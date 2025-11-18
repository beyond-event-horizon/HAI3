# DevTools Guidelines

## AI WORKFLOW (REQUIRED)
1) Summarize 3-6 rules from this file before proposing changes.
2) STOP if you add Redux, hardcode strings, bypass event flow, or change z-index pattern.

## SCOPE
- All code under packages/devtools/**.
- Dev-only overlay for testing and inspection.
- Separate workspace package; no imports from app-level src/**.

## CRITICAL RULES
- DevTools is presentational and tooling-only; no business or domain logic.
- DevTools reads and controls app state through @hai3/uicore actions and selectors.
- DevTools uses @hai3/uikit components directly (do not use uikitRegistry).
- All user-facing text uses i18n namespace "devtools:key" via useTranslation().
- DevTools UI state (position, size, collapsed, visible) lives in React state or context, not Redux.
- Persistence (localStorage) must be event-driven (see Event and Persistence Rules).

## STATE MANAGEMENT RULES
- REQUIRED: Use React state and context for DevTools UI state.
- REQUIRED: Read business state via @hai3/uicore hooks (for example useAppSelector).
- REQUIRED: Keep DevTools state separate from app Redux store.
- FORBIDDEN: DevTools Redux slices, Zustand-style stores, or manual subscribe/notify patterns.

## EVENT AND PERSISTENCE RULES
- REQUIRED: Define DevTools events in a single events file and extend EventPayloadMap.
- REQUIRED: Emit events for UI state changes (position, size, collapsed, visible, button position).
- REQUIRED: Effects subscribe to DevTools events and handle persistence (localStorage reads and writes).
- REQUIRED: Components and hooks must not call localStorage directly.
- FORBIDDEN: Direct localStorage usage in sections or hooks.
- DETECT: grep -rn "localStorage.setItem" packages/devtools/src/{sections,hooks}/

## UI KIT AND STYLING RULES
- REQUIRED: Use @hai3/uikit base and composite components; do not create raw HTML controls.
- REQUIRED: Follow STYLING.md for units, tokens, and dark mode behavior.
- REQUIRED: Use a shared glassmorphism pattern or composite for DevTools shell.
- FORBIDDEN: Hex color literals, inline style props, or external CSS files for DevTools.
- FORBIDDEN: Screenset-specific visual components inside DevTools; keep DevTools visuals generic.

## LOCALIZATION RULES
- REQUIRED: All text uses t("devtools:key") via useTranslation().
- REQUIRED: Use the same loader pattern as UICORE (I18nRegistry.createLoader with full language map).
- REQUIRED: Pass direction-related props (for example RTL) to dropdown or menu components as needed.
- FORBIDDEN: Hardcoded labels such as "Theme:", "Screenset:", or "Language:".

## Z-INDEX AND PORTAL RULES
- REQUIRED: DevTools panel renders above app at a fixed high z-index (for example z-10000).
- REQUIRED: Shared portal container below panel (for example z-99999) with pointer-events-none by default.
- REQUIRED: Dropdown or overlay content inside DevTools must:
  - Use the shared portal container.
  - Enable pointer events on actual content only.
- REQUIRED: Provide portal container through a DevTools context hook (for example useDevToolsContext).

## DEPENDENCY RULES
- REQUIRED: @hai3/uicore and @hai3/uikit-contracts as peer dependencies.
- REQUIRED: @hai3/uikit as direct dependency.
- FORBIDDEN: Importing from app-level src/** or screensets.

## INTEGRATION RULES
- REQUIRED: DevTools must be imported dynamically only when import.meta.env.DEV is true.
- REQUIRED: DevTools overlay rendered as a sibling to main app content.
- FORBIDDEN: DevTools bundle included or rendered in production builds.

## PRE-DIFF CHECKLIST
- [ ] No Redux or custom store for DevTools; UI state uses React state or context.
- [ ] Controls read app state via @hai3/uicore selectors and call @hai3/uicore actions.
- [ ] All text uses t("devtools:key") and follows UICORE i18n loader pattern.
- [ ] No direct localStorage usage in components or hooks; persistence handled in effects.
- [ ] Components imported from @hai3/uikit; no raw HTML controls.
- [ ] Styling follows STYLING.md; no hex colors or inline styles.
- [ ] Z-index and portal behavior follow the high z-index panel plus shared portal container pattern.
- [ ] No imports from app-level src/** or screensets.
- [ ] DevTools loaded only in dev mode and excluded from production builds.