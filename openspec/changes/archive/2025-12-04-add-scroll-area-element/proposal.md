# Change: Add Scroll Area Base Element to UI Kit

## Why
The UI Kit needs a Scroll Area component to provide custom scrollable containers with styled scrollbars. The element is already listed in the Layout & Structure category but not yet implemented.

## What Changes
- Add Scroll Area component to `@hai3/uikit` package (built on `@radix-ui/react-scroll-area`)
- Export ScrollArea and ScrollBar components
- Add Scroll Area demo examples to the Layout & Structure category (vertical and horizontal)
- Add translations for Scroll Area element across all 36 supported languages
- Add 'Scroll Area' to the IMPLEMENTED_ELEMENTS array

## Impact
- Affected specs: uikit-base
- Affected code:
  - `packages/uikit/src/base/scroll-area.tsx` (new)
  - `packages/uikit/src/index.ts` (export)
  - `src/screensets/demo/components/LayoutElements.tsx` (demo examples)
  - `src/screensets/demo/screens/uikit/uikitCategories.ts` (IMPLEMENTED_ELEMENTS)
  - `src/screensets/demo/screens/uikit/i18n/*.json` (translations for 36 languages)

