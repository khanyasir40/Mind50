/* ==========================================================================
   REASONING GAMES (43 - 48) ENGINE IMPLEMENTATION - FULLY FIXED & ENHANCED
   ========================================================================== */

export const ReasoningGames = {
  // GAME 43: MATRIX PATTERN REASONING — 6 randomized matrix puzzles
  raven_matrix: {
    generateChallenge: (prng, difficulty) => {
      const matrixTemplates = [
        {
          rule: 'count increases',
          grid: [
            ['1 Circle', '2 Circles', '3 Circles'],
            ['1 Square', '2 Squares', '3 Squares'],
            ['1 Star', '2 Stars', '?'],
          ],
          correct: '3 Stars',
          distractors: ['2 Stars', '4 Stars', '1 Star'],
          shapeKey: { '1 Circle': '○', '2 Circles': '○○', '3 Circles': '○○○', '1 Square': '□', '2 Squares': '□□', '3 Squares': '□□□', '1 Star': '★', '2 Stars': '★★', '3 Stars': '★★★', '?': '?' },
        },
        {
          rule: 'shape rotates across row',
          grid: [
            ['△ Red', '□ Red', '○ Red'],
            ['△ Blue', '□ Blue', '○ Blue'],
            ['△ Green', '□ Green', '?'],
          ],
          correct: '○ Green',
          distractors: ['□ Green', '△ Green', '○ Blue'],
          shapeKey: {},
        },
        {
          rule: 'shade alternates',
          grid: [
            ['Filled', 'Empty', 'Filled'],
            ['Empty', 'Filled', 'Empty'],
            ['Filled', 'Empty', '?'],
          ],
          correct: 'Filled',
          distractors: ['Empty', 'Half', 'Striped'],
          shapeKey: {},
        },
        {
          rule: 'number doubles',
          grid: [
            ['1', '2', '4'],
            ['3', '6', '12'],
            ['2', '4', '?'],
          ],
          correct: '8',
          distractors: ['6', '10', '16'],
          shapeKey: {},
        },
        {
          rule: 'pattern shifts right',
          grid: [
            ['●○○', '○●○', '○○●'],
            ['○○●', '●○○', '○●○'],
            ['○●○', '○○●', '?'],
          ],
          correct: '●○○',
          distractors: ['○●○', '○○●', '●●○'],
          shapeKey: {},
        },
        {
          rule: 'sum rule',
          grid: [
            ['2', '3', '5'],
            ['4', '5', '9'],
            ['3', '6', '?'],
          ],
          correct: '9',
          distractors: ['7', '10', '8'],
          shapeKey: {},
        },
      ];

      // Scale difficulty: harder = more confusing distractors
      const templateIdx = difficulty > 6
        ? prng.nextRange(3, matrixTemplates.length - 1)
        : prng.nextRange(0, 3);

      const tmpl = matrixTemplates[templateIdx % matrixTemplates.length];
      const options = prng.shuffle([tmpl.correct, ...tmpl.distractors]);

      return {
        matrixGrid: tmpl.grid,
        correctAnswer: tmpl.correct,
        rule: tmpl.rule,
        options,
        shapeKey: tmpl.shapeKey,
      };
    },
    calculateScore: (challenge, sessionResult) => {
      const isCorrect = sessionResult.selectedAnswer === challenge.payload.correctAnswer;
      const rtMs = sessionResult.reactionTimeMs || 5000;
      const speedBonus = isCorrect ? Math.max(0, 300 - Math.round(rtMs / 15)) : 0;
      return { score: isCorrect ? 400 + challenge.difficulty * 45 + speedBonus : 0, accuracy: isCorrect ? 100 : 0 };
    },
  },

  // GAME 44: VISUAL PATTERN COMPLETION — 5 real pattern types
  pattern_completion: {
    generateChallenge: (prng, difficulty) => {
      const patterns = [
        {
          name: 'Pinwheel',
          description: 'A 4-arm pinwheel with one blade missing',
          missingSlice: 'Bottom-Right blade curving clockwise',
          options: [
            { id: 'A', label: 'Blade curving CW', isCorrect: true },
            { id: 'B', label: 'Blade curving CCW', isCorrect: false },
            { id: 'C', label: 'Straight diagonal', isCorrect: false },
            { id: 'D', label: 'Vertical bar', isCorrect: false },
          ],
        },
        {
          name: 'Checkerboard',
          description: 'A 4×4 checkerboard missing bottom-right 2×2',
          missingSlice: 'Alternating dark/light 2×2 block',
          options: [
            { id: 'A', label: 'Light-Dark / Dark-Light', isCorrect: false },
            { id: 'B', label: 'Dark-Light / Light-Dark', isCorrect: true },
            { id: 'C', label: 'All Dark', isCorrect: false },
            { id: 'D', label: 'All Light', isCorrect: false },
          ],
        },
        {
          name: 'Concentric Rings',
          description: 'Three concentric rings with bottom-right arc missing',
          missingSlice: 'Three concentric quarter-arcs',
          options: [
            { id: 'A', label: 'Three arcs (concentric)', isCorrect: true },
            { id: 'B', label: 'Two arcs (concentric)', isCorrect: false },
            { id: 'C', label: 'Solid quarter circle', isCorrect: false },
            { id: 'D', label: 'Three straight lines', isCorrect: false },
          ],
        },
        {
          name: 'Star Burst',
          description: 'An 8-point star with top-right sector missing',
          missingSlice: 'Two starburst triangular points',
          options: [
            { id: 'A', label: 'One sharp point', isCorrect: false },
            { id: 'B', label: 'Curved petal', isCorrect: false },
            { id: 'C', label: 'Two starburst points', isCorrect: true },
            { id: 'D', label: 'Three small dots', isCorrect: false },
          ],
        },
      ];

      const idx = prng.nextRange(0, patterns.length - 1);
      const pattern = patterns[idx];
      const shuffledOptions = prng.shuffle([...pattern.options]);
      const correctId = pattern.options.find(o => o.isCorrect).id;
      // Find new id in shuffled
      const correctShuffledId = shuffledOptions.find(o => o.isCorrect).id;

      return {
        patternName: pattern.name,
        description: pattern.description,
        missingSlice: pattern.missingSlice,
        options: shuffledOptions,
        correctFragmentId: correctShuffledId,
        patternIndex: idx,
      };
    },
    calculateScore: (challenge, sessionResult) => {
      const isCorrect = sessionResult.selectedFragmentId === challenge.payload.correctFragmentId;
      return { score: isCorrect ? 350 + challenge.difficulty * 40 : 0, accuracy: isCorrect ? 100 : 0 };
    },
  },

  // GAME 45: ODD ONE OUT DEDUCTION — varied rule types
  odd_one_out: {
    generateChallenge: (prng, difficulty) => {
      const ruleTypes = [
        {
          rule: 'All shapes have 4 sides except one.',
          common: '4-sided Square',
          odd: '3-sided Triangle',
          commonIcon: '■',
          oddIcon: '▲',
        },
        {
          rule: 'All items are animals except one.',
          common: 'Animal',
          odd: 'Vehicle',
          commonIcon: '🐶',
          oddIcon: '🚗',
        },
        {
          rule: 'All numbers are even except one.',
          common: 'Even',
          odd: 'Odd',
          commonItems: ['2', '4', '6', '8', '10', '12', '14', '16'],
          oddItems: ['3', '5', '7', '9', '11', '13'],
        },
        {
          rule: 'All words rhyme with "cat" except one.',
          common: 'rhymes-cat',
          odd: 'no-rhyme',
          commonItems: ['bat', 'hat', 'mat', 'rat', 'sat', 'fat', 'pat'],
          oddItems: ['dog', 'sun', 'tree', 'cup'],
        },
        {
          rule: 'All colors are warm except one.',
          common: 'Warm',
          odd: 'Cool',
          commonItems: ['Red', 'Orange', 'Yellow', 'Pink', 'Crimson'],
          oddItems: ['Blue', 'Green', 'Teal', 'Violet'],
        },
      ];

      const count = difficulty > 5 ? 12 : 9;
      const ruleIdx = prng.nextRange(0, ruleTypes.length - 1);
      const rule = ruleTypes[ruleIdx];
      const oddIndex = prng.nextRange(0, count - 1);

      const itemColors = ['#6C4DFF', '#39B982', '#E85D75', '#F0A83A', '#06B6D4', '#A855F7', '#EC4899', '#10B981', '#F59E0B', '#3B82F6', '#8B5CF6', '#EF4444'];

      let items;
      if (rule.commonItems) {
        const shuffledCommon = prng.shuffle([...rule.commonItems]);
        const shuffledOdd = prng.shuffle([...rule.oddItems]);
        items = Array.from({ length: count }, (_, i) => ({
          id: i,
          label: i === oddIndex ? shuffledOdd[0] : shuffledCommon[i % shuffledCommon.length],
          isOdd: i === oddIndex,
          color: itemColors[i % itemColors.length],
        }));
      } else {
        items = Array.from({ length: count }, (_, i) => ({
          id: i,
          label: i === oddIndex ? (rule.oddIcon || rule.odd) : (rule.commonIcon || rule.common),
          isOdd: i === oddIndex,
          color: itemColors[i % itemColors.length],
        }));
      }

      return {
        items,
        oddIndex,
        ruleDescription: rule.rule,
      };
    },
    calculateScore: (challenge, sessionResult) => {
      const isCorrect = sessionResult.selectedIndex === challenge.payload.oddIndex;
      const rtMs = sessionResult.reactionTimeMs || 4000;
      const speedBonus = isCorrect ? Math.max(0, 200 - Math.round(rtMs / 20)) : 0;
      return { score: isCorrect ? 300 + challenge.difficulty * 35 + speedBonus : 0, accuracy: isCorrect ? 100 : 0 };
    },
  },

  // GAME 46: LOGIC GRID PUZZLE — FIXED logic, 4 different puzzles
  logic_grid: {
    generateChallenge: (prng, difficulty) => {
      const puzzles = [
        {
          people: ['Alex', 'Blake', 'Charlie'],
          drinks: ['Tea', 'Coffee', 'Juice'],
          clues: [
            'Alex does not drink Coffee.',
            'Blake drinks Tea.',
            'The remaining person drinks Juice.',
          ],
          solution: { Alex: 'Juice', Blake: 'Tea', Charlie: 'Coffee' },
          question: 'What does Charlie drink?',
          targetPerson: 'Charlie',
          correctAnswer: 'Coffee',
          options: ['Tea', 'Coffee', 'Juice'],
        },
        {
          people: ['Maya', 'Sam', 'Jordan'],
          drinks: ['Water', 'Milk', 'Soda'],
          clues: [
            'Sam does not drink Water.',
            'Maya drinks Milk.',
            'Jordan does not drink Milk.',
          ],
          solution: { Maya: 'Milk', Sam: 'Soda', Jordan: 'Water' },
          question: 'What does Sam drink?',
          targetPerson: 'Sam',
          correctAnswer: 'Soda',
          options: ['Water', 'Milk', 'Soda'],
        },
        {
          people: ['Leo', 'Emma', 'Kai'],
          drinks: ['Lemonade', 'Cola', 'Water'],
          clues: [
            'Kai drinks Water.',
            'Emma does not drink Cola.',
            'Leo is not drinking Water.',
          ],
          solution: { Leo: 'Cola', Emma: 'Lemonade', Kai: 'Water' },
          question: 'What does Emma drink?',
          targetPerson: 'Emma',
          correctAnswer: 'Lemonade',
          options: ['Lemonade', 'Cola', 'Water'],
        },
        {
          people: ['Ana', 'Ben', 'Cal'],
          drinks: ['Green Tea', 'Orange Juice', 'Coffee'],
          clues: [
            'Ben drinks neither Green Tea nor Coffee.',
            'Ana does not drink Orange Juice.',
            'Cal does not drink Coffee.',
          ],
          solution: { Ana: 'Coffee', Ben: 'Orange Juice', Cal: 'Green Tea' },
          question: 'What does Ana drink?',
          targetPerson: 'Ana',
          correctAnswer: 'Coffee',
          options: ['Green Tea', 'Orange Juice', 'Coffee'],
        },
      ];

      const idx = prng.nextRange(0, puzzles.length - 1);
      const puzzle = puzzles[idx];

      return {
        people: puzzle.people,
        drinks: puzzle.drinks,
        clues: puzzle.clues,
        question: puzzle.question,
        targetPerson: puzzle.targetPerson,
        correctAnswer: puzzle.correctAnswer,
        options: prng.shuffle([...puzzle.options]),
      };
    },
    calculateScore: (challenge, sessionResult) => {
      const isCorrect = sessionResult.selectedAnswer === challenge.payload.correctAnswer;
      return { score: isCorrect ? 450 + challenge.difficulty * 50 : 0, accuracy: isCorrect ? 100 : 0 };
    },
  },

  // GAME 47: SEQUENCE PREDICTION — 8 sequence types with scaling difficulty
  sequence_prediction: {
    generateChallenge: (prng, difficulty) => {
      const seqPool = [
        { seq: [2, 4, 8, 16], next: 32, rule: '×2 each step' },
        { seq: [3, 7, 11, 15], next: 19, rule: '+4 each step' },
        { seq: [1, 4, 9, 16], next: 25, rule: 'Perfect squares (n²)' },
        { seq: [1, 1, 2, 3, 5], next: 8, rule: 'Fibonacci (+prev two)' },
        { seq: [100, 91, 82, 73], next: 64, rule: '-9 each step' },
        { seq: [3, 6, 12, 24], next: 48, rule: '×2 each step' },
        { seq: [5, 10, 20, 40], next: 80, rule: '×2 each step' },
        { seq: [2, 6, 18, 54], next: 162, rule: '×3 each step' },
        { seq: [50, 43, 36, 29], next: 22, rule: '-7 each step' },
        { seq: [1, 2, 4, 7, 11], next: 16, rule: '+1, +2, +3... incrementing step' },
      ];

      // Harder difficulties use trickier sequences
      const easyPool = seqPool.slice(0, 4);
      const hardPool = seqPool.slice(4);
      const pool = difficulty > 5 ? [...seqPool] : easyPool;

      const chosen = pool[prng.nextRange(0, pool.length - 1)];

      // Generate unique distractors that aren't equal to correct
      const d1 = chosen.next + prng.nextRange(1, 5);
      const d2 = chosen.next - prng.nextRange(1, 7);
      const d3 = chosen.next * 2;
      const distractors = [d1, d2 > 0 ? d2 : chosen.next + 9, d3].filter(d => d !== chosen.next);

      const options = prng.shuffle([chosen.next, ...distractors.slice(0, 3)]);

      return {
        sequence: chosen.seq,
        correctNext: chosen.next,
        rule: chosen.rule,
        options,
      };
    },
    calculateScore: (challenge, sessionResult) => {
      const isCorrect = Number(sessionResult.selectedOption) === challenge.payload.correctNext;
      const rtMs = sessionResult.reactionTimeMs || 6000;
      const speedBonus = isCorrect ? Math.max(0, 250 - Math.round(rtMs / 25)) : 0;
      return { score: isCorrect ? 320 + challenge.difficulty * 35 + speedBonus : 0, accuracy: isCorrect ? 100 : 0 };
    },
  },

  // GAME 48: ABSTRACT RULE SOLVER — 5 randomized transformation puzzles
  abstract_reasoning: {
    generateChallenge: (prng, difficulty) => {
      const puzzles = [
        {
          rule: 'Invert shading and rotate 90° clockwise',
          prompt: '⬛ Arrow UP',
          correct: '⬜ Arrow RIGHT',
          options: ['⬜ Arrow RIGHT', '⬛ Arrow LEFT', '⬜ Arrow DOWN', '⬛ Arrow UP'],
        },
        {
          rule: 'Mirror horizontally (flip left-right)',
          prompt: '← P shape',
          correct: 'q shape →',
          options: ['q shape →', 'p shape ←', 'b shape', 'd shape'],
        },
        {
          rule: 'Remove the largest element',
          prompt: '●●● Big + Small + Tiny',
          correct: 'Small + Tiny',
          options: ['Small + Tiny', 'Big + Small', 'Big + Tiny', '● All three'],
        },
        {
          rule: 'Double the count, halve the size',
          prompt: '2 Large ■■',
          correct: '4 Small ■■■■',
          options: ['4 Small ■■■■', '1 Huge ■', '2 Large ■■', '8 Tiny ■■■■■■■■'],
        },
        {
          rule: 'Rotate 180° (flip both axes)',
          prompt: '↗ Triangle pointing Top-Right',
          correct: '↙ Triangle pointing Bottom-Left',
          options: ['↙ Triangle pointing Bottom-Left', '↘ Triangle pointing Bottom-Right', '↖ Triangle pointing Top-Left', '↗ Same'],
        },
      ];

      const idx = prng.nextRange(0, puzzles.length - 1);
      const puzzle = puzzles[idx];
      const options = prng.shuffle([...puzzle.options]);

      return {
        transformationRule: puzzle.rule,
        promptShape: puzzle.prompt,
        correctAnswer: puzzle.correct,
        options,
      };
    },
    calculateScore: (challenge, sessionResult) => {
      const isCorrect = sessionResult.selectedOption === challenge.payload.correctAnswer;
      return { score: isCorrect ? 380 + challenge.difficulty * 45 : 0, accuracy: isCorrect ? 100 : 0 };
    },
  },
};
