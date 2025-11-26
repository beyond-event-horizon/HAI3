/**
 * HAI3 Dependency Cruiser Configuration (Monorepo)
 * Extends standalone rules + adds monorepo-specific rules
 *
 * This extends presets/standalone/configs/.dependency-cruiser.cjs
 * Root .dependency-cruiser.cjs re-exports this for the monorepo
 */

const standaloneConfig = require('../../standalone/configs/.dependency-cruiser.cjs');

module.exports = {
  forbidden: [
    ...standaloneConfig.forbidden,

    // ============ MONOREPO PACKAGE RULES ============
    {
      name: 'no-internal-package-imports',
      severity: 'error',
      from: { path: '^src/' },
      to: { path: '^packages/[^/]+/src/' },
      comment: 'MONOREPO VIOLATION: App cannot import package internals. Use package root exports.'
    },
    {
      name: 'uikit-no-uicore-import',
      severity: 'error',
      from: { path: '^packages/uikit/' },
      to: { path: '^packages/uicore/' },
      comment: 'PACKAGE VIOLATION: uikit cannot depend on uicore. Use uikit-contracts for shared types.'
    },
    {
      name: 'uicore-no-uikit-import',
      severity: 'error',
      from: { path: '^packages/uicore/' },
      to: { path: '^packages/uikit/' },
      comment: 'PACKAGE VIOLATION: uicore cannot depend on uikit. Use uikit-contracts for shared types.'
    },
    {
      name: 'contracts-no-implementation',
      severity: 'error',
      from: { path: '^packages/uikit-contracts/' },
      to: { path: '^packages/(uikit|uicore)/' },
      comment: 'PACKAGE VIOLATION: uikit-contracts is pure interfaces, cannot import implementations.'
    },
    {
      name: 'packages-no-src-import',
      severity: 'error',
      from: { path: '^packages/' },
      to: { path: '^src/' },
      comment: 'PACKAGE VIOLATION: Packages cannot import from app src/. Packages must be self-contained.'
    },
  ],
  options: {
    ...standaloneConfig.options,
    exclude: {
      ...standaloneConfig.options.exclude,
      path: 'packages/.*/dist'
    }
  }
};
