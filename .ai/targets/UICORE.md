# UI Core Guidelines

> Common: .ai/GUIDELINES.md | Data Flow: EVENTS.md | Styling: STYLING.md

## CRITICAL (AI: READ THIS FIRST)

**NEVER use raw HTML interactive elements:**
- FORBIDDEN: `<button>`, `<input>`, `<select>`
- REQUIRED: UI Kit components via registry
- Detect: grep for `<button|<input|<select` in `packages/uicore/`

**UI Kit Registry (AI: READ THIS - CRITICAL):**
- FORBIDDEN: Direct import from `@hai3/uikit`
- REQUIRED: `const Component = uikitRegistry.getComponent(UiKitComponent.Button)`
- REQUIRED: `const icon = uikitRegistry.getIcon(UiKitIcon.Close)`
- Detect: grep for `from '@hai3/uikit'` in `packages/uicore/src/`

**UI Kit Contracts (@hai3/uikit-contracts - AI: CRITICAL):**
- See UIKIT_CONTRACTS.md for full details
- Import from: `@hai3/uikit-contracts` (dependency)
- Re-exported by UI Core for app convenience

**Data Flow (AI: READ THIS - CRITICAL):**
- ONLY allowed: Event-driven architecture (See EVENTS.md)
- Pattern: Component -> Action -> Event -> Effect -> Slice -> Store
- FORBIDDEN: Direct slice dispatch, prop drilling, callbacks up
- REQUIRED: Import actions from `@hai3/uicore` or `@/core/actions`
- Components read Redux, emit via actions, NEVER dispatch directly
- Cross-domain: ONLY via events, NEVER via slice imports
- Example: `dispatch(navigateToScreen(id))` NOT `dispatch(setSelectedScreen(id))`
- Violations: grep for `dispatch(set[A-Z])` or `import.*Slice.*from`

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
