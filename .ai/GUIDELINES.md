# HAI3 AI Guidelines

## Common Rules for All Contributions

### Stack
- React 18 + TypeScript + Tailwind CSS + Vite

### TypeScript - STRICT
- Types for ALL variables, params, returns
- NEVER `any`, use `unknown`
- Explicit generics when possible
- `type` for objects, `interface` for props
- Export types with component
- Follow SOLID and DRY principles

### Enums & Types - NO Hardcoded Strings
- Use enums OR derived types for string constants - NO hardcoded strings
- Enums: Define in slice file when slice owns the values
- Types: Use `keyof typeof` when source of truth exists elsewhere
- BAD: `theme: 'light'` GOOD: `theme: ThemeName` (derived from themes object)
- GOOD: `domain: LayoutDomains.Menu` (enum in layoutSlice)
- Prefer types over duplicate enums (DRY principle)

### Documentation
- NO emoji in .md files
- ASCII only (no Unicode)
- Use -> for arrows, BAD:/GOOD: for indicators
- Technical, concise language

---

## Contributing to .ai Guidelines

**Rules for .ai/*.md files:**
- Optimize for AI consumption, NOT humans
- Remove examples unless critical for understanding
- Remove structure diagrams (AI can explore codebase)
- No redundant explanations
- Use "AI: READ THIS" markers for critical sections
- Keep files under 100 lines when possible
- No duplications across files - reference instead
- Each file = one concern only

**Self-Improvement Rule:**
- Made a mistake during contribution? Check if guidelines caused it
- If guidelines have gap -> add decision rule to prevent future mistakes
- Always verify your .ai edits follow the rules above
- Examples are OK if they prevent mistakes

---

## Routing (AI: READ THIS)

**Target `src/core` -> USE: .ai/CORE.md**
**Target `src/uikit` -> USE: .ai/UIKIT.md**
**Target `src/styles/themes` -> USE: .ai/THEMES.md**
**Target `src/screensets` -> USE: .ai/SCREENSETS.md**
**Styling questions -> USE: .ai/STYLING.md**
