# HAI3 AI Guidelines (Canonical)

## AI WORKFLOW (REQUIRED)
1) Route: select the correct target file from the Routing table.
2) Summarize: list 3–7 rules from that target file in your own words.
3) Verify: pass the Pre-diff Checklist before proposing code.
4) If unsure which target applies → stop and ask.

## ROUTING

| Area | Target file |
|-------|-------------|
| Data flow / events | .ai/targets/EVENTS.md |
| API layer | .ai/targets/API.md |
| packages/uicore | .ai/targets/UICORE.md |
| packages/uikit | .ai/targets/UIKIT.md |
| packages/uikit-contracts | .ai/targets/UIKIT_CONTRACTS.md |
| src/screensets | .ai/targets/SCREENSETS.md |
| src/themes | .ai/targets/THEMES.md |
| Styling anywhere | .ai/targets/STYLING.md |
| .ai documentation | .ai/targets/AI.md |

## REPO INVARIANTS
- Event-driven architecture only (see EVENTS.md)
- Registries follow Open/Closed: adding items must not modify registry root files
- App-level deps limited to: @hai3/uicore, @hai3/uikit, react, react-dom
- Cross-domain communication only via events
- No string literal identifiers; use constants or enums
- No any, no unsafe casts

## IMPORT RULES

| Case | Rule |
|-------|------|
| Inside same package | Relative paths |
| Cross-branch in app | @/ alias |
| Cross-package | @hai3/uicore, @hai3/uikit |
| Index files | Only when aggregating 3+ exports |
| Redux slices | Import directly (no barrels) |

## TYPE RULES
- type for objects/unions, interface for React props
- No hardcoded string IDs
- Resolve type errors at boundary, do not cast
- Class order: properties → constructor → methods

## STOP CONDITIONS
- Editing /core/runtime or /sdk
- Modifying registry root files
- Changing contracts in uikit-contracts
- Adding new top-level dependencies
- Bypassing rules in EVENTS.md

## PRE-DIFF CHECKLIST
- Routed to correct target file
- Summarized rules in own words
- Registry root files unchanged
- Import paths follow rules
- Types and dependents compile after change
- Architecture check: npm run arch:check passes with no errors
- Dev server test via Google Chrome MCP Tools:
  - Exercise all affected flows and screens
  - Verify UI uses @hai3/uikit and theme tokens
  - Verify event-driven behavior (no direct slice dispatch)
  - No console errors or missing registrations

## BLOCKLIST
- Telemetry or tracking code
- as unknown as type chains
- Direct slice dispatch
- Barrel exports hiding imports
- Manual state sync or prop drilling

## DOC STYLE
- Short, technical, ASCII only
- Use -> arrows
- Use BAD → GOOD diffs
- PR description must reference rule numbers

## CORRECTION POLICY
1) Add or update rule in this file (short)
2) Update the matching target file
3) Store memory of the correction
4) Re-validate using .ai/targets/AI.md

## FEATURE CREATION POLICY
- Reuse existing patterns
- If adding a 3rd+ similar item, consider index file
- If new items require central edits, redesign to self-register