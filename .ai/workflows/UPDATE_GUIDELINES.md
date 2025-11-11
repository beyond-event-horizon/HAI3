# AI Workflow: Update Guidelines

## PURPOSE
Safely update `.ai/**/*.md` rules without adding verbosity or breaking structure.

## INPUT
- Classify update: new rule / clarification / correction
- Identify domain: API, UIKIT, UICORE, SCREENSETS, THEMES, STYLING, EVENTS, AI docs

## ROUTE
- Use `.ai/GUIDELINES.md` to select the correct `.ai/targets/*.md`
- Edit only one target file per update
- If ambiguous, ask for routing

## READ FIRST
- `.ai/targets/AI.md` for format and keywords
- Target top sections: AI WORKFLOW, CRITICAL RULES, STOP CONDITIONS

## APPLY
- ASCII only, one rule per line, max 100 lines per file
- Use keywords: FORBIDDEN, REQUIRED, MUST, STOP, DETECT
- Place new rules under the correct section (do not create new sections unless required)
- Do not add multi-line examples or code blocks
- Prefer short grep patterns for detection, or reference another file/workflow
- Do not modify unrelated content

## VALIDATE
- Ensure no duplication with other target files
- Confirm headings, cross-references, and tone match the rest of `.ai/targets/*`
- Internally summarize 3–6 changed rules to confirm understanding

## OUTPUT
- Return only the full updated target file as a fenced markdown block
- No commentary or extra text

## SELF-CORRECTION
- If a rule caused verbosity or confusion, refine the rule text
- If invariants changed, update `.ai/GUIDELINES.md` accordingly