/**
 * HAI3 ESLint Configuration (Monorepo)
 * Extends standalone rules + adds monorepo-specific rules
 *
 * This extends presets/standalone/configs/eslint.config.js
 * Root eslint.config.js re-exports this for the monorepo
 */

import standaloneConfig from '../../standalone/configs/eslint.config.js';

/** @type {import('eslint').Linter.Config[]} */
export default [
  // Include all standalone configs
  ...standaloneConfig,

  // Additional monorepo ignores
  {
    ignores: [
      'packages/**/dist/**',
      'packages/**/templates/**', // CLI templates are build artifacts
      'presets/**/scripts/**',
      // Legacy config files (still used by dependency-cruiser)
      '.dependency-cruiser.cjs',
      'presets/**/.dependency-cruiser.cjs',
    ],
  },

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
              message:
                'MONOREPO VIOLATION: Import from package root, not internal paths.',
            },
          ],
        },
      ],
    },
  },
];
