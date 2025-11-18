# Implementation Tasks

## 1. Package Setup

- [x] 1.1 Create `packages/devtools` directory structure
- [x] 1.2 Create `packages/devtools/package.json` with workspace configuration
  - Name: `@hai3/devtools`
  - Type: `module`
  - SideEffects: `false`
  - Dependencies: `@hai3/uikit-contracts`, `@hai3/uicore`, `@hai3/uikit`, `lodash`
  - PeerDependencies: `react`, `react-dom`
- [x] 1.3 Create `packages/devtools/tsconfig.json` extending root tsconfig
- [x] 1.4 Create `packages/devtools/tsup.config.ts` for ESM build with tree-shaking
- [x] 1.5 Add `packages/devtools` to root `package.json` workspaces array
- [x] 1.6 Update root `package.json` build:packages script to include devtools build

## 2. Core Components

- [x] 2.1 Create `packages/devtools/src/DevToolsPanel.tsx` - Main floating panel component
  - Import `Card` directly from `@hai3/uikit` for panel container
  - Floating div with fixed positioning
  - Glassmorphic styling (backdrop-blur, semi-transparent background)
  - z-index > 1000 for overlay effect
- [x] 2.2 Create `packages/devtools/src/DevToolsProvider.tsx` - Context provider for panel state
  - Manage visibility, position, size, collapsed state
  - Provide actions to toggle, move, resize, collapse
- [x] 2.3 Create `packages/devtools/src/DevToolsOverlay.tsx` - Top-level component for app integration
  - Wraps DevToolsProvider + DevToolsPanel
  - Handles keyboard shortcuts
  - Import `Button` directly from `@hai3/uikit` for collapsed floating button
  - Renders collapsed button when minimized

## 3. Drag and Drop

- [x] 3.1 Create `packages/devtools/src/hooks/useDraggable.ts` - Drag logic hook
  - Track mouse down/move/up events on panel header
  - Calculate new position based on cursor movement
  - Enforce viewport boundaries (no off-screen positioning)
- [x] 3.2 Implement drag handle in DevToolsPanel header
  - Visual indicator (cursor: move)
  - Attach useDraggable hook to header element
- [x] 3.3 Add position persistence to localStorage (`hai3:devtools:position`)

## 4. Resize Logic

- [x] 4.1 Create `packages/devtools/src/hooks/useResizable.ts` - Resize logic hook
  - Track mouse events on resize handle (bottom-right corner)
  - Calculate new width/height based on cursor movement
  - Enforce min dimensions (320px x 400px)
  - Enforce max dimensions (600px x 800px)
- [x] 4.2 Add resize handle UI element (corner grip icon)
- [x] 4.3 Add size persistence to localStorage (`hai3:devtools:size`)

## 5. Collapse/Expand

- [x] 5.1 Create collapse button in panel header using direct `Button` import from `@hai3/uikit`
- [x] 5.2 Create circular floating button component (40px diameter, bottom-right)
  - Import `Button` directly from `@hai3/uikit` with circular variant
  - Wrench or dev tools icon from lucide-react
  - Positioned at bottom-right: 24px from edges
  - Click handler to expand panel
- [x] 5.3 Implement toggle logic in DevToolsProvider
- [x] 5.4 Add collapsed state persistence to localStorage (`hai3:devtools:collapsed`)

## 6. Keyboard Shortcuts

- [x] 6.1 Create `packages/devtools/src/hooks/useKeyboardShortcut.ts` - Keyboard event hook
  - Listen for `Ctrl+Shift+D` (Windows/Linux)
  - Listen for `Cmd+Shift+D` (macOS)
  - Toggle panel visibility
  - Prevent default browser behavior
- [x] 6.2 Integrate keyboard shortcut hook in DevToolsOverlay
- [x] 6.3 Restore focus to previously focused element after toggle

## 7. Control Sections

- [x] 7.1 Move `ThemeSelector.tsx` from `packages/uicore/src/components/` to `packages/devtools/src/sections/`
  - Update imports: `@hai3/uicore` for hooks/actions, `@hai3/uikit` for components
  - Change from `uikitRegistry.getComponent()` to direct imports
  - Keep Redux integration (useAppSelector, useAppDispatch, changeTheme)
- [x] 7.2 Move `ScreensetSelector.tsx` from `packages/uicore/src/components/` to `packages/devtools/src/sections/`
  - Update imports: direct `@hai3/uikit` imports instead of registry
  - Keep selectScreenset action integration
- [x] 7.3 Move `LanguageSelector.tsx` from `packages/uicore/src/components/` to `packages/devtools/src/sections/`
  - Update imports: direct `@hai3/uikit` imports instead of registry
  - Keep changeLanguage action integration
- [x] 7.4 Move `ApiModeToggle.tsx` from `packages/uicore/src/components/` to `packages/devtools/src/sections/`
  - Update imports: direct `@hai3/uikit` imports instead of registry
  - Keep ApiEvents.ModeChanged integration
- [x] 7.5 Create `packages/devtools/src/sections/ControlPanel.tsx` - Container for all sections
  - Import `ScrollArea` directly from `@hai3/uikit` for scrollable content
  - Render ThemeSelector, ScreensetSelector, LanguageSelector, ApiModeToggle
  - Use Accordion from `@hai3/uikit` for collapsible sections if available
  - Proper spacing and labels

## 8. State Persistence

- [x] 8.1 Create `packages/devtools/src/utils/persistence.ts` - localStorage utilities
  - `saveDevToolsState(key: string, value: any): void`
  - `loadDevToolsState<T>(key: string, defaultValue: T): T`
  - Handle JSON serialization/deserialization
  - Handle localStorage errors gracefully
- [x] 8.2 Implement position persistence in useDraggable
- [x] 8.3 Implement size persistence in useResizable
- [x] 8.4 Implement collapsed state persistence in DevToolsProvider
- [x] 8.5 Restore all persisted state on panel mount

## 9. Footer Cleanup

- [x] 9.1 Remove dev tool components from `packages/uicore/src/layout/domains/footer/Footer.tsx`
  - Remove ThemeSelector import and render
  - Remove ScreensetSelector import and render
  - Remove LanguageSelector import and render
  - Remove ApiModeToggle import and render
  - Remove buildScreensetOptions usage
- [x] 9.2 Simplify Footer to only show copyright and links (production-ready footer)
- [x] 9.3 Remove unused imports from Footer.tsx
- [x] 9.4 Update `packages/uicore/src/layout/domains/footer/footerHelpers.ts` if no longer needed
- [x] 9.5 Clean up any footer-related state in footerSlice if dev-tools-specific

## 10. App Integration

- [x] 10.1 Add conditional dynamic import in `src/main.tsx`
  ```typescript
  if (import.meta.env.DEV) {
    const { DevToolsOverlay } = await import('@hai3/devtools');
    // Render DevToolsOverlay
  }
  ```
- [x] 10.2 Ensure DevToolsOverlay is rendered inside HAI3Provider (fixed from initial outside placement)
- [x] 10.3 Test that devtools loads correctly in development mode

## 11. Build Configuration

- [x] 11.1 Verify `vite.config.ts` supports tree-shaking for conditional imports
- [ ] 11.2 Run production build: `npm run build`
- [ ] 11.3 Inspect production bundle to confirm `@hai3/devtools` is excluded
  - Check bundle size (should not increase)
  - Search bundle for devtools-related strings (should not exist)
- [ ] 11.4 Test production build in browser to confirm no devtools code executes

## 12. Styling

- [x] 12.1 Implement glassmorphic styles in DevToolsPanel
  - Background: `rgba(255, 255, 255, 0.1)` for light themes, `rgba(0, 0, 0, 0.4)` for dark themes
  - Backdrop-filter: `blur(16px) saturate(180%)`
  - Border: `1px solid rgba(255, 255, 255, 0.18)` or theme-appropriate
  - Border-radius: `12px`
  - Box-shadow: `0 8px 32px rgba(0, 0, 0, 0.2)`
- [x] 12.2 Add smooth transitions for collapse/expand animations
- [x] 12.3 Add hover effects on draggable header and resize handle
- [x] 12.4 Ensure styles respect current theme (use Tailwind theme tokens where possible)

## 13. Testing

- [x] 13.1 Manual testing: Drag panel to all corners of viewport
- [x] 13.2 Manual testing: Resize panel to min/max dimensions
- [x] 13.3 Manual testing: Collapse and expand panel
- [x] 13.4 Manual testing: Press keyboard shortcut (Ctrl+Shift+D)
- [x] 13.5 Manual testing: Change theme, screenset, language, API mode
- [x] 13.6 Manual testing: Reload page and verify state persistence
- [x] 13.7 Manual testing: Clear localStorage and verify defaults
- [ ] 13.8 Test production build has no devtools code
- [x] 13.9 Test dev mode loads devtools correctly
- [x] 13.10 Run architecture checks: `npm run arch:check`
- [x] 13.11 Run dependency validation: `npm run arch:deps`
- [x] 13.12 Run type-check: `npm run type-check`
- [x] 13.13 Run lint: `npm run lint`

## 14. Documentation

- [x] 14.1 Add JSDoc comments to all public APIs
- [ ] 14.2 Update CLAUDE.md to mention devtools package
- [ ] 14.3 Add README.md to `packages/devtools/` explaining usage
- [ ] 14.4 Document keyboard shortcuts in README

## 15. Cleanup

- [x] 15.1 Remove unused exports from `packages/uicore/src/components/index.ts` (if ThemeSelector, etc. were exported)
- [x] 15.2 Verify no broken imports across codebase
- [x] 15.3 Run `npm run arch:unused` to check for unused exports
- [x] 15.4 Clean up any temporary or debug code

## 16. Event-Driven Persistence Refactoring

- [x] 16.1 Create `packages/devtools/src/events/devtoolsEvents.ts` - Event definitions
  - Define PositionChangedPayload, SizeChangedPayload event payloads
  - Export DevToolsEvents namespace with event names
  - Module augmentation to extend EventPayloadMap for type safety
- [x] 16.2 Create `packages/devtools/src/effects/persistenceEffects.ts` - Persistence effects
  - Subscribe to DevToolsEvents (PositionChanged, SizeChanged)
  - Update localStorage when events are emitted
  - Return cleanup function with proper unsubscribe pattern
- [x] 16.3 Refactor `useDraggable` hook to emit events instead of direct localStorage writes
- [x] 16.4 Refactor `useResizable` hook to emit events instead of direct localStorage writes
- [x] 16.5 Initialize persistence effects in DevToolsProvider
- [x] 16.6 Fix subscription cleanup (use `.unsubscribe()` method pattern)

## 17. Localization Implementation

- [x] 17.1 Create `packages/devtools/src/i18n/en.json` - English translations source file
- [x] 17.2 Create translation generator script `generate-translations.cjs`
- [x] 17.3 Generate translation files for all 36 supported languages
- [x] 17.4 Create `packages/devtools/src/i18n/translationLoader.ts` using I18nRegistry.createLoader()
- [x] 17.5 Create `packages/devtools/src/i18n/index.ts` - Register translations on module import
- [x] 17.6 Add i18n import to `packages/devtools/src/index.ts` entry point
- [x] 17.7 Update package.json sideEffects to include i18n files
- [x] 17.8 Add tsup onSuccess hook to copy i18n files to dist
- [x] 17.9 Refactor DevToolsPanel to use useTranslation() hook
- [x] 17.10 Refactor ControlPanel to use translations
- [x] 17.11 Refactor ThemeSelector to use translations
- [x] 17.12 Refactor ScreensetSelector to use translations
- [x] 17.13 Refactor LanguageSelector to use translations
- [x] 17.14 Refactor ApiModeToggle to use translations
- [x] 17.15 Test localization with multiple languages (Spanish, French)

## 18. Dependencies Cleanup

- [x] 18.1 Move @hai3/uicore from dependencies to peerDependencies
- [x] 18.2 Move @hai3/uikit-contracts from dependencies to peerDependencies
- [x] 18.3 Keep @hai3/uikit as direct dependency (fallback pattern for self-contained package)
- [x] 18.4 Verify UIKit fallback pattern (direct imports, not registry-based)
- [x] 18.5 Run architecture checks after dependency changes
- [x] 18.6 Verify all architecture checks pass (ESLint, build, type-check, dependency rules)

## 19. File Organization

- [x] 19.1 Verify effects/ directory structure
- [x] 19.2 Verify events/ directory structure
- [x] 19.3 Verify i18n/ directory structure
- [x] 19.4 Review public exports in index.ts
- [x] 19.5 Ensure events and effects are internal (not exported)

## 20. Styling Cleanup

- [x] 20.1 Remove redundant inline styles from DevToolsPanel
- [x] 20.2 Convert `pointerEvents: 'none'` to Tailwind class
- [x] 20.3 Remove duplicate cursor styles
- [x] 20.4 Verify rem-based units throughout
- [x] 20.5 Verify glassmorphic styling uses appropriate values
- [x] 20.6 Fix unused parameter in useResizable hook
