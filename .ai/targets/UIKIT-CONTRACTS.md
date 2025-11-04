# UI Kit Contracts Guidelines

> Common: .ai/GUIDELINES.md

## CRITICAL (AI: READ THIS FIRST)

**Package:** `@hai3/uikit-contracts`

**Purpose:**
- Interface layer between UI Core and UI Kit
- NO circular dependencies
- Type-safe contracts only, zero runtime code
- Single source of truth for component/icon types

**Dependency Graph:**
```
uikit-contracts (no deps)
    ^           ^
    |           |
  uicore      uikit
```

**What Goes Here:**
- UiKitComponent enum (component names - single source of truth)
- UiKitComponentMap interface (maps enum values to component types)
- Component prop interfaces (ButtonProps, SwitchProps, etc)
- UiKitIcon enum (core framework icon IDs)
- Theme interface (structure of theme objects)
- NEVER: React components, implementations, runtime logic

**What Stays Out:**
- FORBIDDEN: React imports, component implementations
- FORBIDDEN: Business logic, Redux, state management
- FORBIDDEN: Styling, Tailwind, CSS
- GOOD: Pure TypeScript types and enums only

## Rules (AI: READ THIS)

**Adding Component Contract:**
1. Add to UiKitComponent enum: `X = 'X',`
2. Add prop interface: `export interface XProps { ... }`
3. Add component type: `export type XComponent = React.FC<XProps>;`
4. Add to UiKitComponentMap: `[UiKitComponent.X]: XComponent;`
5. Enum is single source of truth - no string duplication
6. NO modification to registry service (Open/Closed)

**Icon IDs:**
- Core framework icons: Add to UiKitIcon enum
- Screenset-specific icons: Export constants in screenset
- NEVER: Hardcoded strings for icon IDs

**Theme Contract:**
- Defines structure UI Core expects
- UI Kit MUST implement matching structure
- Modifying requires version bump
- Apps MUST match structure

**Type Safety:**
- All props optional by default UNLESS required for functionality
- Component types use React.FC<Props> or FunctionComponent<Props>
- Enums for variants, NOT string unions
- FORBIDDEN: `any`, loose types

## Dependencies

**ZERO runtime dependencies:**
- peerDependencies: `react` (types only)
- devDependencies: TypeScript, tsup
- NO @radix-ui, NO styling libs, NO utilities

**Consumers:**
- `@hai3/uicore` depends on contracts
- `@hai3/uikit` depends on contracts
- Apps import via `@hai3/uicore` (re-exported)

## Versioning

**Breaking changes:**
- Adding required props to existing interfaces
- Removing props from interfaces
- Changing Theme structure
- Removing enum values

**Non-breaking:**
- Adding optional props
- Adding new component contracts
- Adding new enum values
- Documentation updates
