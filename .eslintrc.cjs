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
    // UI Core: Cannot import UI Kit directly (but can import contracts)
    {
      files: ['packages/uicore/**/*'],
      rules: {
        'no-restricted-imports': [
          'error',
          '@hai3/uikit',
        ],
      },
    },
    
    // UI Kit: Cannot import UI Core or App
    {
      files: ['packages/uikit/**/*'],
      rules: {
        'no-restricted-imports': [
          'error',
          '@hai3/uicore',
          'src/**',
        ],
      },
    },
    
    // Contracts: Must remain pure
    {
      files: ['packages/uikit-contracts/**/*'],
      rules: {
        'no-restricted-imports': [
          'error',
          '@hai3/uicore',
          '@hai3/uikit',
          'src/**',
        ],
      },
    },
    
    // App: Cannot import package internals
    {
      files: ['src/**/*'],
      rules: {
        'no-restricted-imports': [
          'error',
          'packages/*/src/**',
        ],
      },
    },
  ],
};
