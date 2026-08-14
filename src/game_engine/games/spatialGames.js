/* ==========================================================================
   SPATIAL / VISUAL GAMES (37 - 42) ENGINE — FULLY ENHANCED
   ========================================================================== */

export const SpatialGames = {
  // GAME 37: 3D MENTAL ROTATION — uses real asymmetric shape types
  mental_rotation: {
    generateChallenge: (prng, difficulty, isHardMode) => {
      const shapeTypes = ['L_BLOCK', 'Z_BLOCK', 'T_BLOCK', 'CORNER_BLOCK', 'F_SHAPE', 'L_SHAPE'];
      const shapeType = shapeTypes[prng.nextRange(0, shapeTypes.length - 1)];

      const rotationAngles = [0, 45, 90, 135, 180, 225, 270, 315];
      const targetRotation = rotationAngles[prng.nextRange(0, rotationAngles.length - 1)];

      // One option is correct (same shape, different rotation — not mirror)
      const correctAngle = rotationAngles[prng.nextRange(0, rotationAngles.length - 1)];

      const optionCount = isHardMode ? 4 : 4;
      const options = [];

      // Add 1 correct option (non-mirror, different rotation)
      options.push({ id: 1, rotation: correctAngle, isMirror: false, isCorrect: true });

      // Add 2 incorrect rotations
      const usedAngles = new Set([correctAngle]);
      while (options.length < optionCount - 1) {
        const angle = rotationAngles[prng.nextRange(0, rotationAngles.length - 1)];
        if (!usedAngles.has(angle)) {
          usedAngles.add(angle);
          options.push({ id: options.length + 1, rotation: angle, isMirror: false, isCorrect: false });
        }
      }

      // Add 1 mirror option (always wrong, it IS a mirror)
      options.push({ id: optionCount, rotation: prng.nextRange(0, 360), isMirror: true, isCorrect: false });

      const shuffledOptions = prng.shuffle(options).map((o, i) => ({ ...o, id: i + 1 }));
      const correctId = shuffledOptions.find(o => o.isCorrect).id;

      return {
        shapeType,
        targetRotation,
        options: shuffledOptions,
        correctOptionId: correctId,
      };
    },
    calculateScore: (challenge, sessionResult) => {
      const isCorrect = sessionResult.selectedId === challenge.payload.correctOptionId;
      const rtMs = sessionResult.reactionTimeMs || 4000;
      const speedBonus = isCorrect ? Math.max(0, 200 - Math.round(rtMs / 20)) : 0;
      return { score: isCorrect ? 350 + challenge.difficulty * 45 + speedBonus : 0, accuracy: isCorrect ? 100 : 0 };
    },
  },

  // GAME 38: BLOCK DESIGN RECONSTRUCTION
  block_design: {
    generateChallenge: (prng, difficulty, isHardMode) => {
      const tileTypes = ['SOLID_RED', 'SOLID_WHITE', 'SPLIT_DIAGONAL', 'SPLIT_ANTI_DIAGONAL'];
      const dim = isHardMode ? 3 : 2;
      const totalCells = dim * dim;

      const targetPattern = Array.from({ length: totalCells }, () => {
        const tileIdx = Math.min(prng.nextRange(0, tileTypes.length - 1), difficulty > 4 ? 3 : 2);
        return tileTypes[tileIdx];
      });

      return {
        dimension: dim,
        targetPattern,
        studyDurationMs: 3000,
        exposureMs: 3000,
        displayDurationMs: 3000,
      };
    },
    calculateScore: (challenge, sessionResult) => {
      const target = challenge.payload.targetPattern || [];
      const user = sessionResult.userPattern || [];
      let matches = 0;

      for (let i = 0; i < target.length; i++) {
        if (user[i] === target[i]) matches++;
      }

      const isCorrect = target.length > 0 && matches === target.length;
      return { score: isCorrect ? Math.round(100 * 4 + challenge.difficulty * 35 + 200) : 0, accuracy: isCorrect ? 100 : 0, isCorrect };
    },
  },

  // GAME 39: MIRROR IMAGE IDENTIFICATION — FIXED: proper options structure
  mirror_image: {
    generateChallenge: (prng, difficulty, isHardMode) => {
      const shapeTypes = ['F_SHAPE', 'L_SHAPE', 'P_SHAPE', 'L_BLOCK', 'Z_BLOCK', 'CORNER_BLOCK'];
      const baseSvgType = shapeTypes[prng.nextRange(0, shapeTypes.length - 1)];

      const angles = [0, 45, 90, 135, 180, 225];
      const usedAngles = new Set();

      const options = [];

      // 1 true mirror (correct)
      const mirrorAngle = angles[prng.nextRange(0, angles.length - 1)];
      usedAngles.add(mirrorAngle);
      options.push({ id: 1, angle: mirrorAngle, isTrueMirror: true, isCorrect: true });

      // 3 non-mirror rotations (incorrect)
      while (options.length < 4) {
        const angle = angles[prng.nextRange(0, angles.length - 1)];
        if (!usedAngles.has(angle)) {
          usedAngles.add(angle);
          options.push({ id: options.length + 1, angle, isTrueMirror: false, isCorrect: false });
        }
      }

      const shuffled = prng.shuffle(options).map((o, i) => ({ ...o, id: i + 1 }));
      const correctId = shuffled.find(o => o.isCorrect).id;

      return {
        baseSvgType,
        options: shuffled,
        correctOptionId: correctId,
      };
    },
    calculateScore: (challenge, sessionResult) => {
      const isCorrect = sessionResult.selectedId === challenge.payload.correctOptionId;
      const rtMs = sessionResult.reactionTimeMs || 4000;
      const speedBonus = isCorrect ? Math.max(0, 150 - Math.round(rtMs / 30)) : 0;
      return { score: isCorrect ? 320 + challenge.difficulty * 40 + speedBonus : 0, accuracy: isCorrect ? 100 : 0 };
    },
  },

  // GAME 40: SPATIAL GRID ALIGNMENT — FIXED: actually populates dot grids
  spatial_matching: {
    generateChallenge: (prng, difficulty, isHardMode) => {
      const gridMax = isHardMode ? 6 : 4;
      const dotCount = (isHardMode ? 7 : 4) + Math.min(difficulty, 5);

      const originalDots = [];
      for (let i = 0; i < dotCount; i++) {
        let x, y;
        do {
          x = prng.nextRange(1, gridMax);
          y = prng.nextRange(1, gridMax);
        } while (originalDots.some(d => d.x === x && d.y === y));
        originalDots.push({ x, y });
      }

      // In hard mode, more dots match (subtle difference)
      const isSame = prng.nextRange(0, 1) === 0;
      let candidateDots;

      if (isSame) {
        candidateDots = [...originalDots];
      } else {
        // Change 1-2 dot positions
        candidateDots = [...originalDots];
        const changeCount = isHardMode ? 1 : 2;
        for (let c = 0; c < changeCount; c++) {
          const changeIdx = prng.nextRange(0, candidateDots.length - 1);
          let nx, ny;
          let tries = 0;
          do {
            nx = prng.nextRange(1, gridMax);
            ny = prng.nextRange(1, gridMax);
            tries++;
          } while (tries < 20 && candidateDots.some((d, i) => i !== changeIdx && d.x === nx && d.y === ny));
          candidateDots[changeIdx] = { x: nx, y: ny };
        }
      }

      return {
        originalDots,
        candidateDots,
        isSame,
        correctAnswer: isSame ? 'SAME' : 'DIFFERENT',
        gridMax,
      };
    },
    calculateScore: (challenge, sessionResult) => {
      const isCorrect = sessionResult.selectedOption === challenge.payload.correctAnswer;
      return { score: isCorrect ? 300 + challenge.difficulty * 40 : 0, accuracy: isCorrect ? 100 : 0 };
    },
  },

  // GAME 41: MAP ROUTE NAVIGATION
  map_navigation: {
    generateChallenge: (prng, difficulty, isHardMode) => {
      const directionPool = ['Left', 'Right', 'Straight'];
      const routeLength = (isHardMode ? 7 : 4) + Math.min(difficulty, 5);

      const routeSteps = Array.from({ length: routeLength }, () =>
        directionPool[prng.nextRange(0, directionPool.length - 1)]
      );

      return {
        routeSteps,
        studyDurationMs: Math.max(2500, 3000 + routeLength * 800 - difficulty * 200),
        displayDurationMs: Math.max(2500, 3000 + routeLength * 800 - difficulty * 200),
        exposureMs: Math.max(2500, 3000 + routeLength * 800 - difficulty * 200),
      };
    },
    calculateScore: (challenge, sessionResult) => {
      const expected = challenge.payload.routeSteps;
      const got = sessionResult.userSteps || [];
      let hits = 0;
      for (let i = 0; i < Math.min(expected.length, got.length); i++) {
        if (expected[i] === got[i]) hits++;
      }
      const accuracy = expected.length > 0 ? Math.round((hits / expected.length) * 100) : 0;
      return { score: Math.round(accuracy * 3.5 + challenge.difficulty * 35 + (accuracy === 100 ? 200 : 0)), accuracy };
    },
  },

  // GAME 42: CHANGE BLINDNESS — ENHANCED with randomized shapes, colors, sizes & change types
  change_blindness: {
    generateChallenge: (prng, difficulty, isHardMode) => {
      const shapeCount = isHardMode ? 6 : 4;
      const shapes = ['★', '●', '■', '◆', '✦', '▲', '⬢', '⬟'];
      const colors = ['#6C4DFF', '#39B982', '#E85D75', '#F0A83A', '#06B6D4', '#A855F7', '#EC4899'];

      const positions = [
        { x: 20, y: 25 }, { x: 55, y: 25 }, { x: 80, y: 25 },
        { x: 20, y: 65 }, { x: 55, y: 65 }, { x: 80, y: 65 },
      ];

      const selectedPositions = prng.shuffle([...positions]).slice(0, shapeCount);
      const shuffledShapes = prng.shuffle([...shapes]);
      const shuffledColors = prng.shuffle([...colors]);

      const sceneA = selectedPositions.map((pos, i) => ({
        id: i + 1,
        x: pos.x,
        y: pos.y,
        shape: shuffledShapes[i % shuffledShapes.length],
        color: shuffledColors[i % shuffledColors.length],
        size: prng.nextRange(28, 42),
      }));

      // sceneB: ONE item changes ONE attribute (shape, color, size, or position)
      const changeIdx = prng.nextRange(0, sceneA.length - 1);
      const changeType = prng.nextRange(0, 3); // 0: shape, 1: color, 2: size, 3: position

      const sceneB = sceneA.map((item, i) => {
        if (i === changeIdx) {
          if (changeType === 0) {
            const otherShapes = shapes.filter(s => s !== item.shape);
            return { ...item, shape: otherShapes[prng.nextRange(0, otherShapes.length - 1)] };
          } else if (changeType === 1) {
            const otherColors = colors.filter(c => c !== item.color);
            return { ...item, color: otherColors[prng.nextRange(0, otherColors.length - 1)] };
          } else if (changeType === 2) {
            return { ...item, size: item.size > 34 ? item.size - 14 : item.size + 14 };
          } else {
            return { ...item, x: item.x + (isHardMode ? 10 : 16) };
          }
        }
        return { ...item };
      });

      return {
        sceneA,
        sceneB,
        changedItemId: sceneA[changeIdx].id,
      };
    },
    calculateScore: (challenge, sessionResult) => {
      const isCorrect = sessionResult.selectedItemId === challenge.payload.changedItemId;
      const rtMs = sessionResult.reactionTimeMs || 6000;
      const speedBonus = isCorrect ? Math.max(0, 200 - Math.round(rtMs / 30)) : 0;
      return { score: isCorrect ? 350 + challenge.difficulty * 45 + speedBonus : 0, accuracy: isCorrect ? 100 : 0 };
    },
  },
};
