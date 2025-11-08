# Screensets Guidelines

## AI WORKFLOW (REQUIRED)
1) Summarize 3–5 rules from this file before proposing changes.
2) STOP if you add manual styling, import slices directly, or hardcode screenset names.

## SCOPE
- Applies to all screensets under `src/screensets/**`
- Each screenset may define its own actions, events, slices, and effects

## CRITICAL RULES
- Manual styling is FORBIDDEN — always use `@hai3/uikit` components
- Data flow must follow the event-driven pattern defined in `EVENTS.md`
- Screensets are isolated — no hardcoded screenset names in shared code
- Registry imports entire screensets, never individual screens
- No direct slice imports — actions must come from `@hai3/uicore` or screenset-local actions

## ICON RULES
- Icons are registered inside the screenset file
- Icon IDs must be exported as constants
- Screenset icons do NOT go into `UiKitIcon` enum

## UI KIT DECISION TREE
1) Use existing `@hai3/uikit` component
2) If missing, generate via `npx shadcn add`
3) If composite needed, add to `@hai3/uikit/composite`
4) Only screenset-specific composites may live locally
5) Manual styling is never allowed

## PRE-DIFF CHECKLIST
- [ ] No manual Tailwind/className styling
- [ ] No direct slice imports
- [ ] Registry imports screenset root file only
- [ ] Icons exported and registered inside screenset
- [ ] Data flow rules from `EVENTS.md` are followed