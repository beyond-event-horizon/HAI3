# UI Core Guidelines

> Common rules: .ai/GUIDELINES.md | Styling: .ai/targets/STYLING.md | Events: .ai/targets/EVENTS.md

**Entry Point (AI: READ THIS):**
- `<HAI3Provider>` wraps app (includes Redux Provider + AppRouter)
- BAD: Manual Provider/Router setup GOOD: `<HAI3Provider><App /></HAI3Provider>`

**Routing (AI: READ THIS - CRITICAL):**
- URL: `/:screenId` (screenset auto-detected)
- Routes auto-generate from registered screensets (lazy init prevents race)
- BAD: Direct dispatch `dispatch(setSelectedScreen())` GOOD: `navigateToScreen()`
- BAD: Hardcoded routes GOOD: Routes auto-generate
- BAD: RouterSync outside route GOOD: RouterSync inside route element (useParams requirement)

# CRITICAL (AI: READ THIS)

**Domain Pattern:**
1. NO prop drilling - Redux ONLY
2. Self-contained: Component + slice
3. Orchestrators accept ONLY `children`
4. Use UI Kit components (Button, IconButton) - NO raw HTML buttons/inputs
5. Self-hide via `visible: boolean`
6. Styling: ONLY layout classes

**CRITICAL RULE (AI: READ THIS):**
- BAD: `<button>`, `<input>`, `<select>` in domains
- GOOD: `<Button>`, `<IconButton>` from UI Kit
- Domains render layout HTML (`<header>`, `<nav>`, `<footer>`), use UI Kit for interactive elements

**Domains:** Header, Footer, Menu, Sidebar, Screen, Popup, Overlay

**Domain vs Component:**
- Domain = Major layout section, own slice, one instance
- Component = Reusable widget, props config, reads/writes Redux

**Component Pattern (AI: READ THIS):**
- Wrap UI Kit components, add Redux
- BAD: Component reimplements DropdownMenu + Button
- GOOD: Component uses DropdownMenu/CascadingDropdown from UI Kit
- If duplicating UI logic -> extract to UI Kit composite first

**Domain Slice:**
- State: `visible: boolean`, Actions: `setDomainConfig`, `setDomainVisible`
- Types in slice (vertical slice: MenuItem in menuSlice)

---

## Event-Driven Architecture (AI: READ THIS - CRITICAL)

**See EVENTS.md** - Domains communicate via events, NOT direct imports

**Quick Rules:**
- Dispatch actions from `@/core/actions`
- BAD: `import { setMenuItems } from '@/core/layout/domains/menu'`
- GOOD: Actions emit events → Effects subscribe → Update slices

**Services:** See GUIDELINES.md Self-Registering Registries
- Domains consume, NO App calls

**Anti-Patterns:**
- BAD: `<Layout logo={x}/>` GOOD: `<Layout/>`
- BAD: `{show && <Menu/>}` GOOD: `<Menu/>`
- BAD: `useState` GOOD: Redux
- BAD: Direct cross-domain dispatch GOOD: Event-driven actions
- BAD: Eager init in `useEffect` GOOD: Lazy init with cache + empty-check (see routeService)
- BAD: Domain makes navigation decisions GOOD: AppRouter handles routing, domains respond to events
- BAD: `useParams()` outside route GOOD: Component using `useParams()` must be inside route element
