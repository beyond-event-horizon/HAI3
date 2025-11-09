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
  plugins: ['@typescript-eslint', 'react-hooks', 'unused-imports'],
  ignorePatterns: [
    'dist', 
    '.eslintrc.js', 
    'node_modules',
    'packages/*/dist/**',
    'scripts/**',
    'vite.config.ts',
    'tsup.config.*',
    '*.config.*'
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
    'prefer-const': 'error',
    'react-hooks/exhaustive-deps': 'error',
    'no-console': 'off', // Allow console statements for development
    'no-var': 'error',
    'no-empty-pattern': 'error',
    
    // Flux Architecture: No direct store.dispatch (use actions instead)
    'no-restricted-syntax': [
      'error',
      {
        selector: "CallExpression[callee.name='dispatch'] > MemberExpression[object.name='store']",
        message: 'FLUX VIOLATION: Components must not call store.dispatch directly. Use actions instead. See EVENTS.md.',
      },
    ],
  },
  overrides: [
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
            paths: ['@hai3/uicore', '@hai3/uikit', 'src/**'],
            patterns: [
              {
                group: ['@/*'],
                message: 'Use relative imports within packages. @/ aliases are only allowed in app code (src/).',
              },
              {
                group: ['../../uicore/**', '../../../packages/uicore/**', '../../uikit/**', '../../../packages/uikit/**', '../../../src/**'],
                message: 'Contracts cannot import from other packages. Must remain pure types/enums only.',
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
      ],
      rules: {
        'no-restricted-syntax': [
          'error',
          {
            // Catch: dispatch(setXxx(...))
            // This prevents calling slice reducers that follow the setXxx naming convention
            selector: "CallExpression[callee.name='dispatch'] CallExpression[callee.name=/^set[A-Z]/]",
            message: 'FLUX VIOLATION: Components cannot call slice reducers (setXxx functions). Use actions from /actions/ instead. See EVENTS.md.',
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
  ],
};
