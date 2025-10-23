# Themes Development Guidelines

> Read .ai/GUIDELINES.md for common rules

# CRITICAL RULES (AI: READ THIS)

**System:**
- CSS variables for runtime switching
- Tailwind configured to use theme tokens
- Components reference tokens, NOT hardcoded values

**Files:**
- `styles/themes/[name].ts` = theme definition
- `styles/themes/types.ts` = Theme interface
- `styles/globals.css` = CSS variable definitions
- Implement Theme interface completely

**Token Structure:**
- Semantic names: primary, secondary, accent, background, foreground, muted, border
- State colors: error, warning, success, info
- Typography: fontFamily, fontSize, fontWeight
- Spacing: xs, sm, md, lg, xl (use rem)
- Border radius: none, sm, md, lg, full
- Shadows: sm, md, lg

**Adding Themes:**
1. Create `[name].ts` in `src/styles/themes`
2. Implement Theme interface
3. Export from `src/styles/themes/index.ts`
4. Add CSS variables in `globals.css`
5. Test with all UI Kit components

**Modifying Themes:**
- Screensets: CANNOT modify existing themes
- Core: CAN modify themes
- Breaking changes need version update

**Requirements:**
- Support light/dark mode minimum
- Use relative units (rem, em) NOT pixels
- WCAG contrast 4.5:1 minimum
- NO hardcoded colors in components
