/**
 * HAI3 Dependency Cruiser Configuration (Monorepo)
 * Extends standalone base with monorepo-specific package isolation rules
 */

const standaloneConfig = require('./packages/cli/templates/standalone/.dependency-cruiser.cjs');

module.exports = {
  forbidden: [
    // Include all standalone rules (screenset isolation, flux architecture, general)
    ...standaloneConfig.forbidden,

    // ============ MONOREPO: PACKAGE ISOLATION RULES ============
    {
      name: 'no-uikit-in-uicore',
      severity: 'error',
      from: { path: '^packages/uicore' },
      to: { path: '^packages/uikit[^-]' },
      comment: 'UI Core must not import UI Kit directly. Use uikitRegistry.'
    },
    {
      name: 'no-uicore-in-uikit',
      severity: 'error',
      from: { path: '^packages/uikit' },
      to: { path: '^packages/uicore' },
      comment: 'UI Kit must remain pure presentational components.'
    },
    {
      name: 'no-uicore-in-contracts',
      severity: 'error',
      from: { path: '^packages/uikit-contracts' },
      to: { path: '^packages/uicore' },
      comment: 'Contracts must remain pure types only.'
    },
    {
      name: 'no-uikit-in-contracts',
      severity: 'error',
      from: { path: '^packages/uikit-contracts' },
      to: { path: '^packages/uikit[^-]' },
      comment: 'Contracts must remain pure types only.'
    },
    {
      name: 'no-app-in-contracts',
      severity: 'error',
      from: { path: '^packages/uikit-contracts' },
      to: { path: '^src' },
      comment: 'Contracts cannot depend on app code.'
    },
    {
      name: 'no-app-in-uicore',
      severity: 'error',
      from: { path: '^packages/uicore' },
      to: { path: '^src' },
      comment: 'UI Core is a shared package, cannot depend on app.'
    },
    {
      name: 'no-app-in-uikit',
      severity: 'error',
      from: { path: '^packages/uikit' },
      to: { path: '^src' },
      comment: 'UI Kit is a shared package, cannot depend on app.'
    },
    {
      name: 'no-package-internals-in-app',
      severity: 'error',
      from: { path: '^src' },
      to: { path: ['^packages/uikit/src', '^packages/uicore/src', '^packages/uikit-contracts/src', '^packages/devtools/src'] },
      comment: 'App must use published package APIs (@hai3/*), not internals.'
    },
    {
      name: 'no-app-in-devtools',
      severity: 'error',
      from: { path: '^packages/devtools' },
      to: { path: '^src' },
      comment: 'DevTools cannot depend on app code. DevTools is a development-only package.'
    },
    {
      name: 'no-devtools-in-contracts',
      severity: 'error',
      from: { path: '^packages/uikit-contracts' },
      to: { path: '^packages/devtools' },
      comment: 'Contracts cannot depend on DevTools.'
    },
    {
      name: 'no-devtools-in-uikit',
      severity: 'error',
      from: { path: '^packages/uikit' },
      to: { path: '^packages/devtools' },
      comment: 'UI Kit cannot depend on DevTools. UI Kit must remain pure.'
    },

    // ============ MONOREPO: SCREENSET → PACKAGE RULES ============
    {
      name: 'screensets-use-workspace-packages',
      severity: 'error',
      from: { path: '^src/screensets/' },
      to: { path: '^packages/.*/src/' },
      comment: 'Screensets must import via @hai3/* workspace names, not direct package paths.'
    },
  ],
  options: standaloneConfig.options,
  allowed: [
    // ============ MONOREPO: PACKAGE ALLOWANCES ============
    {
      from: { path: '^packages/uicore/dist' },
      to: { path: '^packages/devtools/dist' },
      comment: 'Optional peer dependency with dynamic import + error handling (safe)'
    },
    {
      from: { path: '^packages/devtools/dist' },
      to: { path: '^packages/uicore/dist' },
      comment: 'DevTools depends on uicore for hooks and utilities'
    },
    {
      from: { path: '^packages/.*/dist' },
      to: { path: '^packages/.*/dist' },
      comment: 'Built packages can depend on other built packages (forbidden rules enforce architecture)'
    },
    {
      from: { path: '^packages/.*/dist' },
      to: { path: '^node_modules' },
      comment: 'Built packages can import from node_modules (normal dependency resolution)'
    },
    {
      from: { path: '^packages/cli' },
      to: { path: '^(path|fs|child_process|events|process)$' },
      comment: 'CLI can use Node.js built-in modules'
    },
    {
      from: { path: '^packages/cli' },
      to: { path: '^packages/cli/node_modules' },
      comment: 'CLI can import from its own node_modules (commander, fs-extra, chalk)'
    }
  ]
};
