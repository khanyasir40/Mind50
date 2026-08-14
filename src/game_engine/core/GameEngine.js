/* ==========================================================================
   NEUROVAULT UNIFIED GAME ENGINE REGISTRY & ENGINE INTERFACE
   ========================================================================== */

import { PRNG } from './PRNG.js';
import { AdaptiveDifficulty } from './AdaptiveDifficulty.js';
import { ServerScoringValidator } from './ServerScoringValidator.js';
import { AntiAmbiguityValidator } from './AntiAmbiguityValidator.js';

const gameRegistry = new Map();

export const registerGameEngine = (id, engineModule) => {
  gameRegistry.set(id, engineModule);
};

export const getGameEngine = (id) => {
  return gameRegistry.get(id) || null;
};

export const getAllGameEngines = () => {
  return Array.from(gameRegistry.entries());
};

/**
 * Standardized Challenge Generator Entry Point with Anti-Ambiguity Retry & Hard Mode Support
 */
export const createGameChallenge = (gameId, seed = Date.now(), difficulty = 1, isHardMode = false, trialIndex = 1) => {
  const engine = getGameEngine(gameId);
  const effectiveDifficulty = isHardMode ? Math.min(10, difficulty + 3) : difficulty;

  if (engine && typeof engine.generateChallenge === 'function') {
    let currentSeed = seed;
    let challengePayload = null;
    let attempts = 0;

    // Retry loop to ensure non-ambiguous challenge generation
    while (attempts < 10) {
      const prng = new PRNG(currentSeed);
      challengePayload = engine.generateChallenge(prng, effectiveDifficulty, isHardMode, trialIndex);
      
      const ambiguityCheck = AntiAmbiguityValidator.validateChallenge(gameId, challengePayload);
      if (ambiguityCheck.valid) {
        break;
      }
      // Increment seed for retry if ambiguity found
      currentSeed += 997 + attempts * 13;
      attempts++;
    }

    return {
      challengeId: `${gameId}_${currentSeed}_${effectiveDifficulty}_${isHardMode ? 'hard' : 'normal'}`,
      gameId,
      seed: currentSeed,
      difficulty: effectiveDifficulty,
      isHardMode,
      generatorVersion: '3.6.0',
      rulesetVersion: '3.6.0',
      payload: challengePayload,
    };
  }

  // Fallback default challenge if game engine not registered
  return {
    challengeId: `${gameId}_${seed}_${effectiveDifficulty}_${isHardMode ? 'hard' : 'normal'}`,
    gameId,
    seed,
    difficulty: effectiveDifficulty,
    isHardMode,
    generatorVersion: '3.6.0',
    rulesetVersion: '3.6.0',
    payload: {
      question: 'Identify the target shape',
      options: ['Circle', 'Square', 'Triangle', 'Star'],
      correctAnswer: 'Circle',
    },
  };
};

/**
 * Standardized Score Calculator
 */
export const calculateGameScore = (gameId, challenge, sessionResult) => {
  const engine = getGameEngine(gameId);
  let result = { score: 0, accuracy: 0, isCorrect: false };

  if (engine && typeof engine.calculateScore === 'function') {
    result = engine.calculateScore(challenge, sessionResult);
  } else {
    const { correctCount = 0, totalTrials = 1, totalTimeMs = 5000, difficulty = 1 } = sessionResult;
    const accuracy = Math.round((correctCount / totalTrials) * 100);
    const baseScore = correctCount * 200;
    const difficultyBonus = difficulty * 50;
    const speedBonus = Math.max(0, 500 - Math.round(totalTimeMs / totalTrials / 10));

    result = {
      score: baseScore + difficultyBonus + speedBonus,
      accuracy,
      isCorrect: accuracy === 100,
    };
  }

  // Ensure isCorrect is explicitly determined
  const isCorrect = result.isCorrect !== undefined ? Boolean(result.isCorrect) : (result.accuracy === 100);
  result.isCorrect = isCorrect;

  // Wrong answers MUST return 0 score & 0 accuracy
  if (!isCorrect) {
    result.score = 0;
    result.accuracy = 0;
  }

  // Hard Mode multiplier bonus (1.5x score)
  if (challenge.isHardMode && isCorrect) {
    result.score = Math.round(result.score * 1.5);
  }

  const validation = ServerScoringValidator.validateAttempt({
    seed: challenge.seed,
    difficulty: challenge.difficulty,
    durationMs: sessionResult.totalTimeMs || sessionResult.reactionTimeMs || 5000,
    rawScore: result.score,
    accuracy: result.accuracy,
    inputsCount: sessionResult.totalTrials || 10,
  });

  return {
    ...result,
    isCorrect,
    score: validation.valid ? validation.verifiedScore : 0,
    isValid: validation.valid,
    validationReason: validation.reason || null,
  };
};
