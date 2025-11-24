#!/usr/bin/env node

/**
 * HAI3 Architecture Validation Script (Monorepo)
 * Extends standalone checks with monorepo-specific validations
 *
 * This extends presets/standalone/scripts/test-architecture.ts
 * Root scripts/test-architecture.ts re-exports this for the monorepo
 */

import {
  runValidation,
  getStandaloneChecks,
  displayResults,
} from '../../standalone/scripts/test-architecture';
import type { ArchCheck, ValidationResult } from '../../standalone/scripts/test-architecture';

/**
 * Monorepo prerequisite checks (run before standalone checks)
 */
function getMonorepoPrerequisites(): ArchCheck[] {
  return [
    // Generate tailwindColors.ts (gitignored, must exist for type-check)
    { command: 'npm run generate:colors', description: 'Generate Tailwind colors' },
  ];
}

/**
 * Monorepo-specific architecture checks (run after standalone checks)
 */
function getMonorepoChecks(): ArchCheck[] {
  return [
    { command: 'npm run arch:unused', description: 'Unused exports check' },
  ];
}

/**
 * Run monorepo architecture validation
 */
function validateMonorepoArchitecture(): ValidationResult {
  // Order: prerequisites -> standalone checks -> monorepo checks
  const allChecks = [...getMonorepoPrerequisites(), ...getStandaloneChecks(), ...getMonorepoChecks()];
  return runValidation(allChecks, 'HAI3 Monorepo Architecture Validation');
}

// Main execution
function main(): void {
  const results = validateMonorepoArchitecture();
  displayResults(results);
}

// Execute if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { validateMonorepoArchitecture, getMonorepoChecks, displayResults };
