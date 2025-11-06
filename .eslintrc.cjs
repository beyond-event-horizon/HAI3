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
  plugins: ['@typescript-eslint', 'react-hooks'],
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
    '@typescript-eslint/no-unused-vars': ['error', { 
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_',
      caughtErrorsIgnorePattern: '^_'
    }],
    '@typescript-eslint/no-explicit-any': 'error',
    'prefer-const': 'error',
    'react-hooks/exhaustive-deps': 'error',
    'no-console': 'off', // Allow console statements for development
    'no-var': 'error',
    'no-empty-pattern': 'error',
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
  ],
};
