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
 * Monorepo-specific architecture checks
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
  const allChecks = [...getStandaloneChecks(), ...getMonorepoChecks()];
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
