# Screen Rendering Specification Delta

## ADDED Requirements

### Requirement: Lazy Component Rendering

The Screen component MUST render all screen components with React Suspense for async loading.

#### Scenario: Rendering lazy-loaded screen

- **WHEN** the Screen component receives a lazy loader function from the screenset registry
- **THEN** the component wraps it with `React.lazy()`
- **AND** renders it within a Suspense boundary
- **AND** displays a loading fallback during chunk download
- **AND** renders the screen component once loaded

#### Scenario: No runtime type checking needed

- **WHEN** the Screen component processes a screen definition
- **THEN** it treats all screens as lazy loaders
- **AND** no runtime type checking is performed
- **AND** TypeScript ensures type safety at compile time

### Requirement: Loading Fallback UI

The system MUST provide a consistent loading fallback UI during lazy screen loading.

#### Scenario: Loading state visibility

- **WHEN** a lazy screen is being loaded
- **THEN** a loading indicator is displayed in the screen area
- **AND** the indicator respects the current theme tokens
- **AND** the indicator does not cause layout shift

#### Scenario: Fast loading (no flash)

- **WHEN** a lazy screen loads quickly (< 150ms)
- **THEN** the loading indicator uses CSS transition with delay
- **AND** no jarring flash of loading state occurs
- **AND** user experience remains smooth

#### Scenario: Slow loading (spinner visible)

- **WHEN** a lazy screen takes longer than 150ms to load
- **THEN** the loading indicator becomes visible
- **AND** the user receives feedback that loading is in progress
- **AND** the spinner continues until component is ready

### Requirement: Error Handling for Lazy Loading

The system MUST handle errors that occur during lazy screen loading gracefully.

#### Scenario: Chunk load failure

- **WHEN** a lazy screen chunk fails to load (network error, 404)
- **THEN** the error propagates to the nearest error boundary
- **AND** the application error boundary handles the error
- **AND** the user receives appropriate error feedback

#### Scenario: Invalid component export

- **WHEN** a lazy loader resolves but the default export is invalid
- **THEN** the error propagates to the error boundary
- **AND** development console shows clear error message
- **AND** the application remains functional for other screens

### Requirement: Performance Optimization

The lazy loading implementation MUST improve application performance without degrading user experience.

#### Scenario: Bundle size reduction

- **WHEN** screens are defined with lazy loaders
- **THEN** Vite creates separate chunk files for each screen
- **AND** the main bundle size is reduced
- **AND** chunks are optimally sized for HTTP/2 delivery

#### Scenario: Navigation performance

- **WHEN** navigating between screens
- **THEN** lazy screens load with minimal delay
- **AND** eager screens load instantly
- **AND** navigation feels responsive regardless of screen type

#### Scenario: Memory efficiency

- **WHEN** multiple screens are lazily loaded during a session
- **THEN** loaded chunks remain in browser cache
- **AND** subsequent navigations to same screen are instant
- **AND** no redundant chunk downloads occur

### Requirement: Integration with Existing Architecture

The lazy loading implementation MUST integrate seamlessly with HAI3's event-driven architecture and registry pattern.

#### Scenario: Event-driven navigation

- **WHEN** navigation events trigger screen changes
- **THEN** lazy loading works correctly with navigation actions
- **AND** `NavigationEvents.ScreenNavigated` fires appropriately
- **AND** Redux state updates reflect screen transitions

#### Scenario: Screenset registry integration

- **WHEN** the screenset registry provides screen definitions
- **THEN** the Screen component handles both types from registry
- **AND** registry methods (`getScreens()`) work with lazy loaders
- **AND** no changes to registry API are required

#### Scenario: Router synchronization

- **WHEN** URL changes trigger screen rendering
- **THEN** lazy screens load and URL updates correctly
- **AND** browser back/forward buttons work with lazy screens
- **AND** direct URL access to lazy screens works correctly
