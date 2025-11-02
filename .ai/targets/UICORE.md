# UI Core Guidelines

> Common: .ai/GUIDELINES.md | Styling: STYLING.md | Events: EVENTS.md

## CRITICAL (AI: READ THIS FIRST)

**NEVER use raw HTML interactive elements:**
- FORBIDDEN: `<button>`, `<input>`, `<select>` in domains
- REQUIRED: `<Button>`, `<IconButton>` from `@hai3/uikit`
- Detect: grep for `<button|<input|<select` in `packages/uicore/`

**NEVER dispatch slice actions:**
- FORBIDDEN: `dispatch(setSelectedScreen())`
- REQUIRED: `navigateToScreen()` from `@/core/actions`

**Entry:**
- MUST: `<HAI3Provider>` wraps app
- Includes Redux Provider + AppRouter

**Routing:**
- URL: `/:screenId`
- Routes auto-generate from registered screensets
- NEVER: Hardcoded routes, manual sync

**Domain Rules:**
- NEVER: Prop drilling
- MUST: Self-contained component + slice
- MUST: Orchestrators accept only `children`
- MUST: Self-hide via `visible: boolean`
- Styling: Layout only (See STYLING.md)

**Domains:** Header, Footer, Menu, Sidebar, Screen, Popup, Overlay

**Domain vs Component:**
- Domain = Major layout section, own slice, one instance
- Component = Reusable widget, props config, reads/writes Redux

**Component Pattern:**
- MUST: Wrap UI Kit components + Redux
- NEVER: Reimplement UI Kit logic
- If duplicating -> extract to UI Kit composite

**Domain Slice:**
- State: `visible: boolean`, Actions: `setDomainConfig`, `setDomainVisible`
- Types in slice (vertical slice: MenuItem in menuSlice)

**Services:** See GUIDELINES.md Self-Registering Registries

**Anti-Patterns (grep for violations):**
- FORBIDDEN: `<Layout logo={x}/>` -> `<Layout/>`
- FORBIDDEN: `{show && <Menu/>}` -> `<Menu/>`
- FORBIDDEN: `useState` -> Redux
- FORBIDDEN: Direct cross-domain dispatch -> Event-driven
- FORBIDDEN: Eager init in `useEffect` -> Lazy init with cache
- FORBIDDEN: `useParams()` outside route -> Inside route element
