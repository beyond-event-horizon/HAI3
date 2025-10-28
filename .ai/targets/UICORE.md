# UI Core Guidelines

> Common rules: .ai/GUIDELINES.md | Styling: .ai/targets/STYLING.md

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
- Wrap UI Kit composites, add Redux
- BAD: Component reimplements DropdownMenu + Button
- GOOD: Component uses SimpleSelect/CascadingSelect
- If duplicating UI logic -> extract to UI Kit composite first

**Domain Slice:**
- State: `visible: boolean`, Actions: `setDomainConfig`, `setDomainVisible`
- Types in slice (vertical slice: MenuItem in menuSlice)

---

## Domain Orchestration (AI: READ THIS)

**Pattern:**
- Domain with UI controls orchestrates related state
- Footer: watches theme -> applies, watches screenset -> updates Menu
- Screen: watches selectedScreen -> renders

**CRITICAL: Data Provider vs Behavior Controller**
- Orchestration = providing DATA, NOT controlling BEHAVIOR
- BAD: Footer sets Menu.visible, onClick, selectedScreen
- GOOD: Footer sets Menu.items (data only)
- BAD: Domain A creates handlers for Domain B
- GOOD: Domain B handles its own interactions
- Rule: Provide data to other domains, NOT control their behavior

**Services:** See GUIDELINES.md Self-Registering Registries
- Domains consume, NO App calls

**Anti-Patterns:**
- BAD: `<Layout logo={x}/>` GOOD: `<Layout/>`
- BAD: `{show && <Menu/>}` GOOD: `<Menu/>`
- BAD: `useState` GOOD: Redux
- BAD: App bridging GOOD: Domain orchestration
