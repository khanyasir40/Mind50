/* ==========================================================================
   SPEED / REACTION GAMES (31 - 36) ENGINE — FULLY ENHANCED
   ========================================================================== */

export const SpeedGames = {
  // GAME 31: SIMPLE REACTION TIME
  simple_reaction: {
    generateChallenge: (prng, difficulty, isHardMode) => {
      // Randomize wait delay so player can't time it
      const waitDelayMs = prng.nextRange(
        isHardMode ? 1200 : 1500,
        isHardMode ? 2500 : 3500
      );

      return {
        stimulus: 'GREEN',
        waitDelayMs,
        targetColor: '#39B982',
      };
    },
    calculateScore: (challenge, sessionResult) => {
      if (sessionResult.tooEarly) {
        return { score: 0, accuracy: 0 };
      }
      const rtMs = sessionResult.reactionTimeMs || 500;
      // Tiered scoring based on reaction speed
      let score;
      if (rtMs < 150) score = 600;
      else if (rtMs < 250) score = 500;
      else if (rtMs < 400) score = 400;
      else if (rtMs < 600) score = 300;
      else score = 150;
      return { score: score + challenge.difficulty * 20, accuracy: 100 };
    },
  },

  // GAME 32: CHOICE REACTION
  choice_reaction: {
    generateChallenge: (prng, difficulty, isHardMode) => {
      const symbols = isHardMode
        ? ['←', '→', '↑', '↓', '↖', '↗']
        : ['←', '→', '↑', '↓'];

      const target = symbols[prng.nextRange(0, symbols.length - 1)];

      return {
        targetSymbol: target,
        options: prng.shuffle([...symbols]),
        timeLimitMs: Math.max(400, (isHardMode ? 650 : 1400) - difficulty * 100),
      };
    },
    calculateScore: (challenge, sessionResult) => {
      const isCorrect = sessionResult.selectedSymbol === challenge.payload.targetSymbol;
      const rtMs = sessionResult.reactionTimeMs || 600;
      const speedBonus = isCorrect ? Math.max(0, 400 - Math.round(rtMs / 2)) : 0;
      return { score: isCorrect ? 250 + challenge.difficulty * 30 + speedBonus : 0, accuracy: isCorrect ? 100 : 0 };
    },
  },

  // GAME 33: RAPID SYMBOL RECOGNITION
  rapid_symbol: {
    generateChallenge: (prng, difficulty, isHardMode) => {
      const fullLegend = [
        { symbol: '★', digit: 1 },
        { symbol: '◆', digit: 2 },
        { symbol: '●', digit: 3 },
        { symbol: '▲', digit: 4 },
        { symbol: '■', digit: 5 },
        { symbol: '✦', digit: 6 },
      ];

      // Hard mode uses more symbols
      const legendSize = isHardMode ? 6 : 4;
      const legend = fullLegend.slice(0, legendSize);

      const targetEntry = legend[prng.nextRange(0, legend.length - 1)];

      return {
        legend,
        targetSymbol: targetEntry.symbol,
        correctDigit: targetEntry.digit,
        timeLimitMs: Math.max(400, (isHardMode ? 700 : 1500) - difficulty * 110),
      };
    },
    calculateScore: (challenge, sessionResult) => {
      const isCorrect = sessionResult.selectedDigit === challenge.payload.correctDigit;
      const rtMs = sessionResult.reactionTimeMs || 800;
      const speedBonus = isCorrect ? Math.max(0, 350 - Math.round(rtMs / 2)) : 0;
      return { score: isCorrect ? 280 + challenge.difficulty * 35 + speedBonus : 0, accuracy: isCorrect ? 100 : 0 };
    },
  },

  // GAME 34: NUMBER PARITY REACTION
  number_reaction: {
    generateChallenge: (prng, difficulty, isHardMode) => {
      const number = prng.nextRange(isHardMode ? 3 : 1, isHardMode ? 999 : 99);

      return {
        number,
        correctParity: number % 2 === 0 ? 'EVEN' : 'ODD',
        timeLimitMs: Math.max(350, (isHardMode ? 600 : 1300) - difficulty * 90),
      };
    },
    calculateScore: (challenge, sessionResult) => {
      const isCorrect = sessionResult.selectedParity === challenge.payload.correctParity;
      const rtMs = sessionResult.reactionTimeMs || 700;
      const speedBonus = isCorrect ? Math.max(0, 350 - Math.round(rtMs / 2)) : 0;
      return { score: isCorrect ? 220 + challenge.difficulty * 25 + speedBonus : 0, accuracy: isCorrect ? 100 : 0 };
    },
  },

  // GAME 35: SHAPE MATCHING REACTION
  shape_reaction: {
    generateChallenge: (prng, difficulty, isHardMode) => {
      const shapes = isHardMode
        ? ['Circle', 'Square', 'Triangle', 'Star', 'Hexagon', 'Diamond']
        : ['Circle', 'Square', 'Triangle', 'Star'];

      const prevShape = shapes[prng.nextRange(0, shapes.length - 1)];
      // Hard mode: mostly no-match (makes it harder to auto-tap match)
      const isMatch = isHardMode ? (prng.nextRange(0, 3) === 0) : (prng.nextRange(0, 1) === 0);
      const currentShape = isMatch
        ? prevShape
        : shapes.filter(s => s !== prevShape)[prng.nextRange(0, shapes.length - 2)];

      return {
        prevShape,
        currentShape,
        isMatch,
        correctOption: isMatch ? 'MATCH' : 'DIFFERENT',
        timeLimitMs: Math.max(400, (isHardMode ? 700 : 1500) - difficulty * 100),
      };
    },
    calculateScore: (challenge, sessionResult) => {
      const isCorrect = sessionResult.selectedOption === challenge.payload.correctOption;
      const rtMs = sessionResult.reactionTimeMs || 800;
      const speedBonus = isCorrect ? Math.max(0, 300 - Math.round(rtMs / 3)) : 0;
      return { score: isCorrect ? 240 + challenge.difficulty * 30 + speedBonus : 0, accuracy: isCorrect ? 100 : 0 };
    },
  },

  // GAME 36: COLOR BURST REACTION
  color_reaction: {
    generateChallenge: (prng, difficulty, isHardMode) => {
      const colorPool = isHardMode
        ? [
            { name: 'Red', hex: '#E85D75' },
            { name: 'Blue', hex: '#6C4DFF' },
            { name: 'Green', hex: '#39B982' },
            { name: 'Yellow', hex: '#F0A83A' },
            { name: 'Purple', hex: '#A855F7' },
            { name: 'Orange', hex: '#F97316' },
          ]
        : [
            { name: 'Red', hex: '#E85D75' },
            { name: 'Blue', hex: '#6C4DFF' },
            { name: 'Green', hex: '#39B982' },
            { name: 'Yellow', hex: '#F0A83A' },
          ];

      const targetColor = colorPool[prng.nextRange(0, colorPool.length - 1)];
      const options = prng.shuffle(colorPool.map(c => c.name));

      return {
        targetColor,
        options,
        timeLimitMs: Math.max(450, (isHardMode ? 800 : 1600) - difficulty * 110),
      };
    },
    calculateScore: (challenge, sessionResult) => {
      const isCorrect = sessionResult.selectedColor === challenge.payload.targetColor.name;
      const rtMs = sessionResult.reactionTimeMs || 800;
      const speedBonus = isCorrect ? Math.max(0, 300 - Math.round(rtMs / 3)) : 0;
      return { score: isCorrect ? 220 + challenge.difficulty * 25 + speedBonus : 0, accuracy: isCorrect ? 100 : 0 };
    },
  },
};
