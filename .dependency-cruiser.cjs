/**
 * Dependency Cruiser Configuration
 * JavaScript configuration for dependency analysis
 */

module.exports = {
  forbidden: [
    // ============ PACKAGE ISOLATION RULES ============
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
      to: { path: ['^packages/uikit/src', '^packages/uicore/src', '^packages/uikit-contracts/src'] },
      comment: 'App must use published package APIs (@hai3/*), not internals.'
    },
    
    // ============ FLUX ARCHITECTURE RULES ============
    // Note: ESLint handles precise Flux violations (actions/components importing slices).
    // Dependency-cruiser focuses on architectural boundaries (folders, circular deps).
    {
      name: 'flux-no-actions-in-effects-folder',
      severity: 'error',
      from: { path: '/effects/' },
      to: { path: '/actions/' },
      comment: 'FLUX VIOLATION: Effects folder cannot import from actions folder (circular flow risk). See EVENTS.md.'
    },
    {
      name: 'flux-no-effects-in-actions-folder',
      severity: 'error',
      from: { path: '/actions/' },
      to: { path: '/effects/' },
      comment: 'FLUX VIOLATION: Actions folder cannot import from effects folder. Use event bus. See EVENTS.md.'
    },
    
    // ============ GENERAL RULES ============
    {
      name: 'no-circular',
      severity: 'error',
      from: { path: '^(?!.*node_modules)' },
      to: { circular: true },
      comment: 'Circular dependencies create tight coupling and make code harder to reason about.'
    }
  ]
};
