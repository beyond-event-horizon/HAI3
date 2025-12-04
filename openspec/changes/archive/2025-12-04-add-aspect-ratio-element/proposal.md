# Change: Add Aspect Ratio Element to UI Kit

## Why

The Layout & Structure category lists Aspect Ratio as a planned element but it's not yet implemented. Aspect Ratio is a fundamental layout primitive that maintains consistent width-to-height proportions for content like images, videos, and maps.

## What Changes

- Add new `aspect-ratio.tsx` component to `@hai3/uikit` package, built on @radix-ui/react-aspect-ratio
- Export AspectRatio from uikit index
- Add AspectRatio demo examples in LayoutElements.tsx (Layout & Structure category, positioned first per category order)
- Add AspectRatio to IMPLEMENTED_ELEMENTS array
- Add translations for Aspect Ratio demo (36 languages)

## Impact

- Affected specs: `uikit-base`
- Affected code:
  - `packages/uikit/src/base/aspect-ratio.tsx` (new)
  - `packages/uikit/src/index.ts`
  - `src/screensets/demo/components/LayoutElements.tsx`
  - `src/screensets/demo/screens/uikit/uikitCategories.ts`
  - `src/screensets/demo/screens/uikit/i18n/*.json` (36 files)

