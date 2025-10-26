# Themes Guidelines

> Common rules: .ai/GUIDELINES.md

# CRITICAL (AI: READ THIS)

**System:**
- Theme objects = source of truth (TypeScript)
- CSS variables via `applyTheme(theme, name)`
- NO duplication
- Apps define themes in `src/themes/`
- themeService from @hai3/uicore

**Registry (AI: READ THIS):**
- Self-registers on import
- Set function: `themeService.setApplyFunction(applyTheme)`
- Register: `themeService.register('light', lightTheme)`
- App imports: `import '@/themes/themeRegistry'`
- NO registration in App.tsx
- Footer orchestrates: theme -> themeService.apply()

**Adding (2 steps):**
1. Create `[name].ts` (implement Theme)
2. Register in `themeRegistry.ts`

**Modifying:**
- Screensets: CANNOT
- Core: CAN (version bump if breaking)

**Requirements:**
- Light/dark minimum
- Relative units (rem, em)
- WCAG 4.5:1
- NO hardcoded colors
