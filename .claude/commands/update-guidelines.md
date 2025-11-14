---
description: Update AI guidelines following the correction policy
---

Follow the workflow from `.ai/workflows/UPDATE_GUIDELINES.md`:

## CONSTRAINTS

- MUST modify the target file in workspace (not print a copy)
- MUST NOT restate rules from other .ai/targets/*.md files
- MUST NOT copy text; reference instead
- MUST keep each .ai/*.md file under 100 lines, ASCII only
- MUST keep changes minimal (add/update bullets, short sentences)

## ROUTE

1. Use `.ai/GUIDELINES.md` routing table to identify correct target file
2. Read that file
3. Internally summarize 3-5 key rules (don't write to file)

## APPLY CHANGE

Work directly in the target file:

- Add or update a bullet point
- Add or update a short sentence
- Add or update a DETECT rule
- Rewrite section only if necessary

Use keywords: MUST, REQUIRED, FORBIDDEN, STOP, DETECT

When referring to behavior defined elsewhere:
```
See UIKIT.md for component rules.
```

NO multi-line examples, long explanations, or code blocks in .ai/targets/*.md

## SCOPE

- Only touch the section related to the request
- Don't modify unrelated sections
- Don't introduce new sections unless explicitly requested

## VALIDATION

Before finishing:
- Change directly related to request? ✓
- No duplicate content from other targets? ✓
- File still under 100 lines, ASCII only? ✓
- Cross-references correct? ✓

## SELF-CORRECTION

If duplication or verbosity detected:
- Refine rules to be shorter and more referential
- Update this workflow to tighten constraints

## OUTPUT

- Edit file in place (primary action)
- Only show full content if user explicitly asks
- Do NOT print "proposed" content instead of editing
