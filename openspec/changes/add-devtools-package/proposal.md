# Change: Add Developer Tools Package

## Why

The current development tooling (theme selector, screenset selector, language selector, API mode toggle) is embedded in the Footer component within `@hai3/uicore`. This creates several issues:

1. **Limited Space** - Footer has constrained horizontal space, making it difficult to add new dev tools
2. **Poor Separation** - Dev tools are mixed with production layout code
3. **Bundle Bloat** - Dev-only code ships in production builds (current Footer includes dev tools)
4. **Poor UX** - Tools are always visible and consume vertical space, even when not needed
5. **Not Extensible** - Hard to add advanced dev features (state inspector, console, performance monitoring)

This change creates a dedicated `@hai3/devtools` package with a modern floating overlay panel that can be completely excluded from production builds.

## What Changes

- **New Package**: `@hai3/devtools` - Standalone developer tools package
- **Floating Panel UI**: Glassmorphic draggable/resizable overlay with collapsible state
- **Migrated Tools**: Theme, screenset, language selectors and API mode toggle move from Footer
- **Footer Cleanup**: Remove dev tools from Footer, make Footer production-ready
- **Conditional Import**: Dev tools only load in development mode via `import.meta.env.DEV`
- **Keyboard Shortcuts**: `Ctrl+Shift+D` (Cmd on Mac) to toggle panel visibility
- **Persistent State**: Panel position, size, and visibility saved to localStorage

## Impact

### Affected Specs
- **ADDED**: New `devtools` capability (floating panel, controls, state persistence)

### Affected Code
- **New Package**: `packages/devtools/` (complete new workspace package)
  - DevToolsPanel component (main floating overlay)
  - DevToolsProvider context and hooks
  - Control sections (theme, screenset, language, API mode)
  - Drag/resize/collapse logic
  - State persistence utilities
- **Modified Files**:
  - `packages/uicore/src/layout/domains/footer/Footer.tsx` - Remove dev tools, keep only production footer
  - `packages/uicore/src/layout/domains/footer/footerSlice.ts` - Remove dev tool state if needed
  - `package.json` - Add new workspace `@hai3/devtools`
  - `src/main.tsx` - Conditionally import and render DevToolsOverlay
  - `vite.config.ts` - Ensure tree-shaking for conditional imports
- **Moved Components** (from uicore to devtools):
  - `ThemeSelector.tsx`
  - `ScreensetSelector.tsx`
  - `LanguageSelector.tsx`
  - `ApiModeToggle.tsx`

### Migration Path
1. Create new `@hai3/devtools` package
2. Implement floating panel with all features
3. Move selector components from uicore to devtools
4. Update Footer to remove dev tools
5. Add conditional import in main.tsx
6. Verify tree-shaking excludes devtools from production build

### Breaking Changes
None - This is purely additive. Footer continues to work, dev tools move to new location in dev mode only.
