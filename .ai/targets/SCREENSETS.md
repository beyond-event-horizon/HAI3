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
- REQUIRED: Two-tier system: screenset-level + screen-level translations
- REQUIRED: Screenset-level translations registered via `localization: TranslationLoader` property in `ScreensetConfig`
- REQUIRED: Screen-level translations registered by screen components using `useScreenTranslations(screensetId, screenId, loader)`
- REQUIRED: Use `I18nRegistry.createLoader()` to create translation loaders with all 36 languages
- REQUIRED: Screenset namespace: `screenset.<screenset-id>:key` (e.g., `screenset.demo:screens.hello.title` for menu labels)
- REQUIRED: Screen namespace: `screen.<screenset-id>.<screen-id>:key` (e.g., `screen.demo.hello:title` for screen content)
- REQUIRED: Translation files colocated with code: `src/screensets/*/i18n/` (screenset) + `src/screensets/*/screens/*/i18n/` (screens)
- REQUIRED: All 36 languages provided via explicit imports in createLoader map (Vite analyzes but only loads current language)
- REQUIRED: Wrap translated text with `<TextLoader>` component for loading states during lazy translation loading
- FORBIDDEN: Hardcoded strings, path-based loaders (use TranslationLoader functions), missing languages
- DETECT: `grep -R "['\"] [A-Za-z].* " src/screensets` (find hardcoded strings)

## ICON RULES
- Define and register icons inside the screenset file.
- Export icon IDs as constants.
- Do not add screenset icons to the `UiKitIcon` enum.

## SCREENSET UI KIT RULES
- Screenset-local UI Kit components must follow the same rules as components in `UIKIT.md`.

## UI KIT DECISION TREE
1) Use existing `@hai3/uikit` component.
2) If missing, generate via `npx shadcn add`.
3) If composite needed, add to `@hai3/uikit/composite`.
4) Only screenset-specific composites may live locally in `src/screensets/*/uikit/`.
5) Screenset UI Kit components are package-ready and must not depend on UI Core.
6) Manual styling is never allowed.

## PRE-DIFF CHECKLIST
- [ ] No manual Tailwind/className styling.
- [ ] No custom state management.
- [ ] Slice registered via `registerSlice()`.
- [ ] Module augmentation present in store files.
- [ ] No direct slice imports.
- [ ] Registry imports the screenset root only.
- [ ] Icons exported and registered.
- [ ] Screenset config has `localization: TranslationLoader` property
- [ ] Screenset loader created with `I18nRegistry.createLoader()` with all 36 languages
- [ ] Screen components use `useScreenTranslations(screensetId, screenId, loader)` for lazy loading
- [ ] Screen loaders created with `I18nRegistry.createLoader()` with all 36 languages
- [ ] Screenset namespace: `screenset.<id>:key`, Screen namespace: `screen.<screenset>.<screen>:key`
- [ ] Translated text wrapped with `<TextLoader>` component
- [ ] All user-facing strings use `t()`.
- [ ] Screenset UI Kit components have no `@hai3/uicore` imports or hooks.
- [ ] Data flow rules from `EVENTS.md` are followed.