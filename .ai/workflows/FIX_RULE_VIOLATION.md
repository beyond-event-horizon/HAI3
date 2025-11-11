# AI Workflow: Fix Rule Violation

## WHEN
A rule from `.ai/targets/*.md` or `.ai/GUIDELINES.md` is broken.

## IDENTIFY
- Find violating code and the exact rule
- Classify: typing / data flow / styling / registry / contracts

## FIX
- Change code to comply with the target file
- If ambiguity caused the issue, clarify the rule in that target
- Update `.ai/GUIDELINES.md` only if invariants or routing change

## DOCUMENT
Add a one-line note at the end of the affected file:
# Note: Correction on <YYYY-MM-DD>, clarified <rule/section>.

## VERIFY
- Run `.ai/workflows/VALIDATE_CHANGES.md`
- Remove temporary notes when no longer needed

## ESCALATE
- Repeated violations → strengthen wording or add detection/checklist items in the target