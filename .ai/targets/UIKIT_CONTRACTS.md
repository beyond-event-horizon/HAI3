# UI Kit Contracts Guidelines

> Common: .ai/GUIDELINES.md

## CRITICAL (AI: READ THIS FIRST)

**Package:** `@hai3/uikit-contracts`

**Content Rules:**
- REQUIRED: UiKitComponent enum (single source of truth)
- REQUIRED: UiKitComponentMap interface (enum-driven)
- REQUIRED: Component prop interfaces (ButtonProps, SwitchProps, etc)
- REQUIRED: UiKitIcon enum (core framework icon IDs)
- REQUIRED: Theme interface (structure of theme objects)
- FORBIDDEN: React components, implementations, runtime logic
- FORBIDDEN: React imports, component implementations
- FORBIDDEN: Business logic, Redux, state management
- FORBIDDEN: Styling, Tailwind, CSS
- GOOD: Pure TypeScript types and enums only

## Component Contracts (AI: READ THIS)

**Adding Component Contract:**
1. Add to UiKitComponent enum: `X = 'X',`
2. Add prop interface: `export interface XProps { ... }`
3. Add component type: `export type XComponent = React.FC<XProps>;`
4. Add to UiKitComponentMap: `[UiKitComponent.X]: XComponent;`
5. Enum is single source of truth - no string duplication
6. NO modification to registry service (Open/Closed)

**Type Safety:**
- All props optional by default UNLESS required for functionality
- Component types use React.FC<Props> or FunctionComponent<Props>
- Enums for variants, NOT string unions
- FORBIDDEN: `any`, loose types

## Icon Contracts

- Core framework icons: Add to UiKitIcon enum
- Screenset-specific icons: Export constants in screenset
- NEVER: Hardcoded strings for icon IDs

## Theme Contracts

- UI Kit MUST implement matching structure
- Modifying requires version bump
- Apps MUST match structure

## Dependencies

- REQUIRED: peerDependencies: `react` (types only)
- REQUIRED: devDependencies: TypeScript, tsup
- FORBIDDEN: @radix-ui, styling libs, utilities
- Consumers: `@hai3/uicore`, `@hai3/uikit` depend on contracts
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
