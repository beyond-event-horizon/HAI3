# Developer Tools Package Specification

## ADDED Requirements

### Requirement: Floating Panel Component

The system SHALL provide a `DevToolsPanel` component that renders as a floating overlay on top of the application.

#### Scenario: Panel renders as overlay
- **WHEN** DevToolsPanel is mounted in development mode
- **THEN** the panel renders as a floating div with fixed positioning
- **AND** the panel appears above all other UI elements (z-index > 1000)
- **AND** the panel has glassmorphic styling (semi-transparent background with backdrop blur)

#### Scenario: Panel does not render in production
- **WHEN** application is built for production (`import.meta.env.PROD === true`)
- **THEN** DevToolsPanel code is tree-shaken and excluded from bundle
- **AND** no devtools-related code executes in production

### Requirement: Drag and Drop Positioning

The system SHALL allow users to drag the DevToolsPanel to any position on the viewport.

#### Scenario: User drags panel by header
- **WHEN** user clicks and holds on the panel header
- **AND** moves the mouse cursor
- **THEN** the panel follows the cursor position
- **AND** the panel remains within viewport boundaries (does not go off-screen)

#### Scenario: Panel position persists across sessions
- **WHEN** user drags panel to a new position
- **THEN** the position is saved to localStorage as `hai3:devtools:position`
- **AND** when page reloads, panel appears at the saved position

### Requirement: Resizable Panel

The system SHALL allow users to resize the DevToolsPanel by dragging edges or corners.

#### Scenario: User resizes panel
- **WHEN** user drags the bottom-right corner resize handle
- **THEN** the panel width and height adjust in real-time
- **AND** minimum dimensions are enforced (320px width, 400px height)
- **AND** maximum dimensions are enforced (600px width, 800px height)

#### Scenario: Panel size persists across sessions
- **WHEN** user resizes the panel
- **THEN** the dimensions are saved to localStorage as `hai3:devtools:size`
- **AND** when page reloads, panel renders with saved dimensions

### Requirement: Collapsible State

The system SHALL allow users to collapse the DevToolsPanel to minimize visual obstruction.

#### Scenario: User collapses panel
- **WHEN** user clicks the collapse button in panel header
- **THEN** the full panel disappears
- **AND** a small circular button (40px diameter) appears in the bottom-right corner
- **AND** the button displays a recognizable icon (e.g., wrench or dev tools icon)

#### Scenario: User expands collapsed panel
- **WHEN** user clicks the circular button in bottom-right corner
- **THEN** the full panel re-appears at its previous position
- **AND** the circular button disappears

#### Scenario: Collapsed state persists
- **WHEN** user collapses or expands the panel
- **THEN** the state is saved to localStorage as `hai3:devtools:collapsed`
- **AND** when page reloads, panel restores the collapsed/expanded state

### Requirement: Keyboard Shortcuts

The system SHALL provide keyboard shortcuts for toggling the DevToolsPanel visibility.

#### Scenario: User presses keyboard shortcut
- **WHEN** user presses `Ctrl+Shift+D` on Windows/Linux or `Cmd+Shift+D` on macOS
- **THEN** if panel is visible, it becomes hidden
- **AND** if panel is hidden, it becomes visible
- **AND** focus returns to the previously focused element after toggle

### Requirement: Theme Control Section

The system SHALL provide a theme selector control within the DevToolsPanel.

#### Scenario: User changes theme
- **WHEN** user selects a different theme from the dropdown
- **THEN** the `changeTheme` action is dispatched with the selected theme name
- **AND** the application theme updates immediately
- **AND** the current theme is displayed in the dropdown button label

#### Scenario: Available themes are loaded
- **WHEN** DevToolsPanel mounts
- **THEN** theme options are fetched from `themeRegistry.getThemeNames()`
- **AND** all registered themes appear in the dropdown menu

### Requirement: Screenset Control Section

The system SHALL provide a screenset selector control within the DevToolsPanel.

#### Scenario: User switches screenset
- **WHEN** user selects a different screenset from the dropdown
- **THEN** the `selectScreenset` action is dispatched with the screenset ID
- **AND** the application navigates to the selected screenset's default screen
- **AND** the current screenset is displayed in the dropdown button label

#### Scenario: Screenset options are categorized
- **WHEN** DevToolsPanel renders the screenset selector
- **THEN** screensets are grouped by category (Drafts, Mockups, Production)
- **AND** category headers appear in the dropdown menu
- **AND** each screenset shows its name and category badge

### Requirement: Language Control Section

The system SHALL provide a language selector control within the DevToolsPanel.

#### Scenario: User changes language
- **WHEN** user selects a different language from the dropdown
- **THEN** the `changeLanguage` action is dispatched with the language code
- **AND** all translated UI text updates to the selected language
- **AND** the current language name is displayed in the dropdown button label

#### Scenario: Languages display in native script
- **WHEN** DevToolsPanel renders the language selector
- **THEN** each language option displays its name in native script (e.g., "Español", "日本語")
- **AND** language options are sorted alphabetically by English name

### Requirement: API Mode Control Section

The system SHALL provide an API mode toggle control within the DevToolsPanel.

#### Scenario: User toggles API mode to mock
- **WHEN** user clicks the "Mock API" toggle button
- **THEN** the `ApiEvents.ModeChanged` event is emitted with mode `'mock'`
- **AND** API services switch to returning mock data
- **AND** the toggle button displays "Using Mock API" in active state

#### Scenario: User toggles API mode to real
- **WHEN** user clicks the "Mock API" toggle button while in mock mode
- **THEN** the `ApiEvents.ModeChanged` event is emitted with mode `'real'`
- **AND** API services switch to making real HTTP requests
- **AND** the toggle button displays "Using Real API" in inactive state

### Requirement: UIKit Component Usage

The system SHALL use UIKit components via direct imports from `@hai3/uikit` for all UI elements in the DevToolsPanel.

#### Scenario: Panel uses UIKit Card component
- **WHEN** DevToolsPanel is rendered
- **THEN** the main panel container uses Card component imported directly from `@hai3/uikit`
- **AND** the component is imported at build time (not via registry)
- **AND** tree-shaking eliminates these components in production builds

#### Scenario: Buttons use UIKit Button component
- **WHEN** DevToolsPanel renders buttons (collapse, close, etc.)
- **THEN** all buttons are imported directly from `@hai3/uikit`
- **AND** button variants are from `ButtonVariant` enum in `@hai3/uikit-contracts`
- **AND** no custom button elements are used

#### Scenario: Selectors use UIKit DropdownMenu
- **WHEN** ThemeSelector, ScreensetSelector, and LanguageSelector are rendered
- **THEN** they import DropdownMenu directly from `@hai3/uikit`
- **AND** they import DropdownButton and DropdownMenuItem directly from `@hai3/uikit`
- **AND** no registry lookups are performed

#### Scenario: ScrollArea uses UIKit component
- **WHEN** ControlPanel renders scrollable content
- **THEN** it imports ScrollArea directly from `@hai3/uikit`
- **AND** no fallback to native scrolling is needed (component always available)

### Requirement: Glassmorphic Styling

The system SHALL style the DevToolsPanel with modern glassmorphism design patterns.

#### Scenario: Panel has glassmorphic appearance
- **WHEN** DevToolsPanel is rendered
- **THEN** the panel background has 80% opacity
- **AND** the panel has backdrop-filter blur effect (16px blur)
- **AND** the panel has a subtle border with low opacity
- **AND** the panel has rounded corners (12px border-radius)
- **AND** the panel casts a soft shadow for depth

### Requirement: Package Independence

The system SHALL implement the devtools package as a standalone workspace package that can be excluded from production builds.

#### Scenario: Package is in monorepo workspaces
- **WHEN** package.json is read
- **THEN** `packages/devtools` is listed in workspaces array
- **AND** the package has name `@hai3/devtools`
- **AND** the package has its own package.json, tsconfig.json, and build configuration

#### Scenario: Package dependencies
- **WHEN** `@hai3/devtools` package.json is inspected
- **THEN** it depends on `@hai3/uikit-contracts` for type definitions (ButtonVariant, etc.)
- **AND** it depends on `@hai3/uicore` for Redux hooks, actions, registries, and events
- **AND** it depends on `@hai3/uikit` for direct component imports
- **AND** it has peerDependencies on `react` and `react-dom`

#### Scenario: Direct uikit dependency is safe for production
- **WHEN** application is built for production with `vite build`
- **THEN** the conditional import `if (import.meta.env.DEV)` is eliminated by tree-shaking
- **AND** the entire `@hai3/devtools` package is excluded from bundle
- **AND** all `@hai3/uikit` components imported by devtools are also excluded
- **AND** platforms do not need to register devtools-specific components

#### Scenario: Package exports are tree-shakeable
- **WHEN** package is built with tsup
- **THEN** package.json has `"type": "module"` and `"sideEffects": false`
- **AND** exports use ESM format for optimal tree-shaking
- **AND** individual exports are granular (not barrel exports)

### Requirement: Conditional Loading

The system SHALL load the devtools package only in development mode using conditional imports.

#### Scenario: DevTools loads in development
- **WHEN** application runs with `import.meta.env.DEV === true`
- **THEN** DevToolsOverlay component is dynamically imported
- **AND** DevToolsOverlay is rendered in the React tree
- **AND** devtools panel becomes available to users

#### Scenario: DevTools excluded in production
- **WHEN** application is built with `vite build` for production
- **THEN** the conditional import branch is eliminated by tree-shaking
- **AND** the `@hai3/devtools` package code is completely excluded from bundle
- **AND** no devtools-related code or styles are in production build

#### Scenario: Conditional import uses dynamic import
- **WHEN** devtools is loaded in development mode
- **THEN** the import uses dynamic `import()` syntax for code-splitting
- **AND** devtools bundle is loaded as a separate chunk
- **AND** main bundle does not include devtools code even in development
