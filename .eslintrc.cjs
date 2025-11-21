const path = require('path');

module.exports = {
  root: true,
  env: { browser: true, es2020: true, node: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  plugins: ['@typescript-eslint', 'react-hooks', 'unused-imports', 'local'],
  settings: {
    // Resolve local plugin
    'import/resolver': {
      node: {
        paths: [path.resolve(__dirname, 'eslint-plugin-local')]
      }
    }
  },
  noInlineConfig: true, // Disallow ALL inline eslint-disable comments
  ignorePatterns: [
    'dist',
    '.eslintrc.js',
    'node_modules',
    'packages/*/dist/**',
    'scripts/**',
    'vite.config.ts',
    'tsup.config.*',
    '*.config.*',
    'eslint-plugin-local/**'
  ],
  rules: {
    // Unused detection with eslint-plugin-unused-imports
    // Catches: unused imports, unused variables, unused exports
    '@typescript-eslint/no-unused-vars': 'off', // Turned off - using unused-imports plugin instead
    'unused-imports/no-unused-imports': 'error', // Remove unused imports
    'unused-imports/no-unused-vars': ['error', { 
      vars: 'all',
      varsIgnorePattern: '^_',
      args: 'after-used',
      argsIgnorePattern: '^_',
      caughtErrors: 'all',
      caughtErrorsIgnorePattern: '^_'
    }],
    '@typescript-eslint/no-explicit-any': 'error',
    // STRICT: Ban ALL TypeScript suppression directives - no exceptions
    // Use proper TypeScript syntax: type guards, ambient declarations, type assertions, etc.
    '@typescript-eslint/ban-ts-comment': ['error', {
      'ts-expect-error': true, // Banned - use proper types
      'ts-ignore': true,       // Banned - use proper types
      'ts-nocheck': true,      // Banned - use proper types
      'ts-check': false        // Allow (enables checking in JS files)
    }],
    'prefer-const': 'error',
    'react-hooks/exhaustive-deps': 'error',
    'no-console': 'off', // Allow console statements for development
    'no-var': 'error',
    'no-empty-pattern': 'error',

    // Screenset Architecture: Domain-based conventions (disabled globally, enabled for screensets only)
    'local/no-barrel-exports-events-effects': 'off',
    'local/no-coordinator-effects': 'off',
    'local/no-missing-domain-id': 'off',
    'local/domain-event-format': 'off',

    // Flux Architecture: No direct store.dispatch (use actions instead)
    'no-restricted-syntax': [
      'error',
      {
        selector: "CallExpression[callee.name='dispatch'] > MemberExpression[object.name='store']",
        message: 'FLUX VIOLATION: Components must not call store.dispatch directly. Use actions instead. See EVENTS.md.',
      },
      // Lodash enforcement: Detect common native methods that should use lodash
      {
        selector: "CallExpression[callee.property.name='trim']",
        message: 'LODASH VIOLATION: Use lodash trim() instead of native .trim(). Import { trim } from \'lodash\'. See GUIDELINES.md line 35.',
      },
      {
        selector: "CallExpression[callee.property.name='charAt']",
        message: 'LODASH VIOLATION: Use lodash string methods instead of native .charAt(). See GUIDELINES.md line 35.',
      },
      {
        selector: "CallExpression[callee.property.name='substring']",
        message: 'LODASH VIOLATION: Use lodash truncate() or other string methods instead of native .substring(). See GUIDELINES.md line 35.',
      },
      {
        selector: "CallExpression[callee.property.name='toUpperCase']",
        message: 'LODASH VIOLATION: Use lodash upperCase() or upperFirst() instead of native .toUpperCase(). See GUIDELINES.md line 35.',
      },
      {
        selector: "CallExpression[callee.property.name='toLowerCase']",
        message: 'LODASH VIOLATION: Use lodash lowerCase() or lowerFirst() instead of native .toLowerCase(). See GUIDELINES.md line 35.',
      },
    ],
  },
  overrides: [
    // Screensets: Domain-based architecture rules
    {
      files: ['src/screensets/**/*'],
      rules: {
        'local/no-barrel-exports-events-effects': 'error',
        'local/no-coordinator-effects': 'error',
        'local/no-missing-domain-id': 'error',
        'local/domain-event-format': 'error',
      },
    },

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

    // App: DevTools should only be imported via HAI3Provider (auto-detection)
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
    
    // Flux Architecture: Effects cannot import actions
    {
      files: ['**/*Effects.ts', '**/*Effects.tsx', '**/effects/**/*'],
      rules: {
        'no-restricted-imports': [
          'error',
          {
            patterns: [
              {
                group: ['**/actions/**', '../actions/**', './actions/**', '**/core/actions/**'],
                message: 'FLUX VIOLATION: Effects cannot import actions (circular flow risk). Effects only listen to events and update slices. See EVENTS.md.',
              },
            ],
          },
        ],
      },
    },
    
    // Flux Architecture: Actions cannot import slices (they should emit events instead)
    {
      files: ['**/*Actions.ts', '**/*Actions.tsx', '**/actions/**/*'],
      excludedFiles: ['**/*.test.*', '**/*.spec.*'],
      rules: {
        'no-restricted-imports': [
          'error',
          {
            patterns: [
              {
                group: ['**/*Slice', '../*Slice', './*Slice', '**/*Slice.ts'],
                message: 'FLUX VIOLATION: Actions cannot import slice files. Actions should emit events via eventBus, effects update slices. See EVENTS.md.',
              },
              {
                group: ['**/slices/**', '../slices/**', './slices/**'],
                message: 'FLUX VIOLATION: Actions cannot import from /slices/ folders. Emit events instead. See EVENTS.md.',
              },
            ],
          },
        ],
        'no-restricted-syntax': [
          'error',
          {
            selector: "FunctionDeclaration[returnType.typeAnnotation.typeName.name='Promise']",
            message: 'FLUX VIOLATION: Actions must return void, not Promise<void>. Use fire-and-forget pattern with .then()/.catch(). See EVENTS.md.',
          },
          {
            selector: "ArrowFunctionExpression[returnType.typeAnnotation.typeName.name='Promise']",
            message: 'FLUX VIOLATION: Actions must return void, not Promise<void>. Use fire-and-forget pattern with .then()/.catch(). See EVENTS.md.',
          },
          {
            selector: "FunctionDeclaration[async=true]",
            message: 'FLUX VIOLATION: Actions must NOT use async keyword. Use fire-and-forget pattern: return void and handle promises with .then()/.catch(). See EVENTS.md.',
          },
          {
            selector: "ArrowFunctionExpression[async=true]",
            message: 'FLUX VIOLATION: Actions must NOT use async keyword. Use fire-and-forget pattern: return void and handle promises with .then()/.catch(). See EVENTS.md.',
          },
          {
            selector: "FunctionDeclaration:has(Identifier[name='getState'])",
            message: 'FLUX VIOLATION: Actions are PURE FUNCTIONS. They must NOT access store via getState(). Pass all required parameters from the calling component. See EVENTS.md.',
          },
          {
            selector: "ArrowFunctionExpression:has(Identifier[name='getState'])",
            message: 'FLUX VIOLATION: Actions are PURE FUNCTIONS. They must NOT access store via getState(). Pass all required parameters from the calling component. See EVENTS.md.',
          },
        ],
      },
    },
    
    {
      files: [
        'src/screensets/**/*.tsx', 
        'src/components/**/*.tsx', 
        'packages/uicore/src/components/**/*.tsx',
        'packages/uicore/src/layout/domains/**/*.tsx',  // Domain components must also use actions!
      ],
      excludedFiles: [
        '**/*.test.*', 
        '**/*.spec.*', 
        '**/*Slice.tsx',  // Exclude slice files themselves
        '**/actions/**',  // Exclude actions
        '**/effects/**',  // Exclude effects
        '**/store/**',  // Exclude store files themselves (but they shouldn't exist in screensets!)
      ],
      rules: {
        'no-restricted-imports': [
          'error',
          {
            patterns: [
              {
                // Forbid importing custom stores - components should only use Redux
                group: ['**/store/*Store', '../store/*Store', './store/*Store', '../../store/*Store'],
                message: 'FLUX VIOLATION: Components cannot import custom stores. Use Redux slices with useSelector and dispatch actions. See EVENTS.md.',
              },
              {
                // Forbid importing hooks that bypass Redux
                group: ['**/hooks/use*Store', '../hooks/use*Store', './hooks/use*Store', '../../hooks/use*Store'],
                message: 'FLUX VIOLATION: Components cannot use custom store hooks. Use Redux useSelector hook. See EVENTS.md.',
              },
            ],
          },
        ],
        'no-restricted-syntax': [
          'error',
          {
            // Catch: dispatch(setXxx(...))
            // This prevents calling slice reducers that follow the setXxx naming convention
            selector: "CallExpression[callee.name='dispatch'] CallExpression[callee.name=/^set[A-Z]/]",
            message: 'FLUX VIOLATION: Components cannot call slice reducers (setXxx functions). Use actions from /actions/ instead. See EVENTS.md.',
          },
          {
            // Catch: customStore.someMethod() - direct method calls on custom stores
            selector: "CallExpression[callee.object.name=/Store$/][callee.property.name!='getState']",
            message: 'FLUX VIOLATION: Components cannot call custom store methods directly. Use Redux actions and useSelector. See EVENTS.md.',
          },
        ],
      },
    },
    
    // Flux Architecture: Effects cannot emit events
    //
    // Effects should only listen to events and update slices
    // Emitting events from effects creates circular flow: Effect → Event → Effect
    //
    // CORRECT: Action → emits event → Effect → updates slice
    // WRONG:   Effect → emits event (potential infinite loop)
    {
      files: ['**/*Effects.ts', '**/effects/**/*.ts'],
      excludedFiles: ['**/*.test.*', '**/*.spec.*'],
      rules: {
        'no-restricted-syntax': [
          'error',
          {
            // Catch: eventBus.emit(...)
            selector: "CallExpression[callee.object.name='eventBus'][callee.property.name='emit']",
            message: 'FLUX VIOLATION: Effects cannot emit events (creates circular flow). Effects should only listen to events and update slices. If you need to trigger another action, refactor the original action to emit both events. See EVENTS.md.',
          },
        ],
      },
    },

    // Data Layer: No hardcoded i18n values in types, interfaces, or mock data
    //
    // Translation keys should only be used in UI components, not in data structures
    // Hardcoding translated strings in entity data causes language-switching bugs
    //
    // CORRECT: Generate smart, content-based values in API/mocks (e.g., title from first message)
    // WRONG:   { title: t('new_chat_title') } in entity data
    {
      files: ['**/types/**/*', '**/api/**/*', '**/mocks.ts', '**/*.types.ts'],
      excludedFiles: ['**/*.test.*', '**/*.spec.*', '**/*.tsx', '**/*.jsx'],
      rules: {
        'no-restricted-syntax': [
          'error',
          {
            // Catch: t('...') or t("...") in data files
            selector: "CallExpression[callee.name='t']",
            message: 'I18N VIOLATION: Translation function t() should NOT be used in types, interfaces, or data structures. Generates language-switching bugs. Use smart content-based generation instead. See SCREENSETS.md (Draft Entity Pattern).',
          },
        ],
      },
    },

    // Mock Data: Strict lodash enforcement
    //
    // Mock data factories must use lodash for ALL string/array/object operations
    // This ensures consistency with the codebase standards
    {
      files: ['**/mocks.ts', '**/mock*.ts'],
      rules: {
        'no-restricted-syntax': [
          'error',
          {
            selector: "CallExpression[callee.property.name='trim']",
            message: 'MOCK DATA VIOLATION: Use lodash trim() instead of native .trim() in mock data factories. Import { trim } from \'lodash\'. See API.md (Mock Data Rules).',
          },
          {
            selector: "CallExpression[callee.property.name='charAt']",
            message: 'MOCK DATA VIOLATION: Use lodash string methods instead of native .charAt() in mock data. See API.md (Mock Data Rules).',
          },
          {
            selector: "CallExpression[callee.property.name='substring']",
            message: 'MOCK DATA VIOLATION: Use lodash truncate() or other methods instead of native .substring() in mock data. See API.md (Mock Data Rules).',
          },
          {
            selector: "CallExpression[callee.property.name='toUpperCase']",
            message: 'MOCK DATA VIOLATION: Use lodash upperCase() or upperFirst() instead of native .toUpperCase() in mock data. See API.md (Mock Data Rules).',
          },
          {
            selector: "CallExpression[callee.property.name='toLowerCase']",
            message: 'MOCK DATA VIOLATION: Use lodash lowerCase() or lowerFirst() instead of native .toLowerCase() in mock data. See API.md (Mock Data Rules).',
          },
          {
            selector: "CallExpression[callee.property.name='slice']",
            message: 'MOCK DATA VIOLATION: Use lodash slice() instead of native .slice() in mock data. Import { slice } from \'lodash\'. See API.md (Mock Data Rules).',
          },
        ],
      },
    },
  ],
};
