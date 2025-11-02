# .ai Documentation Guidelines

> Read .ai/GUIDELINES.md for common rules

## Rules for .ai/*.md Files (AI: READ THIS FIRST)

**Structure:**
- Frontload critical info: `## CRITICAL (AI: READ THIS FIRST)` at top
- Keep files under 100 lines
- Each file = one concern only
- Reference, don't duplicate
- ASCII only: NO -> use ->, NO emoji, NO unicode bullets

**Keywords (grep-friendly):**
- NEVER/FORBIDDEN: Anti-patterns
- MUST/REQUIRED/ALWAYS: Requirements
- BAD/GOOD: Minimal examples
- Detect: grep patterns for violations

**Patterns:**
```markdown
- FORBIDDEN: `code pattern`
- REQUIRED: `correct pattern`
- Detect: grep for `regex pattern`
```

**Decision Trees:**
Numbered steps for complex decisions

**Validation:**
- Check existing rules before adding new ones
- Grep to find duplications
- Apply per line, not per file
