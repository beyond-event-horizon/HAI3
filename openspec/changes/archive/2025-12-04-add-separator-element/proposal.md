# Change: Add Separator Base Element to UI Kit

## Why
The UI Kit needs a Separator component to visually divide content sections. The element is already listed in the Layout & Structure category but not yet implemented.

## What Changes
- Add Separator component to `@hai3/uikit` package (built on `@radix-ui/react-separator`)
- Export Separator component
- Add Separator demo example to the Layout & Structure category (showing horizontal and vertical usage)
- Add translations for Separator element across all 36 supported languages
- Add 'Separator' to the IMPLEMENTED_ELEMENTS array

## Impact
- Affected specs: uikit-base
- Affected code:
  - `packages/uikit/src/base/separator.tsx` (new)
  - `packages/uikit/src/index.ts` (export)
  - `src/screensets/demo/components/LayoutElements.tsx` (demo example)
  - `src/screensets/demo/screens/uikit/uikitCategories.ts` (IMPLEMENTED_ELEMENTS)
  - `src/screensets/demo/screens/uikit/i18n/*.json` (translations for 36 languages)

