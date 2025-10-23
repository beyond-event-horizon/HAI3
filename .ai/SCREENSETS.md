# UI Screensets Development Guidelines

> Read .ai/GUIDELINES.md for common rules

# CRITICAL RULES (AI: READ THIS)

**Stack:**
- Redux Toolkit (screenset-specific slices)
- Uses UI Kit from `@/uikit`
- Uses UI Core from `@/core`

**Files:**
- `screensets/[name]/screens/[screen]/ScreenComponent.tsx` = screen component
- `screensets/[name]/screens/[screen]/screenSlice.ts` = screen state
- `screensets/[name]/data.ts` = mock data
- `screensets/[name]/api.ts` = API simulation
- Export slices with "Slice" suffix (userListSlice)

**Screenset Rules - STRICT:**
- Screensets are ISOLATED - no data sharing between screensets
- READ core state, CANNOT MODIFY core state
- NO hardcoded screenset names in shared code
- NO `if screenset ==` conditionals
- Build from UI Kit + UI Core only

**UI Kit & Themes:**
- CAN add NEW UI Kit components (follow .ai/UIKIT.md)
- CANNOT modify existing UI Kit components
- CAN add NEW themes (follow .ai/THEMES.md)
- CANNOT modify existing themes
- NO hardcoded colors - use theme tokens

**Building Screens:**
- ALWAYS use UI Kit components
- Use UI Core Layout (Header, Footer, Menu, Sidebar)
- Screen = UI Kit + business logic + screenset state
- Styling: ONLY layout (flex, grid, gap) - NO visual styles (see .ai/STYLING.md)

**Data Simulation:**
- Mock data in `data.ts`
- API simulation in `api.ts`
- Simulate async with setTimeout
- Handle loading/error states

**Draft Screenset:**
- Wireframes, NOT pixel-perfect
- Stickers: GREEN=behavior, YELLOW=hints, ORANGE=add
- Multiple mockups = different states
- New screen = generate 5 versions
