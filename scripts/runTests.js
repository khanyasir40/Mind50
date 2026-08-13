/* ==========================================================================
   NEUROVAULT TEST RUNNER SCRIPT
   ========================================================================== */

import { runAllEngineTests } from '../src/tests/gameEngine.test.js';

runAllEngineTests().catch((err) => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
