# HAI3 Styling Architecture

> Read .ai/GUIDELINES.md for common rules

# CRITICAL RULES (AI: READ THIS)

**Hierarchy:**
- Project tokens -> Themes -> Base -> Composite -> Core/Screensets
- Bottom-up: styling at base, layout at top

**Responsibility:**
- **Base:** ALL visual styling (colors, typography, borders, shadows, states)
- **Composite:** ONLY layout of base components (flex, grid, gap)
- **Core/Screensets:** ONLY layout of UI Kit components (flex, grid, gap)
- **Themes:** Token values (hex colors, rem sizes, font names)
- **Project:** Token definitions in `tailwind.config.ts` and `globals.css`

**Rules:**
- NO hardcoded values anywhere
- Base uses Tailwind classes with theme tokens
- Composite/Core/Screensets use ONLY layout classes
- All states (hover, focus, active, disabled) in base components

## Token System

**Location:**
- Definitions: `tailwind.config.ts`
- Values: `styles/themes/[name].ts`
- CSS vars: `styles/globals.css`

**Categories:**
- Colors: primary, secondary, accent, background, foreground, muted, border, error, warning, success, info
- Spacing: xs, sm, md, lg, xl, 2xl, 3xl
- Typography: fontFamily, fontSize, fontWeight, lineHeight
- Border radius: none, sm, md, lg, xl, full
- Shadows: sm, md, lg, xl
- Z-index: dropdown(1000), sticky(1020), fixed(1030), modal(1040), popover(1050), tooltip(1060)
- Transitions: fast(150ms), base(200ms), slow(300ms), slower(500ms)
- Breakpoints: sm(640px), md(768px), lg(1024px), xl(1280px), 2xl(1536px)

## Responsive

**Mobile-first:**
- Base styles = mobile
- Use Tailwind responsive prefixes: `md:text-lg lg:px-xl`

**Base handles:**
- Font/padding scaling
- Layout direction changes

**Screensets handle:**
- Grid columns: `grid-cols-1 md:grid-cols-2`
- Visibility: `hidden md:block`

## Dark Mode

**System:**
- CSS variables via `data-theme` attribute
- NO component overrides
- Both light/dark required in all themes

**Switch theme:**
```typescript
document.documentElement.setAttribute('data-theme', 'dark');
```

## Anti-Patterns

**BAD:**
- Hardcoded: `bg-[#0066cc]`
- Visual styles in screensets: `text-lg font-bold text-blue-600`
- Inline styles: `style={{ color: '#fff' }}`

**GOOD:**
- Theme tokens: `bg-primary`
- UI Kit components: `<Text variant="heading">`
- Layout only: `flex gap-md`
