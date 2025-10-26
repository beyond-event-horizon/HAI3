# UI Core Development Guidelines

> Read .ai/GUIDELINES.md for common rules

# CRITICAL RULES (AI: READ THIS)

**Stack:**
- Redux Toolkit for state management
- Imports UI Kit from `@hai3/uikit`

**Domain Pattern - STRICT:**
1. NO prop drilling - Redux ONLY
2. Domains self-contained: Component + slice + config
3. Orchestrators ONLY accept `children` - NO domain props
4. Domains wrap UI Kit components
5. Domains self-hide via `visible: boolean` in slice
6. Styling: ONLY layout (flex, grid, gap) - NO visual styles (see .ai/targets/STYLING.md)

**Domains:**
- Header, Footer, Menu, Sidebar, Screen, Popup, Overlay
- Each domain self-contained with own slice + component
- Self-hide via `visible: boolean` in Redux state

**Components (AI: READ THIS):**
- `components/` = Redux-aware reusable widgets (NOT domains)
- Take configuration via props, not Redux slices
- Can read/write Redux state (useAppSelector, useAppDispatch)
- Can be used in domains, apps, or anywhere
- Example: ThemeSelector (props: availableThemes, reads/writes: layout.theme)

**Decision Matrix (Domain vs Component):**
```
Create DOMAIN if:
- Major layout section (Header, Footer, Sidebar, Menu)
- Has complex state (items, position, collapsed, etc.)
- Needs own Redux slice
- Only one instance in layout

Create COMPONENT if:
- Small widget or control (ThemeSelector, Breadcrumbs, UserMenu)
- Simple configuration via props
- Reusable in multiple places
- Can read/write Redux but configured via props
```

**Required Domain Slice:**
- State MUST have `visible: boolean`
- Actions MUST have: setDomainConfig, setDomainVisible
- Init: `useEffect(() => dispatch(setDomainConfig({...config, visible:true})), [])`

**Types & Enums:**
- Enums in slice files (see GUIDELINES.md vertical slice approach)
- MenuItem type from `@hai3/uikit` (presentational type)

**Component Pattern Example:**
```tsx
// ThemeSelector: props (availableThemes) + Redux (reads layout.theme, dispatches setTheme)
<ThemeSelector availableThemes={state.footer.availableThemes} />
// App: dispatch(setFooterConfig({ availableThemes: Object.keys(themes) }))
```

**Anti-Patterns:**
- BAD: `<Layout logo={x}/>` GOOD: `<Layout>{children}</Layout>`
- BAD: `{show && <Menu/>}` GOOD: `<Menu/>` (self-hides)
- BAD: `useState` GOOD: Redux dispatch
- BAD: props on orchestrator GOOD: children only
