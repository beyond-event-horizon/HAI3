# HAI3 AI Guidelines

## Common Rules for All Contributions

### Programming
- TypeScript with strict typing - NEVER `any`, use `unknown`
- Explicit types for ALL variables, params, returns
- Explicit generics when possible
- Follow SOLID and DRY principles

### Stack
- React 18
- TypeScript
- Tailwind CSS for styling
- Vite for build tooling

### TypeScript
- Types for ALL variables, params, returns
- Export types with component
- `type` for objects, `interface` for props
- NEVER `any`, use `unknown`
- Use enums for string constants - NO hardcoded strings
  - Define in slice file (vertical slice approach)
  - BAD:  `status: 'active' | 'inactive'` -> GOOD: `status: Status.Active`
  - Export enums from slice files

### Documentation
- NO emoji in documentation files (*.md)
- Use ASCII characters only (no Unicode symbols)
- Use ASCII alternatives: -> for arrows, BAD:/GOOD: for indicators
- Clear, professional, technical language

---

## Routing (AI: READ THIS)

**Target `src/core` -> USE: .ai/CORE.md**
**Target `src/uikit` -> USE: .ai/UIKIT.md**
**Target `src/styles/themes` -> USE: .ai/THEMES.md**
**Target `src/screensets` -> USE: .ai/SCREENSETS.md**
