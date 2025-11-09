# Theme Guidelines

## AI WORKFLOW (REQUIRED)
1) Summarize 3–5 rules from this file before proposing changes.
2) STOP if you modify theme objects outside the designated theme locations.

## SCOPE
- Theme objects and theme registration in packages and app code
- Contracts for theme shape live in `@hai3/uikit-contracts`

## CRITICAL RULES
- Theme objects are the single source of truth — no standalone CSS variables
- Theme shape MUST match the `Theme` interface from `@hai3/uikit-contracts`
- Apps define themes in `src/themes/**`; screensets must not modify themes
- Theme application is performed via `themeRegistry.setApplyFunction(applyTheme)` and `themeRegistry.register(name, theme)`
- Themes must support light and dark variants, use rem units, and meet WCAG 4.5:1 contrast

## STOP CONDITIONS
- Editing theme values inside screensets or feature modules
- Adding CSS variables that don’t exist in the Theme interface
- Changing the Theme interface without a version bump

## PRE-DIFF CHECKLIST
- [ ] Theme object matches contract exactly
- [ ] No hex colors or CSS variables defined outside theme objects
- [ ] Light & dark variants exist
- [ ] Contrast ratio ≥ 4.5:1 verified