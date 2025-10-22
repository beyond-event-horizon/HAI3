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

## Contribution Guidelines by Area

**Determine your contribution target and use the appropriate guidelines:**

## Contributing to UI Core
Working on: `src/core`

**USE:** `.ai/CORE.md`

Core includes: Layout system, Redux store, state management, hooks

---

## Contributing to UI Kit
Working on: `src/uikit`

**USE:** `.ai/UIKIT.md`

UI Kit includes: Reusable business-logic-free components

---

## Contributing to Themes
Working on: `src/styles/themes`

**USE:** `.ai/THEMES.md`

Themes include: Visual appearance, colors, typography, spacing

---

## Contributing to Screensets
Working on: `src/screensets/[name]`

**USE:** `.ai/SCREENSETS.md`

Screensets include: Application screens, business logic, screen-specific state

**Note:** When working on screensets, you can ADD new UI Kit components and themes (see respective guidelines), but CANNOT modify existing ones unless explicitly prompted.

---

## Additional Context
- **docs/MANIFEST.md** - Core philosophy and vision
- **docs/MODEL.md** - Domain models and glossary
