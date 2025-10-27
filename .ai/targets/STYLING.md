# Styling Guidelines

> Common rules: .ai/GUIDELINES.md

# CRITICAL (AI: READ THIS)

**Hierarchy:** Tokens -> Themes -> Base -> Composite -> Core/Screensets

**Responsibility:**
- Base: ALL visual (colors, typography, borders, shadows, states)
- Composite: ONLY layout of base (flex, grid, gap)
- Core/Screensets: ONLY layout of UI Kit (flex, grid, gap)
- Themes: Token values (hex, rem, fonts)

**Rules:**
- NO hardcoded values
- Base uses theme tokens
- Composite/Core/Screensets ONLY layout
- States in base only

**Units (AI: READ THIS - CRITICAL):**
- Use rem-based units for theme responsiveness
- BAD: `min-w-[160px]` (fixed pixels, doesn't scale with theme)
- GOOD: `min-w-40` (10rem, scales with root font size)
- Tailwind spacing classes = rem-based (theme-responsive)
- Pixels ONLY for borders (1px) or fixed assets

**Tokens:** colors, spacing, typography, radius, shadows, z-index, transitions

**Responsive:** Mobile-first, Tailwind prefixes (`md:`, `lg:`)

**Dark Mode:** CSS variables via `data-theme`, both modes required

**Anti-Patterns:**
- BAD: `bg-[#0066cc]`, `text-lg font-bold text-blue-600`, inline styles
- GOOD: `bg-primary`, `<Text variant="heading">`, `flex gap-md`
