/* ==========================================================================
   NEUROVAULT ADAPTIVE DIFFICULTY ENGINE
   Calculates optimal challenge difficulty (1-10) based on recent accuracy,
   reaction time, and mistakes without extreme jumps.
   ========================================================================== */

export class AdaptiveDifficultyEngine {
  static calculateNewDifficulty(currentDifficulty, recentAttempts) {
    if (!recentAttempts || recentAttempts.length === 0) return currentDifficulty || 1;

    const last3 = recentAttempts.slice(-3);
    const avgAccuracy = last3.reduce((sum, a) => sum + (a.accuracy || 0), 0) / last3.length;

    let targetDiff = currentDifficulty;

    if (avgAccuracy >= 90) {
      targetDiff = Math.min(10, currentDifficulty + 1);
    } else if (avgAccuracy < 70) {
      targetDiff = Math.max(1, currentDifficulty - 1);
    }

    return targetDiff;
  }
}

export const AdaptiveDifficulty = AdaptiveDifficultyEngine;

