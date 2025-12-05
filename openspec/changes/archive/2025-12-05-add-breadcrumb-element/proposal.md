# Proposal: Add Breadcrumb Element

## Summary
Add Breadcrumb base component to the UI kit with demo examples showcasing custom separator, dropdown navigation, collapsed breadcrumbs, link component usage, and responsive design.

## Motivation
The Navigation category currently has no implemented elements. Breadcrumb is a fundamental navigation component that helps users understand their location within a site hierarchy and navigate back to parent pages.

## Changes
1. **New Component**: Create `breadcrumb.tsx` in `packages/uikit/src/base/` with Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator, and BreadcrumbEllipsis components
2. **Export**: Add exports to `packages/uikit/src/index.ts`
3. **Demo Component**: Create `NavigationElements.tsx` with 2 examples (custom separator, dropdown)
4. **Screen Integration**: Add navigation case to `UIKitElementsScreen.tsx`
5. **Category Update**: Add 'Breadcrumb' to `IMPLEMENTED_ELEMENTS` array
6. **Translations**: Add breadcrumb translation keys to all 36 language files

## Impact
- First implemented element in Navigation category
- Reuses existing @radix-ui/react-slot dependency
- Follows existing patterns from other element implementations

