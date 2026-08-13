/* ==========================================================================
   PERCEPTION / MIXED GAMES (49 - 50) ENGINE — FULLY ENHANCED
   ========================================================================== */

export const MixedGames = {
  // GAME 49: HIDDEN OBJECT SEARCH — diverse item pool with position randomization
  hidden_object: {
    generateChallenge: (prng, difficulty, isHardMode) => {
      const itemsPool = [
        { id: 'key', name: 'Brass Key', icon: '🔑' },
        { id: 'book', name: 'Ancient Book', icon: '📖' },
        { id: 'star', name: 'Gold Star', icon: '⭐' },
        { id: 'cup', name: 'Coffee Cup', icon: '☕' },
        { id: 'compass', name: 'Compass', icon: '🧭' },
        { id: 'gem', name: 'Ruby Gem', icon: '💎' },
        { id: 'torch', name: 'Torch', icon: '🔦' },
        { id: 'lock', name: 'Padlock', icon: '🔒' },
        { id: 'apple', name: 'Apple', icon: '🍎' },
        { id: 'coin', name: 'Gold Coin', icon: '🪙' },
      ];

      // Harder difficulty → more items to search through
      const gridItemCount = (isHardMode ? 8 : 5) + Math.min(difficulty, 5);
      const selectedItems = prng.shuffle([...itemsPool]).slice(0, gridItemCount);

      // Randomize positions
      const positions = Array.from({ length: 100 }, (_, i) => ({
        x: 10 + (i % 10) * 8 + prng.nextRange(0, 4),
        y: 10 + Math.floor(i / 10) * 8 + prng.nextRange(0, 4),
      }));
      const usedPositions = prng.shuffle([...positions]).slice(0, gridItemCount);

      const sceneItems = selectedItems.map((item, idx) => ({
        ...item,
        x: usedPositions[idx].x,
        y: usedPositions[idx].y,
        size: isHardMode ? 16 : 22, // Smaller = harder to find
      }));

      const targetIdx = prng.nextRange(0, sceneItems.length - 1);
      const target = sceneItems[targetIdx];

      return {
        sceneItems,
        targetItem: target,
      };
    },
    calculateScore: (challenge, sessionResult) => {
      const isCorrect = sessionResult.selectedItemId === challenge.payload.targetItem.id;
      const rtMs = sessionResult.reactionTimeMs || 5000;
      const speedBonus = isCorrect ? Math.max(0, 400 - Math.round(rtMs / 12)) : 0;
      return { score: isCorrect ? 350 + challenge.difficulty * 40 + speedBonus : 0, accuracy: isCorrect ? 100 : 0 };
    },
  },

  // GAME 50: CHALLENGE FUSION WORKOUT — Real multi-domain challenge fusion
  challenge_fusion: {
    generateChallenge: (prng, difficulty, isHardMode) => {
      const subGames = [
        { id: 'stroop_sprint', name: 'Stroop Sprint' },
        { id: 'simple_reaction', name: 'Simple Reaction' },
        { id: 'raven_matrix', name: 'Matrix Reasoning' },
        { id: 'choice_reaction', name: 'Choice Reaction' },
        { id: 'number_reaction', name: 'Number Parity' },
      ];
      const selected = subGames[prng.nextRange(0, subGames.length - 1)];

      let subPayload;
      if (selected.id === 'stroop_sprint') {
        const colors = [{ name: 'Red', hex: '#E85D75' }, { name: 'Blue', hex: '#6C4DFF' }, { name: 'Green', hex: '#39B982' }, { name: 'Yellow', hex: '#F0A83A' }];
        const text = colors[prng.nextRange(0, colors.length - 1)];
        const ink = colors.filter(c => c.name !== text.name)[prng.nextRange(0, colors.length - 2)];
        subPayload = { wordText: text.name, inkColorHex: ink.hex, correctInkName: ink.name, options: prng.shuffle(colors.map(c => c.name)) };
      } else if (selected.id === 'simple_reaction') {
        subPayload = { stimulus: 'GREEN', waitDelayMs: prng.nextRange(1000, 2200), targetColor: '#39B982' };
      } else if (selected.id === 'number_reaction') {
        const num = prng.nextRange(1, 99);
        subPayload = { number: num, correctParity: num % 2 === 0 ? 'EVEN' : 'ODD' };
      } else if (selected.id === 'choice_reaction') {
        const syms = ['←', '→', '↑', '↓'];
        const target = syms[prng.nextRange(0, syms.length - 1)];
        subPayload = { targetSymbol: target, options: prng.shuffle([...syms]) };
      } else {
        const grid = [['1 Circle', '2 Circles', '3 Circles'], ['1 Square', '2 Squares', '3 Squares'], ['1 Star', '2 Stars', '?']];
        subPayload = { matrixGrid: grid, correctAnswer: '3 Stars', rule: 'count increases', options: prng.shuffle(['3 Stars', '2 Stars', '4 Stars', '1 Star']) };
      }

      return {
        subGameId: selected.id,
        subGameName: selected.name,
        subPayload,
      };
    },
    calculateScore: (challenge, sessionResult) => {
      const { subGameId, subPayload } = challenge.payload;
      let isCorrect = false;
      if (subGameId === 'stroop_sprint') isCorrect = sessionResult.selectedColor === subPayload.correctInkName;
      else if (subGameId === 'simple_reaction') isCorrect = !sessionResult.tooEarly && (sessionResult.reactionTimeMs || 0) > 100;
      else if (subGameId === 'number_reaction') isCorrect = sessionResult.selectedParity === subPayload.correctParity;
      else if (subGameId === 'choice_reaction') isCorrect = sessionResult.selectedSymbol === subPayload.targetSymbol;
      else if (subGameId === 'raven_matrix') isCorrect = sessionResult.selectedAnswer === subPayload.correctAnswer;
      else isCorrect = sessionResult.isCorrect || false;

      const rtMs = sessionResult.reactionTimeMs || 3000;
      const speedBonus = isCorrect ? Math.max(0, 300 - Math.round(rtMs / 20)) : 0;
      return { score: isCorrect ? 400 + challenge.difficulty * 50 + speedBonus : 0, accuracy: isCorrect ? 100 : 0 };
    },
  },
};
