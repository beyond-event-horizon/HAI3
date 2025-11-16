# UI Core Guidelines

## AI WORKFLOW (REQUIRED)
1) Summarize 3-6 rules from this file before proposing changes.
2) STOP if you import from @hai3/uikit, use raw HTML controls, or dispatch slices directly.

## SCOPE
- All code under packages/uicore/**.
- UI Core owns domains, routing, providers, registry access, i18n system, and shared actions and events.
- Screensets may define their own state and events, but UI Core must not depend on screenset internals.

## CRITICAL RULES
- Raw HTML controls (<button>, <input>, <select>) are FORBIDDEN; use UI Kit components via uikitRegistry.
- UI Core must not import from @hai3/uikit directly; components and icons must come from uikitRegistry.
- UI Core follows event-driven architecture; no direct slice dispatch, no prop drilling, no callback-based state mutation.
- App must be wrapped in <HAI3Provider> (Redux Provider + Router + registries).
- Domains are vertical slices: each owns its slice, effects, and actions; cross-domain communication only through events.

## FILE LOCATION RULES
- Domain slices and effects: packages/uicore/src/domains/<domain>/{slice.ts,effects.ts}.
- Domain actions: packages/uicore/src/actions/<namespace>Actions.ts.
- Domain events: packages/uicore/src/events/<namespace>Events.ts.
- Bootstrap and providers: packages/uicore/src/app/{HAI3Provider.tsx,store.ts,initEffects.ts}.
- UI Kit registry accessors: packages/uicore/src/registry/uikitRegistry.ts.
- Screenset-driven routing (no hardcoded routes): packages/uicore/src/routing/**.
- I18n system: packages/uicore/src/i18n/{i18nRegistry.ts,types.ts,useTranslation.ts,useScreenTranslations.ts}.

## STOP CONDITIONS
- Importing from @hai3/uikit inside UI Core.
- Writing <button>, <input>, <select>, or other raw HTML form controls in UI Core.
- Directly dispatching slice actions from UI components.
- Hardcoding routes or importing screenset internals into UI Core.

## I18N RULES
- REQUIRED: Use I18nRegistry class for all translation utilities (for example static createLoader, LANGUAGE_FILE_MAP).
- REQUIRED: Use I18nRegistry.createLoader({ [Language.X]: () => import("...") }) to create translation loaders.
- REQUIRED: Provide all 36 languages in loader maps (Record<Language, ...>).
- REQUIRED: Use useTranslation() hook to consume translations (t, language, direction).
- REQUIRED: Use useScreenTranslations(screensetId, screenId, loader) in screen components for lazy-loaded translations.
- REQUIRED: Use <TextLoader> component to wrap translated text for loading states during lazy translation loading.
- REQUIRED: Translation namespaces:
  - Screenset: "screenset.<id>:key".
  - Screen: "screen.<screenset>.<screen>:key".
- REQUIRED: Screenset-level translations auto-load on language change via i18nRegistry.loadLanguage().
- REQUIRED: Screen-level translations lazy-load only when screen is active (via useScreenTranslations).
- FORBIDDEN: Creating standalone i18n utility files; consolidate into I18nRegistry class methods.
- FORBIDDEN: Duplicating screen content in both screenset-level and screen-level translation files.
- FORBIDDEN: Path-based loaders with dynamic imports; use explicit TranslationLoader functions instead.

## PRE-DIFF CHECKLIST
- [ ] All UI components and icons retrieved through uikitRegistry.
- [ ] No direct slice dispatch or prop drilling.
- [ ] <HAI3Provider> is still the root wrapper.
- [ ] Routing is generated from screenset registry, not hardcoded.
- [ ] No imports from screenset-private modules.
- [ ] I18n uses I18nRegistry class methods (no standalone utilities).