# Themes Guidelines

> Common rules: .ai/GUIDELINES.md

# CRITICAL (AI: READ THIS)

**System:**
- Theme objects = source of truth (TypeScript)
- CSS variables via `applyTheme(theme, name)`
- Apps define in `src/themes/`, service from @hai3/uicore

**Registry (AI: READ THIS):**
- Self-registers on import
- Set function: `themeService.setApplyFunction(applyTheme)`
- Register: `themeService.register(name, theme)`
- App imports themeRegistry, NO registration in App.tsx

**Adding:** Create theme file, register in themeRegistry

**Modifying:** Screensets CANNOT, Core CAN (version bump)

**Requirements:** Light/dark, rem units, WCAG 4.5:1, no hardcoded colors
