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

## Self-Improvement Rule

- Made a mistake during contribution? Check if guidelines caused it
- If guidelines have gap -> add decision rule to prevent future mistakes
- Always verify your .ai edits follow .ai/targets/AI.md rules
- Examples are OK if they prevent mistakes

## Documentation Rule (AI: READ THIS)

- DO NOT create markdown report files (*.md) without explicit user request
- Summarize work in chat response instead
- Exception: .ai/ directory documentation is OK

---

## Routing (AI: READ THIS)

**ALWAYS read the target guideline BEFORE making changes:**

**Target `packages/uicore` -> USE: .ai/targets/UICORE.md**
**Target `packages/uikit` -> USE: .ai/targets/UIKIT.md**
**Target `src/themes` -> USE: .ai/targets/THEMES.md**
**Target `src/screensets` -> USE: .ai/targets/SCREENSETS.md**
**Target `.ai/*.md` files -> USE: .ai/targets/AI.md**
**Styling questions -> USE: .ai/targets/STYLING.md**

## Project Structure (AI: READ THIS)

**Monorepo with npm workspaces:**
- `packages/uicore` -> @hai3/uicore (Layout domains, Redux state, Redux-aware components)
- `packages/uikit` -> @hai3/uikit (Pure React components, theme system utilities)
- `src/` -> Demo app (business logic, themes, screensets)
