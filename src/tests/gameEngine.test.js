/* ==========================================================================
   NEUROVAULT AUTOMATED GAME ENGINE & ANSWER VALIDATION TEST SUITE
   Iterates through all 50 games to verify deterministic challenge generation,
   anti-ambiguity checks, correct answer acceptance, wrong answer rejection,
   and anti-cheat score validation.
   ========================================================================== */

import assert from 'node:assert';
import { GAMES_CATALOG } from '../game_engine/catalog/index.js';
import { initializeGameEngines } from '../game_engine/games/index.js';
import { createGameChallenge, calculateGameScore } from '../game_engine/core/GameEngine.js';
import { AntiAmbiguityValidator } from '../game_engine/core/AntiAmbiguityValidator.js';
import { ServerScoringValidator } from '../game_engine/core/ServerScoringValidator.js';
import { CryptoUtils } from '../core/auth/CryptoUtils.js';

// Initialize game engine registry
initializeGameEngines();

export async function runAllEngineTests() {
  console.log(`🧪 Starting Mind 40 Game Engine Audit & Validation Tests (${GAMES_CATALOG.length} Active Engines)...\n`);

  let passedGames = 0;
  let failedGames = 0;

  for (const game of GAMES_CATALOG) {
    try {
      // Test 1: Challenge Generation & Anti-Ambiguity Validation
      const seed = 12345 + game.difficulty * 99;
      const challenge = createGameChallenge(game.id, seed, game.difficulty, false);

      assert.ok(challenge, `[${game.id}] Challenge payload should exist`);
      assert.strictEqual(challenge.gameId, game.id, `[${game.id}] gameId match`);

      const ambiguity = AntiAmbiguityValidator.validateChallenge(game.id, challenge.payload);
      assert.strictEqual(ambiguity.valid, true, `[${game.id}] Challenge must be non-ambiguous: ${ambiguity.reason}`);

      // Test 2: Scoring Engine Evaluation (Correct Answer)
      const p = challenge.payload;
      const subP = p.subPayload || {};
      const correctSession = {
        userInput: p.expected || p.correctAnswer,
        userAnswer: p.correctAnswer || p.expected || (p.nextValue !== undefined ? p.nextValue : undefined),
        selectedColor: p.correctAnswer || p.correctInkName || p.targetColor?.name || subP.correctInkName,
        selectedId: p.correctOptionId || p.changedItemId,
        selectedIndex: p.targetIndex !== undefined ? p.targetIndex : p.oddIndex,
        selectedOption: p.correctOption || p.correctAnswer || p.correctNext,
        selectedDigit: p.correctDigit,
        selectedParity: p.correctParity || subP.correctParity,
        selectedButton: p.expectedButton,
        selectedDirection: p.correctDirection,
        selectedPartner: p.correctPartner,
        selectedCategory: p.correctCategory,
        selectedName: p.targetPair?.name || p.correctPartner,
        selectedCellIdx: p.correctCellIdx,
        selectedBinId: p.bins?.find(b => {
          if (p.activeRule === 'COLOR') return b.color === p.card?.color;
          if (p.activeRule === 'SHAPE') return b.shape === p.card?.shape;
          return b.count === p.card?.count;
        })?.id,
        isSolved: true,
        selectedSide: p.expectedAnswer,
        trackingAccuracy: 100,
        selectedTone: p.expectedToneResponse,
        reachedExit: true,
        userSequence: p.sequence || p.validSequences?.[0] || p.expected,
        nextValue: p.nextValue,
        selectedSymbol: p.targetSymbol || subP.targetSymbol,
        userPattern: p.targetPattern,
        userGrid: p.targetGrid || p.targetPattern,
        userDots: p.targetDots,
        selectedItemId: p.changedItemId || p.targetItem?.id,
        selectedFragmentId: p.correctFragmentId,
        selectedAnswer: p.correctAnswer || subP.correctAnswer,
        selectedNext: p.correctNext,
        userTapped: p.stimulus?.type === 'GO',
        tooEarly: false,
        errorCount: 0,
        shadedIndices: p.targetGrid || p.shadedIndices,
        selectedIds: p.gridItems?.filter(i => i.symbol === p.targetSymbol).map(i => i.id) || p.targetIds || p.targetIndices,
        tapIndices: p.targetIndices,
        userSteps: p.route || p.routeSteps,
        reactionTimeMs: 450,
        totalTimeMs: 4500,
        totalTrials: 10,
        correctCount: 10,
      };

      const scoreResult = calculateGameScore(game.id, challenge, correctSession);
      assert.ok(typeof scoreResult.score === 'number', `[${game.id}] Score must be numeric`);
      assert.ok(typeof scoreResult.accuracy === 'number', `[${game.id}] Accuracy must be numeric`);
      assert.strictEqual(scoreResult.isCorrect, true, `[${game.id}] Correct answer submission must yield isCorrect = true`);

      // Test 3: Wrong Answer Submission Rejection (Zero Score)
      const wrongSession = {
        userInput: 'WRONG_INPUT_999',
        userAnswer: 'WRONG_ANSWER_999',
        selectedColor: 'INVALID_COLOR',
        selectedId: -999,
        selectedIndex: -999,
        selectedOption: 'INVALID_OPTION',
        selectedDigit: -999,
        selectedParity: 'INVALID_PARITY',
        selectedButton: 'INVALID_BUTTON',
        selectedDirection: 'INVALID_DIRECTION',
        selectedPartner: 'INVALID_PARTNER',
        selectedCategory: 'INVALID_CATEGORY',
        selectedName: 'INVALID_NAME',
        selectedCellIdx: -999,
        selectedBinId: -999,
        isSolved: false,
        selectedSide: 'INVALID_SIDE',
        trackingAccuracy: 0,
        selectedTone: 'INVALID_TONE',
        reachedExit: false,
        userSequence: [-999, -888],
        nextValue: -999,
        selectedSymbol: 'INVALID_SYMBOL',
        userPattern: ['INVALID_TILE'],
        selectedItemId: -999,
        selectedFragmentId: 'INVALID_FRAGMENT',
        selectedAnswer: 'INVALID_ANSWER',
        selectedNext: -999,
        userTapped: p.stimulus?.type === 'NO_GO',
        tooEarly: true,
        errorCount: 5,
        shadedIndices: [-999],
        selectedIds: [],
        tapIndices: [],
        userSteps: ['INVALID_STEP'],
        reactionTimeMs: 450,
        totalTimeMs: 4500,
        totalTrials: 10,
        correctCount: 0,
      };

      const wrongResult = calculateGameScore(game.id, challenge, wrongSession);
      assert.strictEqual(wrongResult.isCorrect, false, `[${game.id}] Wrong answer must yield isCorrect = false`);
      assert.strictEqual(wrongResult.score, 0, `[${game.id}] Wrong answer must result in 0 score`);

      // Test 4: Hard Mode Challenge Generation
      const hardChallenge = createGameChallenge(game.id, seed, game.difficulty, true);
      assert.strictEqual(hardChallenge.isHardMode, true, `[${game.id}] Hard mode flag set`);

      passedGames++;
      console.log(`  ✓ Game ${passedGames}/${GAMES_CATALOG.length} [${game.id}] (${game.name}): PASSED (Correct + Wrong answer checks)`);
    } catch (err) {
      failedGames++;
      console.error(`  ❌ Game [${game.id}] (${game.name}) FAILED:`, err.message);
    }
  }

  // Test 5: Digit Span Partial Sequence Rejection Specific Test
  console.log('\n🧠 Testing Digit Span Forward Partial Sequence Rejection...');
  const dsChallenge = createGameChallenge('digit_span_forward', 12345, 1, false);
  const expectedStr = dsChallenge.payload.expected;
  const wrongDigitStr = expectedStr.slice(0, -1) + ((Number(expectedStr.slice(-1)) + 1) % 10);
  const dsWrongResult = calculateGameScore('digit_span_forward', dsChallenge, { userInput: wrongDigitStr, totalTimeMs: 2000 });
  assert.strictEqual(dsWrongResult.isCorrect, false, 'Digit Span partial match must be rejected as isCorrect = false');
  assert.strictEqual(dsWrongResult.score, 0, 'Digit Span partial match must return 0 score');
  console.log('  ✓ Digit Span Partial Sequence Rejection: PASSED');

  // Test 6: Crypto Password Hashing
  console.log('\n🔒 Testing Security & Hashing Utilities...');
  const { hash, salt } = await CryptoUtils.hashPassword('SecretPassword123!');
  assert.ok(hash && salt, 'Password hash and salt generated');
  const isMatch = await CryptoUtils.verifyPassword('SecretPassword123!', hash, salt);
  assert.strictEqual(isMatch, true, 'Password verification succeeded');
  console.log('  ✓ Cryptographic Auth Hashing: PASSED');

  // Test 7: Server Scoring Anti-Cheat
  console.log('\n🛡️ Testing Anti-Cheat Server Scoring Validator...');
  const validCheck = ServerScoringValidator.validateAttempt({ seed: 999, difficulty: 3, durationMs: 4500, rawScore: 1200, accuracy: 90, inputsCount: 10 });
  assert.strictEqual(validCheck.valid, true, 'Normal score attempt accepted');

  const cheatCheck = ServerScoringValidator.validateAttempt({ seed: 999, difficulty: 1, durationMs: 50, rawScore: 99999, accuracy: 100, inputsCount: 10 });
  assert.strictEqual(cheatCheck.valid, false, 'Impossible reaction time / cheat score rejected');
  console.log('  ✓ Anti-Cheat Score Verification: PASSED');

  console.log(`\n==================================================`);
  console.log(`🎉 TEST SUMMARY: ${passedGames}/${GAMES_CATALOG.length} Games Passed (${failedGames} Failures)`);
  console.log(`==================================================\n`);

  if (failedGames > 0) {
    process.exit(1);
  }
}
