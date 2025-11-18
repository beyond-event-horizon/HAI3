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
  ],
  options: {
    /**
     * Exclude node_modules from analysis (industry standard - only validate project code)
     * Using regex pattern to explicitly exclude node_modules directory
     *
     * Allow specific circular dependencies that are safe:
     * devtools ↔ uicore: DevTools is an optional peer dependency loaded via dynamic import with .catch()
     * This breaks the compile-time cycle and ensures graceful degradation if not installed
     */
    doNotFollow: '^node_modules',
    exclude: {
      dynamic: true  // Exclude dynamic imports from circular dependency checks
    }
  },
  allowed: [
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
    }
  ]
};
