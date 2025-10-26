#UI Core Guidelines

> Common rules: .ai/GUIDELINES.md | Styling: .ai/targets/STYLING.md

# CRITICAL (AI: READ THIS)

**Domain Pattern:**
1. NO prop drilling - Redux ONLY
2. Self-contained: Component + slice
3. Orchestrators accept ONLY `children`
4. Wrap UI Kit components
5. Self-hide via `visible: boolean`
6. Styling: ONLY layout classes

**Domains:** Header, Footer, Menu, Sidebar, Screen, Popup, Overlay

**Domain vs Component:**
- Domain = Major layout section, own slice, one instance
- Component = Reusable widget, props config, reads/writes Redux

**Domain Slice Requirements:**
- State: `visible: boolean`
- Actions: `setDomainConfig`, `setDomainVisible`
- MenuItem type from `@hai3/uikit`

---

## Domain Orchestration (AI: READ THIS)

**Pattern:**
- Domain with UI controls orchestrates related state
- Footer has selectors -> orchestrates themes + screensets
- Footer watches layout.theme -> applies via themeService
- Footer watches layout.currentScreenset -> updates Menu
- Screen watches menu.selectedScreen -> renders from screensetService

**CRITICAL: Data Provider vs Behavior Controller**
- Orchestration = providing DATA, NOT controlling BEHAVIOR
- BAD: Footer sets Menu.visible, onClick, selectedScreen
- GOOD: Footer sets Menu.items (data only)
- BAD: Domain A creates handlers for Domain B
- GOOD: Domain B handles its own interactions
- Rule: Provide data to other domains, NOT control their behavior

**Services:**
- themeService, screensetService = registry management
- Apps register on import (self-registering)
- Domains consume services
- NO service calls in App

**Anti-Patterns:**
- BAD: `<Layout logo={x}/>` GOOD: `<Layout/>`
- BAD: `{show && <Menu/>}` GOOD: `<Menu/>`
- BAD: `useState` GOOD: Redux
- BAD: App bridging GOOD: Domain orchestration
