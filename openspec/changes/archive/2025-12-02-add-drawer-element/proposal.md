# Change: Add Drawer Element to UI Kit

## Why

The Layout & Structure category in the UI Kit lists Drawer as a planned element but it's not yet implemented. Drawer is a mobile-friendly overlay panel (built on vaul library) that provides smooth touch gestures and supports multiple directions, making it essential for responsive layouts.

## What Changes

- Add new `drawer.tsx` component to `@hai3/uikit` package, built on vaul library
- Export Drawer and sub-components from uikit index
- Add Drawer demo example in LayoutElements.tsx (Layout & Structure category)
- Add Drawer to IMPLEMENTED_ELEMENTS array
- Add translations for Drawer demo (36 languages)

## Impact

- Affected specs: `uikit-base`
- Affected code:
  - `packages/uikit/src/base/drawer.tsx` (new)
  - `packages/uikit/src/index.ts`
  - `src/screensets/demo/components/LayoutElements.tsx`
  - `src/screensets/demo/screens/uikit/uikitCategories.ts`
  - `src/screensets/demo/screens/uikit/i18n/*.json` (36 files)

