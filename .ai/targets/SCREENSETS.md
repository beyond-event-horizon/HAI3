# UI Screensets Development Guidelines

> Read .ai/GUIDELINES.md for common rules

# CRITICAL RULES (AI: READ THIS)

**Stack:**
- Redux Toolkit (screenset-specific slices with "Slice" suffix)
- UI Kit from `@hai3/uikit`, UI Core from `@hai3/uicore`

**Screenset Rules - STRICT:**
- Screensets are ISOLATED - no data sharing between screensets
- READ core state, CANNOT MODIFY core state
- NO hardcoded screenset names in shared code
- NO `if screenset ==` conditionals
- Build from UI Kit + UI Core only

**Navigation & Menu (AI: READ THIS):**
- Menu items (data) = defined in app (src/App.tsx), NOT in UI Core
- MenuItem type = from `@hai3/uikit` (re-exported by @hai3/uicore)
- Screens/routes = app-specific (src/screensets/), NOT in packages
- UI Core provides Menu *container*, app provides menu *content*

**UI Kit & Themes:**
- Use existing global UI Kit components from `@hai3/uikit`
- CANNOT modify existing global UI Kit components
- CANNOT add NEW global UI Kit components (only by explicit human request)
- CAN create LOCAL UI Kit in `screensets/[name]/uikit/` (AI: READ THIS)
- CAN add NEW themes (follow .ai/targets/THEMES.md)
- CANNOT modify existing themes
- NO hardcoded colors - use theme tokens

**Local UI Kit (AI: READ THIS):**
- ONLY composite components (wrap/combine global components)
- NO new base components in screenset
- KEEP local by default - NEVER promote without explicit human request
- Use when global UI Kit missing component

**Building Screens:**
- Screen = global UI Kit + local uikit (if needed) + business logic + screenset state
- Styling: ONLY layout (flex, grid, gap) - NO visual styles (see STYLING.md)

**Data Simulation:**
- Mock data + API simulation with setTimeout
- Handle loading/error states

**Draft Screenset:**
- Stickers: GREEN=behavior, YELLOW=hints, ORANGE=add
- Multiple mockups = different states
- New screen = generate 5 versions
