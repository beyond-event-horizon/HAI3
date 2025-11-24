# Implementation Tasks

## 1. Update Type Definitions (Breaking)
- [ ] 1.1 Change `MenuScreenItem.screen` type to `ScreenLoader` only (remove `React.ComponentType`)
- [ ] 1.2 Add `ScreenLoader` type alias: `() => Promise<{ default: React.ComponentType }>`
- [ ] 1.3 Update JSDoc comments with lazy-loading examples
- [ ] 1.4 Remove any union type logic or type guards (not needed)

## 2. Update Screen Component
- [ ] 2.1 Add React Suspense wrapper for all screen components
- [ ] 2.2 Create loading fallback UI component (`ScreenLoadingFallback`)
- [ ] 2.3 Wrap screen loader with `React.lazy()`
- [ ] 2.4 Remove any runtime type checking (all screens are lazy)
- [ ] 2.5 Handle lazy loading errors with error boundary

## 3. Convert Demo Screenset Screens
- [ ] 3.1 Add default export to `HelloWorldScreen.tsx`
- [ ] 3.2 Add default export to `CurrentThemeScreen.tsx`
- [ ] 3.3 Add default export to `ProfileScreen.tsx`
- [ ] 3.4 Add default export to `UIKitElementsScreen.tsx`
- [ ] 3.5 Update `demoScreenset.tsx` to use dynamic imports
- [ ] 3.6 Remove top-level screen imports from `demoScreenset.tsx`

## 4. Convert Chat Screenset Screens
- [ ] 4.1 Add default export to `ChatScreen.tsx`
- [ ] 4.2 Update `chatScreenset.tsx` to use dynamic import
- [ ] 4.3 Remove top-level screen import from `chatScreenset.tsx`

## 5. Update Screenset Registry
- [ ] 5.1 Update `buildScreensFromMenu` to handle lazy loaders correctly
- [ ] 5.2 Ensure registry returns lazy loader functions (not components)
- [ ] 5.3 Update type signatures to match new `ScreenLoader` type

## 6. Testing & Validation
- [ ] 6.1 Run `npm run type-check` (should pass with no errors)
- [ ] 6.2 Run `npm run arch:check` (should pass)
- [ ] 6.3 Test demo screenset in browser - verify all 4 screens load
- [ ] 6.4 Test chat screenset in browser - verify screen loads
- [ ] 6.5 Verify bundle splitting in build output (`npm run build`)
- [ ] 6.6 Test navigation between screens (should be smooth)
- [ ] 6.7 Check browser Studio Network tab - verify chunks load on-demand
- [ ] 6.8 Test error handling (modify import path to trigger error)

## 7. Documentation
- [ ] 7.1 Update CLAUDE.md with mandatory lazy-loading pattern
- [ ] 7.2 Update screenset creation examples in CLAUDE.md
- [ ] 7.3 Update `/new-screenset` slash command template
- [ ] 7.4 Add example of correct screen file structure (with default export)
- [ ] 7.5 Document the breaking change and migration path
