# HAI3 AI Guidelines (Canonical)

## AI WORKFLOW (REQUIRED)
1) Route: select the correct target file from the Routing table.
2) Read: MUST read the target file before making changes (never assume rules).
3) Summarize: list 3-7 rules from that target file in your own words.
4) Verify: pass the Pre-diff Checklist before proposing code.
5) If unsure which target applies -> stop and ask.

## CRITICAL RULE
- FORBIDDEN: Making changes based on assumed rules without reading target file first.
- REQUIRED: When user says "follow X.md rules", immediately read X.md before any changes.

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
- Event-driven architecture only (see EVENTS.md).
- Registries follow Open/Closed: adding items must not modify registry root files.
- App-level deps limited to: @hai3/uicore, @hai3/uikit, react, react-dom.
- Cross-domain communication only via events.
- No string literal identifiers; use constants or enums.
- No any, no unknown, no unsafe casts (for example, no "as unknown as").
- REQUIRED: Use lodash for all non-trivial object and array operations instead of native methods.

## IMPORT RULES

| Case | Rule |
|-------|------|
| Inside same package | Relative paths |
| Cross-branch in app | @/ alias |
| Cross-package | @hai3/uicore, @hai3/uikit |
| Index files | Only when aggregating 3+ exports |
| Redux slices | Import directly (no barrels) |

## TYPE RULES
- Use type for objects and unions; interface for React props.
- No hardcoded string IDs.
- No unknown in type definitions.
- No "as unknown as" type casts.
- Resolve type errors at boundaries using proper generics and contracts.
- Class member order: properties -> constructor -> methods.

## STOP CONDITIONS
- Editing /core/runtime or /sdk.
- Modifying registry root files.
- Changing contracts in @hai3/uikit-contracts.
- Adding new top-level dependencies.
- Bypassing rules in EVENTS.md.
- Killing MCP server processes (see MCP_TROUBLESHOOTING.md).

## PRE-DIFF CHECKLIST
- Routed to correct target file.
- Summarized rules in own words.
- Registry root files unchanged.
- Import paths follow rules.
- Types and dependents compile after change.
- Architecture check: npm run arch:check passes with no errors.
- Dev server test via Google Chrome MCP Tools:
  - Exercise all affected flows and screens.
  - Verify UI uses @hai3/uikit and theme tokens.
  - Verify event-driven behavior (no direct slice dispatch).
  - No console errors or missing registrations.

## BLOCKLIST
- Telemetry or tracking code.
- "as unknown as" type casts.
- unknown types in type definitions.
- eslint-disable comments.
- Barrel exports hiding imports.
- Manual state sync or prop drilling (see EVENTS.md).
- Native methods when lodash equivalent is available (for example: Object.assign, deep spread, complex array transforms).

## DOC STYLE
- Short, technical, ASCII only.
- Use "->" arrows for flows.
- Use BAD -> GOOD diffs.
- PR description must reference rule numbers or sections.

## CORRECTION POLICY
1) Add or update rule in this file (short).
2) Update the matching target file.
3) Store memory of the correction.
4) Re-validate using .ai/targets/AI.md.

## FEATURE CREATION POLICY
- Reuse existing patterns.
- If adding a 3rd+ similar item, consider an index file.
- If new items require central edits, redesign to self-register.