# Styling Guidelines

> Common rules: .ai/GUIDELINES.md

# CRITICAL (AI: READ THIS)

**Hierarchy:** Tokens -> Themes -> Base -> Composite -> Core

**Responsibility:**
- Base: ALL visual
- Composite/Core/Screensets: ONLY layout
- NO hardcoded values, states in base only

**Units (AI: READ THIS - CRITICAL):**
- Use rem-based units for theme responsiveness
- BAD: `min-w-[160px]` (fixed pixels, doesn't scale with theme)
- GOOD: `min-w-40` (10rem, scales with root font size)
- Tailwind spacing classes = rem-based (theme-responsive)
- Pixels ONLY for borders (1px) or fixed assets

**Responsive:** Mobile-first, Tailwind prefixes

**Dark Mode:** CSS variables via `data-theme`

**Anti-Patterns:**
- BAD: `bg-[#0066cc]`, inline styles
- GOOD: `bg-primary`, `flex gap-md`
