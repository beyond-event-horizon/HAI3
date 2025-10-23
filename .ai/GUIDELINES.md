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

### Enums - Vertical Slice
- Use enums for string constants - NO hardcoded strings
- Define in slice file (NOT central constants.ts)
- Export from slice files
- BAD: `theme: 'light'` GOOD: `theme: Theme.Light`
- BAD: `'menu'` GOOD: `LayoutDomains.Menu`

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

---

## Routing (AI: READ THIS)

**Target `src/core` -> USE: .ai/CORE.md**
**Target `src/uikit` -> USE: .ai/UIKIT.md**
**Target `src/styles/themes` -> USE: .ai/THEMES.md**
**Target `src/screensets` -> USE: .ai/SCREENSETS.md**
**Styling questions -> USE: .ai/STYLING.md**
