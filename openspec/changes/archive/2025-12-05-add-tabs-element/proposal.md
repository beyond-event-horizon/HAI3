# Proposal: Add Tabs Element

## Why
The Navigation category needs a Tabs component for organizing content into switchable panels, a fundamental navigation pattern for forms and content sections.

## What Changes
1. **New Dependency**: Install `@radix-ui/react-tabs` in uikit package
2. **New Component**: Create `tabs.tsx` in `packages/uikit/src/base/` with Tabs, TabsList, TabsTrigger, TabsContent
3. **Export**: Add exports to `packages/uikit/src/index.ts`
4. **Demo**: Add Tabs example to `NavigationElements.tsx` with Account/Password tabs using Card, Input, Button
5. **Category Update**: Add 'Tabs' to `IMPLEMENTED_ELEMENTS` array
6. **Translations**: Add tabs translation keys to all 36 language files

## Impact
- Affected specs: uikit-base
- Fifth implemented element in Navigation category
- Completes the Navigation category elements list

