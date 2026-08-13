/* ==========================================================================
   EXECUTIVE FUNCTION / PLANNING GAMES (21 - 30) ENGINE — FULLY FIXED
   ========================================================================== */

export const PlanningGames = {
  // GAME 21: ADAPTIVE RULE SORTING (WISCONSIN CARD SORTING)
  wisconsin_card_sorting: {
    generateChallenge: (prng, difficulty) => {
      const rules = ['COLOR', 'SHAPE', 'COUNT'];
      const activeRule = rules[prng.nextRange(0, rules.length - 1)];

      const colorOptions = ['Red', 'Blue', 'Green', 'Yellow'];
      const shapeOptions = ['Circle', 'Square', 'Triangle', 'Star'];

      const card = {
        color: colorOptions[prng.nextRange(0, 3)],
        shape: shapeOptions[prng.nextRange(0, 3)],
        count: prng.nextRange(1, 4),
      };

      const bins = [
        { id: 1, color: 'Red', shape: 'Circle', count: 1 },
        { id: 2, color: 'Blue', shape: 'Square', count: 2 },
        { id: 3, color: 'Green', shape: 'Triangle', count: 3 },
        { id: 4, color: 'Yellow', shape: 'Star', count: 4 },
      ];

      return {
        card,
        bins,
        activeRule,
        ruleHint: difficulty < 4 ? `Sort by: ${activeRule}` : null, // Remove hint on harder difficulty
      };
    },
    calculateScore: (challenge, sessionResult) => {
      const { selectedBinId } = sessionResult;
      const { card, bins, activeRule } = challenge.payload;
      const chosenBin = bins.find((b) => b.id === selectedBinId);

      let isCorrect = false;
      if (chosenBin) {
        if (activeRule === 'COLOR') isCorrect = chosenBin.color === card.color;
        if (activeRule === 'SHAPE') isCorrect = chosenBin.shape === card.shape;
        if (activeRule === 'COUNT') isCorrect = chosenBin.count === card.count;
      }

      return { score: isCorrect ? 300 + challenge.difficulty * 30 : 0, accuracy: isCorrect ? 100 : 0 };
    },
  },

  // GAME 22: TOWER OF LONDON — 8 randomized pre-defined valid puzzles
  tower_of_london: {
    generateChallenge: (prng, difficulty) => {
      // Each puzzle: [initialPegs, targetPegs, minMoves, diskCount]
      const puzzles = [
        { initial: [[1, 2, 3], [], []], target: [[], [1, 2], [3]], minMoves: 3, disks: 3 },
        { initial: [[1, 2, 3], [], []], target: [[], [], [1, 2, 3]], minMoves: 7, disks: 3 },
        { initial: [[3, 2], [1], []], target: [[1], [], [3, 2]], minMoves: 4, disks: 3 },
        { initial: [[2, 1], [3], []], target: [[], [1], [3, 2]], minMoves: 5, disks: 3 },
        { initial: [[1, 2, 3, 4], [], []], target: [[], [], [1, 2, 3, 4]], minMoves: 15, disks: 4 },
        { initial: [[4, 3, 2, 1], [], []], target: [[], [2, 1], [4, 3]], minMoves: 8, disks: 4 },
        { initial: [[2], [1, 3], []], target: [[3], [1], [2]], minMoves: 5, disks: 3 },
        { initial: [[3, 1], [], [2]], target: [[], [3, 2, 1], []], minMoves: 6, disks: 3 },
      ];

      // Harder difficulty = use harder puzzles
      const easyPuzzles = puzzles.slice(0, 4);
      const hardPuzzles = puzzles.slice(4);
      const pool = difficulty > 5 ? hardPuzzles : easyPuzzles;

      const puzzle = pool[prng.nextRange(0, pool.length - 1)];

      return {
        initialPegs: puzzle.initial.map(peg => [...peg]),
        targetPegs: puzzle.target,
        minMoves: puzzle.minMoves,
        diskCount: puzzle.disks,
      };
    },
    calculateScore: (challenge, sessionResult) => {
      const moves = sessionResult.movesCount || 10;
      const optimal = challenge.payload.minMoves;
      const isSuccess = sessionResult.isSolved;
      const efficiency = Math.max(0, 100 - (moves - optimal) * 12);
      const score = isSuccess ? 400 + Math.round(efficiency * 3.5) + challenge.difficulty * 40 : 0;
      return { score, accuracy: isSuccess ? efficiency : 0 };
    },
  },

  // GAME 23: TOWER OF HANOI
  tower_of_hanoi: {
    generateChallenge: (prng, difficulty) => {
      const diskCount = 3 + (difficulty > 4 ? (difficulty > 7 ? 2 : 1) : 0);
      const minMoves = Math.pow(2, diskCount) - 1;
      return {
        diskCount,
        minMoves,
        timeLimitMs: minMoves * 8000, // Generous limit scaled by complexity
      };
    },
    calculateScore: (challenge, sessionResult) => {
      const moves = sessionResult.movesCount || 20;
      const minMoves = challenge.payload.minMoves;
      const isSuccess = sessionResult.isSolved;
      const efficiency = Math.max(0, 100 - (moves - minMoves) * 8);
      const perfectBonus = moves === minMoves ? 200 : 0;
      return {
        score: isSuccess ? 450 + Math.round(efficiency * 3) + perfectBonus : 0,
        accuracy: isSuccess ? efficiency : 0,
      };
    },
  },

  // GAME 24: RULE SWITCHING — enhanced with 3 distinct rule types
  rule_switching: {
    generateChallenge: (prng, difficulty) => {
      const ruleTypes = [
        {
          cue: 'PARITY',
          number: prng.nextRange(1, 99),
          color: null,
          instruction: 'Is the number ODD or EVEN?',
          leftLabel: 'ODD',
          rightLabel: 'EVEN',
          getAnswer: (n) => n % 2 === 0 ? 'RIGHT' : 'LEFT',
        },
        {
          cue: 'COLOR',
          number: null,
          color: prng.nextRange(0, 1) === 0 ? 'RED' : 'BLUE',
          instruction: 'Which COLOR is shown?',
          leftLabel: 'RED',
          rightLabel: 'BLUE',
          getAnswer: (_, c) => c === 'BLUE' ? 'RIGHT' : 'LEFT',
        },
        {
          cue: 'SIZE',
          number: prng.nextRange(1, 200),
          color: null,
          instruction: 'Is the number SMALL (<100) or LARGE (≥100)?',
          leftLabel: 'SMALL',
          rightLabel: 'LARGE',
          getAnswer: (n) => n >= 100 ? 'RIGHT' : 'LEFT',
        },
      ];

      const ruleIdx = difficulty > 5 ? prng.nextRange(0, ruleTypes.length - 1) : prng.nextRange(0, 1);
      const rule = ruleTypes[ruleIdx];
      const number = rule.number || prng.nextRange(1, 99);
      const color = rule.color || 'RED';
      const expectedAnswer = rule.getAnswer(number, color);

      return {
        cue: rule.cue,
        number,
        color,
        instruction: rule.instruction,
        leftLabel: rule.leftLabel,
        rightLabel: rule.rightLabel,
        expectedAnswer,
      };
    },
    calculateScore: (challenge, sessionResult) => {
      const isCorrect = sessionResult.selectedSide === challenge.payload.expectedAnswer;
      const rtMs = sessionResult.reactionTimeMs || 2000;
      const speedBonus = isCorrect ? Math.max(0, 200 - Math.round(rtMs / 10)) : 0;
      return { score: isCorrect ? 250 + challenge.difficulty * 30 + speedBonus : 0, accuracy: isCorrect ? 100 : 0 };
    },
  },

  // GAME 25: DUAL TASK MULTITASKING
  dual_task: {
    generateChallenge: (prng, difficulty) => {
      const trackingTargetX = prng.nextRange(20, 80);
      const auditoryToneIsHigh = prng.nextRange(0, 1) === 1;
      const mathQuestion = prng.nextRange(1, 1) === 1
        ? { q: `${prng.nextRange(2, 9)} × ${prng.nextRange(2, 9)}`, type: 'math' }
        : null;

      return {
        trackingTargetX,
        auditoryToneIsHigh,
        expectedToneResponse: auditoryToneIsHigh ? 'HIGH' : 'LOW',
        driftSpeedPct: 2 + Math.min(difficulty, 5), // % per step, increases with difficulty
      };
    },
    calculateScore: (challenge, sessionResult) => {
      const trackingAccuracy = sessionResult.trackingAccuracy || 70;
      const toneCorrect = sessionResult.selectedTone === challenge.payload.expectedToneResponse;

      const accuracy = Math.round((trackingAccuracy + (toneCorrect ? 100 : 0)) / 2);
      const score = Math.round(accuracy * 4.5) + challenge.difficulty * 30;
      return { score, accuracy };
    },
  },

  // GAME 26: CATEGORY SEMANTIC SORTING — expanded pool
  category_sorting: {
    generateChallenge: (prng, difficulty) => {
      const categories = [
        { name: 'Animal', items: ['Lion', 'Eagle', 'Dolphin', 'Tiger', 'Panda', 'Cobra', 'Elk', 'Crow'] },
        { name: 'Food', items: ['Apple', 'Pizza', 'Bread', 'Cheese', 'Mango', 'Pasta', 'Sushi', 'Steak'] },
        { name: 'Tool', items: ['Hammer', 'Wrench', 'Pliers', 'Saw', 'Drill', 'Chisel', 'Scalpel', 'Level'] },
        { name: 'Planet', items: ['Mars', 'Venus', 'Jupiter', 'Saturn', 'Mercury', 'Neptune', 'Uranus', 'Earth'] },
        { name: 'Sport', items: ['Tennis', 'Soccer', 'Boxing', 'Archery', 'Fencing', 'Rugby', 'Polo', 'Sumo'] },
      ];

      // Harder difficulty uses more categories
      const catCount = difficulty > 6 ? 5 : difficulty > 3 ? 4 : 3;
      const selectedCats = prng.shuffle([...categories]).slice(0, catCount);
      const catIdx = prng.nextRange(0, selectedCats.length - 1);
      const category = selectedCats[catIdx];
      const item = category.items[prng.nextRange(0, category.items.length - 1)];

      return {
        item,
        correctCategory: category.name,
        options: prng.shuffle(selectedCats.map((c) => c.name)),
      };
    },
    calculateScore: (challenge, sessionResult) => {
      const isCorrect = sessionResult.selectedCategory === challenge.payload.correctCategory;
      const rtMs = sessionResult.reactionTimeMs || 2000;
      const speedBonus = isCorrect ? Math.max(0, 150 - Math.round(rtMs / 15)) : 0;
      return { score: isCorrect ? 200 + challenge.difficulty * 25 + speedBonus : 0, accuracy: isCorrect ? 100 : 0 };
    },
  },

  // GAME 27: LABYRINTH ROUTE PLANNING — with actual walls
  maze_planning: {
    generateChallenge: (prng, difficulty) => {
      const gridDim = difficulty > 5 ? 7 : difficulty > 2 ? 6 : 5;
      const start = { x: 0, y: 0 };
      const end = { x: gridDim - 1, y: gridDim - 1 };

      // Generate simple maze walls (not blocking the path entirely)
      const wallSet = new Set();
      const wallCount = Math.floor(gridDim * difficulty * 0.4);
      for (let i = 0; i < wallCount; i++) {
        const wx = prng.nextRange(0, gridDim - 1);
        const wy = prng.nextRange(0, gridDim - 1);
        // Don't block start or end
        if (!(wx === 0 && wy === 0) && !(wx === gridDim - 1 && wy === gridDim - 1)) {
          wallSet.add(`${wx},${wy}`);
        }
      }

      const minSteps = gridDim * 2 - 2;

      return {
        gridDim,
        start,
        end,
        walls: Array.from(wallSet),
        minSteps,
      };
    },
    calculateScore: (challenge, sessionResult) => {
      const steps = sessionResult.stepsCount || 12;
      const minSteps = challenge.payload.minSteps;
      const isReached = sessionResult.reachedExit;
      const efficiency = Math.max(0, 100 - (steps - minSteps) * 8);
      return { score: isReached ? 350 + Math.round(efficiency * 2.5) : 0, accuracy: isReached ? efficiency : 0 };
    },
  },

  // GAME 28: RESOURCE PLANNING — expanded task trees
  planning_challenge: {
    generateChallenge: (prng, difficulty) => {
      const taskSets = [
        {
          tasks: [
            { id: 'A', name: 'Task A', cost: 2, req: [] },
            { id: 'B', name: 'Task B', cost: 3, req: ['A'] },
            { id: 'C', name: 'Task C', cost: 1, req: ['A'] },
            { id: 'D', name: 'Task D', cost: 4, req: ['B', 'C'] },
          ],
          validSequences: [['A', 'B', 'C', 'D'], ['A', 'C', 'B', 'D']],
        },
        {
          tasks: [
            { id: 'X', name: 'Step X', cost: 1, req: [] },
            { id: 'Y', name: 'Step Y', cost: 2, req: ['X'] },
            { id: 'Z', name: 'Step Z', cost: 2, req: ['X'] },
            { id: 'W', name: 'Step W', cost: 3, req: ['Y'] },
            { id: 'V', name: 'Step V', cost: 4, req: ['Z', 'W'] },
          ],
          validSequences: [['X', 'Y', 'Z', 'W', 'V'], ['X', 'Z', 'Y', 'W', 'V']],
        },
        {
          tasks: [
            { id: '1', name: 'Phase 1', cost: 1, req: [] },
            { id: '2', name: 'Phase 2', cost: 2, req: ['1'] },
            { id: '3', name: 'Phase 3', cost: 2, req: ['1'] },
            { id: '4', name: 'Phase 4', cost: 3, req: ['2', '3'] },
            { id: '5', name: 'Phase 5', cost: 1, req: ['3'] },
            { id: '6', name: 'Phase 6', cost: 4, req: ['4', '5'] },
          ],
          validSequences: [
            ['1', '2', '3', '4', '5', '6'],
            ['1', '3', '2', '4', '5', '6'],
            ['1', '2', '3', '5', '4', '6'],
            ['1', '3', '5', '2', '4', '6'],
          ],
        },
      ];

      const setIdx = difficulty > 6 ? 2 : difficulty > 3 ? prng.nextRange(0, 1) : 0;
      const chosen = taskSets[Math.min(setIdx, taskSets.length - 1)];

      return {
        tasks: chosen.tasks,
        validSequences: chosen.validSequences,
      };
    },
    calculateScore: (challenge, sessionResult) => {
      const userSeq = sessionResult.userSequence || [];
      const isMatch = challenge.payload.validSequences.some(
        (seq) => seq.join('') === userSeq.join('')
      );
      return { score: isMatch ? 400 + challenge.difficulty * 40 : 0, accuracy: isMatch ? 100 : 0 };
    },
  },

  // GAME 29: SERIAL SUBTRACTION SPEED — multi-step chains
  serial_subtraction: {
    generateChallenge: (prng, difficulty) => {
      const startValue = prng.nextRange(80, 150);
      const stepOptions = [3, 7, 13, 17];
      const stepIdx = Math.min(Math.floor(difficulty / 2.5), stepOptions.length - 1);
      const step = stepOptions[stepIdx];
      const expected = startValue - step;

      // In harder difficulties, require TWO subtractions
      const doubleStep = difficulty > 6;
      const expected2 = doubleStep ? expected - step : null;

      return {
        startValue,
        step,
        expected: doubleStep ? expected2 : expected,
        displayValue: doubleStep ? `${startValue} − ${step} − ${step}` : `${startValue} − ${step}`,
        doubleStep,
      };
    },
    calculateScore: (challenge, sessionResult) => {
      const isCorrect = Number(sessionResult.userAnswer) === challenge.payload.expected;
      const rtMs = sessionResult.reactionTimeMs || 4000;
      const speedBonus = isCorrect ? Math.max(0, 200 - Math.round(rtMs / 20)) : 0;
      return { score: isCorrect ? 250 + challenge.difficulty * 30 + speedBonus : 0, accuracy: isCorrect ? 100 : 0 };
    },
  },

  // GAME 30: BACKWARD COUNT SPRINT — varied step sizes
  backward_counting: {
    generateChallenge: (prng, difficulty) => {
      const startOptions = [100, 200, 50, 300, 150];
      const start = startOptions[prng.nextRange(0, startOptions.length - 1)];
      const step = 3 + Math.min(difficulty, 5);
      const seqLength = difficulty > 5 ? 5 : 4;
      const expectedSeq = Array.from({ length: seqLength }, (_, i) => start - step * i);
      const nextValue = start - step * seqLength;

      // Generate 3 wrong answers
      const wrongs = [
        nextValue + step,      // Off by one step
        nextValue - 1,         // Close but wrong
        nextValue + prng.nextRange(2, 4), // Off by small amount
      ].filter(n => n !== nextValue);

      return {
        start,
        step,
        expectedSeq,
        nextValue,
        options: prng.shuffle([nextValue, ...wrongs.slice(0, 3)]),
      };
    },
    calculateScore: (challenge, sessionResult) => {
      const isCorrect = Number(sessionResult.userAnswer) === challenge.payload.nextValue;
      const rtMs = sessionResult.reactionTimeMs || 3000;
      const speedBonus = isCorrect ? Math.max(0, 150 - Math.round(rtMs / 20)) : 0;
      return { score: isCorrect ? 260 + challenge.difficulty * 30 + speedBonus : 0, accuracy: isCorrect ? 100 : 0 };
    },
  },
};
