# Styling Guidelines

> Common rules: .ai/GUIDELINES.md

## CRITICAL (AI: READ THIS FIRST)

**Responsibility:**
- Base: ALL visual
- Composite/Core/Screensets: ONLY layout
- NO hardcoded values, states in base only

**Units:**
- MUST: rem-based units
- BAD: `min-w-[160px]`
- GOOD: `min-w-40`
- Pixels ONLY for borders

**Hierarchy:** Tokens -> Themes -> Base -> Composite -> Core

**Responsive:** Mobile-first, Tailwind prefixes

**Dark Mode:** CSS variables via `data-theme`

**Anti-Patterns:**
- BAD: `bg-[#0066cc]`, inline styles
- GOOD: `bg-primary`, `flex gap-md`
