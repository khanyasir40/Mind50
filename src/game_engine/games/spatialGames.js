/* ==========================================================================
   SPATIAL / VISUAL GAMES (37 - 42) ENGINE — FULLY ENHANCED & FIXED
   ========================================================================== */

export const SpatialGames = {
  // GAME 37: 3D MENTAL ROTATION — 3D Isometric Polycube Voxel Engine
  mental_rotation: {
    generateChallenge: (prng, difficulty, isHardMode) => {
      const polycubes = {
        L_BLOCK: [[0,0,0], [0,0,1], [0,0,2], [1,0,0]],
        Z_BLOCK: [[0,0,0], [1,0,0], [1,0,1], [2,0,1]],
        T_BLOCK: [[0,0,0], [1,0,0], [2,0,0], [1,0,1]],
        CORNER:  [[0,0,0], [1,0,0], [0,1,0], [0,0,1]],
        SNAKE:   [[0,0,0], [1,0,0], [1,1,0], [1,1,1]],
      };

      const keys = Object.keys(polycubes);
      const chosenKey = keys[prng.nextRange(0, keys.length - 1)];
      const baseVoxel = polycubes[chosenKey];

      // Target 3D orientation
      const targetRotX = prng.nextRange(0, 3);
      const targetRotY = prng.nextRange(0, 3);
      const targetRotZ = prng.nextRange(0, 3);

      // Correct option: rotated in 3D (same chiral parity, non-mirror)
      const correctRotX = (targetRotX + prng.nextRange(1, 3)) % 4;
      const correctRotY = (targetRotY + prng.nextRange(1, 3)) % 4;
      const correctRotZ = (targetRotZ + prng.nextRange(0, 3)) % 4;

      const options = [];

      // Option 1: True 3D rotation match (isCorrect = true, isMirror = false)
      options.push({
        id: 1,
        rotX: correctRotX,
        rotY: correctRotY,
        rotZ: correctRotZ,
        isMirror: false,
        isCorrect: true,
      });

      // Option 2: Chiral mirror flip (always wrong)
      options.push({
        id: 2,
        rotX: correctRotX,
        rotY: (correctRotY + 1) % 4,
        rotZ: correctRotZ,
        isMirror: true,
        isCorrect: false,
      });

      // Option 3: Different polycube shape
      const otherKey = keys.filter(k => k !== chosenKey)[prng.nextRange(0, keys.length - 2)];
      options.push({
        id: 3,
        otherShapeKey: otherKey,
        rotX: prng.nextRange(0, 3),
        rotY: prng.nextRange(0, 3),
        rotZ: prng.nextRange(0, 3),
        isMirror: false,
        isCorrect: false,
      });

      // Option 4: Another chiral mirror flip
      options.push({
        id: 4,
        rotX: (correctRotX + 2) % 4,
        rotY: correctRotY,
        rotZ: (correctRotZ + 1) % 4,
        isMirror: true,
        isCorrect: false,
      });

      const shuffledOptions = prng.shuffle(options).map((o, i) => ({ ...o, id: i + 1 }));
      const correctId = shuffledOptions.find(o => o.isCorrect).id;

      return {
        shapeKey: chosenKey,
        baseVoxel,
        targetRotX,
        targetRotY,
        targetRotZ,
        options: shuffledOptions,
        correctOptionId: correctId,
        timeLimitMs: Math.max(5000, (isHardMode ? 6000 : 9000) - difficulty * 200),
      };
    },
    calculateScore: (challenge, sessionResult) => {
      const isCorrect = sessionResult.selectedId === challenge.payload.correctOptionId;
      const rtMs = sessionResult.reactionTimeMs || 4000;
      const speedBonus = isCorrect ? Math.max(0, 200 - Math.round(rtMs / 20)) : 0;
      return { score: isCorrect ? 350 + challenge.difficulty * 40 + speedBonus : 0, accuracy: isCorrect ? 100 : 0, isCorrect };
    },
  },

  // GAME 38: BLOCK DESIGN RECONSTRUCTION
  block_design: {
    generateChallenge: (prng, difficulty, isHardMode) => {
      const gridSize = isHardMode ? 3 : 2;
      const totalBlocks = gridSize * gridSize;
      const blockStyles = ['SOLID_RED', 'SOLID_WHITE', 'SPLIT_DIAG_1', 'SPLIT_DIAG_2'];

      const targetGrid = Array.from({ length: totalBlocks }, () =>
        blockStyles[prng.nextRange(0, blockStyles.length - 1)]
      );

      return {
        gridSize,
        targetGrid,
        blockStyles,
        exposureMs: isHardMode ? 5000 : 3000,
        timeLimitMs: Math.max(5000, (isHardMode ? 7000 : 12000)),
      };
    },
    calculateScore: (challenge, sessionResult) => {
      const userGrid = sessionResult.userGrid || [];
      const targetGrid = challenge.payload.targetGrid;
      let matches = 0;
      targetGrid.forEach((val, idx) => { if (userGrid[idx] === val) matches++; });

      const accuracy = Math.round((matches / targetGrid.length) * 100);
      const isCorrect = accuracy === 100;
      return { score: isCorrect ? 400 + challenge.difficulty * 45 : 0, accuracy, isCorrect };
    },
  },

  // GAME 39: MIRROR IMAGE IDENTIFICATION
  mirror_image: {
    generateChallenge: (prng, difficulty, isHardMode) => {
      const shapes = ['F_SHAPE', 'L_SHAPE', 'P_SHAPE', 'Z_BLOCK', 'T_BLOCK'];
      const targetShape = shapes[prng.nextRange(0, shapes.length - 1)];

      const options = [
        { id: 1, isMirror: true, rotation: prng.nextRange(0, 3) * 90 },
        { id: 2, isMirror: false, rotation: prng.nextRange(0, 3) * 90 },
        { id: 3, isMirror: false, rotation: prng.nextRange(0, 3) * 90 },
        { id: 4, isMirror: false, rotation: prng.nextRange(0, 3) * 90 },
      ];

      const shuffledOptions = prng.shuffle(options).map((o, i) => ({ ...o, id: i + 1 }));
      const correctOptionId = shuffledOptions.find(o => o.isMirror).id;

      return {
        targetShape,
        options: shuffledOptions,
        correctOptionId,
        timeLimitMs: Math.max(5000, (isHardMode ? 5000 : 8000) - difficulty * 150),
      };
    },
    calculateScore: (challenge, sessionResult) => {
      const isCorrect = sessionResult.selectedId === challenge.payload.correctOptionId;
      return { score: isCorrect ? 300 + challenge.difficulty * 35 : 0, accuracy: isCorrect ? 100 : 0, isCorrect };
    },
  },

  // GAME 40: SPATIAL GRID ALIGNMENT
  spatial_matching: {
    generateChallenge: (prng, difficulty, isHardMode) => {
      const dotCount = (isHardMode ? 5 : 3) + Math.min(difficulty, 3);
      const dots = [];
      const used = new Set();
      while (dots.length < dotCount) {
        const x = prng.nextRange(1, 5);
        const y = prng.nextRange(1, 5);
        const key = `${x},${y}`;
        if (!used.has(key)) {
          used.add(key);
          dots.push({ x, y });
        }
      }

      return {
        targetDots: dots,
        timeLimitMs: Math.max(5000, (isHardMode ? 6000 : 9000)),
      };
    },
    calculateScore: (challenge, sessionResult) => {
      const userDots = sessionResult.userDots || [];
      const targetDots = challenge.payload.targetDots;
      let matches = 0;
      targetDots.forEach(td => {
        if (userDots.some(ud => ud.x === td.x && ud.y === td.y)) matches++;
      });
      const accuracy = Math.round((matches / targetDots.length) * 100);
      const isCorrect = accuracy > 70;
      return { score: isCorrect ? 320 + challenge.difficulty * 35 : 0, accuracy, isCorrect };
    },
  },

  // GAME 41: MAP ROUTE NAVIGATION
  map_navigation: {
    generateChallenge: (prng, difficulty, isHardMode) => {
      const turnsCount = (isHardMode ? 5 : 3) + Math.min(difficulty, 3);
      const turns = ['LEFT', 'RIGHT', 'STRAIGHT'];
      const route = Array.from({ length: turnsCount }, () => turns[prng.nextRange(0, turns.length - 1)]);

      return {
        route,
        studyDurationMs: isHardMode ? 5000 : 4000,
        timeLimitMs: Math.max(5000, (isHardMode ? 6000 : 9000)),
      };
    },
    calculateScore: (challenge, sessionResult) => {
      const userSteps = sessionResult.userSteps || [];
      const route = challenge.payload.route;
      let matches = 0;
      route.forEach((t, i) => { if (userSteps[i] === t) matches++; });
      const accuracy = Math.round((matches / route.length) * 100);
      const isCorrect = accuracy === 100;
      return { score: isCorrect ? 350 + challenge.difficulty * 40 : 0, accuracy, isCorrect };
    },
  },

  // GAME 42: CHANGE BLINDNESS SCENE — High-Complexity Flicker Paradigm
  change_blindness: {
    generateChallenge: (prng, difficulty, isHardMode) => {
      const gridCols = isHardMode ? 4 : 3;
      const totalItems = gridCols * gridCols; // 9 in Normal mode (3x3), 16 in Hard mode (4x4)

      const iconsPool = ['💎', '🚀', '👑', '🔮', '⚡', '🎯', '🌟', '🛡️', '🧩', '🦁', '💡', '🏆', '🔥', '🍀', '🔑', '🎨'];
      const colorsPool = ['#6C4DFF', '#E1306C', '#39B982', '#F0A83A', '#1DA1F2', '#A855F7', '#EC4899'];
      const rotationsPool = [0, 90, 180, 270];

      const shuffledIcons = prng.shuffle([...iconsPool]);

      const items = Array.from({ length: totalItems }, (_, i) => ({
        id: i,
        icon: shuffledIcons[i % shuffledIcons.length],
        color: colorsPool[prng.nextRange(0, colorsPool.length - 1)],
        rotation: rotationsPool[prng.nextRange(0, rotationsPool.length - 1)],
      }));

      const changedIdx = prng.nextRange(0, totalItems - 1);
      const changeTypes = ['COLOR_SHIFT', 'ICON_MORPH', 'ROTATION_FLIP'];
      const chosenChangeType = changeTypes[prng.nextRange(0, changeTypes.length - 1)];

      const modifiedItems = items.map((item, i) => {
        if (i === changedIdx) {
          if (chosenChangeType === 'COLOR_SHIFT') {
            const otherColors = colorsPool.filter(c => c !== item.color);
            return { ...item, color: otherColors[prng.nextRange(0, otherColors.length - 1)] };
          }
          if (chosenChangeType === 'ICON_MORPH') {
            const otherIcons = iconsPool.filter(ic => ic !== item.icon);
            return { ...item, icon: otherIcons[prng.nextRange(0, otherIcons.length - 1)] };
          }
          const otherRots = rotationsPool.filter(r => r !== item.rotation);
          return { ...item, rotation: otherRots[prng.nextRange(0, otherRots.length - 1)] };
        }
        return item;
      });

      return {
        items,
        modifiedItems,
        changedItemId: changedIdx,
        changeType: chosenChangeType,
        gridCols,
        totalItems,
        timeLimitMs: Math.max(5000, (isHardMode ? 8000 : 12000)),
      };
    },
    calculateScore: (challenge, sessionResult) => {
      const isCorrect = sessionResult.selectedItemId === challenge.payload.changedItemId;
      const rtMs = sessionResult.reactionTimeMs || 3000;
      const speedBonus = isCorrect ? Math.max(0, 400 - Math.round(rtMs / 10)) : 0;
      return { score: isCorrect ? 350 + challenge.difficulty * 45 + speedBonus : 0, accuracy: isCorrect ? 100 : 0, isCorrect };
    },
  },
};
