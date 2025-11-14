---
description: Fix a rule violation following HAI3 correction policy
---

## WORKFLOW
1. IDENTIFY: Location (file:line), rule violated, category
2. ROUTE: Use .ai/GUIDELINES.md table to find target file
3. SUMMARIZE: Extract 3-7 applicable rules from target
4. FIX: Apply correction
5. VERIFY: Run npm run arch:check && npm run lint && npm run type-check
6. REPORT: What violated, rule applied, changes made, results

## CATEGORY
- typing | data flow | styling | registry | contracts | imports

## TARGET FILES
- Data flow/events -> .ai/targets/EVENTS.md
- API layer -> .ai/targets/API.md
- packages/uicore -> .ai/targets/UICORE.md
- packages/uikit -> .ai/targets/UIKIT.md
- packages/uikit-contracts -> .ai/targets/UIKIT_CONTRACTS.md
- src/screensets -> .ai/targets/SCREENSETS.md
- src/themes -> .ai/targets/THEMES.md
- Styling -> .ai/targets/STYLING.md

## COMMON FIXES
- Direct dispatch: BAD dispatch(setMenuItems(items)) -> GOOD navigateToScreen(screenId)
- Hardcoded colors: BAD style={{ color: '#0066cc' }} -> GOOD className="text-primary"
- Raw HTML in uicore: BAD <button onClick={...}> -> GOOD uikitRegistry.getComponent(Button)
- Import violations: BAD import from '@hai3/uikit/src/Foo' -> GOOD import from '@hai3/uikit'
- String literals: BAD screenId: 'dashboard' -> GOOD export const DASHBOARD_SCREEN_ID = 'dashboard'
