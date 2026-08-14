/* ==========================================================================
   PERCEPTION / MIXED GAMES (49 - 50) ENGINE — FULLY FIXED
   ========================================================================== */

export const MixedGames = {
  // GAME 49: HIDDEN OBJECT SEARCH
  // FIX: positions now truly spread across full canvas using grid-with-jitter,
  //      not a clustered 100-item row pattern
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
        { id: 'scroll', name: 'Scroll', icon: '📜' },
        { id: 'potion', name: 'Potion', icon: '🧪' },
        { id: 'crown', name: 'Crown', icon: '👑' },
        { id: 'lantern', name: 'Lantern', icon: '🪔' },
      ];

      const gridItemCount = (isHardMode ? 10 : 6) + Math.min(difficulty, 4);
      const selectedItems = prng.shuffle([...itemsPool]).slice(0, Math.min(gridItemCount, itemsPool.length));

      // FIX: spread items across the canvas using a proper jittered grid
      // Divide canvas into sectors and place one item per sector with random offset
      const cols = 4;
      const rows = Math.ceil(selectedItems.length / cols);
      const sectorW = 88 / cols;
      const sectorH = 80 / rows;

      const sceneItems = selectedItems.map((item, idx) => {
        const col = idx % cols;
        const row = Math.floor(idx / cols);
        // Random position within sector, with padding from edges
        const x = 6 + col * sectorW + prng.nextRange(2, Math.max(3, sectorW - 6));
        const y = 8 + row * sectorH + prng.nextRange(2, Math.max(3, sectorH - 6));
        return {
          ...item,
          x,
          y,
          size: isHardMode ? 18 : 24, // Smaller = harder to find
        };
      });

      // Shuffle the final layout so target isn't always at the same sector
      const shuffledScene = prng.shuffle(sceneItems);
      const targetIdx = prng.nextRange(0, shuffledScene.length - 1);
      const target = shuffledScene[targetIdx];

      return {
        sceneItems: shuffledScene,
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
  // FIX: raven_matrix calculateScore now uses correct sessionResult key (selectedAnswer)
  //      and all sub-games have consistent key mapping
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
        const colors = [
          { name: 'Red', hex: '#E85D75' },
          { name: 'Blue', hex: '#6C4DFF' },
          { name: 'Green', hex: '#39B982' },
          { name: 'Yellow', hex: '#F0A83A' },
        ];
        const text = colors[prng.nextRange(0, colors.length - 1)];
        const ink = colors.filter(c => c.name !== text.name)[prng.nextRange(0, colors.length - 2)];
        subPayload = {
          wordText: text.name,
          inkColorHex: ink.hex,
          correctInkName: ink.name,   // score key: sessionResult.selectedColor
          options: prng.shuffle(colors.map(c => c.name)),
        };
      } else if (selected.id === 'simple_reaction') {
        subPayload = {
          stimulus: 'GREEN',
          waitDelayMs: prng.nextRange(1000, 2200),
          targetColor: '#39B982',
          // score key: !sessionResult.tooEarly && reactionTimeMs > 100
        };
      } else if (selected.id === 'number_reaction') {
        const num = prng.nextRange(1, 99);
        subPayload = {
          number: num,
          correctParity: num % 2 === 0 ? 'EVEN' : 'ODD',  // score key: sessionResult.selectedParity
        };
      } else if (selected.id === 'choice_reaction') {
        const syms = ['←', '→', '↑', '↓'];
        const target = syms[prng.nextRange(0, syms.length - 1)];
        subPayload = {
          targetSymbol: target,               // score key: sessionResult.selectedSymbol
          options: prng.shuffle([...syms]),
        };
      } else {
        // raven_matrix
        subPayload = {
          matrixGrid: [
            ['1 Circle', '2 Circles', '3 Circles'],
            ['1 Square', '2 Squares', '3 Squares'],
            ['1 Star', '2 Stars', '?'],
          ],
          correctAnswer: '3 Stars',           // score key: sessionResult.selectedAnswer
          rule: 'count increases',
          options: prng.shuffle(['3 Stars', '2 Stars', '4 Stars', '1 Star']),
          shapeKey: {},
        };
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

      if (subGameId === 'stroop_sprint') {
        isCorrect = sessionResult.selectedColor === subPayload.correctInkName;
      } else if (subGameId === 'simple_reaction') {
        isCorrect = !sessionResult.tooEarly && (sessionResult.reactionTimeMs || 0) > 100;
      } else if (subGameId === 'number_reaction') {
        isCorrect = sessionResult.selectedParity === subPayload.correctParity;
      } else if (subGameId === 'choice_reaction') {
        isCorrect = sessionResult.selectedSymbol === subPayload.targetSymbol;
      } else if (subGameId === 'raven_matrix') {
        // FIX: was sessionResult.isCorrect || false — now properly checks .selectedAnswer
        isCorrect = sessionResult.selectedAnswer === subPayload.correctAnswer;
      } else {
        isCorrect = sessionResult.isCorrect || false;
      }

      const rtMs = sessionResult.reactionTimeMs || 3000;
      const speedBonus = isCorrect ? Math.max(0, 300 - Math.round(rtMs / 20)) : 0;
      return { score: isCorrect ? 400 + challenge.difficulty * 50 + speedBonus : 0, accuracy: isCorrect ? 100 : 0, isCorrect };
    },
  },
};
