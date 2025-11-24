const path = require('path');

/**
 * HAI3 ESLint Configuration (Monorepo)
 * Extends standalone base with monorepo-specific package rules
 */

const standaloneConfig = require('./packages/cli/templates/standalone/.eslintrc.cjs');

module.exports = {
  ...standaloneConfig,
  // Override settings to use local path
  settings: {
    'import/resolver': {
      node: {
        paths: [path.resolve(__dirname, 'eslint-plugin-local')]
      }
    }
  },
  // Extend ignore patterns for monorepo
  ignorePatterns: [
    ...standaloneConfig.ignorePatterns,
    'packages/*/dist/**',
    'tsup.config.*',
  ],
  overrides: [
    // Include all standalone overrides
    ...standaloneConfig.overrides,

    // ============ MONOREPO: CLI PACKAGE RULES ============
    {
      files: ['packages/cli/**/*'],
      rules: {
        // CLI has its own string utilities that don't need lodash
        'no-restricted-syntax': 'off',
      },
    },

    // CLI Templates: Copied from main project during build
    {
      files: ['packages/cli/templates/**/*'],
      rules: {
        'no-restricted-syntax': 'off',
      },
    },

    // ============ MONOREPO: PACKAGE IMPORT RULES ============

    // Packages: Must use relative imports, no @/ aliases
    {
      files: ['packages/**/*'],
      rules: {
        'no-restricted-imports': [
          'error',
          {
            patterns: [{
              group: ['@/*'],
              message: 'Use relative imports within packages. @/ aliases are only allowed in app code (src/).',
            }],
          },
        ],
      },
    },

    // UI Core: Cannot import UI Kit directly (but can import contracts)
    {
      files: ['packages/uicore/**/*'],
      rules: {
        'no-restricted-imports': [
          'error',
          {
            paths: ['@hai3/uikit'],
            patterns: [
              {
                group: ['@/*'],
                message: 'Use relative imports within packages. @/ aliases are only allowed in app code (src/).',
              },
              {
                group: ['../../uikit/**', '../../../packages/uikit/**'],
                message: 'UI Core cannot import UI Kit directly. Use uikitRegistry or @hai3/uikit-contracts.',
              },
            ],
          },
        ],
      },
    },

    // UI Kit: Cannot import UI Core or App
    {
      files: ['packages/uikit/**/*'],
      rules: {
        'no-restricted-imports': [
          'error',
          {
            paths: ['@hai3/uicore', 'src/**'],
            patterns: [
              {
                group: ['@/*'],
                message: 'Use relative imports within packages. @/ aliases are only allowed in app code (src/).',
              },
              {
                group: ['../../uicore/**', '../../../packages/uicore/**', '../../../src/**'],
                message: 'UI Kit cannot import UI Core or app code. UI Kit must remain pure presentational components.',
              },
            ],
          },
        ],
      },
    },

    // Contracts: Must remain pure
    {
      files: ['packages/uikit-contracts/**/*'],
      rules: {
        'no-restricted-imports': [
          'error',
          {
            paths: ['@hai3/uicore', '@hai3/uikit', '@hai3/devtools', 'src/**'],
            patterns: [
              {
                group: ['@/*'],
                message: 'Use relative imports within packages. @/ aliases are only allowed in app code (src/).',
              },
              {
                group: ['../../uicore/**', '../../../packages/uicore/**', '../../uikit/**', '../../../packages/uikit/**', '../../devtools/**', '../../../packages/devtools/**', '../../../src/**'],
                message: 'Contracts cannot import from other packages. Must remain pure types/enums only.',
              },
            ],
          },
        ],
      },
    },

    // DevTools: Development-only package
    {
      files: ['packages/devtools/**/*'],
      rules: {
        'no-restricted-imports': [
          'error',
          {
            paths: ['src/**'],
            patterns: [
              {
                group: ['@/*'],
                message: 'Use relative imports within packages. @/ aliases are only allowed in app code (src/).',
              },
              {
                group: ['../../../src/**', '../../src/**', './src/**'],
                message: 'DevTools cannot import app code. DevTools is a development-only package that must remain independent.',
              },
              {
                group: ['../../uikit-contracts/**', '../../../packages/uikit-contracts/**', '../../uikit/**', '../../../packages/uikit/**', '../../uicore/**', '../../../packages/uicore/**'],
                message: 'DevTools should import peer dependencies via package names (@hai3/*), not relative paths.',
              },
            ],
          },
        ],
      },
    },

    // App: Cannot import package internals
    {
      files: ['src/**/*'],
      rules: {
        'no-restricted-imports': [
          'error',
          {
            paths: ['packages/*/src/**'],
            patterns: [{
              group: ['**/packages/*/src/**', '../packages/**'],
              message: 'App cannot import package internals. Use @hai3/uicore, @hai3/uikit, @hai3/uikit-contracts.',
            }],
          },
        ],
      },
    },

    // App: DevTools should only be imported via HAI3Provider
    {
      files: ['src/**/*'],
      excludedFiles: ['src/main.tsx', '**/HAI3Provider.tsx'],
      rules: {
        'no-restricted-imports': [
          'error',
          {
            paths: ['@hai3/devtools'],
            patterns: [
              {
                group: ['@hai3/devtools', '@hai3/devtools/**'],
                message: 'DEVTOOLS VIOLATION: DevTools should not be imported directly in app code. HAI3Provider auto-detects and loads DevTools in development mode. See CLAUDE.md.',
              },
            ],
          },
        ],
      },
    },

    // ============ MONOREPO: UICORE DOMAIN COMPONENTS ============
    {
      files: ['packages/uicore/src/layout/domains/**/*.tsx'],
      excludedFiles: ['**/*.test.*', '**/*.spec.*', '**/*Slice.tsx', '**/actions/**', '**/effects/**', '**/store/**'],
      rules: {
        'no-restricted-imports': [
          'error',
          {
            patterns: [
              {
                group: ['**/store/*Store', '../store/*Store', './store/*Store', '../../store/*Store'],
                message: 'FLUX VIOLATION: Components cannot import custom stores. Use Redux slices with useSelector and dispatch actions.',
              },
              {
                group: ['**/hooks/use*Store', '../hooks/use*Store', './hooks/use*Store', '../../hooks/use*Store'],
                message: 'FLUX VIOLATION: Components cannot use custom store hooks. Use Redux useSelector hook.',
              },
            ],
          },
        ],
        'no-restricted-syntax': [
          'error',
          {
            selector: "CallExpression[callee.name='dispatch'] CallExpression[callee.name=/^set[A-Z]/]",
            message: 'FLUX VIOLATION: Components cannot call slice reducers (setXxx functions). Use actions from /actions/ instead.',
          },
          {
            selector: "CallExpression[callee.object.name=/Store$/][callee.property.name!='getState']",
            message: 'FLUX VIOLATION: Components cannot call custom store methods directly. Use Redux actions and useSelector.',
          },
        ],
      },
    },
  ],
};
