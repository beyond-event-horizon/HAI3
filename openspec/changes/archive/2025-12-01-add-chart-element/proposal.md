# Change: Add Chart Element to UI Kit

## Why

The UI Kit demo currently lacks a Chart component in the Data Display category. Charts are essential for data visualization in modern SaaS applications and should be included as a base UI element with examples demonstrating various chart types and configurations.

## What Changes

- Add Chart base component to `@hai3/uikit` package using Recharts library
- Add Chart element to Data Display category in UI Kit demo
- Create example implementations showing different chart types (line, bar, area, pie)
- Add translations for Chart element across all 36 language files
- Update `uikitCategories.ts` to include Chart in IMPLEMENTED_ELEMENTS

## Impact

- **Affected specs**: `uikit-base` (new capability)
- **Affected code**:
  - `packages/uikit/package.json` - Add Recharts dependency
  - `packages/uikit/src/base/chart.tsx` - New Chart component
  - `packages/uikit/src/index.ts` - Export Chart components
  - `src/screensets/demo/components/DataDisplayElements.tsx` - Add Chart examples
  - `src/screensets/demo/screens/uikit/i18n/*.json` - Add translations (36 files)
  - `src/screensets/demo/screens/uikit/uikitCategories.ts` - Update categories

