# Proposal: Add Menubar Element

## Why
The Navigation category needs a Menubar component for building desktop-style menu interfaces with support for menus, submenus, checkboxes, radio groups, and keyboard navigation.

## What Changes
1. **New Dependency**: Install `@radix-ui/react-menubar` in uikit package
2. **New Component**: Create `menubar.tsx` in `packages/uikit/src/base/` with all Menubar sub-components
3. **Export**: Add exports to `packages/uikit/src/index.ts`
4. **Demo**: Add Menubar example to `NavigationElements.tsx`
5. **Category Update**: Add 'Menubar' to `IMPLEMENTED_ELEMENTS` array
6. **Translations**: Add menubar translation keys to all 36 language files

## Impact
- Affected specs: uikit-base
- Second implemented element in Navigation category (after Breadcrumb)
- Requires new Radix UI dependency

