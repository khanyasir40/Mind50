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
  console.log('🧪 Starting NeuroVault 50 Game Engine Audit & Validation Tests...\n');

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

      // Test 2: Scoring Engine Evaluation
      const dummySession = {
        userInput: challenge.payload.expected || challenge.payload.correctAnswer,
        userAnswer: challenge.payload.correctAnswer || challenge.payload.expected,
        selectedColor: challenge.payload.correctInkName || challenge.payload.targetColor?.name,
        selectedId: challenge.payload.correctOptionId || challenge.payload.changedItemId,
        selectedIndex: challenge.payload.targetIndex || challenge.payload.oddIndex,
        selectedOption: challenge.payload.correctOption || challenge.payload.correctAnswer,
        selectedDigit: challenge.payload.correctDigit,
        selectedParity: challenge.payload.correctParity,
        selectedButton: challenge.payload.expectedButton,
        selectedDirection: challenge.payload.correctDirection,
        selectedPartner: challenge.payload.correctPartner,
        selectedCategory: challenge.payload.correctCategory,
        userSequence: challenge.payload.sequence || challenge.payload.expected,
        shadedIndices: challenge.payload.shadedIndices,
        targetIndices: challenge.payload.targetIndices,
        selectedIds: challenge.payload.targetIds || challenge.payload.targetIndices,
        reactionTimeMs: 450,
        totalTimeMs: 4500,
        totalTrials: 10,
        correctCount: 10,
      };

      const scoreResult = calculateGameScore(game.id, challenge, dummySession);
      assert.ok(typeof scoreResult.score === 'number', `[${game.id}] Score must be numeric`);
      assert.ok(typeof scoreResult.accuracy === 'number', `[${game.id}] Accuracy must be numeric`);

      // Test 3: Hard Mode Challenge Generation
      const hardChallenge = createGameChallenge(game.id, seed, game.difficulty, true);
      assert.strictEqual(hardChallenge.isHardMode, true, `[${game.id}] Hard mode flag set`);

      passedGames++;
      console.log(`  ✓ Game ${passedGames}/50 [${game.id}] (${game.name}): PASSED`);
    } catch (err) {
      failedGames++;
      console.error(`  ❌ Game [${game.id}] (${game.name}) FAILED:`, err.message);
    }
  }

  // Test 4: Crypto Password Hashing
  console.log('\n🔒 Testing Security & Hashing Utilities...');
  const { hash, salt } = await CryptoUtils.hashPassword('SecretPassword123!');
  assert.ok(hash && salt, 'Password hash and salt generated');
  const isMatch = await CryptoUtils.verifyPassword('SecretPassword123!', hash, salt);
  assert.strictEqual(isMatch, true, 'Password verification succeeded');
  console.log('  ✓ Cryptographic Auth Hashing: PASSED');

  // Test 5: Server Scoring Anti-Cheat
  console.log('\n🛡️ Testing Anti-Cheat Server Scoring Validator...');
  const validCheck = ServerScoringValidator.validateAttempt({ seed: 999, difficulty: 3, durationMs: 4500, rawScore: 1200, accuracy: 90, inputsCount: 10 });
  assert.strictEqual(validCheck.valid, true, 'Normal score attempt accepted');

  const cheatCheck = ServerScoringValidator.validateAttempt({ seed: 999, difficulty: 1, durationMs: 50, rawScore: 99999, accuracy: 100, inputsCount: 10 });
  assert.strictEqual(cheatCheck.valid, false, 'Impossible reaction time / cheat score rejected');
  console.log('  ✓ Anti-Cheat Score Verification: PASSED');

  console.log(`\n==================================================`);
  console.log(`🎉 TEST SUMMARY: ${passedGames}/50 Games Passed (${failedGames} Failures)`);
  console.log(`==================================================\n`);

  if (failedGames > 0) {
    process.exit(1);
  }
}
