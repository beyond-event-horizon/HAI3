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
- Use existing global UI Kit components from `@/uikit`
- CANNOT modify existing global UI Kit components
- CANNOT add NEW global UI Kit components (only by explicit human request)
- CAN create LOCAL UI Kit in `screensets/[name]/uikit/` (AI: READ THIS)
- CAN add NEW themes (follow .ai/targets/THEMES.md)
- CANNOT modify existing themes
- NO hardcoded colors - use theme tokens

**Local UI Kit (AI: READ THIS):**
- Location: `screensets/[name]/uikit/[component]/Component.tsx`
- ONLY composite components allowed (wrap/combine global base/composite)
- NO new base components in screenset
- Use when component missing from global UI Kit
- KEEP local by default - NEVER promote to global without explicit human request
- Only human can decide if component should be global
- Follow same structure as global UI Kit composite components

**Building Screens:**
- Use global UI Kit components from `@/uikit`
- Use local UI Kit components from `./uikit` (if needed)
- Use UI Core Layout (Header, Footer, Menu, Sidebar)
- Screen = UI Kit + business logic + screenset state
- Styling: ONLY layout (flex, grid, gap) - NO visual styles (see .ai/targets/STYLING.md)

**Data Simulation:**
- Mock data in `data.ts`
- API simulation in `api.ts`
- Simulate async with setTimeout
- Handle loading/error states

**Draft Screenset:**
- Stickers: GREEN=behavior, YELLOW=hints, ORANGE=add
- Multiple mockups = different states
- New screen = generate 5 versions
