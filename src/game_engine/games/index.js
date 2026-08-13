/* ==========================================================================
   NEUROVAULT 50 GAME ENGINE REGISTRATION BUNDLE
   ========================================================================== */

import { registerGameEngine } from '../core/GameEngine.js';
import { MemoryGames } from './memoryGames.js';
import { AttentionGames } from './attentionGames.js';
import { PlanningGames } from './planningGames.js';
import { SpeedGames } from './speedGames.js';
import { SpatialGames } from './spatialGames.js';
import { ReasoningGames } from './reasoningGames.js';
import { MixedGames } from './mixedGames.js';

export const initializeGameEngines = () => {
  const allEngines = {
    ...MemoryGames,
    ...AttentionGames,
    ...PlanningGames,
    ...SpeedGames,
    ...SpatialGames,
    ...ReasoningGames,
    ...MixedGames,
  };

  Object.entries(allEngines).forEach(([id, engine]) => {
    registerGameEngine(id, engine);
  });
};

// Initialize immediately upon import
initializeGameEngines();
