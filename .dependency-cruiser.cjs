/**
 * Dependency Cruiser Configuration
 * JavaScript configuration for dependency analysis
 */

module.exports = {
  forbidden: [
    {
      name: 'no-uikit-in-uicore',
      severity: 'error',
      from: { path: '^packages/uicore' },
      to: { path: '^packages/uikit[^-]' }
    },
    {
      name: 'no-uicore-in-uikit', 
      severity: 'error',
      from: { path: '^packages/uikit' },
      to: { path: '^packages/uicore' }
    },
    {
      name: 'no-uicore-in-contracts',
      severity: 'error',
      from: { path: '^packages/uikit-contracts' },
      to: { path: '^packages/uicore' }
    },
    {
      name: 'no-uikit-in-contracts',
      severity: 'error', 
      from: { path: '^packages/uikit-contracts' },
      to: { path: '^packages/uikit[^-]' }
    },
    {
      name: 'no-app-in-contracts',
      severity: 'error',
      from: { path: '^packages/uikit-contracts' },
      to: { path: '^src' }
    },
    {
      name: 'no-app-in-uicore',
      severity: 'error',
      from: { path: '^packages/uicore' },
      to: { path: '^src' }
    },
    {
      name: 'no-app-in-uikit',
      severity: 'error',
      from: { path: '^packages/uikit' },
      to: { path: '^src' }
    },
    {
      name: 'no-package-internals-in-app',
      severity: 'error',
      from: { path: '^src' },
      to: { path: ['^packages/uikit/src', '^packages/uicore/src', '^packages/uikit-contracts/src'] }
    },
    {
      name: 'no-circular',
      severity: 'error',
      from: { path: '^(?!.*node_modules)' },
      to: { circular: true }
    }
  ]
};
