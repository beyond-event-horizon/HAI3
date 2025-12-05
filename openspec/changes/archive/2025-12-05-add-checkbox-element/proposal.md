# Proposal: Add Checkbox Element

## Why
The Forms & Inputs category needs a Checkbox component for boolean input selection, a fundamental form control.

## What Changes
1. **New Dependency**: Install `@radix-ui/react-checkbox` in uikit package
2. **New Component**: Create `checkbox.tsx` in `packages/uikit/src/base/` with Checkbox component using existing CheckIcon
3. **Export**: Add export to `packages/uikit/src/index.ts`
4. **Demo**: Add Checkbox examples to `FormElements.tsx` showing:
   - Basic checkbox with label
   - Checked checkbox with description
   - Disabled checkbox
   - Card-style checkbox with custom styling
5. **Category Update**: Add 'Checkbox' to `IMPLEMENTED_ELEMENTS` array
6. **Translations**: Add checkbox translation keys to all 36 language files

## Impact
- Affected specs: uikit-base
- Third Forms & Inputs element with demo examples
- Reuses existing CheckIcon from uikit icons

