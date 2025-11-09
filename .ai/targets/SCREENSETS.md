# Screensets Guidelines

## AI WORKFLOW (REQUIRED)
1) Summarize 3–5 rules from this file before proposing changes.
2) STOP if you add manual styling, import slices directly, or hardcode screenset names.

## SCOPE
- Applies to all screensets under `src/screensets/**`
- Each screenset may define its own actions, events, slices, effects, and localization

## CRITICAL RULES
- Manual styling is FORBIDDEN — all UI must use `@hai3/uikit` components
- Data flow must follow the event-driven pattern in `EVENTS.md`
- Screensets are isolated — no hardcoded screenset names in shared/shared code
- Registry imports one screenset root file, never individual screens
- No direct slice imports — only `@hai3/uicore` actions or screenset-local actions

## LOCALIZATION RULES
- Localization folder: `i18n/{lang}.json` inside the screenset
- Loader must be registered in the screenset root: `i18nRegistry.registerLoader('screenset.${ID}', loader)`
- Loader type must be: `Record<Language, () => Promise<TranslationModule>>` (compile-time enforced)
- All UI text must go through `t()` — hardcoded strings are forbidden
- Use key format: `t('screenset.id:key')`
- Detection rule: `grep -R "['\"] [A-Za-z].* " src/screensets` (raw strings)

## ICON RULES
- Icons are defined and registered inside the screenset file
- Icon IDs must be exported as constants
- Screenset icons never go into `UiKitIcon` enum

## UI KIT DECISION TREE
1) Use existing `@hai3/uikit` component  
2) If missing, generate via `npx shadcn add`  
3) If composite needed, add to `@hai3/uikit/composite`  
4) Only screenset-specific composites may live locally  
5) Manual styling is never allowed  

## PRE-DIFF CHECKLIST
- [ ] No manual Tailwind/className styling
- [ ] No direct slice imports
- [ ] Registry imports screenset root only
- [ ] Icons exported and registered
- [ ] i18n loader registered under `screenset.${ID}`
- [ ] All user-facing strings replaced by `t()`
- [ ] Data flow rules from `EVENTS.md` followed