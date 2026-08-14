/* ==========================================================================
   MEMORY GAMES (01 - 10) ENGINE — ENHANCED & FULLY FIXED (payload aligned)
   ========================================================================== */

export const MemoryGames = {
  // GAME 01: DIGIT SPAN FORWARD
  digit_span_forward: {
    generateChallenge: (prng, difficulty, isHardMode, trialIndex = 1) => {
      const length = isHardMode
        ? Math.min(10, 6 + Math.floor((trialIndex - 1) / 3) + Math.min(difficulty, 2))
        : Math.min(8, 3 + Math.floor((trialIndex - 1) / 2) + Math.min(difficulty, 2));
      const digits = Array.from({ length }, () => prng.nextRange(0, 9));
      const speedMs = Math.max(300, (isHardMode ? 450 : 850) - (trialIndex - 1) * 35 - difficulty * 30);

      return {
        digits,
        expected: digits.join(''),
        displayDurationMs: (digits.length + 1) * speedMs + 800,
        speedMs,
        isHardMode,
      };
    },
    calculateScore: (challenge, sessionResult) => {
      const expected = challenge.payload.expected;
      const got = sessionResult.userInput || '';
      const isCorrect = got === expected;
      return {
        score: isCorrect ? Math.round(100 * 3 + challenge.difficulty * 30 + 200) : 0,
        accuracy: isCorrect ? 100 : 0,
        isCorrect,
      };
    },
  },

  // GAME 02: DIGIT SPAN BACKWARD
  digit_span_backward: {
    generateChallenge: (prng, difficulty, isHardMode, trialIndex = 1) => {
      const length = isHardMode
        ? Math.min(9, 5 + Math.floor((trialIndex - 1) / 3) + Math.min(difficulty, 2))
        : Math.min(7, 2 + Math.floor((trialIndex - 1) / 2) + Math.min(difficulty, 2));
      const digits = Array.from({ length }, () => prng.nextRange(1, 9));
      const speedMs = Math.max(300, (isHardMode ? 400 : 800) - (trialIndex - 1) * 35 - difficulty * 30);

      return {
        digits,
        expected: [...digits].reverse().join(''),
        displayDurationMs: (digits.length + 1) * speedMs + 800,
        speedMs,
        isHardMode,
      };
    },
    calculateScore: (challenge, sessionResult) => {
      const expected = challenge.payload.expected;
      const got = sessionResult.userInput || '';
      const isCorrect = got === expected;
      return {
        score: isCorrect ? Math.round(100 * 3.5 + challenge.difficulty * 35 + 250) : 0,
        accuracy: isCorrect ? 100 : 0,
        isCorrect,
      };
    },
  },

  // GAME 03: CORSI BLOCK TAPPING
  corsi_blocks: {
    generateChallenge: (prng, difficulty, isHardMode, trialIndex = 1) => {
      const seqLen = isHardMode
        ? Math.min(9, 5 + Math.floor((trialIndex - 1) / 3) + Math.min(difficulty, 2))
        : Math.min(7, 2 + Math.floor((trialIndex - 1) / 2) + Math.min(difficulty, 2));
      const gridSize = 9;

      const sequence = [];
      for (let i = 0; i < seqLen; i++) {
        let next;
        do {
          next = prng.nextRange(0, gridSize - 1);
        } while (sequence.length > 0 && next === sequence[sequence.length - 1]);
        sequence.push(next);
      }

      const stepMs = Math.max(280, (isHardMode ? 450 : 750) - (trialIndex - 1) * 35 - difficulty * 25);

      return {
        sequence,
        gridSize,
        gridRows: 3,
        stepMs,
        displayStepMs: stepMs,
        exposureMs: sequence.length * stepMs + 800,
        displayDurationMs: sequence.length * stepMs + 800,
      };
    },
    calculateScore: (challenge, sessionResult) => {
      const expected = challenge.payload.sequence || [];
      const got = sessionResult.userSequence || [];
      const isCorrect = expected.length > 0 && expected.length === got.length && expected.every((val, i) => val === got[i]);
      return {
        score: isCorrect ? Math.round(100 * 4 + challenge.difficulty * 40 + 200) : 0,
        accuracy: isCorrect ? 100 : 0,
        isCorrect,
      };
    },
  },

  // GAME 04: SPATIAL SPAN
  spatial_span: {
    generateChallenge: (prng, difficulty, isHardMode, trialIndex = 1) => {
      const seqLen = isHardMode
        ? Math.min(9, 5 + Math.floor((trialIndex - 1) / 3) + Math.min(difficulty, 2))
        : Math.min(7, 2 + Math.floor((trialIndex - 1) / 2) + Math.min(difficulty, 2));
      const gridSize = 9;

      const sequence = [];
      for (let i = 0; i < seqLen; i++) {
        let next;
        do {
          next = prng.nextRange(0, gridSize - 1);
        } while (sequence.length > 0 && next === sequence[sequence.length - 1]);
        sequence.push(next);
      }

      const stepMs = Math.max(280, (isHardMode ? 450 : 750) - (trialIndex - 1) * 35 - difficulty * 25);

      return {
        sequence,
        gridSize,
        gridRows: 3,
        stepMs,
        displayStepMs: stepMs,
        exposureMs: sequence.length * stepMs + 800,
        displayDurationMs: sequence.length * stepMs + 800,
      };
    },
    calculateScore: (challenge, sessionResult) => {
      const expected = challenge.payload.sequence || [];
      const got = sessionResult.userSequence || [];
      const isCorrect = expected.length > 0 && expected.length === got.length && expected.every((val, i) => val === got[i]);
      return {
        score: isCorrect ? Math.round(100 * 4 + challenge.difficulty * 40 + 200) : 0,
        accuracy: isCorrect ? 100 : 0,
        isCorrect,
      };
    },
  },

  // GAME 05: PICTURE SCENE RECALL
  picture_recall: {
    generateChallenge: (prng, difficulty, isHardMode, trialIndex = 1) => {
      const objectPools = [
        { icon: '🍎', name: 'Apple' },
        { icon: '📚', name: 'Books' },
        { icon: '🕯️', name: 'Candle' },
        { icon: '⏰', name: 'Clock' },
        { icon: '🗝️', name: 'Key' },
        { icon: '🌹', name: 'Rose' },
        { icon: '🔦', name: 'Torch' },
        { icon: '🎭', name: 'Mask' },
        { icon: '💎', name: 'Gem' },
        { icon: '🪩', name: 'Disco Ball' },
        { icon: '🧲', name: 'Magnet' },
        { icon: '🔭', name: 'Telescope' },
      ];

      const positionList = ['Top-Left', 'Top-Right', 'Bottom-Left', 'Bottom-Right', 'Center', 'Mid-Left', 'Mid-Right', 'Top-Center', 'Bottom-Center'];
      const count = isHardMode ? Math.min(9, 6 + Math.floor((trialIndex - 1) / 3)) : Math.min(7, 3 + Math.floor((trialIndex - 1) / 2));
      const shuffled = prng.shuffle([...objectPools]);
      const selectedObjects = shuffled.slice(0, Math.min(count, shuffled.length));
      const shuffledPositions = prng.shuffle([...positionList]);

      const items = selectedObjects.map((obj, i) => ({
        icon: obj.icon,
        name: obj.name,
        position: shuffledPositions[i % shuffledPositions.length],
      }));

      const target = items[prng.nextRange(0, items.length - 1)];
      const correctPos = target.position;
      const wrongPositions = positionList.filter(p => p !== correctPos);
      const options = prng.shuffle([correctPos, ...wrongPositions.slice(0, 3)]);

      return {
        items,
        question: `Where was the ${target.name}?`,
        targetName: target.name,
        targetIcon: target.icon,
        correctAnswer: correctPos,
        options,
        studyDurationMs: isHardMode ? 3500 : Math.max(3000, 5000 - (trialIndex - 1) * 200),
        exposureMs: isHardMode ? 3500 : Math.max(3000, 5000 - (trialIndex - 1) * 200),
        displayDurationMs: isHardMode ? 3500 : Math.max(3000, 5000 - (trialIndex - 1) * 200),
      };
    },
    calculateScore: (challenge, sessionResult) => {
      const isCorrect = sessionResult.userAnswer === challenge.payload.correctAnswer;
      return { score: isCorrect ? 300 + challenge.difficulty * 35 : 0, accuracy: isCorrect ? 100 : 0, isCorrect };
    },
  },

  // GAME 06: FACE-NAME MEMORY
  face_name_memory: {
    generateChallenge: (prng, difficulty, isHardMode, trialIndex = 1) => {
      const avatarPool = [
        { avatar: '🧑‍🦱', names: ['Zara', 'Maya', 'Leila', 'Priya'] },
        { avatar: '🧔‍♂️', names: ['Bram', 'Kai', 'Ivan', 'Samir'] },
        { avatar: '👩‍🦰', names: ['Aria', 'Nora', 'Luna', 'Cleo'] },
        { avatar: '👨‍🦳', names: ['Hugo', 'Curt', 'Wade', 'Glen'] },
        { avatar: '👩‍🦳', names: ['Edna', 'Rose', 'Joan', 'Vera'] },
        { avatar: '👳‍♂️', names: ['Tariq', 'Zayn', 'Amir', 'Rohan'] },
        { avatar: '👩‍🦱', names: ['Amber', 'Jade', 'Ruby', 'Pearl'] },
        { avatar: '🕵️‍♂️', names: ['Rex', 'Ford', 'Reid', 'Vance'] },
        { avatar: '👸', names: ['Sia', 'Elena', 'Tanya', 'Mira'] },
        { avatar: '👨‍🌾', names: ['Seth', 'Drew', 'Ash', 'Lane'] },
        { avatar: '👷‍♀️', names: ['Kira', 'Nia', 'Gwen', 'Hope'] },
        { avatar: '👨‍🎨', names: ['Leo', 'Milo', 'Nico', 'Ezra'] },
      ];

      const pairCount = isHardMode
        ? Math.min(7, 5 + Math.floor((trialIndex - 1) / 3))
        : Math.min(5, 2 + Math.floor((trialIndex - 1) / 2));

      const shuffledPool = prng.shuffle([...avatarPool]);
      const selectedAvatars = new Set();
      const pairs = [];

      for (const item of shuffledPool) {
        if (!selectedAvatars.has(item.avatar)) {
          selectedAvatars.add(item.avatar);
          pairs.push({
            avatar: item.avatar,
            name: item.names[prng.nextRange(0, item.names.length - 1)],
          });
        }
        if (pairs.length >= pairCount) break;
      }

      const targetIdx = prng.nextRange(0, pairs.length - 1);
      const targetPair = pairs[targetIdx];
      const wrongNames = pairs.filter((_, i) => i !== targetIdx).map(p => p.name);
      const options = prng.shuffle([targetPair.name, ...wrongNames.slice(0, 3)]);

      return {
        pairs,
        targetPair,
        targetAvatar: targetPair.avatar,
        nameOptions: options,
        options,
        studyDurationMs: isHardMode ? 3500 : Math.max(3000, 5500 - (trialIndex - 1) * 200),
        displayDurationMs: isHardMode ? 3500 : Math.max(3000, 5500 - (trialIndex - 1) * 200),
      };
    },
    calculateScore: (challenge, sessionResult) => {
      const isCorrect = sessionResult.selectedName === challenge.payload.targetPair.name;
      return { score: isCorrect ? 280 + challenge.difficulty * 35 : 0, accuracy: isCorrect ? 100 : 0, isCorrect };
    },
  },

  // GAME 07: PAIRED ASSOCIATES
  paired_associates: {
    generateChallenge: (prng, difficulty, isHardMode, trialIndex = 1) => {
      const symbolPairs = [
        { symbolA: '★', symbolB: '◯' },
        { symbolA: '◆', symbolB: '△' },
        { symbolA: '♠', symbolB: '♥' },
        { symbolA: '✦', symbolB: '▽' },
        { symbolA: '⊙', symbolB: '◈' },
        { symbolA: '☽', symbolB: '✺' },
        { symbolA: '⊞', symbolB: '⊘' },
        { symbolA: '⟁', symbolB: '⊗' },
      ];

      const count = isHardMode ? Math.min(7, 5 + Math.floor((trialIndex - 1) / 3)) : Math.min(5, 2 + Math.floor((trialIndex - 1) / 2));
      const shuffledPairs = prng.shuffle([...symbolPairs]);
      const selected = shuffledPairs.slice(0, count);

      const targetIdx = prng.nextRange(0, selected.length - 1);
      const targetPair = selected[targetIdx];
      const wrongSymbols = shuffledPairs.slice(count).map(p => p.symbolB);
      const allWrong = [...selected.filter((_, i) => i !== targetIdx).map(p => p.symbolB), ...wrongSymbols];
      const options = prng.shuffle([targetPair.symbolB, ...allWrong.slice(0, 3)]);

      return {
        pairs: selected.map(p => ({ avatar: p.symbolA, name: p.symbolB })),
        targetPair,
        promptSymbol: targetPair.symbolA,
        correctPartner: targetPair.symbolB,
        targetAvatar: targetPair.symbolA,
        nameOptions: options,
        options,
        studyDurationMs: isHardMode ? 3500 : Math.max(3000, 5000 - (trialIndex - 1) * 200),
        displayDurationMs: isHardMode ? 3500 : Math.max(3000, 5000 - (trialIndex - 1) * 200),
      };
    },
    calculateScore: (challenge, sessionResult) => {
      const isCorrect =
        sessionResult.selectedPartner === challenge.payload.correctPartner ||
        sessionResult.selectedName === challenge.payload.correctPartner;
      return { score: isCorrect ? 290 + challenge.difficulty * 35 : 0, accuracy: isCorrect ? 100 : 0, isCorrect };
    },
  },

  // GAME 08: OBJECT LOCATION MEMORY
  object_location: {
    generateChallenge: (prng, difficulty, isHardMode, trialIndex = 1) => {
      const objects = [
        { symbol: '🍎', name: 'Apple' },
        { symbol: '📚', name: 'Books' },
        { symbol: '🕯️', name: 'Candle' },
        { symbol: '⏰', name: 'Clock' },
        { symbol: '🗝️', name: 'Key' },
        { symbol: '🌹', name: 'Rose' },
        { symbol: '🔦', name: 'Torch' },
        { symbol: '💎', name: 'Gem' },
        { symbol: '🧲', name: 'Magnet' },
      ];

      const gridDim = isHardMode ? 4 : (difficulty > 5 || trialIndex > 5 ? 4 : 3);
      const totalCells = gridDim * gridDim;

      const itemCount = isHardMode ? Math.min(6, 4 + Math.floor((trialIndex - 1) / 3)) : Math.min(4, 2 + Math.floor((trialIndex - 1) / 2));
      const shuffledObjects = prng.shuffle([...objects]);
      const selectedObjects = shuffledObjects.slice(0, itemCount);

      const usedCells = new Set();
      const items = selectedObjects.map(obj => {
        let cellIdx;
        do { cellIdx = prng.nextRange(0, totalCells - 1); } while (usedCells.has(cellIdx));
        usedCells.add(cellIdx);
        return {
          ...obj,
          cellIdx,
          row: Math.floor(cellIdx / gridDim),
          col: cellIdx % gridDim,
        };
      });

      const targetItem = items[prng.nextRange(0, items.length - 1)];
      const gridOptions = Array.from({ length: totalCells }, (_, i) => i);

      return {
        items,
        targetItem,
        targetCell: { row: targetItem.row, col: targetItem.col },
        correctCellIdx: targetItem.cellIdx,
        gridOptions,
        gridDim,
        totalCells,
        studyDurationMs: Math.max(1200, (isHardMode ? 2000 : 3500) - (trialIndex - 1) * 200 - difficulty * 150),
        displayDurationMs: Math.max(1200, (isHardMode ? 2000 : 3500) - (trialIndex - 1) * 200 - difficulty * 150),
      };
    },
    calculateScore: (challenge, sessionResult) => {
      const target = challenge.payload.correctCellIdx;
      const selected = sessionResult.selectedCellIdx ?? sessionResult.selectedIndex;
      const isCorrect = selected === target;
      return { score: isCorrect ? Math.round(100 * 3.5 + challenge.difficulty * 30) : 0, accuracy: isCorrect ? 100 : 0, isCorrect };
    },
  },

  // GAME 09: VISUAL SEQUENCE REPRODUCTION (Simon-Says)
  sequence_reproduction: {
    generateChallenge: (prng, difficulty, isHardMode, trialIndex = 1) => {
      const itemColors = [
        { id: 'red', name: 'Red', color: '#E85D75' },
        { id: 'blue', name: 'Blue', color: '#6C4DFF' },
        { id: 'green', name: 'Green', color: '#39B982' },
        { id: 'yellow', name: 'Yellow', color: '#F0A83A' },
      ];

      const seqLen = isHardMode
        ? Math.min(8, 5 + Math.floor((trialIndex - 1) / 3))
        : Math.min(6, 2 + Math.floor((trialIndex - 1) / 2));

      const sequence = [];
      for (let i = 0; i < seqLen; i++) {
        let idx;
        do { idx = prng.nextRange(0, itemColors.length - 1); }
        while (sequence.length > 0 && sequence[sequence.length - 1] === idx);
        sequence.push(idx);
      }

      const stepMs = Math.max(280, (isHardMode ? 400 : 700) - (trialIndex - 1) * 35 - difficulty * 25);

      return {
        items: itemColors,
        sequence,
        expected: sequence,
        stepMs,
        displayStepMs: stepMs,
        speedMs: stepMs,
        displayDurationMs: sequence.length * stepMs + 800,
      };
    },
    calculateScore: (challenge, sessionResult) => {
      const expected = challenge.payload.sequence || [];
      const got = sessionResult.userSequence || [];
      const isCorrect = expected.length > 0 && expected.length === got.length && expected.every((val, i) => val === got[i]);
      return { score: isCorrect ? Math.round(100 * 4 + challenge.difficulty * 35 + 200) : 0, accuracy: isCorrect ? 100 : 0, isCorrect };
    },
  },

  // GAME 10: VISUAL PATTERN MEMORY (Matrix Grid)
  visual_pattern_memory: {
    generateChallenge: (prng, difficulty, isHardMode, trialIndex = 1) => {
      const dimension = isHardMode ? 5 : 4;
      const totalCells = dimension * dimension;
      const shadedCount = isHardMode
        ? Math.min(12, 7 + Math.floor((trialIndex - 1) / 3))
        : Math.min(7, 3 + Math.floor((trialIndex - 1) / 2));

      const shadedSet = new Set();
      while (shadedSet.size < Math.min(shadedCount, totalCells - 4)) {
        shadedSet.add(prng.nextRange(0, totalCells - 1));
      }
      const targetGrid = Array.from(shadedSet);

      return {
        dimension,
        targetGrid,
        shadedIndices: targetGrid,
        studyDurationMs: Math.max(1000, (isHardMode ? 2000 : 3500) - (trialIndex - 1) * 200 - difficulty * 100),
        displayDurationMs: Math.max(1000, (isHardMode ? 2000 : 3500) - (trialIndex - 1) * 200 - difficulty * 100),
      };
    },
    calculateScore: (challenge, sessionResult) => {
      const targets = new Set(challenge.payload.targetGrid || challenge.payload.shadedIndices || []);
      const userSelected = new Set(sessionResult.shadedIndices || sessionResult.targetGrid || []);
      const isCorrect = targets.size > 0 && targets.size === userSelected.size && [...targets].every(t => userSelected.has(t));
      return { score: isCorrect ? Math.round(targets.size * 100 + challenge.difficulty * 35) : 0, accuracy: isCorrect ? 100 : 0, isCorrect };
    },
  },
};
