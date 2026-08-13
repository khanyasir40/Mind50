/* ==========================================================================
   NEUROVAULT ANTI-AMBIGUITY VALIDATOR
   Ensures generated challenges have exactly one valid, unambiguous answer
   and no duplicate or conflicting options.
   ========================================================================== */

export class AntiAmbiguityValidator {
  /**
   * Validate a generated challenge payload for ambiguity, duplicate options, or missing answers.
   */
  static validateChallenge(gameId, payload) {
    if (!payload || typeof payload !== 'object') {
      return { valid: false, reason: 'EMPTY_PAYLOAD' };
    }

    // Rule 1: Multiple choice option uniqueness check
    if (Array.isArray(payload.options)) {
      if (payload.options.length < 2) {
        return { valid: false, reason: 'TOO_FEW_OPTIONS' };
      }

      // Stringify options to catch object equality
      const stringifiedOptions = payload.options.map(o =>
        typeof o === 'object' ? JSON.stringify(o) : String(o)
      );

      const uniqueSet = new Set(stringifiedOptions);
      if (uniqueSet.size !== payload.options.length) {
        return { valid: false, reason: 'DUPLICATE_OPTIONS_FOUND' };
      }

      // Check that the authoritative answer matches at least one option if correctAnswer/expected is specified as a choice
      if (payload.correctAnswer !== undefined) {
        const targetStr = typeof payload.correctAnswer === 'object'
          ? JSON.stringify(payload.correctAnswer)
          : String(payload.correctAnswer);

        const hasMatch = stringifiedOptions.includes(targetStr);
        if (!hasMatch) {
          return { valid: false, reason: 'CORRECT_ANSWER_NOT_IN_OPTIONS' };
        }
      }
    }

    // Rule 2: Digits / Sequences checks
    if (payload.digits && (!Array.isArray(payload.digits) || payload.digits.length === 0)) {
      return { valid: false, reason: 'INVALID_DIGITS_ARRAY' };
    }

    if (payload.sequence && (!Array.isArray(payload.sequence) || payload.sequence.length === 0)) {
      return { valid: false, reason: 'INVALID_SEQUENCE_ARRAY' };
    }

    // Rule 3: Visual search & spatial index boundary checks
    if (payload.items && payload.targetIndex !== undefined) {
      if (payload.targetIndex < 0 || payload.targetIndex >= payload.items.length) {
        return { valid: false, reason: 'TARGET_INDEX_OUT_OF_BOUNDS' };
      }
    }

    // Rule 4: Matrix & logic grid completeness
    if (payload.matrixGrid && !Array.isArray(payload.matrixGrid)) {
      return { valid: false, reason: 'INVALID_MATRIX_GRID' };
    }

    return { valid: true };
  }
}
