# Workflow: Update AI Guidelines

## PURPOSE
Apply user-requested changes to `.ai/**/*.md` files by editing them in place, with minimal diff and no duplication.

## HARD CONSTRAINTS
- You MUST modify the target file in the workspace, not just print a rewritten copy.
- You MUST NOT restate rules that already exist in other `.ai/targets/*.md` files.
- You MUST NOT copy text from other guideline files; instead, reference them.
- You MAY rewrite an existing section only if the new information changes or supersedes existing rules.
- You MUST keep each `.ai/*.md` file under 100 lines, ASCII only.

## ROUTE
1. Use `.ai/GUIDELINES.md` to identify the correct target file in `.ai/targets/*.md`.
2. Open that file in the editor.
3. Internally summarize 3–5 key rules from that file (do not write the summary into the file).

## APPLY CHANGE
- Work directly in the opened file.
- Keep the change as small as possible:
  - Add or update a bullet
  - Add or update a short sentence
  - Add or update a DETECT rule
  - Rewrite a section only if necessary to integrate the new rule
- Use short declarative statements with these keywords where appropriate:
  - MUST, REQUIRED, FORBIDDEN, STOP, DETECT
- When the new rule refers to behavior defined elsewhere, add a reference instead of duplicating:
  - Example form: `See UIKIT.md for component rules.`
- Do NOT add multi-line examples, long explanations, or code blocks into `.ai/targets/*.md`.

## SCOPE OF EDIT
- Only touch the section that is logically related to the user request (for example, SCREENSETS UI KIT RULES when the request is about screenset UI components).
- Do not modify unrelated sections.
- Do not introduce new sections unless the user explicitly asks for a new section.

## VALIDATION
Before finishing the edit:
- Check that the change is directly related to the user request.
- Check that you did not duplicate content from other `.ai/targets/*.md` files.
- Check that the file is still under 100 lines and uses ASCII only.
- Check that cross-references (for example to UIKIT.md or STYLING.md) are correct.

## OUTPUT BEHAVIOR
- Primary action: edit the file content in place.
- When invoked as a command (for example `/update-guidelines`), you should:
  - Apply the change to the file in the workspace.
  - Only print the final full file content if the user explicitly asks to see it.
  - Do NOT print “proposed” content instead of editing.

## SELF-CORRECTION
- If a future request reveals that this workflow caused duplication or verbose rules:
  - Refine the affected rule(s) in the target file to be shorter and more referential.
  - Update this workflow to tighten the constraints if needed.