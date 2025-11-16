# UI Kit Contracts Guidelines

## AI WORKFLOW (REQUIRED)
1) Summarize 3-5 rules from this file before proposing changes.
2) STOP if you add React code, styling, runtime logic, or string literals instead of enums.

## SCOPE
- All code under packages/uikit-contracts/**.
- This package defines types only; no React, no runtime, no CSS.

## CRITICAL RULES
- UiKitComponent enum is the single source of truth for component IDs.
- Each component contract consists of:
  1) Enum entry.
  2) XProps interface.
  3) XComponent type alias.
  4) UiKitComponentMap entry.
- UiKitIcon enum defines core icon IDs only; screenset-level icons never belong here.
- Theme interface defines the full structure all themes must follow.
- No React imports, no JSX, no runtime logic, no Tailwind, no CSS.

## STOP CONDITIONS
- Adding import React or JSX.
- Declaring string literals instead of enum values.
- Adding runtime helpers, functions, or styling.
- Modifying any registry or service logic (Open/Closed violation).

## ADDING A COMPONENT CONTRACT
- Add enum entry to UiKitComponent.
- Add "export interface XProps {}".
- Add "export type XComponent = React.FC<XProps>".
- Add map entry in UiKitComponentMap.
- Do not duplicate strings; enum value must be the single source of truth.

## PRE-DIFF CHECKLIST
- [ ] Enum entry added.
- [ ] Props interface added.
- [ ] Component type alias added.
- [ ] UiKitComponentMap updated.
- [ ] No React, JSX, CSS, styling, or runtime code added.