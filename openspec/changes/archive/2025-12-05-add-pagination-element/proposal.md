# Proposal: Add Pagination Element

## Why
The Navigation category needs a Pagination component for navigating between pages of content with previous/next controls and page number links.

## What Changes
1. **New Icons**: Create ChevronLeftIcon, ChevronRightIcon, MoreHorizontalIcon in uikit icons
2. **New Component**: Create `pagination.tsx` in `packages/uikit/src/base/` with Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext, PaginationEllipsis
3. **Export**: Add exports to `packages/uikit/src/index.ts`
4. **Demo**: Add Pagination example to `NavigationElements.tsx`
5. **Category Update**: Add 'Pagination' to `IMPLEMENTED_ELEMENTS` array
6. **Translations**: Add pagination translation keys to all 36 language files

## Impact
- Affected specs: uikit-base
- Fourth implemented element in Navigation category
- Reuses existing buttonVariants for consistent styling

