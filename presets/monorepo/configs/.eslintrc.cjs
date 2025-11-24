/**
 * HAI3 ESLint Configuration (Monorepo)
 * Extends standalone rules + adds monorepo-specific rules
 *
 * This extends presets/standalone/configs/.eslintrc.cjs
 * Root .eslintrc.cjs re-exports this for the monorepo
 */

const standaloneConfig = require('../../standalone/configs/.eslintrc.cjs');

module.exports = {
  ...standaloneConfig,
  ignorePatterns: [
    ...standaloneConfig.ignorePatterns,
    'packages/**/dist',
    'packages/**/templates', // CLI templates are build artifacts
    'presets/**/scripts',
  ],
  overrides: [
    ...standaloneConfig.overrides,
    // Monorepo-specific: Package internals
    {
      files: ['packages/**/*'],
      rules: {
        'no-restricted-imports': [
          'error',
          {
            patterns: [
              {
                group: ['@hai3/*/src/**'],
                message: 'MONOREPO VIOLATION: Import from package root, not internal paths.',
              },
            ],
          },
        ],
      },
    },
  ],
};
