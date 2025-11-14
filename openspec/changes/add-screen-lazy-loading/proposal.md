# Change: Add Mandatory Lazy-Loading for Screen Components

## Why

Currently, all screen components are eagerly imported and bundled together, increasing initial bundle size and slowing down application startup. For applications with many screensets and screens, this results in downloading and parsing JavaScript that may never be used.

Mandatory lazy-loading will improve initial page load performance by splitting screen components into separate chunks that are loaded on-demand when the user navigates to them. By making this mandatory, we ensure consistent performance characteristics across all screens and simplify the implementation.

## What Changes

- **BREAKING:** Change `MenuScreenItem.screen` type from `React.ComponentType` to lazy loader function
- Update `Screen` component in uicore to handle lazy-loaded components with Suspense
- Convert all existing screensets to use lazy loaders (demo, chat)
- Provide declarative configuration - screenset authors specify import functions, uicore handles lazy-loading

**Key Design Decisions:**
- Mandatory lazy-loading (simpler implementation, no union types)
- Zero configuration required beyond using dynamic imports
- Automatic fallback UI during lazy loading (handled by uicore)
- Type-safe loader functions
- **Breaking change** - all existing screensets must be updated

**Rationale for Breaking Change:**
- Simpler implementation (no runtime type checking)
- Consistent performance profile across all screens
- Future-proof architecture (all screens benefit from code-splitting)
- Minimal migration effort (only 2 screensets currently exist)

## Impact

**Affected specs:**
- `screensets` - **BREAKING:** Screenset configuration and registration
- `screen-rendering` - Screen component rendering logic

**Affected code:**
- `packages/uicore/src/screensets/screensetRegistry.ts` - ScreensetConfig type (breaking)
- `packages/uicore/src/layout/domains/screen/Screen.tsx` - Lazy loading and Suspense
- `src/screensets/drafts/demo/demoScreenset.tsx` - Convert to lazy loaders (4 screens)
- `src/screensets/drafts/chat/chatScreenset.tsx` - Convert to lazy loaders (1 screen)

**Performance Impact:**
- Reduced initial bundle size (all screens loaded on demand)
- Faster time-to-interactive for applications
- Minimal runtime overhead (React.lazy is optimized)
- Consistent loading patterns across all screens

**Migration Path:**
- Convert existing demo screenset (4 screens)
- Convert existing chat screenset (1 screen)
- Update CLAUDE.md and documentation with lazy-loading pattern
- All future screensets must use lazy loaders
