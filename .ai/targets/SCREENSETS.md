# Screensets Guidelines

## AI WORKFLOW (REQUIRED)
1) Summarize 3–5 rules from this file before proposing changes.
2) STOP if you add manual styling, custom state management, import slices directly, or hardcode screenset names.

## SCOPE
- Applies to all screensets under `src/screensets/**`
- Each screenset may define its own actions, events, slices, effects, and localization

## CRITICAL RULES
- Manual styling is FORBIDDEN. Use `@hai3/uikit` components only.
- Data flow must follow the event-driven pattern in `EVENTS.md`.
- State management MUST follow the `@hai3/uicore` store pattern (Redux + Flux: actions -> events -> effects -> slices).
- Screensets are isolated. Do not hardcode screenset names in shared code.
- Registry imports only the screenset root file, never individual screens.
- No direct slice imports. Use actions from `@hai3/uicore` or screenset-local actions.

## STATE MANAGEMENT RULES
- REQUIRED: Register slices dynamically via `registerSlice()` from `@hai3/uicore`.
- REQUIRED: Folder structure includes `slices/`, `actions/`, `events/`, `effects/`.
- REQUIRED: Add module augmentation for `RootState` in the screenset store files.
- FORBIDDEN: Custom store classes, Zustand-like patterns, or manual subscribe/notify logic.
- DETECT: `grep -rn "class.*Store\|subscribe.*listener" src/screensets/*/`
- DETECT: `grep -rn "use.*Store.*useState\|Set<.*>" src/screensets/*/hooks/`

## LOCALIZATION RULES
- Localization folder: `i18n/{lang}.json`.
- Register loader: `i18nRegistry.registerLoader('screenset.${ID}', loader)`.
- Loader type: `Record<Language, () => Promise<TranslationModule>>`.
- All UI text uses `t('screenset.id:key')`. Hardcoded strings are FORBIDDEN.
- DETECT: `grep -R "['\"] [A-Za-z].* " src/screensets`

## ICON RULES
- Define and register icons inside the screenset file.
- Export icon IDs as constants.
- Do not add screenset icons to the `UiKitIcon` enum.

## UI KIT DECISION TREE
1) Use existing `@hai3/uikit` component.
2) If missing, generate via `npx shadcn add`.
3) If composite needed, add to `@hai3/uikit/composite`.
4) Only screenset-specific composites may live locally.
5) Manual styling is never allowed.

## PRE-DIFF CHECKLIST
- [ ] No manual Tailwind/className styling.
- [ ] No custom state management.
- [ ] Slice registered via `registerSlice()`.
- [ ] Module augmentation present in store files.
- [ ] No direct slice imports.
- [ ] Registry imports the screenset root only.
- [ ] Icons exported and registered.
- [ ] i18n loader registered under `screenset.${ID}`.
- [ ] All user-facing strings use `t()`.
- [ ] Data flow rules from `EVENTS.md` are followed.