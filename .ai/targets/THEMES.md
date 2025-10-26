# Themes Development Guidelines

> Read .ai/GUIDELINES.md for common rules

# CRITICAL RULES (AI: READ THIS)

**System:**
- Theme objects = SINGLE source of truth (TypeScript)
- CSS variables generated dynamically via `applyTheme(theme, themeName)`
- NO duplication between theme objects and CSS
- Each app defines its own themes in `src/themes/`
- Theme interface from @hai3/uikit, applyTheme from @hai3/uikit

**Adding Themes (3 STEPS):**
1. Create `[name].ts` in `src/themes/` (implement Theme interface from @hai3/uikit)
2. Import in `src/themes/themeRegistry.ts` and add to `themes` object + exports
3. Apply in app: `applyTheme(themes[themeName], themeName)` (applyTheme from @hai3/uikit)

**Modifying Themes:**
- Screensets: CANNOT modify existing themes
- Core: CAN modify themes
- Breaking changes need version update

**Requirements:**
- Support light/dark mode minimum
- Use relative units (rem, em) NOT pixels
- WCAG contrast 4.5:1 minimum
- NO hardcoded colors in components
