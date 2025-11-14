---
description: Validate changes before commit following HAI3 guidelines
---

Follow the workflow from `.ai/workflows/VALIDATE_CHANGES.md`:

1. Read `.ai/GUIDELINES.md` and identify which target file(s) apply to the changes
2. Summarize 3-7 key rules from the applicable target file(s)
3. Run architecture check:
   ```bash
   npm run arch:check
   ```
4. If arch:check fails, follow `.ai/workflows/FIX_RULE_VIOLATION.md`
5. Check for common violations:
   - Direct slice dispatch (use event-driven actions instead)
   - Hardcoded colors or inline styles
   - Import violations (package internals, circular dependencies)
   - Raw HTML controls in uicore (must use uikitRegistry)
   - String literal IDs (must use constants or enums)
6. Verify event-driven flow:
   - Actions emit events (not dispatch slices)
   - Effects listen to events and update slices
   - No prop drilling or callback-based state mutation
7. Report validation results and list any violations found
