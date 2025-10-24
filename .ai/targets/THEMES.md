# Themes Development Guidelines

> Read .ai/GUIDELINES.md for common rules

# CRITICAL RULES (AI: READ THIS)

**System (AI: READ THIS):**
- Theme objects = SINGLE source of truth (TypeScript)
- CSS variables generated dynamically via `applyTheme()`
- NO duplication between theme objects and CSS
- Tailwind/shadcn use generated CSS variables

**Files:**
- `styles/themes/[name].ts` = theme definitions ONLY (SOURCE OF TRUTH)
- `styles/themeTypes.ts` = Theme interface
- `styles/applyTheme.ts` = dynamic CSS var generator
- `styles/themeRegistry.ts` = theme exports + themes object
- `styles/globals.css` = only default values for SSR

**Folder Structure:**
- `themes/` = theme definition files ONLY
- Supporting files (types, utils, registry) at `styles/` level

**Adding Themes (2 STEPS ONLY):**
1. Create `[name].ts` in `src/styles/themes/` (implement Theme interface from themeTypes.ts)
2. Import in `src/styles/themeRegistry.ts` and add to `themes` object + exports
DONE - applyTheme automatically uses new theme from registry

**Modifying Themes:**
- Screensets: CANNOT modify existing themes
- Core: CAN modify themes
- Breaking changes need version update

**Requirements:**
- Support light/dark mode minimum
- Use relative units (rem, em) NOT pixels
- WCAG contrast 4.5:1 minimum
- NO hardcoded colors in components
