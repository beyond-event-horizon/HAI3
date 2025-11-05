#!/usr/bin/env node

/**
 * Architecture Validation Script
 * Tests that current codebase follows dependency rules
 */

import { execSync } from 'child_process';

interface Colors {
  red: string;
  green: string;
  yellow: string;
  blue: string;
  reset: string;
}

const colors: Colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

function log(message: string, color: keyof Colors = 'reset'): void {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

interface CommandResult {
  success: boolean;
  output?: string;
  error?: string;
}

function runCommand(command: string, description: string): boolean {
  log(`\ud83d\udd0d ${description}...`, 'blue');
  
  try {
    execSync(command, { stdio: 'inherit' });
    log(`\u2705 ${description} - PASSED`, 'green');
    return true;
  } catch (error: any) {
    log(`\u274c ${description} - FAILED`, 'red');
    if (error.stdout) {
      console.log(error.stdout.toString());
    }
    if (error.stderr) {
      console.error(error.stderr.toString());
    }
    return false;
  }
}

interface ValidationResult {
  passed: number;
  total: number;
  success: boolean;
}

function validateArchitecture(): ValidationResult {
  log('\ud83c\udfd7\ufe0f HAI3 Architecture Validation', 'blue');
  log('================================', 'blue');
  
  const results: boolean[] = [];
  
  // Run architecture checks
  results.push(runCommand('npm run lint -- --max-warnings 0', 'ESLint rules'));
  
  // Clean artifacts before type-check to ensure fresh validation
  results.push(runCommand('npm run clean:build:packages', 'Clean artifacts build'));
  results.push(runCommand('npm run type-check', 'TypeScript type check'));
  results.push(runCommand('npm run arch:deps', 'Dependency rules'));
  
  // Calculate results
  const passed = results.filter(result => result === true).length;
  const total = results.length;
  const success = passed === total;
  
  return { passed, total, success };
}

function displayResults({ passed, total, success }: ValidationResult): void {
  if (success) {
    log(`\ud83c\udf89 ALL CHECKS PASSED (${passed}/${total})`, 'green');
    log('Architecture is compliant! \ud83c\udfdb\ufe0f', 'green');
    process.exit(0);
  } else {
    log(`\ud83d\udca5 ${total - passed} CHECKS FAILED (${passed}/${total})`, 'red');
    log('Architecture violations detected! \ud83d\udea8', 'red');
    process.exit(1);
  }
}

// Main execution
function main(): void {
  const results = validateArchitecture();
  displayResults(results);
}

// Execute if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { runCommand, validateArchitecture, displayResults };
export type { CommandResult, ValidationResult };
