---
description: Fix a rule violation following HAI3 correction policy
---

Follow the workflow from `.ai/workflows/FIX_RULE_VIOLATION.md`:

## 1. IDENTIFY

Ask the user or analyze the code to identify:
- Violating code location (file:line)
- Exact rule being violated
- Category: typing | data flow | styling | registry | contracts | imports

## 2. CLASSIFY AND ROUTE

Use `.ai/GUIDELINES.md` routing table to identify target file:

| Area | Target file |
|------|-------------|
| Data flow / events | .ai/targets/EVENTS.md |
| API layer | .ai/targets/API.md |
| packages/uicore | .ai/targets/UICORE.md |
| packages/uikit | .ai/targets/UIKIT.md |
| packages/uikit-contracts | .ai/targets/UIKIT_CONTRACTS.md |
| src/screensets | .ai/targets/SCREENSETS.md |
| src/themes | .ai/targets/THEMES.md |
| Styling anywhere | .ai/targets/STYLING.md |

## 3. SUMMARIZE RULES

Read the target file and summarize 3-7 applicable rules in your own words.

## 4. FIX

Apply the fix to make code compliant with the target file.

Common violations and fixes:

**Direct slice dispatch:**
```typescript
// ❌ BAD
dispatch(setMenuItems(items));

// ✅ GOOD
navigateToScreen(screenId); // Emits event → effect updates slice
```

**Hardcoded colors:**
```typescript
// ❌ BAD
<div style={{ color: '#0066cc' }}>

// ✅ GOOD
<div className="text-primary">
```

**Raw HTML in uicore:**
```typescript
// ❌ BAD
<button onClick={...}>

// ✅ GOOD
const Button = uikitRegistry.getComponent(UiKitComponent.Button);
<Button onClick={...}>
```

**Import violations:**
```typescript
// ❌ BAD
import { Foo } from '@hai3/uikit/src/components/Foo';

// ✅ GOOD
import { Foo } from '@hai3/uikit';
```

**String literal IDs:**
```typescript
// ❌ BAD
screenId: 'dashboard'

// ✅ GOOD
export const DASHBOARD_SCREEN_ID = 'dashboard';
screenId: DASHBOARD_SCREEN_ID
```

## 5. DOCUMENT

If the rule was ambiguous and caused the violation, clarify it in the target file.

## 6. VERIFY

Run validation:
```bash
npm run arch:check
npm run lint
npm run type-check
```

## 7. REPORT

Provide a summary:
- What was violated
- What rule applies
- What was changed
- Verification results
