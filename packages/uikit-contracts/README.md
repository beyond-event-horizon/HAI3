# @hai3/uikit-contracts

Type-safe contract definitions for the HAI3 UI framework.

## Overview

`@hai3/uikit-contracts` provides TypeScript interfaces and type definitions that establish a contract layer between UI Core and UI Kit packages. This separation prevents circular dependencies while maintaining strict type safety across the framework.

## Purpose

This package serves as a shared type system that enables loose coupling between framework layers. By defining interfaces separately from implementations, it allows UI Core to specify requirements without depending on concrete UI Kit implementations, and enables UI Kit to satisfy those requirements without depending on UI Core internals.

## Architecture Role

The contracts package sits at the foundation of the dependency hierarchy with zero runtime dependencies. Both UI Core and UI Kit depend on contracts, but not on each other. Application code typically consumes these types indirectly through re-exports from UI Core.

**Dependency Flow:**
- UI Core imports contracts to define component expectations
- UI Kit imports contracts to implement component interfaces
- Applications import through UI Core's public API

## Package Contents

### Component Contracts

Defines the complete set of framework UI components through enums and mapped types. Includes prop interfaces and component type definitions for buttons, switches, inputs, and layout elements. The enum-based approach eliminates duplication and ensures consistent naming across the framework.

### Icon Contracts

Provides type definitions for core framework icons and icon registration mechanisms. Establishes the contract for icon providers to implement and frameworks to consume.

### Theme Contracts

Specifies the structure that all theme implementations must follow. Defines token types for colors, typography, spacing, and other design system primitives.

## Usage Patterns

### Indirect Consumption (Recommended)

Most applications consume contracts indirectly through the UI Core package, which re-exports necessary types. This approach maintains proper abstraction boundaries and reduces direct dependencies.

### Direct Import (Framework Extensions)

When building custom UI Kit implementations or framework extensions, import directly from this package to access base interfaces and contracts.

## Installation

```bash
npm install @hai3/uikit-contracts
```

This package has zero runtime dependencies and serves purely as a type definition layer.

## Versioning Policy

### Breaking Changes
- Adding required properties to existing interfaces
- Removing properties from interfaces
- Modifying theme structure
- Removing enum values

### Non-Breaking Changes
- Adding optional properties
- Introducing new component contracts
- Adding new enum values

## Version

**Alpha Release** (`0.1.0-alpha.0`) - APIs may change before stable release.

## License

Apache-2.0

## Related Packages

- [`@hai3/uicore`](../uicore) - Core framework implementation
- [`@hai3/uikit`](../uikit) - Reference UI component library
