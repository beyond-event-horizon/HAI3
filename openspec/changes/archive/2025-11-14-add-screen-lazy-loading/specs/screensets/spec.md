# Screensets Specification Delta

## MODIFIED Requirements

### Requirement: Screen Component Definition

**BREAKING CHANGE:** The screenset configuration MUST require all screen components to be defined as lazy loaders using dynamic imports.

The `MenuScreenItem.screen` property type is changed from `React.ComponentType` to `ScreenLoader`, where `ScreenLoader` is defined as `() => Promise<{ default: React.ComponentType }>`.

#### Scenario: Screenset with lazy-loaded screen

- **WHEN** a screenset registers a screen with a loader function returning a Promise
- **THEN** the screen component is code-split into a separate chunk
- **AND** the chunk is loaded on-demand when the screen is navigated to
- **AND** the loader function matches the signature `() => Promise<{ default: React.ComponentType }>`
- **AND** TypeScript enforces this signature at compile time

#### Scenario: Attempting to use direct component reference

- **WHEN** a developer attempts to define a screen with a direct `React.ComponentType` reference
- **THEN** TypeScript compilation fails with a type error
- **AND** the error message indicates that a lazy loader function is required

#### Scenario: Multiple screens in screenset

- **WHEN** a screenset contains multiple screen definitions
- **THEN** all screens MUST use lazy loader functions
- **AND** navigation between screens works seamlessly
- **AND** each screen is loaded on-demand independently

## ADDED Requirements

### Requirement: Type Safety for Screen Loaders

The system MUST provide type-safe definitions for screen loaders that enforce correct import patterns.

#### Scenario: Type-checking lazy loader signature

- **WHEN** a developer defines a screen loader with incorrect signature
- **THEN** TypeScript compilation fails with clear error message
- **AND** the error indicates the expected signature format
- **AND** the error references the `ScreenLoader` type

#### Scenario: Correct dynamic import pattern

- **WHEN** a developer uses `() => import('./path/to/Screen')` pattern
- **THEN** TypeScript validates the loader signature
- **AND** the imported module MUST have a default export of type `React.ComponentType`
- **AND** compilation succeeds with no errors

### Requirement: Performance Consistency

All screens MUST be lazy-loaded to ensure consistent performance characteristics across the application.

#### Scenario: Bundle splitting for all screens

- **WHEN** the application is built for production
- **THEN** each screen component is bundled into a separate chunk
- **AND** the main bundle does not include any screen components
- **AND** bundle size is minimized

#### Scenario: On-demand loading

- **WHEN** a user navigates to a screen for the first time
- **THEN** the screen chunk is loaded asynchronously
- **AND** subsequent navigations to the same screen use the cached chunk
- **AND** no redundant network requests occur
