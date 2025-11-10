# HAI3 AI Guidelines (Canonical)

## AI WORKFLOW (REQUIRED)
1) Route: select the correct target file from the Routing table.
2) Summarize: list 3–7 applicable rules from that target file in your own words.
3) Verify: pass the Pre-diff Checklist before proposing code.
4) If unsure which target applies -> STOP and ask.

## ROUTING

| Area | Target file |
|-------|-------------|
| Data flow / events | `.ai/targets/EVENTS.md` |
| API layer | `.ai/targets/API.md` |
| `packages/uicore/**` | `.ai/targets/UICORE.md` |
| `packages/uikit/**` | `.ai/targets/UIKIT.md` |
| `packages/uikit-contracts/**` | `.ai/targets/UIKIT_CONTRACTS.md` |
| `src/screensets/**` | `.ai/targets/SCREENSETS.md` |
| `src/themes/**` | `.ai/targets/THEMES.md` |
| Styling anywhere | `.ai/targets/STYLING.md` |
| `.ai/*.md` docs | `.ai/targets/AI.md` |

## REPO INVARIANTS (MANDATORY)
- Event-driven architecture only -> full rules in `EVENTS.md`
- Registries follow Open/Closed -> adding items must not require editing registry root files (cleanup after deletion is OK)
- App-level dependencies limited to: `@hai3/uicore`, `@hai3/uikit`, `react`, `react-dom`
- Cross-domain communication only via events — no direct slice imports, no prop drilling
- No string-literal identifiers — always use constants/enums
- No `any`, no type-erasing casts
- Always support RTL/LTR layouts — use logical properties (`ms-`, `me-`), `rtl:` variants, and `TextDirection` enum
- No default language — initial language state is `null` until determined by user preference/detection

## IMPORT RULES

| Case | Rule |
|-------|------|
| Inside same package | Relative paths (`../..`) |
| Cross-branch in same app | `@/...` alias |
| Cross-package | `@hai3/uicore`, `@hai3/uikit` |
| Index files | Only when aggregating ≥ 3 exports |
| Redux slices | Import directly, no barrel indirection |

## TYPE RULES
- `type` for objects/unions, `interface` for React props
- No hardcoded string IDs
- Fix type errors at boundary — do not cast to bypass
- Class ordering: properties -> constructor -> methods (public -> protected -> private)

## STOP CONDITIONS (ASK FIRST)
- Editing `/core/runtime/**` or `/sdk/**`
- Modifying registry root files to add new items (cleanup after deletion is OK)
- Changing public contracts in `uikit-contracts/**`
- Adding new top-level dependencies
- Violating the data-flow rules in `EVENTS.md`

## PRE-DIFF CHECKLIST (MUST PASS)
- [ ] `npm run arch:check` passes
- [ ] Routed to correct target file
- [ ] Summarized rules in own words
- [ ] No registry root file modified to add items (cleanup OK)
- [ ] Import paths follow rules
- [ ] Snapshot + type dependents updated if types changed

## BLOCKLIST
- Secrets / telemetry / analytics code
- `as unknown as` type chains
- Direct slice dispatch
- Barrel exports that hide real imports
- Manual state sync / prop drilling
- Default language hardcoded in slice initial state

## DOC STYLE
- Short, technical, ASCII only
- Use `->` arrows
- Use `BAD -> GOOD` diffs
- PR descriptions must cite rule numbers followed (e.g. `Follows: 2.1, 3.4`)

## AFTER A MISTAKE (SELF-CORRECTION)
1) Add or adjust rule here (1–2 lines max)
2) Update the matching target file
3) Save memory of the fix
4) Re-validate with `.ai/targets/AI.md`

## FILE / FEATURE CREATION POLICY
- Prefer existing extension + registry patterns
- If adding the 3rd+ similar item -> consider index/aggregate
- If adding an item requires editing a central file -> redesign to self-register