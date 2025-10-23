# UI Screensets Development Guidelines

> Rules for contributing to HAI3 Screensets (src/screensets)
> Read .ai/GUIDELINES.md for common rules

# Stack Specifics
- Redux Toolkit for state management (screenset-specific slices)
- Uses UI Kit components (see .ai/UIKIT.md)
- Uses UI Core (see .ai/CORE.md)
- Uses themes (see .ai/THEMES.md)

# Structure
```
src/
├── uikit/              # Business-logic-free components (USE THESE)
├── core/               # UI Core (USE, DO NOT MODIFY)
└── screensets/         # Your contribution target
    └── [name]/         # Screenset name
        ├── screens/    # Screen folders
        │   └── [screen]/
        │       ├── ScreenComponent.tsx
        │       ├── screenSlice.ts
        │       └── index.ts
        ├── data.ts     # Simulated data
        ├── api.ts      # API simulation layer
        └── store.ts    # Optional: combine reducers
```

# UI Screensets - Core Concept
- Independent variants in `src/screensets/[name]`
- Develop in screenset, NOT global (unless specified)
- Vertical slices = components + logic + data
- Build from UI Kit + UI Core
- Each screenset is isolated from others

## Screenset Pattern
```
screensets/[name]/
├── screens/
│   └── [screen]/
│       ├── ScreenComponent.tsx
│       ├── screenSlice.ts
│       └── index.ts
├── data.ts     # simulated data
├── api.ts      # API simulation layer
└── store.ts    # optional: combine reducers
```

# Screenset Rules
- Export slices with "Slice" suffix (e.g., `userListSlice`)
- Screensets READ core state, CANNOT MODIFY core state
- NO data sharing between screensets
- Can use global actions/data from core
- NO hardcoded screenset names in shared logic
- NO `if screenset ==` conditionals in shared code

## UI Kit & Themes - IMPORTANT
When working on screensets:

**UI Kit Components:**
- **ALLOWED:** Add NEW components (follow .ai/UIKIT.md)
- **FORBIDDEN:** Modify existing components (unless explicitly prompted)

**Themes:**
- **ALLOWED:** Add NEW themes (follow .ai/THEMES.md)
- **FORBIDDEN:** Modify existing themes (unless explicitly prompted)

# Building Screens
- ALWAYS use components from UI Kit (`src/uikit`)
- If no suitable component exists, ADD new one (see .ai/UIKIT.md)
- DO NOT modify existing UI Kit components (unless explicitly prompted)
- Use UI Core Layout components (Header, Footer, Menu, Sidebar, etc.)
- Build screen = UIKit components + business logic + screenset state

# Styles
- Use existing themes from `/src/styles/themes`
- Can ADD new themes if needed (see .ai/THEMES.md)
- DO NOT modify existing themes (unless explicitly prompted)
- NO hardcoded colors/fonts - use theme tokens

# Draft Screenset (`src/screensets/drafts`)
- Mockups = wireframes, NOT pixel-perfect designs
- Use stickers for annotations:
  - GREEN = behavior specification
  - YELLOW = implementation hints
  - ORANGE = functionality to add
- Multiple mockups = different states of same screen
- New screen request = generate 5 different versions first

# Data & API Simulation
- Use `data.ts` for mock data
- Use `api.ts` for API simulation layer
- Simulate async operations with setTimeout
- Return realistic data structures
- Handle loading/error states

# Reference Documents
- **docs/MANIFEST.md** - Core philosophy, principles, and vision
- **docs/MODEL.md** - Domain models and glossary
- **.ai/UIKIT.md** - UI Kit component guidelines (for adding components)
- **.ai/THEMES.md** - Theming guidelines (for adding themes)
- **.ai/CORE.md** - UI Core guidelines (for using layout components)
