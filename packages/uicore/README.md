# @hai3/uicore

Core framework package providing layout orchestration and state management for HAI3 applications.

## Overview

`@hai3/uicore` delivers the foundational architecture for building SaaS control panels and admin interfaces. The package provides a complete layout system, pre-configured Redux store with domain-based slices, event-driven state management, and component registries that enable loose coupling across the application.

## Purpose

This package establishes the core patterns and infrastructure that HAI3 applications build upon. It implements a domain-driven architecture where each layout region (header, footer, menu, sidebar, screen, overlay) manages its own state independently. Configuration flows through Redux actions rather than prop drilling, enabling clean separation between presentation and state.

## Architecture

### Layout System

Provides orchestrator components for all major application regions. Each layout domain is self-contained with its own Redux slice, actions, and effects. Domains automatically show or hide based on their configuration state, eliminating the need for conditional rendering in application code.

**Layout Domains:**
- **Header**: Top navigation and branding area
- **Footer**: Bottom utility area and links
- **Menu**: Primary navigation structure
- **Sidebar**: Contextual navigation or tools
- **Screen**: Main content area with routing
- **Popup**: Modal dialogs and overlays
- **Overlay**: Full-screen takeovers

### Redux Architecture

Ships with a pre-configured Redux store following domain-based slice organization. Each domain defines its own slice with reducers, actions, and selectors. The store supports dynamic reducer injection, allowing feature modules to register their state at runtime.

### Event-Driven Flux

Implements an event bus that decouples action creators from reducers. Actions emit events that effects listen to, enabling cross-cutting concerns like persistence, analytics, and synchronization without tight coupling. This pattern maintains unidirectional data flow while providing loose coupling benefits.

### Registry System

Provides registries for UI components, themes, icons, screensets, and routes. Registries follow the Open/Closed Principle - new items register themselves without modifying core code. This enables a plugin-style architecture where features can be added without central coordination.

## Core Capabilities

### State Management

Complete Redux Toolkit integration with TypeScript support, domain-based slices, and dynamic reducer registration. Includes action creators, selectors, and middleware for common patterns.

### Routing

Built-in routing system with lazy-loaded screens, route parameters, and automatic navigation state synchronization. Routes auto-register from screenset definitions.

### Internationalization

Multi-language support with lazy-loaded translations, automatic language detection, and screen-level localization. Includes utilities for translation key namespacing and fallback handling.

### API Integration

Service layer with domain-based API organization, mock/real implementation switching, and request/response interceptors. Supports both REST and GraphQL patterns.

### Theme Management

Dynamic theme switching with CSS custom properties, theme registry for multiple themes, and automatic theme persistence. Works seamlessly with UI Kit components.

## Installation

```bash
npm install @hai3/uicore @reduxjs/toolkit react-redux
```

### Required Peer Dependencies

The package requires Redux Toolkit and React:

```bash
npm install @reduxjs/toolkit react react-dom
```

## Integration Patterns

### Application Bootstrap

Applications wrap their root component with the HAI3 Provider, which initializes the Redux store, registers core services, and sets up the event bus. The provider handles automatic loading of the development overlay in development mode.

### Screenset Development

Build features as self-contained screensets that bundle screens, navigation, translations, and state management. Screensets register themselves with the framework at import time, enabling automatic discovery without manual wiring.

### State Configuration

Configure layout domains through action creators rather than component props. This keeps presentation logic separate from configuration and enables programmatic layout changes from any part of the application.

## Framework Philosophy

### Domain-Driven Design

Each layout region and business domain is self-contained with its own state, actions, and effects. Domains communicate through events rather than direct dependencies.

### Zero Prop Drilling

Configuration flows through Redux state, eliminating the need to pass props through component hierarchies. Orchestrator components accept only children.

### Self-Registration

Components, themes, and features register themselves at module import time. No central configuration file to maintain.

### Progressive Enhancement

The framework loads development tools in dev mode and tree-shakes them in production. Supports both mock and real API implementations for efficient development.

## TypeScript Support

Fully typed with strict TypeScript. Includes module augmentation patterns for extending core types in application code.

## Version

**Alpha Release** (`0.1.0-alpha.0`) - APIs may change before stable release.

## License

Apache-2.0

## Documentation

Full framework documentation: [HAI3 Documentation](https://github.com/HAI3org/HAI3)

## Related Packages

- [`@hai3/uikit-contracts`](../uikit-contracts) - Type definitions and contracts
- [`@hai3/uikit`](../uikit) - Reference component library
- [`@hai3/studio`](../studio) - Development tools overlay
- [`@hai3/cli`](../cli) - Project scaffolding tool
