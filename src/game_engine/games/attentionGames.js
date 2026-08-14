/* ==========================================================================
   ATTENTION / INHIBITION GAMES (11 - 20) PRO ENGINE — FULLY FIXED & ENHANCED
   ========================================================================== */

export const AttentionGames = {
  // GAME 11: STROOP SPRINT
  stroop_sprint: {
    generateChallenge: (prng, difficulty, isHardMode) => {
      const colors = [
        { name: 'Red', hex: '#E85D75' },
        { name: 'Blue', hex: '#6C4DFF' },
        { name: 'Green', hex: '#39B982' },
        { name: 'Yellow', hex: '#F0A83A' },
        { name: 'Purple', hex: '#A855F7' },
        { name: 'Orange', hex: '#F97316' },
      ];

      const pool = isHardMode ? colors : colors.slice(0, 4);
      // Force incongruent (harder) in hard mode, allow congruent otherwise
      let textItem, inkItem;
      const forceIncongruent = isHardMode || prng.nextRange(0, 1) === 0;

      textItem = pool[prng.nextRange(0, pool.length - 1)];
      if (forceIncongruent) {
        // Pick a different color for ink
        const filtered = pool.filter(c => c.name !== textItem.name);
        inkItem = filtered[prng.nextRange(0, filtered.length - 1)];
      } else {
        inkItem = textItem;
      }

      return {
        wordText: textItem.name,
        inkColorHex: inkItem.hex,
        correctInkName: inkItem.name,
        isIncongruent: textItem.name !== inkItem.name,
        options: prng.shuffle(pool.map((c) => c.name)),
        timeLimitMs: Math.max(700, (isHardMode ? 1300 : 2400) - difficulty * 150),
      };
    },
    calculateScore: (challenge, sessionResult) => {
      const isCorrect = sessionResult.selectedColor === challenge.payload.correctInkName;
      const rtMs = sessionResult.reactionTimeMs || 1000;
      // Incongruent trials worth more
      const incongruentBonus = challenge.payload.isIncongruent ? 80 : 0;
      const speedBonus = Math.max(0, 400 - Math.round(rtMs / 4));
      const score = isCorrect ? 300 + challenge.difficulty * 45 + speedBonus + incongruentBonus : 0;
      return { score, accuracy: isCorrect ? 100 : 0 };
    },
  },

  // GAME 12: TRAIL MAKING A
  trail_making_a: {
    generateChallenge: (prng, difficulty, isHardMode) => {
      const count = (isHardMode ? 12 : 6) + Math.min(difficulty, 6);
      const points = [];
      // Ensure points don't overlap by using a grid-based placement approach
      const usedPositions = new Set();
      for (let i = 1; i <= count; i++) {
        let x, y, key;
        let attempts = 0;
        do {
          x = prng.nextRange(8, 88);
          y = prng.nextRange(12, 82);
          // Round to grid of 15 to avoid overlap
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
      const accuracy = Math.max(0, 100 - errors * 12);
      const score = Math.max(100, Math.round(60000 / Math.max(totalTimeMs, 500)) * 12 - errors * 50);
      return { score, accuracy };
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
      const accuracy = Math.max(0, 100 - errors * 12);
      const score = Math.max(100, Math.round(75000 / Math.max(totalTimeMs, 500)) * 12 - errors * 50);
      return { score, accuracy };
    },
  },

  // GAME 14: GO / NO-GO RESPONSE — with proper auto-timeout duration
  go_no_go: {
    generateChallenge: (prng, difficulty, isHardMode) => {
      const isGo = prng.nextRange(0, 99) < (isHardMode ? 55 : 70);
      const stimulus = isGo
        ? { type: 'GO', color: '#39B982', shape: 'Circle', label: 'TAP!' }
        : { type: 'NO_GO', color: '#E85D75', shape: 'Square', label: 'HOLD!' };

      const durationMs = Math.max(400, (isHardMode ? 750 : 1300) - difficulty * 80);

      return {
        stimulus,
        durationMs,
        // No-go trials must auto-submit after duration elapses (handled by renderer)
        autoSubmitAfterMs: durationMs + 200,
      };
    },
    calculateScore: (challenge, sessionResult) => {
      const isGo = challenge.payload.stimulus.type === 'GO';
      const didTap = sessionResult.userTapped;
      const isCorrect = (isGo && didTap) || (!isGo && !didTap);
      const rtMs = sessionResult.reactionTimeMs || 500;
      const speedBonus = isGo && isCorrect ? Math.max(0, 200 - Math.round(rtMs / 4)) : 0;
      return { score: isCorrect ? 250 + challenge.difficulty * 35 + speedBonus : 0, accuracy: isCorrect ? 100 : 0 };
    },
  },

  // GAME 15: ERIKSEN FLANKER
  flanker_task: {
    generateChallenge: (prng, difficulty, isHardMode) => {
      const directions = ['left', 'right'];
      const centerDir = directions[prng.nextRange(0, 1)];
      const isCongruent = !isHardMode && prng.nextRange(0, 3) !== 0; // Hard mode is mostly incongruent
      const flankerDir = isCongruent ? centerDir : (centerDir === 'left' ? 'right' : 'left');

      const symbolMap = { left: '←', right: '→' };
      const flankerCount = isHardMode ? 4 : 2;
      const flankersLeft = Array(flankerCount).fill(symbolMap[flankerDir]).join(' ');
      const flankersRight = Array(flankerCount).fill(symbolMap[flankerDir]).join(' ');

      const displayString = `${flankersLeft} ${symbolMap[centerDir]} ${flankersRight}`;

      return {
        displayString,
        correctDirection: centerDir,
        isCongruent,
        flankerCount,
        timeLimitMs: Math.max(450, (isHardMode ? 850 : 1700) - difficulty * 110),
      };
    },
    calculateScore: (challenge, sessionResult) => {
      const isCorrect = sessionResult.selectedDirection === challenge.payload.correctDirection;
      const rtMs = sessionResult.reactionTimeMs || 800;
      const incongruentBonus = !challenge.payload.isCongruent ? 60 : 0;
      const speedBonus = Math.max(0, 320 - Math.round(rtMs / 3));
      return { score: isCorrect ? 280 + challenge.difficulty * 40 + speedBonus + incongruentBonus : 0, accuracy: isCorrect ? 100 : 0 };
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
