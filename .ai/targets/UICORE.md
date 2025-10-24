# UI Core Development Guidelines

> Read .ai/GUIDELINES.md for common rules

# CRITICAL RULES (AI: READ THIS)

**Stack:**
- Redux Toolkit for state management
- Uses UI Kit from `@/uikit` (see .ai/targets/UIKIT.md)

**Domain Pattern - STRICT:**
1. NO prop drilling - Redux ONLY
2. Domains self-contained: Component + slice + config
3. Orchestrators ONLY accept `children` - NO domain props
4. Domains wrap UI Kit components
5. Domains self-hide via `visible: boolean` in slice
6. Styling: ONLY layout (flex, grid, gap) - NO visual styles (see .ai/targets/STYLING.md)

**Files:**
- `domains/[name]/Component.tsx` = useAppSelector, if (!visible) return null
- `domains/[name]/domainSlice.ts` = types + state + actions
- `domains/[name]/index.ts` = exports
- `coreSlice.ts` = global state (user, tenant, loading, error)
- `types.ts` = shared types

**Required Slice:**
- State MUST have `visible: boolean`
- Actions MUST have: setDomainConfig, setDomainVisible
- Init: `useEffect(() => dispatch(setDomainConfig({...config, visible:true})), [])`

**Types & Enums:**
- Domain types -> export from `domainSlice.ts`
- Global types -> `src/core/types.ts`
- Enums -> see GUIDELINES.md (vertical slice approach)

**Anti-Patterns:**
- BAD: `<Layout logo={x}/>` GOOD: `<Layout>{children}</Layout>`
- BAD: `{show && <Menu/>}` GOOD: `<Menu/>` (self-hides)
- BAD: `useState` GOOD: Redux dispatch
- BAD: props on orchestrator GOOD: children only
