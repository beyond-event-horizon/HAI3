# @hai3/uikit-contracts

UI Kit contract definitions for the HAI3 framework.

## Purpose

This package provides TypeScript interfaces and type definitions that serve as a contract layer between `@hai3/uicore` and `@hai3/uikit`, preventing circular dependencies while ensuring type safety.

## Architecture

```
@hai3/uikit-contracts (no runtime deps)
        ↑           ↑
        |           |
    uicore       uikit
```

- **UI Core** imports contracts to define what it expects from UI implementations
- **UI Kit** imports contracts to implement the required interfaces
- **Apps** consume contracts through `@hai3/uicore` (re-exported)

## Contents

### Component Contracts

- `UiKitComponent` - Enum of framework component names (single source of truth)
- `UiKitComponentMap` - Maps enum values to component types
- Component prop interfaces (ButtonProps, SwitchProps, etc.)
- Component type definitions (ButtonComponent, SwitchComponent, etc.)
- Uses enum values as computed property names to eliminate duplication

### Icon Contracts

- `UiKitIcon` - Enum of core framework icon IDs
- Icon registration types

### Theme Contracts

- `Theme` - Structure that all themes must implement
- Theme token types

## Dependencies

- **Zero runtime dependencies** - Types only
- `react` - Peer dependency (types only)

## Usage

This package is typically consumed indirectly through `@hai3/uicore`:

```typescript
import { UiKitComponent, UiKitIcon } from '@hai3/uicore';
```

Direct import (for UI Kit implementations):

```typescript
import type { ButtonProps, ButtonComponent } from '@hai3/uikit-contracts';
```

## Versioning

Breaking changes include:
- Adding required props to existing interfaces
- Removing props from interfaces  
- Changing Theme structure
- Removing enum values

Non-breaking changes:
- Adding optional props
- Adding new component contracts
- Adding new enum values

## License

ISC
