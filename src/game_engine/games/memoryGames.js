/* ==========================================================================
   MEMORY GAMES (01 - 10) ENGINE — ENHANCED & POLISHED
   ========================================================================== */

export const MemoryGames = {
  // GAME 01: DIGIT SPAN FORWARD
  digit_span_forward: {
    generateChallenge: (prng, difficulty, isHardMode) => {
      const length = (isHardMode ? 6 : 4) + Math.min(difficulty, 6);
      const digits = Array.from({ length }, () => prng.nextRange(0, 9));
      const speedMs = Math.max(500, (isHardMode ? 550 : 900) - difficulty * 55);

      return {
        digits,
        expected: digits.join(''),
        displayDurationMs: (digits.length + 1) * speedMs + 1000,
        speedMs,
        isHardMode,
      };
    },
    calculateScore: (challenge, sessionResult) => {
      const expected = challenge.payload.expected;
      const got = sessionResult.userInput || '';
      const isCorrect = got === expected;

      // Partial credit: number of chars matched
      let matchCount = 0;
      for (let i = 0; i < Math.min(expected.length, got.length); i++) {
        if (expected[i] === got[i]) matchCount++;
      }
      const accuracy = expected.length > 0 ? Math.round((matchCount / expected.length) * 100) : 0;
      const score = Math.round(accuracy * 3 + challenge.difficulty * 30 + (isCorrect ? 200 : 0));
      return { score, accuracy };
    },
  },

  // GAME 02: DIGIT SPAN BACKWARD
  digit_span_backward: {
    generateChallenge: (prng, difficulty, isHardMode) => {
      const length = (isHardMode ? 5 : 3) + Math.min(difficulty, 5);
      const digits = Array.from({ length }, () => prng.nextRange(1, 9));
      const speedMs = Math.max(500, (isHardMode ? 500 : 850) - difficulty * 50);

      return {
        digits,
        expected: [...digits].reverse().join(''),
        displayDurationMs: (digits.length + 1) * speedMs + 1000,
        speedMs,
        isHardMode,
      };
    },
    calculateScore: (challenge, sessionResult) => {
      const expected = challenge.payload.expected;
      const got = sessionResult.userInput || '';
      const isCorrect = got === expected;

      let matchCount = 0;
      for (let i = 0; i < Math.min(expected.length, got.length); i++) {
        if (expected[i] === got[i]) matchCount++;
      }
      const accuracy = expected.length > 0 ? Math.round((matchCount / expected.length) * 100) : 0;
      return { score: Math.round(accuracy * 3.5 + challenge.difficulty * 35 + (isCorrect ? 250 : 0)), accuracy };
    },
  },

  // GAME 03: CORSI BLOCK TAPPING
  corsi_blocks: {
    generateChallenge: (prng, difficulty, isHardMode) => {
      const seqLen = (isHardMode ? 6 : 3) + Math.min(difficulty, 6);
      const gridSize = 9;
      const gridRows = 3;

      // Ensure no adjacent repeats for harder sequences
      const sequence = [];
      for (let i = 0; i < seqLen; i++) {
        let next;
        do {
          next = prng.nextRange(0, gridSize - 1);
        } while (sequence.length > 0 && next === sequence[sequence.length - 1]);
        sequence.push(next);
      }

      const stepMs = Math.max(400, (isHardMode ? 500 : 800) - difficulty * 55);

      return {
        sequence,
        gridSize,
        gridRows,
        displayStepMs: stepMs,
        exposureMs: sequence.length * stepMs + 800,
      };
    },
    calculateScore: (challenge, sessionResult) => {
      const expected = challenge.payload.sequence;
      const got = sessionResult.userSequence || [];
      let hits = 0;
      for (let i = 0; i < Math.min(expected.length, got.length); i++) {
        if (expected[i] === got[i]) hits++;
      }
      const accuracy = expected.length > 0 ? Math.round((hits / expected.length) * 100) : 0;
      return { score: Math.round(accuracy * 4 + challenge.difficulty * 40 + (accuracy === 100 ? 200 : 0)), accuracy };
    },
  },

  // GAME 04: SPATIAL SPAN
  spatial_span: {
    generateChallenge: (prng, difficulty, isHardMode) => {
      const count = (isHardMode ? 7 : 4) + Math.min(difficulty, 6);
      const gridSize = 16;
      const targetIndices = new Set();
      while (targetIndices.size < Math.min(count, gridSize)) {
        targetIndices.add(prng.nextRange(0, gridSize - 1));
      }

      return {
        targetIndices: Array.from(targetIndices),
        gridSize,
        studyDurationMs: 3000 + difficulty * 300,
      };
    },
    calculateScore: (challenge, sessionResult) => {
      const targets = new Set(challenge.payload.targetIndices);
      const userSelected = new Set(sessionResult.selectedIndices || []);

      let hits = 0;
      let falseAlarms = 0;
      targets.forEach(t => { if (userSelected.has(t)) hits++; });
      userSelected.forEach(s => { if (!targets.has(s)) falseAlarms++; });

      const accuracy = Math.round((hits / targets.size) * 100);
      return { score: Math.max(0, hits * 120 - falseAlarms * 60 + challenge.difficulty * 30), accuracy };
    },
  },

  // GAME 05: PICTURE SCENE RECALL
  picture_recall: {
    generateChallenge: (prng, difficulty, isHardMode) => {
      const objectPools = [
        { icon: '🍎', name: 'Apple', positions: ['Top-Left', 'Top-Right', 'Bottom-Left', 'Bottom-Right', 'Center'] },
        { icon: '📚', name: 'Books', positions: ['Top-Left', 'Top-Right', 'Bottom-Left', 'Bottom-Right', 'Center'] },
        { icon: '🕯️', name: 'Candle', positions: ['Top-Left', 'Top-Right', 'Bottom-Left', 'Bottom-Right', 'Center'] },
        { icon: '⏰', name: 'Clock', positions: ['Top-Left', 'Top-Right', 'Bottom-Left', 'Bottom-Right', 'Center'] },
        { icon: '🗝️', name: 'Key', positions: ['Top-Left', 'Top-Right', 'Bottom-Left', 'Bottom-Right', 'Center'] },
        { icon: '🌹', name: 'Rose', positions: ['Top-Left', 'Top-Right', 'Bottom-Left', 'Bottom-Right', 'Center'] },
        { icon: '🔦', name: 'Torch', positions: ['Top-Left', 'Top-Right', 'Bottom-Left', 'Bottom-Right', 'Center'] },
        { icon: '🎭', name: 'Mask', positions: ['Top-Left', 'Top-Right', 'Bottom-Left', 'Bottom-Right', 'Center'] },
        { icon: '💎', name: 'Gem', positions: ['Top-Left', 'Top-Right', 'Bottom-Left', 'Bottom-Right', 'Center'] },
      ];

      const count = isHardMode ? 9 : 4 + Math.min(difficulty, 5);
      const shuffled = prng.shuffle([...objectPools]);
      const selectedObjects = shuffled.slice(0, Math.min(count, shuffled.length));

      const positionList = ['Top-Left', 'Top-Right', 'Bottom-Left', 'Bottom-Right', 'Center', 'Mid-Left', 'Mid-Right', 'Top-Center', 'Bottom-Center'];
      const shuffledPositions = prng.shuffle([...positionList]);

      const sceneLayout = selectedObjects.map((obj, i) => ({
        icon: obj.icon,
        name: obj.name,
        position: shuffledPositions[i % shuffledPositions.length],
      }));

      const target = sceneLayout[prng.nextRange(0, sceneLayout.length - 1)];
      const correctPos = target.position;
      const wrongPositions = positionList.filter(p => p !== correctPos);
      const choices = prng.shuffle([correctPos, ...wrongPositions.slice(0, 3)]);

      return {
        sceneLayout,
        question: `Where was the ${target.name}?`,
        targetName: target.name,
        correctAnswer: correctPos,
        choices,
        studyDurationMs: isHardMode ? 3500 : 5000,
        exposureMs: isHardMode ? 3500 : 5000,
      };
    },
    calculateScore: (challenge, sessionResult) => {
      const isCorrect = sessionResult.userAnswer === challenge.payload.correctAnswer;
      return { score: isCorrect ? 300 + challenge.difficulty * 35 : 0, accuracy: isCorrect ? 100 : 0 };
    },
  },

  // GAME 06: FACE-NAME MEMORY
  face_name_memory: {
    generateChallenge: (prng, difficulty, isHardMode) => {
      const avatarPool = [
        { avatar: '🧑‍🦱', names: ['Zara', 'Maya', 'Leila', 'Priya'] },
        { avatar: '🧔', names: ['Bram', 'Kai', 'Ivan', 'Samir'] },
        { avatar: '👩‍🦰', names: ['Aria', 'Nora', 'Luna', 'Cleo'] },
        { avatar: '👨‍🦳', names: ['Hugo', 'Curt', 'Wade', 'Glen'] },
        { avatar: '👩‍🦳', names: ['Edna', 'Rose', 'Joan', 'Vera'] },
        { avatar: '🧑‍🦲', names: ['Drew', 'Ash', 'Seth', 'Lane'] },
        { avatar: '👩‍🦱', names: ['Amber', 'Jade', 'Ruby', 'Pearl'] },
        { avatar: '👨‍🦲', names: ['Rex', 'Ford', 'Reid', 'Vance'] },
      ];

      const pairCount = isHardMode ? 5 : 2 + Math.min(difficulty, 4);
      const shuffledPool = prng.shuffle([...avatarPool]);
      const selected = shuffledPool.slice(0, pairCount);

      const pairs = selected.map(p => ({
        avatar: p.avatar,
        name: p.names[prng.nextRange(0, p.names.length - 1)],
      }));

      const targetIdx = prng.nextRange(0, pairs.length - 1);
      const targetPair = pairs[targetIdx];
      const wrongNames = pairs.filter((_, i) => i !== targetIdx).map(p => p.name);
      const options = prng.shuffle([targetPair.name, ...wrongNames.slice(0, 3)]);

      return {
        pairs,
        targetPair,
        options,
        studyDurationMs: isHardMode ? 4000 : 5500,
        displayDurationMs: isHardMode ? 4000 : 5500,
      };
    },
    calculateScore: (challenge, sessionResult) => {
      const isCorrect = sessionResult.selectedName === challenge.payload.targetPair.name;
      return { score: isCorrect ? 280 + challenge.difficulty * 35 : 0, accuracy: isCorrect ? 100 : 0 };
    },
  },

  // GAME 07: PAIRED ASSOCIATES
  paired_associates: {
    generateChallenge: (prng, difficulty, isHardMode) => {
      const symbolPairs = [
        ['★', '◯'], ['◆', '△'], ['♠', '♥'], ['✦', '▽'],
        ['⊙', '◈'], ['☽', '✺'], ['⊞', '⊘'], ['⟁', '⊗'],
      ];

      const count = isHardMode ? 5 : 2 + Math.min(difficulty, 4);
      const shuffledPairs = prng.shuffle([...symbolPairs]);
      const selected = shuffledPairs.slice(0, count);

      const pairs = selected.map(([a, b]) => ({
        symbolA: a,
        symbolB: b,
      }));

      const targetIdx = prng.nextRange(0, pairs.length - 1);
      const targetPair = pairs[targetIdx];
      const wrongSymbols = shuffledPairs.slice(count).map(p => p[1]);
      const options = prng.shuffle([targetPair.symbolB, ...wrongSymbols.slice(0, 4)]);

      return {
        pairs,
        promptSymbol: targetPair.symbolA,
        correctPartner: targetPair.symbolB,
        options,
        studyDurationMs: isHardMode ? 3500 : 5000,
        displayDurationMs: isHardMode ? 3500 : 5000,
      };
    },
    calculateScore: (challenge, sessionResult) => {
      const isCorrect = sessionResult.selectedPartner === challenge.payload.correctPartner;
      return { score: isCorrect ? 290 + challenge.difficulty * 35 : 0, accuracy: isCorrect ? 100 : 0 };
    },
  },

  // GAME 08: OBJECT LOCATION MEMORY
  object_location: {
    generateChallenge: (prng, difficulty, isHardMode) => {
      const objects = ['🍎', '📚', '🕯️', '⏰', '🗝️', '🌹'];
      const item = objects[prng.nextRange(0, objects.length - 1)];
      const row = prng.nextRange(0, 2);
      const col = prng.nextRange(0, 2);

      return {
        item,
        targetCell: { row, col },
        studyDurationMs: Math.max(1200, (isHardMode ? 1500 : 3000) - difficulty * 200),
        displayDurationMs: Math.max(1200, (isHardMode ? 1500 : 3000) - difficulty * 200),
      };
    },
    calculateScore: (challenge, sessionResult) => {
      const target = challenge.payload.targetCell;
      const selected = sessionResult.selectedCell || {};
      const isCorrect = selected.row === target.row && selected.col === target.col;

      // Partial credit for one-off positions
      const rowDiff = Math.abs((selected.row ?? -9) - target.row);
      const colDiff = Math.abs((selected.col ?? -9) - target.col);
      const accuracy = isCorrect ? 100 : (rowDiff + colDiff) <= 1 ? 50 : 0;
      return { score: Math.round(accuracy * 3.5 + challenge.difficulty * 30), accuracy };
    },
  },

  // GAME 09: VISUAL SEQUENCE REPRODUCTION (Simon-Says)
  sequence_reproduction: {
    generateChallenge: (prng, difficulty, isHardMode) => {
      const itemColors = [
        { id: 'red', name: 'Red', color: '#E85D75' },
        { id: 'blue', name: 'Blue', color: '#6C4DFF' },
        { id: 'green', name: 'Green', color: '#39B982' },
        { id: 'yellow', name: 'Yellow', color: '#F0A83A' },
      ];

      const seqLen = (isHardMode ? 6 : 3) + Math.min(difficulty, 6);
      // Ensure no two consecutive identical flashes (makes it harder to track)
      const sequence = [];
      for (let i = 0; i < seqLen; i++) {
        let idx;
        do { idx = prng.nextRange(0, itemColors.length - 1); }
        while (sequence.length > 0 && sequence[sequence.length - 1] === idx);
        sequence.push(idx);
      }

      const speedMs = Math.max(350, (isHardMode ? 400 : 700) - difficulty * 50);

      return {
        items: itemColors,
        sequence,
        expected: sequence,
        speedMs,
        displayDurationMs: sequence.length * speedMs + 800,
      };
    },
    calculateScore: (challenge, sessionResult) => {
      const expected = challenge.payload.sequence;
      const got = sessionResult.userSequence || [];
      let hits = 0;
      for (let i = 0; i < Math.min(expected.length, got.length); i++) {
        if (expected[i] === got[i]) hits++;
      }
      const accuracy = expected.length > 0 ? Math.round((hits / expected.length) * 100) : 0;
      return { score: Math.round(accuracy * 4 + challenge.difficulty * 35 + (accuracy === 100 ? 200 : 0)), accuracy };
    },
  },

  // GAME 10: VISUAL PATTERN MEMORY (Matrix Grid)
  visual_pattern_memory: {
    generateChallenge: (prng, difficulty, isHardMode) => {
      const dimension = isHardMode ? 5 : 4;
      const totalCells = dimension * dimension;
      const shadedCount = (isHardMode ? 10 : 5) + Math.min(difficulty, 7);

      const shadedIndices = new Set();
      while (shadedIndices.size < Math.min(shadedCount, totalCells - 4)) {
        shadedIndices.add(prng.nextRange(0, totalCells - 1));
      }

      return {
        dimension,
        shadedIndices: Array.from(shadedIndices),
        studyDurationMs: Math.max(1500, (isHardMode ? 2000 : 3500) - difficulty * 200),
        displayDurationMs: Math.max(1500, (isHardMode ? 2000 : 3500) - difficulty * 200),
      };
    },
    calculateScore: (challenge, sessionResult) => {
      const targets = new Set(challenge.payload.shadedIndices);
      const userSelected = new Set(sessionResult.shadedIndices || []);
      let hits = 0;
      let falsePositives = 0;

      targets.forEach(t => { if (userSelected.has(t)) hits++; });
      userSelected.forEach(s => { if (!targets.has(s)) falsePositives++; });

      const accuracy = targets.size > 0 ? Math.round((hits / targets.size) * 100) : 0;
      return { score: Math.max(0, hits * 100 - falsePositives * 55 + challenge.difficulty * 35), accuracy };
    },
  },
};
