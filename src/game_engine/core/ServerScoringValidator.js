/* ==========================================================================
   NEUROVAULT SERVER-AUTHORITATIVE SCORE VALIDATOR & ANTI-CHEAT ENGINE
   Comprehensive verification for leaderboard entries & score anti-exploit
   ========================================================================== */

export class ServerScoringValidator {
  /**
   * Validate attempt parameters against theoretical human limits and security rules.
   */
  static validateAttempt({ seed, difficulty, durationMs, rawScore, accuracy, inputsCount = 1 }) {
    // 1. Reaction time floor rule (< 110ms average per trial is humanly impossible)
    const avgReactionPerInput = durationMs / Math.max(1, inputsCount);
    if (durationMs > 0 && avgReactionPerInput < 110) {
      return { valid: false, reason: 'IMPOSSIBLE_REACTION_TIME', flagReason: 'Average reaction time < 110ms' };
    }

    // 2. Accuracy bounds [0, 100]
    if (typeof accuracy !== 'number' || isNaN(accuracy) || accuracy < 0 || accuracy > 100) {
      return { valid: false, reason: 'MALFORMED_ACCURACY_VALUE', flagReason: `Accuracy value out of bounds: ${accuracy}` };
    }

    // 3. Theoretical Score Caps (prevent fake 999999 score injection)
    const maxTheoreticalCap = Math.max(1000, difficulty * 3500 + 1500);
    if (rawScore > maxTheoreticalCap) {
      return { valid: false, reason: 'SCORE_EXCEEDS_THEORETICAL_CAP', flagReason: `Score ${rawScore} exceeds cap of ${maxTheoreticalCap}` };
    }

    // 4. Negative score exploit check
    if (rawScore < 0) {
      return { valid: false, reason: 'NEGATIVE_SCORE_EXPLOIT', flagReason: 'Score is negative' };
    }

    // Generate cryptographic-style verification token
    const timestamp = Date.now();
    const tokenPayload = `${seed}_${rawScore}_${accuracy}_${timestamp}`;
    let hash = 0;
    for (let i = 0; i < tokenPayload.length; i++) {
      hash = (Math.imul(31, hash) + tokenPayload.charCodeAt(i)) | 0;
    }
    const token = `nv_v2_${Math.abs(hash).toString(36)}_${timestamp.toString(36)}`;

    return {
      valid: true,
      verifiedScore: Math.round(rawScore),
      validationToken: token,
    };
  }

  /**
   * Verify score submission before accepting onto global leaderboards.
   */
  static isLeaderboardEligible(attemptData) {
    const result = this.validateAttempt(attemptData);
    return result.valid;
  }
}
