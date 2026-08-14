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
        taskMode,
        wordText: textItem.name,
        inkColorHex: inkItem.hex,
        correctInkName: inkItem.name,
        correctWordName: textItem.name,
        correctAnswer,
        isIncongruent: textItem.name !== inkItem.name,
        options,
        timeLimitMs: Math.max(5000, (isHardMode ? 4000 : 7000) - difficulty * 150),
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
        timeLimitMs: Math.max(5000, 22000 - difficulty * 1400),
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

  // GAME 14: GO / NO-GO RESPONSE
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

      const durationMs = Math.max(1200, (isHardMode ? 1200 : 2500) - difficulty * 80);

      return {
        stimulus,
        durationMs,
        autoSubmitAfterMs: durationMs + 250,
        timeLimitMs: Math.max(5000, (isHardMode ? 4000 : 6000)),
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

  // GAME 15: ERIKSEN FLANKER — 4-Way Directions & Position Targets
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
        targetPosition: targetPos,
        targetDirection: targetDir,
        correctDirection: targetDir,
        displayString,
        isCongruent: targetDir === flankerDir,
        timeLimitMs: Math.max(5000, (isHardMode ? 4500 : 7500) - difficulty * 110),
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

  // GAME 16: SIMON TASK — Color Arcade with Location Distractors
  simon_task: {
    generateChallenge: (prng, difficulty, isHardMode) => {
      const targetColors = [
        { name: 'Red', hex: '#E85D75', expectedButton: 'RED' },
        { name: 'Blue', hex: '#6C4DFF', expectedButton: 'BLUE' },
        { name: 'Green', hex: '#39B982', expectedButton: 'GREEN' },
        { name: 'Yellow', hex: '#F0A83A', expectedButton: 'YELLOW' },
      ];

      const activeColors = isHardMode ? targetColors : targetColors.slice(0, 2);
      const target = activeColors[prng.nextRange(0, activeColors.length - 1)];

      const locations = ['TOP_LEFT', 'TOP_RIGHT', 'BOTTOM_LEFT', 'BOTTOM_RIGHT', 'CENTER'];
      const screenSide = locations[prng.nextRange(0, locations.length - 1)];

      return {
        colorName: target.name,
        colorHex: target.hex,
        screenSide,
        expectedButton: target.expectedButton,
        isCongruent: false,
        activeColors,
        timeLimitMs: Math.max(5000, (isHardMode ? 4500 : 7500) - difficulty * 120),
      };
    },
    calculateScore: (challenge, sessionResult) => {
      const isCorrect = (sessionResult.selectedButton || sessionResult.selectedColor) === challenge.payload.expectedButton;
      return { score: isCorrect ? 280 + challenge.difficulty * 35 : 0, accuracy: isCorrect ? 100 : 0, isCorrect };
    },
  },

  // GAME 17: VISUAL SEARCH MATRIX — Balanced Mix of Filled & Outline Shapes (Uniqueness = 1)
  visual_search: {
    generateChallenge: (prng, difficulty, isHardMode) => {
      const gridCols = isHardMode ? 5 : 4;
      const rowCount = isHardMode ? 5 : 4;
      const totalGridCount = gridCols * rowCount; // 16 items in 4x4, 25 items in 5x5

      // Pool of both filled AND outline shapes
      const allSymbols = ['✦', '✧', '▲', '△', '◆', '◇', '●', '◯', '★', '☆', '■', '□', '◁', '▷'];
      
      const targetSymbol = allSymbols[prng.nextRange(0, allSymbols.length - 1)];
      const distractorPool = allSymbols.filter(s => s !== targetSymbol);

      // Select 5-6 distractor shapes to repeat so each appears 2-4 times (frequency ≥ 2)
      const numDistractorTypes = isHardMode ? 6 : 5;
      const chosenDistractorTypes = prng.shuffle(distractorPool).slice(0, numDistractorTypes);

      const distractors = [];
      let typeIdx = 0;
      while (distractors.length < totalGridCount - 1) {
        distractors.push(chosenDistractorTypes[typeIdx % chosenDistractorTypes.length]);
        typeIdx++;
      }

      // Shuffle distractors so their distribution is balanced
      const shuffledDistractors = prng.shuffle(distractors);

      const insertAt = prng.nextRange(0, shuffledDistractors.length);
      const rawItems = [...shuffledDistractors.slice(0, insertAt), targetSymbol, ...shuffledDistractors.slice(insertAt)];

      const indices = rawItems.map((_, i) => i);
      const shuffledIndices = prng.shuffle(indices);
      const shuffled = shuffledIndices.map(i => rawItems[i]);
      const targetIndex = shuffledIndices.indexOf(insertAt);

      const uniformColor = '#6C4DFF';

      const items = shuffled.map((symbol) => ({
        symbol,
        color: uniformColor,
        rotation: 0,
      }));

      return {
        items,
        targetSymbol,
        targetIndex,
        gridCols,
        rowCount,
        totalGridCount,
        timeLimitMs: Math.max(5000, (isHardMode ? 5000 : 8000) - difficulty * 180),
      };
    },
    calculateScore: (challenge, sessionResult) => {
      const isCorrect = sessionResult.selectedIndex === challenge.payload.targetIndex;
      const rtMs = sessionResult.reactionTimeMs || 2500;
      const speedBonus = isCorrect ? Math.max(0, 500 - Math.round(rtMs / 6)) : 0;
      return { score: isCorrect ? 350 + challenge.difficulty * 45 + speedBonus : 0, accuracy: isCorrect ? 100 : 0, isCorrect };
    },
  },

  // GAME 18: CANCELLATION TASK
  cancellation_task: {
    generateChallenge: (prng, difficulty, isHardMode) => {
      const targetSymbols = ['★', '◆', '▲', '●'];
      const targetSymbol = targetSymbols[prng.nextRange(0, targetSymbols.length - 1)];

      const distractorsPool = ['▲', '●', '■', '◆', '✦', '☆', '◇', '◯'].filter(s => s !== targetSymbol);
      const totalGrid = isHardMode ? 35 : 24;
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
        timeLimitMs: Math.max(5000, isHardMode ? 20000 : 30000),
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
      return { score, accuracy, isCorrect: accuracy > 40 };
    },
  },

  // GAME 19: CONTINUOUS PERFORMANCE — Dynamic Target Pair Rules (A→X, 3→7, ◆→★, M→Z)
  continuous_performance: {
    generateChallenge: (prng, difficulty, isHardMode, trialIndex = 1) => {
      const ruleSets = [
        { triggerLetter: 'X', leadLetter: 'A', pool: ['B', 'C', 'D', 'E', 'F', 'Y', 'Z', 'A', 'X'] },
        { triggerLetter: '7', leadLetter: '3', pool: ['1', '2', '4', '5', '6', '8', '9', '3', '7'] },
        { triggerLetter: '★', leadLetter: '◆', pool: ['▲', '●', '■', '✦', '⬟', '◆', '★'] },
        { triggerLetter: 'Z', leadLetter: 'M', pool: ['K', 'L', 'N', 'P', 'Q', 'R', 'M', 'Z'] },
      ];

      const activeRule = ruleSets[(trialIndex - 1) % ruleSets.length];
      const streamLength = isHardMode ? 18 : 12;
      const stream = [];

      const targetSlots = new Set();
      const numTargets = isHardMode ? 4 : 3;

      let attempts = 0;
      while (targetSlots.size < numTargets && attempts < 50) {
        const slot = prng.nextRange(2, streamLength - 1);
        if (!targetSlots.has(slot) && !targetSlots.has(slot - 1) && !targetSlots.has(slot + 1)) {
          targetSlots.add(slot);
        }
        attempts++;
      }

      for (let i = 0; i < streamLength; i++) {
        if (targetSlots.has(i)) {
          stream[i] = activeRule.triggerLetter;
          if (stream[i - 1] !== activeRule.leadLetter) stream[i - 1] = activeRule.leadLetter;
        } else if (!stream[i]) {
          const nonTargetLetters = activeRule.pool.filter(l => l !== activeRule.triggerLetter && l !== activeRule.leadLetter);
          stream[i] = nonTargetLetters[prng.nextRange(0, nonTargetLetters.length - 1)];
        }
      }

      for (let i = 0; i < streamLength; i++) {
        if (!stream[i]) {
          const nonTargetLetters = activeRule.pool.filter(l => l !== activeRule.triggerLetter && l !== activeRule.leadLetter);
          stream[i] = nonTargetLetters[prng.nextRange(0, nonTargetLetters.length - 1)];
        }
      }

      return {
        stream,
        leadLetter: activeRule.leadLetter,
        triggerLetter: activeRule.triggerLetter,
        targetTriggerCount: targetSlots.size,
        targetIndices: Array.from(targetSlots),
        intervalMs: Math.max(500, (isHardMode ? 500 : 900) - difficulty * 45),
        timeLimitMs: Math.max(5000, (isHardMode ? 6000 : 9000)),
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
      return { score, accuracy, isCorrect: accuracy > 40 };
    },
  },

  // GAME 20: MULTIPLE OBJECT TRACKING — Gentle Speed, 1 Target in Trial 1 for Normal Mode
  multiple_object_tracking: {
    generateChallenge: (prng, difficulty, isHardMode, trialIndex = 1) => {
      const totalObjects = isHardMode ? 8 : 6;
      // Normal mode starts at 1 target sphere in trial 1!
      const targetCount = isHardMode
        ? (trialIndex > 5 ? 4 : 3)
        : (trialIndex === 1 ? 1 : trialIndex > 6 ? 3 : 2);

      const targetIds = new Set();
      while (targetIds.size < targetCount) {
        targetIds.add(prng.nextRange(0, totalObjects - 1));
      }

      const objects = Array.from({ length: totalObjects }, (_, idx) => ({
        id: idx,
        isTarget: targetIds.has(idx),
        x: prng.nextRange(15, 85),
        y: prng.nextRange(15, 85),
        vx: (prng.nextRange(0, 1) === 0 ? 1 : -1) * (isHardMode ? prng.nextRange(2, 4) : prng.nextRange(1, 2)),
        vy: (prng.nextRange(0, 1) === 0 ? 1 : -1) * (isHardMode ? prng.nextRange(2, 4) : prng.nextRange(1, 2)),
      }));

      return {
        totalObjects,
        objects,
        targetIds: Array.from(targetIds),
        motionDurationMs: isHardMode ? 5500 : 4500,
        highlightDurationMs: 3000,
        timeLimitMs: Math.max(5000, (isHardMode ? 6000 : 9000)),
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
      return { score, accuracy, isCorrect: accuracy > 40 };
    },
  },
};
