/* ==========================================================================
   ATTENTION / INHIBITION GAMES (11 - 20) PRO ENGINE — FULLY FIXED & ENHANCED
   ========================================================================== */

export const AttentionGames = {
  // GAME 11: STROOP SPRINT — 12 Colors + Dynamic INK vs WORD Task Prompting
  stroop_sprint: {
    generateChallenge: (prng, difficulty, isHardMode) => {
      const colors = [
        { name: 'Red', hex: '#E85D75' },
        { name: 'Blue', hex: '#6C4DFF' },
        { name: 'Green', hex: '#39B982' },
        { name: 'Yellow', hex: '#F0A83A' },
        { name: 'Purple', hex: '#A855F7' },
        { name: 'Orange', hex: '#F97316' },
        { name: 'Pink', hex: '#EC4899' },
        { name: 'Cyan', hex: '#06B6D4' },
        { name: 'Brown', hex: '#92400E' },
        { name: 'Teal', hex: '#14B8A6' },
        { name: 'Magenta', hex: '#D946EF' },
        { name: 'Lime', hex: '#84CC16' },
      ];

      const taskMode = prng.nextRange(0, 1) === 0 ? 'INK' : 'WORD';
      const pool = prng.shuffle([...colors]);

      const textItem = pool[prng.nextRange(0, pool.length - 1)];
      const filtered = pool.filter(c => c.name !== textItem.name);
      const inkItem = filtered[prng.nextRange(0, filtered.length - 1)];

      const correctAnswer = taskMode === 'INK' ? inkItem.name : textItem.name;
      const wrongDistractors = pool.filter(c => c.name !== correctAnswer).map(c => c.name);
      const options = prng.shuffle([correctAnswer, ...wrongDistractors.slice(0, 3)]);

      return {
        taskMode, // 'INK' or 'WORD'
        wordText: textItem.name,
        inkColorHex: inkItem.hex,
        correctInkName: inkItem.name,
        correctWordName: textItem.name,
        correctAnswer,
        isIncongruent: textItem.name !== inkItem.name,
        options,
        timeLimitMs: Math.max(1200, (isHardMode ? 2200 : 3800) - difficulty * 150),
      };
    },
    calculateScore: (challenge, sessionResult) => {
      const expected = challenge.payload.correctAnswer || challenge.payload.correctInkName;
      const userSelected = sessionResult.selectedColor || sessionResult.userAnswer;
      const isCorrect = userSelected === expected;
      const rtMs = sessionResult.reactionTimeMs || 1000;
      const incongruentBonus = challenge.payload.isIncongruent ? 80 : 0;
      const speedBonus = Math.max(0, 400 - Math.round(rtMs / 4));
      const score = isCorrect ? 300 + challenge.difficulty * 45 + speedBonus + incongruentBonus : 0;
      return { score, accuracy: isCorrect ? 100 : 0, isCorrect };
    },
  },

  // GAME 12: TRAIL MAKING A
  trail_making_a: {
    generateChallenge: (prng, difficulty, isHardMode) => {
      const count = (isHardMode ? 12 : 6) + Math.min(difficulty, 6);
      const points = [];
      const usedPositions = new Set();
      for (let i = 1; i <= count; i++) {
        let x, y, key;
        let attempts = 0;
        do {
          x = prng.nextRange(8, 88);
          y = prng.nextRange(12, 82);
          const gx = Math.round(x / 15) * 15;
          const gy = Math.round(y / 15) * 15;
          key = `${gx},${gy}`;
          attempts++;
        } while (usedPositions.has(key) && attempts < 20);
        usedPositions.add(key);
        points.push({ id: i, label: `${i}`, x, y });
      }
      return {
        points: prng.shuffle([...points]),
        expectedSequence: points.map((p) => p.label),
        isPartB: false,
        timeLimitMs: Math.max(5000, 18000 - difficulty * 1200),
      };
    },
    calculateScore: (challenge, sessionResult) => {
      const totalTimeMs = sessionResult.trialTimeMs || sessionResult.totalTimeMs || 10000;
      const errors = sessionResult.errorCount || 0;
      const isCorrect = errors < 5;
      const accuracy = Math.max(0, 100 - errors * 12);
      const score = isCorrect ? Math.max(100, Math.round(60000 / Math.max(totalTimeMs, 500)) * 12 - errors * 50) : 0;
      return { score, accuracy, isCorrect };
    },
  },

  // GAME 13: TRAIL MAKING B
  trail_making_b: {
    generateChallenge: (prng, difficulty, isHardMode) => {
      const pairCount = (isHardMode ? 8 : 4) + Math.min(difficulty, 4);
      const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];
      const sequence = [];
      for (let i = 0; i < pairCount; i++) {
        sequence.push(`${i + 1}`);
        sequence.push(letters[i]);
      }

      const usedPositions = new Set();
      const points = sequence.map((label, idx) => {
        let x, y, key;
        let attempts = 0;
        do {
          x = prng.nextRange(8, 88);
          y = prng.nextRange(12, 82);
          const gx = Math.round(x / 14) * 14;
          const gy = Math.round(y / 14) * 14;
          key = `${gx},${gy}`;
          attempts++;
        } while (usedPositions.has(key) && attempts < 20);
        usedPositions.add(key);
        return { id: idx + 1, label, x, y };
      });

      return {
        points: prng.shuffle([...points]),
        expectedSequence: sequence,
        isPartB: true,
        timeLimitMs: Math.max(6000, 22000 - difficulty * 1400),
      };
    },
    calculateScore: (challenge, sessionResult) => {
      const totalTimeMs = sessionResult.trialTimeMs || sessionResult.totalTimeMs || 15000;
      const errors = sessionResult.errorCount || 0;
      const isCorrect = errors < 5;
      const accuracy = Math.max(0, 100 - errors * 12);
      const score = isCorrect ? Math.max(100, Math.round(75000 / Math.max(totalTimeMs, 500)) * 12 - errors * 50) : 0;
      return { score, accuracy, isCorrect };
    },
  },

  // GAME 14: GO / NO-GO RESPONSE — Dynamic Arcade GO/NO-GO Traps & Bonuses
  go_no_go: {
    generateChallenge: (prng, difficulty, isHardMode) => {
      const isGo = prng.nextRange(0, 99) < (isHardMode ? 55 : 70);

      const goStimuli = [
        { type: 'GO', color: '#39B982', icon: '🟢', label: 'TAP FAST!' },
        { type: 'GO', color: '#39B982', icon: '🚀', label: 'LAUNCH!' },
        { type: 'GO', color: '#39B982', icon: '⚡', label: 'SURGE!' },
      ];

      const noGoStimuli = [
        { type: 'NO_GO', color: '#E85D75', icon: '💀', label: 'DANGER!' },
        { type: 'NO_GO', color: '#E85D75', icon: '💣', label: 'BOOM!' },
        { type: 'NO_GO', color: '#E85D75', icon: '🛑', label: 'HALT!' },
      ];

      const stimulus = isGo
        ? goStimuli[prng.nextRange(0, goStimuli.length - 1)]
        : noGoStimuli[prng.nextRange(0, noGoStimuli.length - 1)];

      const durationMs = Math.max(500, (isHardMode ? 850 : 1400) - difficulty * 80);

      return {
        stimulus,
        durationMs,
        autoSubmitAfterMs: durationMs + 250,
      };
    },
    calculateScore: (challenge, sessionResult) => {
      const isGo = challenge.payload.stimulus.type === 'GO';
      const didTap = Boolean(sessionResult.userTapped);
      const isCorrect = (isGo && didTap) || (!isGo && !didTap);
      const rtMs = sessionResult.reactionTimeMs || 500;
      const speedBonus = isGo && isCorrect ? Math.max(0, 200 - Math.round(rtMs / 4)) : 0;
      return { score: isCorrect ? 250 + challenge.difficulty * 35 + speedBonus : 0, accuracy: isCorrect ? 100 : 0, isCorrect };
    },
  },

  // GAME 15: ERIKSEN FLANKER — 4-Way Directions (Up/Down/Left/Right) & Position Targets (LEFT, CENTER, RIGHT)
  flanker_task: {
    generateChallenge: (prng, difficulty, isHardMode) => {
      const directions = ['left', 'right', 'up', 'down'];
      const positions = ['LEFT', 'CENTER', 'RIGHT'];
      const targetPos = positions[prng.nextRange(0, positions.length - 1)];

      const themes = [
        { name: 'arrows', map: { up: '↑', down: '↓', left: '←', right: '→' } },
        { name: 'jets', map: { up: '🚀', down: '🛬', left: '✈️', right: '🛩️' } },
        { name: 'fish', map: { up: '🐬', down: '🪼', left: '🐟', right: '🐠' } },
        { name: 'hands', map: { up: '👆', down: '👇', left: '👈', right: '👉' } },
      ];
      const theme = themes[prng.nextRange(0, themes.length - 1)];

      const targetDir = directions[prng.nextRange(0, directions.length - 1)];
      const flankerDir = isHardMode
        ? directions[prng.nextRange(0, directions.length - 1)]
        : (prng.nextRange(0, 1) === 0 ? targetDir : directions.filter(d => d !== targetDir)[prng.nextRange(0, 2)]);

      // Create 5 items: indices 0 (LEFT), 1, 2 (CENTER), 3, 4 (RIGHT)
      const items = Array.from({ length: 5 }, (_, idx) => {
        if (targetPos === 'LEFT' && idx === 0) return { dir: targetDir, symbol: theme.map[targetDir] };
        if (targetPos === 'CENTER' && idx === 2) return { dir: targetDir, symbol: theme.map[targetDir] };
        if (targetPos === 'RIGHT' && idx === 4) return { dir: targetDir, symbol: theme.map[targetDir] };
        return { dir: flankerDir, symbol: theme.map[flankerDir] };
      });

      const displayString = items.map(i => i.symbol).join(' ');

      return {
        items,
        theme: theme.name,
        targetPosition: targetPos, // 'LEFT', 'CENTER', or 'RIGHT'
        targetDirection: targetDir,
        correctDirection: targetDir,
        displayString,
        isCongruent: targetDir === flankerDir,
        timeLimitMs: Math.max(1200, (isHardMode ? 2200 : 3800) - difficulty * 110),
      };
    },
    calculateScore: (challenge, sessionResult) => {
      const expected = challenge.payload.correctDirection || challenge.payload.targetDirection;
      const isCorrect = sessionResult.selectedDirection === expected;
      const rtMs = sessionResult.reactionTimeMs || 800;
      const incongruentBonus = !challenge.payload.isCongruent ? 60 : 0;
      const speedBonus = Math.max(0, 320 - Math.round(rtMs / 3));
      return { score: isCorrect ? 280 + challenge.difficulty * 40 + speedBonus + incongruentBonus : 0, accuracy: isCorrect ? 100 : 0, isCorrect };
    },
  },

  // GAME 16: SIMON TASK
  simon_task: {
    generateChallenge: (prng, difficulty, isHardMode) => {
      // In hard mode, expand to 4 colors with 4 buttons
      const targetColors = isHardMode
        ? [
            { name: 'Red', hex: '#E85D75', expectedButton: 'A' },
            { name: 'Blue', hex: '#6C4DFF', expectedButton: 'B' },
            { name: 'Green', hex: '#39B982', expectedButton: 'C' },
            { name: 'Yellow', hex: '#F0A83A', expectedButton: 'D' },
          ]
        : [
            { name: 'Red', hex: '#E85D75', expectedButton: 'LEFT' },
            { name: 'Blue', hex: '#6C4DFF', expectedButton: 'RIGHT' },
          ];

      const buttonOptions = isHardMode ? ['A', 'B', 'C', 'D'] : ['LEFT', 'RIGHT'];
      const target = targetColors[prng.nextRange(0, targetColors.length - 1)];
      const screenSide = isHardMode
        ? ['LEFT', 'RIGHT', 'CENTER', 'FAR_RIGHT'][prng.nextRange(0, 3)]
        : (prng.nextRange(0, 1) === 0 ? 'LEFT' : 'RIGHT');

      return {
        colorName: target.name,
        colorHex: target.hex,
        screenSide,
        expectedButton: target.expectedButton,
        isCongruent: target.expectedButton === screenSide,
        buttonOptions,
        isHardMode,
      };
    },
    calculateScore: (challenge, sessionResult) => {
      const isCorrect = sessionResult.selectedButton === challenge.payload.expectedButton;
      const incongruentBonus = !challenge.payload.isCongruent ? 50 : 0;
      return { score: isCorrect ? 280 + challenge.difficulty * 35 + incongruentBonus : 0, accuracy: isCorrect ? 100 : 0 };
    },
  },

  // GAME 17: VISUAL SEARCH
  visual_search: {
    generateChallenge: (prng, difficulty, isHardMode) => {
      // In hard mode: target is harder to distinguish (similar shape, different color)
      const count = (isHardMode ? 24 : 12) + Math.min(difficulty * 3, 20);

      const targetSymbols = ['▲', '★', '◆', '●'];
      const distractorGroups = [
        ['△', '△', '△'], // open triangles (similar to ▲)
        ['☆', '☆', '☆'], // open stars (similar to ★)
        ['◇', '◇', '◇'], // open diamonds (similar to ◆)
        ['◯', '◯', '◯'], // open circles (similar to ●)
      ];

      const targetSymbolIdx = prng.nextRange(0, targetSymbols.length - 1);
      const target = targetSymbols[targetSymbolIdx];
      const distractorPool = isHardMode
        ? distractorGroups[targetSymbolIdx]
        : ['◯', '□', '△'];

      const distractorCount = Math.max(1, count - 1);
      const distractors = Array.from({ length: distractorCount }, () =>
        distractorPool[prng.nextRange(0, distractorPool.length - 1)]
      );

      // FIX: insert target at a known position BEFORE shuffling,
      // then track that position through the shuffle — avoid indexOf() which
      // can match a distractor that is the same symbol as target.
      const insertAt = prng.nextRange(0, distractors.length);
      const rawItems = [...distractors.slice(0, insertAt), target, ...distractors.slice(insertAt)];

      // Shuffle while tracking target position
      const indices = rawItems.map((_, i) => i);
      const shuffledIndices = prng.shuffle(indices);
      const shuffled = shuffledIndices.map(i => rawItems[i]);
      // targetIndex = position of the original insertAt index in shuffledIndices
      const targetIndex = shuffledIndices.indexOf(insertAt);

      const colors = ['#6C4DFF', '#39B982', '#E85D75', '#F0A83A', '#06B6D4', '#A855F7', '#EC4899'];
      const items = shuffled.map((symbol) => ({
        symbol,
        color: colors[prng.nextRange(0, colors.length - 1)],
        rotation: prng.nextRange(0, 3) * 90,
      }));

      return {
        items,
        targetSymbol: target,
        targetIndex,
        gridCols: isHardMode ? 6 : 4,
      };
    },
    calculateScore: (challenge, sessionResult) => {
      const isCorrect = sessionResult.selectedIndex === challenge.payload.targetIndex;
      const rtMs = sessionResult.reactionTimeMs || 2500;
      const speedBonus = Math.max(0, 500 - Math.round(rtMs / 6));
      return { score: isCorrect ? 350 + challenge.difficulty * 45 + speedBonus : 0, accuracy: isCorrect ? 100 : 0 };
    },
  },

  // GAME 18: CANCELLATION TASK
  cancellation_task: {
    generateChallenge: (prng, difficulty, isHardMode) => {
      const targetSymbol = '★';
      // In hard mode, distractors include ☆ (open star) which looks similar
      const distractorsPool = isHardMode
        ? ['▲', '●', '■', '◆', '✦', '☆']
        : ['▲', '●', '■', '◆', '✦'];

      const totalGrid = isHardMode ? 42 : 28;
      const targetCount = (isHardMode ? 8 : 5) + Math.min(difficulty, 6);

      const items = [];
      for (let i = 0; i < totalGrid; i++) {
        items.push({
          id: i,
          symbol: i < targetCount
            ? targetSymbol
            : distractorsPool[prng.nextRange(0, distractorsPool.length - 1)],
        });
      }

      return {
        targetSymbol,
        gridItems: prng.shuffle(items),
        targetCount,
        timeLimitMs: isHardMode ? 20000 : 30000,
        gridCols: isHardMode ? 7 : 6,
      };
    },
    calculateScore: (challenge, sessionResult) => {
      const userSelectedIds = new Set(sessionResult.selectedIds || []);
      const items = challenge.payload.gridItems;
      let correctHits = 0;
      let falsePositives = 0;

      items.forEach((item) => {
        if (item.symbol === challenge.payload.targetSymbol) {
          if (userSelectedIds.has(item.id)) correctHits++;
        } else {
          if (userSelectedIds.has(item.id)) falsePositives++;
        }
      });

      const accuracy = Math.round(
        (Math.max(0, correctHits - falsePositives) / challenge.payload.targetCount) * 100
      );
      const score = Math.max(0, correctHits * 130 - falsePositives * 70 + challenge.difficulty * 30);
      return { score, accuracy };
    },
  },

  // GAME 19: CONTINUOUS PERFORMANCE — FIXED stream generation
  continuous_performance: {
    generateChallenge: (prng, difficulty, isHardMode) => {
      const letters = ['B', 'C', 'D', 'E', 'F', 'Y', 'Z', 'A', 'X'];
      const streamLength = isHardMode ? 20 : 14;
      const stream = [];

      // Guarantee at least 2-3 A→X triggers
      const targetSlots = new Set();
      const numTargets = isHardMode ? 4 : 3;

      // Reserve slots for targets (need slot i and i-1, i >= 1)
      let attempts = 0;
      while (targetSlots.size < numTargets && attempts < 50) {
        const slot = prng.nextRange(2, streamLength - 1);
        // Make sure it's not adjacent to another target
        if (!targetSlots.has(slot) && !targetSlots.has(slot - 1) && !targetSlots.has(slot + 1)) {
          targetSlots.add(slot);
        }
        attempts++;
      }

      // Build stream
      for (let i = 0; i < streamLength; i++) {
        if (targetSlots.has(i)) {
          // This position should be X, previous must be A
          stream[i] = 'X';
          if (stream[i - 1] !== 'A') stream[i - 1] = 'A';
        } else if (!stream[i]) {
          // Random non-target, non-A letter (unless we need A before X)
          const nonTargetLetters = letters.filter(l => l !== 'X' && l !== 'A');
          stream[i] = nonTargetLetters[prng.nextRange(0, nonTargetLetters.length - 1)];
        }
      }

      // Fill any remaining undefined (from i-1 overwrites)
      const nonTargetLetters = letters.filter(l => l !== 'X' && l !== 'A');
      for (let i = 0; i < streamLength; i++) {
        if (!stream[i]) {
          stream[i] = nonTargetLetters[prng.nextRange(0, nonTargetLetters.length - 1)];
        }
      }

      return {
        stream,
        targetTriggerCount: targetSlots.size,
        targetIndices: Array.from(targetSlots),
        intervalMs: Math.max(300, (isHardMode ? 450 : 800) - difficulty * 45),
      };
    },
    calculateScore: (challenge, sessionResult) => {
      const userTaps = sessionResult.tapIndices || [];
      const targetIndices = new Set(challenge.payload.targetIndices || []);
      let validHits = 0;
      let falseAlarms = 0;

      userTaps.forEach((idx) => {
        if (targetIndices.has(idx)) {
          validHits++;
        } else {
          falseAlarms++;
        }
      });

      const totalTargets = challenge.payload.targetTriggerCount || 1;
      const accuracy = Math.round((validHits / totalTargets) * 100);
      const score = Math.max(0, validHits * 250 - falseAlarms * 80 + challenge.difficulty * 35);
      return { score, accuracy };
    },
  },

  // GAME 20: MULTIPLE OBJECT TRACKING
  multiple_object_tracking: {
    generateChallenge: (prng, difficulty, isHardMode) => {
      const totalObjects = isHardMode ? 9 : 6;
      const targetCount = (isHardMode ? 4 : 2) + (difficulty > 5 ? 1 : 0);
      const targetIds = new Set();

      while (targetIds.size < targetCount) {
        targetIds.add(prng.nextRange(0, totalObjects - 1));
      }

      // Generate initial positions and velocities for animation
      const objects = Array.from({ length: totalObjects }, (_, idx) => ({
        id: idx,
        isTarget: targetIds.has(idx),
        x: prng.nextRange(10, 90),
        y: prng.nextRange(10, 90),
        vx: (prng.nextRange(0, 1) === 0 ? 1 : -1) * prng.nextRange(2, 5) * (isHardMode ? 1.4 : 1),
        vy: (prng.nextRange(0, 1) === 0 ? 1 : -1) * prng.nextRange(2, 5) * (isHardMode ? 1.4 : 1),
      }));

      return {
        totalObjects,
        objects,
        targetIds: Array.from(targetIds),
        motionDurationMs: isHardMode ? 5500 : 4000,
        highlightDurationMs: 2500,
      };
    },
    calculateScore: (challenge, sessionResult) => {
      const userSelected = new Set(sessionResult.selectedIds || []);
      const targets = challenge.payload.targetIds;
      let hits = 0;
      let falseAlarms = 0;

      targets.forEach((id) => { if (userSelected.has(id)) hits++; });
      userSelected.forEach((id) => { if (!targets.includes(id)) falseAlarms++; });

      const accuracy = Math.round((hits / targets.length) * 100);
      const score = Math.max(0, hits * 250 - falseAlarms * 60 + challenge.difficulty * 50);
      return { score, accuracy };
    },
  },
};
