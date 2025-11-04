# Themes Guidelines

> Common rules: .ai/GUIDELINES.md

## CRITICAL (AI: READ THIS FIRST)

**System:**
- Theme objects = source of truth
- Theme interface: `@hai3/uicore/uikitContracts` (contract)
- CSS variables via `applyTheme(theme, name)`
- Apps define in `src/themes/`
- MUST match Theme interface structure

**Registry:** See GUIDELINES.md
- Set function: `themeService.setApplyFunction(applyTheme)` from UI Kit
- Register: `themeService.register(name, theme)`

**Modifying:**
- Screensets: FORBIDDEN
- Core: Allowed with version bump

**Requirements:** Light/dark, rem units, WCAG 4.5:1, no hardcoded colors
