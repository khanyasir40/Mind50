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
        timeLimitMs: null,
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

      return { score: isCorrect ? 300 + challenge.difficulty * 30 : 0, accuracy: isCorrect ? 100 : 0, isCorrect };
    },
  },

  // GAME 22: TOWER OF LONDON — Pure Move-Based (No Timer)
  tower_of_london: {
    generateChallenge: (prng, difficulty) => {
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

      const easyPuzzles = puzzles.slice(0, 4);
      const hardPuzzles = puzzles.slice(4);
      const pool = difficulty > 5 ? hardPuzzles : easyPuzzles;

      const puzzle = pool[prng.nextRange(0, pool.length - 1)];

      return {
        initialPegs: puzzle.initial.map(peg => [...peg]),
        targetPegs: puzzle.target,
        minMoves: puzzle.minMoves,
        diskCount: puzzle.disks,
        timeLimitMs: null,
      };
    },
    calculateScore: (challenge, sessionResult) => {
      const moves = sessionResult.movesCount || 10;
      const optimal = challenge.payload.minMoves;
      const isSuccess = Boolean(sessionResult.isSolved);
      const efficiency = Math.max(0, 100 - (moves - optimal) * 12);
      const score = isSuccess ? 400 + Math.round(efficiency * 3.5) + challenge.difficulty * 40 : 0;
      return { score, accuracy: isSuccess ? efficiency : 0, isCorrect: isSuccess };
    },
  },

  // GAME 23: TOWER OF HANOI — Pure Move-Based (No Timer)
  tower_of_hanoi: {
    generateChallenge: (prng, difficulty) => {
      const diskCount = 3 + (difficulty > 4 ? (difficulty > 7 ? 2 : 1) : 0);
      const minMoves = Math.pow(2, diskCount) - 1;
      return {
        diskCount,
        minMoves,
        timeLimitMs: null,
      };
    },
    calculateScore: (challenge, sessionResult) => {
      const moves = sessionResult.movesCount || 20;
      const minMoves = challenge.payload.minMoves;
      const isSuccess = Boolean(sessionResult.isSolved);
      const efficiency = Math.max(0, 100 - (moves - minMoves) * 8);
      const perfectBonus = moves === minMoves ? 200 : 0;
      return {
        score: isSuccess ? 450 + Math.round(efficiency * 3) + perfectBonus : 0,
        accuracy: isSuccess ? efficiency : 0,
        isCorrect: isSuccess,
      };
    },
  },

  // GAME 24: RULE SWITCHING — 4 Dynamic Cues (PARITY, MAGNITUDE, COLOR, LOCATION)
  rule_switching: {
    generateChallenge: (prng, difficulty, isHardMode) => {
      const number = prng.nextRange(1, 99);
      const warmColors = ['#E85D75', '#F97316', '#F0A83A'];
      const coolColors = ['#6C4DFF', '#39B982', '#06B6D4'];
      const isWarm = prng.nextRange(0, 1) === 0;
      const colorHex = isWarm
        ? warmColors[prng.nextRange(0, warmColors.length - 1)]
        : coolColors[prng.nextRange(0, coolColors.length - 1)];

      const isTop = prng.nextRange(0, 1) === 0;

      const cues = ['PARITY', 'MAGNITUDE', 'COLOR', 'LOCATION'];
      const activeCue = cues[prng.nextRange(0, cues.length - 1)];

      let instruction = '';
      let leftLabel = '';
      let rightLabel = '';
      let expectedAnswer = '';

      if (activeCue === 'PARITY') {
        instruction = 'Is the number ODD or EVEN?';
        leftLabel = 'ODD';
        rightLabel = 'EVEN';
        expectedAnswer = number % 2 !== 0 ? 'LEFT' : 'RIGHT';
      } else if (activeCue === 'MAGNITUDE') {
        instruction = 'Is the number HIGH (> 50) or LOW (≤ 50)?';
        leftLabel = 'LOW (≤ 50)';
        rightLabel = 'HIGH (> 50)';
        expectedAnswer = number > 50 ? 'RIGHT' : 'LEFT';
      } else if (activeCue === 'COLOR') {
        instruction = 'Is the number WARM (Red/Orange) or COOL (Blue/Green)?';
        leftLabel = '🔴 WARM';
        rightLabel = '🔵 COOL';
        expectedAnswer = isWarm ? 'LEFT' : 'RIGHT';
      } else {
        instruction = 'Is the number at the TOP or BOTTOM?';
        leftLabel = '⬆️ TOP';
        rightLabel = '⬇️ BOTTOM';
        expectedAnswer = isTop ? 'LEFT' : 'RIGHT';
      }

      return {
        cue: activeCue,
        number,
        colorHex,
        isWarm,
        isTop,
        instruction,
        leftLabel,
        rightLabel,
        expectedAnswer,
        timeLimitMs: Math.max(5000, (isHardMode ? 4500 : 7000) - difficulty * 150),
      };
    },
    calculateScore: (challenge, sessionResult) => {
      const isCorrect = sessionResult.selectedSide === challenge.payload.expectedAnswer;
      const rtMs = sessionResult.reactionTimeMs || 2000;
      const speedBonus = isCorrect ? Math.max(0, 200 - Math.round(rtMs / 10)) : 0;
      return { score: isCorrect ? 250 + challenge.difficulty * 30 + speedBonus : 0, accuracy: isCorrect ? 100 : 0, isCorrect };
    },
  },

  // GAME 25: DUAL TASK MULTITASKING — Web Audio Pitch Tone (No text answer spoil)
  dual_task: {
    generateChallenge: (prng, difficulty, isHardMode) => {
      const trackingTargetX = prng.nextRange(25, 75);
      const auditoryToneIsHigh = prng.nextRange(0, 1) === 1;
      const frequencyHz = auditoryToneIsHigh ? 880 : 220; // 880Hz HIGH vs 220Hz LOW
      const driftSpeedPct = 2 + Math.min(difficulty, 5);

      return {
        trackingTargetX,
        auditoryToneIsHigh,
        frequencyHz,
        expectedToneResponse: auditoryToneIsHigh ? 'HIGH' : 'LOW',
        driftSpeedPct,
        timeLimitMs: Math.max(5000, (isHardMode ? 5000 : 7500) - difficulty * 150),
      };
    },
    calculateScore: (challenge, sessionResult) => {
      const trackingAccuracy = Math.max(0, Math.min(100, sessionResult.trackingAccuracy || 70));
      const toneCorrect = sessionResult.selectedTone === challenge.payload.expectedToneResponse;
      const isCorrect = toneCorrect && trackingAccuracy > 50;

      const accuracy = Math.round((trackingAccuracy + (toneCorrect ? 100 : 0)) / 2);
      const score = isCorrect ? Math.round(accuracy * 4.5) + challenge.difficulty * 30 : 0;
      return { score, accuracy: isCorrect ? accuracy : 0, isCorrect };
    },
  },

  // GAME 26: CATEGORY SEMANTIC SORTING
  category_sorting: {
    generateChallenge: (prng, difficulty, isHardMode) => {
      const categories = [
        { name: 'Animal', items: ['Lion', 'Eagle', 'Dolphin', 'Tiger', 'Panda', 'Cobra', 'Elk', 'Crow'] },
        { name: 'Food', items: ['Apple', 'Pizza', 'Bread', 'Cheese', 'Mango', 'Pasta', 'Sushi', 'Steak'] },
        { name: 'Tool', items: ['Hammer', 'Wrench', 'Pliers', 'Saw', 'Drill', 'Chisel', 'Scalpel', 'Level'] },
        { name: 'Planet', items: ['Mars', 'Venus', 'Jupiter', 'Saturn', 'Mercury', 'Neptune', 'Uranus', 'Earth'] },
        { name: 'Sport', items: ['Tennis', 'Soccer', 'Boxing', 'Archery', 'Fencing', 'Rugby', 'Polo', 'Sumo'] },
      ];

      const catCount = difficulty > 6 ? 5 : difficulty > 3 ? 4 : 3;
      const selectedCats = prng.shuffle([...categories]).slice(0, catCount);
      const catIdx = prng.nextRange(0, selectedCats.length - 1);
      const category = selectedCats[catIdx];
      const item = category.items[prng.nextRange(0, category.items.length - 1)];

      return {
        item,
        correctCategory: category.name,
        options: prng.shuffle(selectedCats.map((c) => c.name)),
        timeLimitMs: Math.max(5000, (isHardMode ? 4500 : 7000) - difficulty * 150),
      };
    },
    calculateScore: (challenge, sessionResult) => {
      const isCorrect = sessionResult.selectedCategory === challenge.payload.correctCategory;
      const rtMs = sessionResult.reactionTimeMs || 2000;
      const speedBonus = isCorrect ? Math.max(0, 150 - Math.round(rtMs / 15)) : 0;
      return { score: isCorrect ? 200 + challenge.difficulty * 25 + speedBonus : 0, accuracy: isCorrect ? 100 : 0, isCorrect };
    },
  },

  // GAME 27: LABYRINTH ROUTE PLANNING
  maze_planning: {
    generateChallenge: (prng, difficulty) => {
      const gridDim = difficulty > 5 ? 7 : difficulty > 2 ? 6 : 5;
      const start = { x: 0, y: 0 };
      const end = { x: gridDim - 1, y: gridDim - 1 };

      const isSolvable = (walls) => {
        const wallSet = new Set(walls);
        const visited = new Set();
        const queue = [`0,0`];
        const goal = `${gridDim - 1},${gridDim - 1}`;
        const dirs = [[0,1],[0,-1],[1,0],[-1,0]];
        while (queue.length > 0) {
          const curr = queue.shift();
          if (curr === goal) return true;
          visited.add(curr);
          const [cx, cy] = curr.split(',').map(Number);
          for (const [dx, dy] of dirs) {
            const nx = cx + dx;
            const ny = cy + dy;
            const key = `${nx},${ny}`;
            if (nx >= 0 && nx < gridDim && ny >= 0 && ny < gridDim && !wallSet.has(key) && !visited.has(key)) {
              queue.push(key);
              visited.add(key);
            }
          }
        }
        return false;
      };

      let walls = [];
      let minSteps = gridDim * 2 - 2;
      let attempts = 0;
      do {
        const wallCount = Math.min(gridDim * 2, 4 + Math.floor(difficulty * 1.5));
        const wallSet = new Set();
        while (wallSet.size < wallCount) {
          const wx = prng.nextRange(0, gridDim - 1);
          const wy = prng.nextRange(0, gridDim - 1);
          const key = `${wx},${wy}`;
          if (key !== `0,0` && key !== `${gridDim - 1},${gridDim - 1}`) {
            wallSet.add(key);
          }
        }
        walls = Array.from(wallSet);
        attempts++;
      } while (!isSolvable(walls) && attempts < 20);

      return {
        gridDim,
        start,
        end,
        walls,
        minSteps,
        timeLimitMs: null,
      };
    },
    calculateScore: (challenge, sessionResult) => {
      const steps = sessionResult.stepsCount || 12;
      const minSteps = challenge.payload.minSteps;
      const isReached = Boolean(sessionResult.reachedExit);
      const efficiency = Math.max(0, 100 - (steps - minSteps) * 8);
      return { score: isReached ? 350 + Math.round(efficiency * 2.5) : 0, accuracy: isReached ? efficiency : 0, isCorrect: isReached };
    },
  },

  // GAME 28: RESOURCE PLANNING
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
      ];

      const setIdx = difficulty > 5 ? 1 : 0;
      const chosen = taskSets[setIdx];

      return {
        tasks: chosen.tasks,
        validSequences: chosen.validSequences,
        timeLimitMs: null,
      };
    },
    calculateScore: (challenge, sessionResult) => {
      const userSeq = sessionResult.userSequence || [];
      const isMatch = challenge.payload.validSequences.some(
        (seq) => seq.join('') === userSeq.join('')
      );
      return { score: isMatch ? 400 + challenge.difficulty * 40 : 0, accuracy: isMatch ? 100 : 0, isCorrect: isMatch };
    },
  },

  // GAME 29: SERIAL SUBTRACTION SPEED — Dynamic Subtrahends (-3 to -9 Normal, -11 to -19 Hard) & Scaled Time Limits
  serial_subtraction: {
    generateChallenge: (prng, difficulty, isHardMode) => {
      const normalSteps = [3, 4, 5, 6, 7, 8, 9];
      const hardSteps = [11, 13, 14, 17, 19];

      const step = isHardMode
        ? hardSteps[prng.nextRange(0, hardSteps.length - 1)]
        : normalSteps[prng.nextRange(0, normalSteps.length - 1)];

      const startValue = prng.nextRange(isHardMode ? 180 : 90, isHardMode ? 450 : 250);
      const expected = startValue - step;

      // 4 option choices (including expected answer)
      const wrong1 = expected + 2;
      const wrong2 = expected - 3;
      const wrong3 = expected + 5;
      const options = prng.shuffle([expected, wrong1, wrong2, wrong3]);

      const timeLimitMs = isHardMode
        ? Math.max(7000, 10000 - difficulty * 200)
        : Math.max(5000, 7500 - difficulty * 200);

      return {
        startValue,
        step,
        expected,
        displayValue: `${startValue} − ${step}`,
        options,
        timeLimitMs,
      };
    },
    calculateScore: (challenge, sessionResult) => {
      const userVal = Number(sessionResult.userAnswer || sessionResult.userInput);
      const isCorrect = userVal === challenge.payload.expected;
      const rtMs = sessionResult.reactionTimeMs || 4000;
      const speedBonus = isCorrect ? Math.max(0, 200 - Math.round(rtMs / 20)) : 0;
      return { score: isCorrect ? 250 + challenge.difficulty * 30 + speedBonus : 0, accuracy: isCorrect ? 100 : 0, isCorrect };
    },
  },

  // GAME 30: BACKWARD COUNT SPRINT
  backward_counting: {
    generateChallenge: (prng, difficulty, isHardMode) => {
      const startOptions = [100, 200, 150, 250, 300];
      const start = startOptions[prng.nextRange(0, startOptions.length - 1)];
      const step = isHardMode ? prng.nextRange(7, 13) : prng.nextRange(3, 6);
      const seqLength = isHardMode ? 5 : 4;
      const expectedSeq = Array.from({ length: seqLength }, (_, i) => start - step * i);
      const nextValue = start - step * seqLength;

      const wrongs = [
        nextValue + step,
        nextValue - 2,
        nextValue + 4,
      ].filter(n => n !== nextValue);

      return {
        start,
        step,
        expectedSeq,
        nextValue,
        options: prng.shuffle([nextValue, ...wrongs.slice(0, 3)]),
        timeLimitMs: Math.max(5000, (isHardMode ? 5000 : 8000) - difficulty * 200),
      };
    },
    calculateScore: (challenge, sessionResult) => {
      const userVal = Number(sessionResult.userAnswer || sessionResult.userInput);
      const isCorrect = userVal === challenge.payload.nextValue;
      const rtMs = sessionResult.reactionTimeMs || 3000;
      const speedBonus = isCorrect ? Math.max(0, 150 - Math.round(rtMs / 20)) : 0;
      return { score: isCorrect ? 260 + challenge.difficulty * 30 + speedBonus : 0, accuracy: isCorrect ? 100 : 0, isCorrect };
    },
  },
};
