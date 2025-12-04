# Change: Add Resizable Base Element to UI Kit

## Why
The UI Kit needs a Resizable component to allow users to create resizable panel layouts. The element is already listed in the Layout & Structure category but not yet implemented.

## What Changes
- Add Resizable component to `@hai3/uikit` package (built on `react-resizable-panels`)
- Export ResizablePanelGroup, ResizablePanel, and ResizableHandle components
- Add Resizable demo examples to the Layout & Structure category
- Add translations for Resizable element across all 36 supported languages
- Add 'Resizable' to the IMPLEMENTED_ELEMENTS array

## Impact
- Affected specs: uikit-base
- Affected code:
  - `packages/uikit/src/base/resizable.tsx` (new)
  - `packages/uikit/src/index.ts` (export)
  - `src/screensets/demo/components/LayoutElements.tsx` (demo examples)
  - `src/screensets/demo/screens/uikit/uikitCategories.ts` (IMPLEMENTED_ELEMENTS)
  - `src/screensets/demo/screens/uikit/i18n/*.json` (translations for 36 languages)

