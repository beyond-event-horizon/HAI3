# studio Specification

## Purpose
TBD - created by archiving change add-studio-package. Update Purpose after archive.
## Requirements
### Requirement: Floating Panel Component

The system SHALL provide a `StudioPanel` component that renders as a floating overlay on top of the application.

#### Scenario: Panel renders as overlay
- **WHEN** StudioPanel is mounted in development mode
- **THEN** the panel renders as a floating div with fixed positioning
- **AND** the panel appears above all other UI elements (z-index > 1000)
- **AND** the panel has glassmorphic styling (semi-transparent background with backdrop blur)

#### Scenario: Panel does not render in production
- **WHEN** application is built for production (`import.meta.env.PROD === true`)
- **THEN** StudioPanel code is tree-shaken and excluded from bundle
- **AND** no studio-related code executes in production

### Requirement: Drag and Drop Positioning

The system SHALL allow users to drag the StudioPanel to any position on the viewport.

#### Scenario: User drags panel by header
- **WHEN** user clicks and holds on the panel header
- **AND** moves the mouse cursor
- **THEN** the panel follows the cursor position
- **AND** the panel remains within viewport boundaries (does not go off-screen)

#### Scenario: Panel position persists across sessions
- **WHEN** user drags panel to a new position
- **THEN** the position is saved to localStorage as `hai3:studio:position`
- **AND** when page reloads, panel appears at the saved position

### Requirement: Resizable Panel

The system SHALL allow users to resize the StudioPanel by dragging edges or corners.

#### Scenario: User resizes panel
- **WHEN** user drags the bottom-right corner resize handle
- **THEN** the panel width and height adjust in real-time
- **AND** minimum dimensions are enforced (320px width, 400px height)
- **AND** maximum dimensions are enforced (600px width, 800px height)

#### Scenario: Panel size persists across sessions
- **WHEN** user resizes the panel
- **THEN** the dimensions are saved to localStorage as `hai3:studio:size`
- **AND** when page reloads, panel renders with saved dimensions

### Requirement: Collapsible State

The system SHALL allow users to collapse the StudioPanel to minimize visual obstruction.

#### Scenario: User collapses panel
- **WHEN** user clicks the collapse button in panel header
- **THEN** the full panel disappears
- **AND** a circular glassmorphic button (48px diameter) appears
- **AND** the button displays a settings/sliders icon (StudioIcon)

#### Scenario: User expands collapsed panel
- **WHEN** user clicks the circular button in bottom-right corner
- **THEN** the full panel re-appears at its previous position
- **AND** the circular button disappears

#### Scenario: Collapsed state persists
- **WHEN** user collapses or expands the panel
- **THEN** the state is saved to localStorage as `hai3:studio:collapsed`
- **AND** when page reloads, panel restores the collapsed/expanded state

### Requirement: Keyboard Shortcuts

The system SHALL provide keyboard shortcuts for toggling the StudioPanel visibility.

#### Scenario: User presses keyboard shortcut
- **WHEN** user presses `Shift+`` ` ``** (tilde key)
- **THEN** if panel is collapsed, it expands
- **AND** if panel is expanded, it collapses
- **AND** focus returns to the previously focused element after toggle

### Requirement: Theme Control Section

The system SHALL provide a theme selector control within the StudioPanel.

#### Scenario: User changes theme
- **WHEN** user selects a different theme from the dropdown
- **THEN** the `changeTheme` action is dispatched with the selected theme name
- **AND** the application theme updates immediately
- **AND** the current theme is displayed in the dropdown button label

#### Scenario: Available themes are loaded
- **WHEN** StudioPanel mounts
- **THEN** theme options are fetched from `themeRegistry.getThemeNames()`
- **AND** all registered themes appear in the dropdown menu

### Requirement: Screenset Control Section

The system SHALL provide a screenset selector control within the StudioPanel.

#### Scenario: User switches screenset
- **WHEN** user selects a different screenset from the dropdown
- **THEN** the `selectScreenset` action is dispatched with the screenset ID
- **AND** the application navigates to the selected screenset's default screen
- **AND** the current screenset is displayed in the dropdown button label

#### Scenario: Screenset options are categorized
- **WHEN** StudioPanel renders the screenset selector
- **THEN** screensets are grouped by category (Drafts, Mockups, Production)
- **AND** category headers appear in the dropdown menu
- **AND** each screenset shows its name and category badge

### Requirement: Language Control Section

The system SHALL provide a language selector control within the StudioPanel.

#### Scenario: User changes language
- **WHEN** user selects a different language from the dropdown
- **THEN** the `changeLanguage` action is dispatched with the language code
- **AND** all translated UI text updates to the selected language
- **AND** the current language name is displayed in the dropdown button label

#### Scenario: Languages display in native script
- **WHEN** StudioPanel renders the language selector
- **THEN** each language option displays its name in native script (e.g., "Español", "日本語")
- **AND** language options are sorted alphabetically by English name

### Requirement: API Mode Control Section

The system SHALL provide an API mode toggle control within the StudioPanel.

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

The system SHALL use UIKit components via direct imports from `@hai3/uikit` for all UI elements in the StudioPanel.

#### Scenario: Panel uses UIKit Card component
- **WHEN** StudioPanel is rendered
- **THEN** the main panel container uses Card component imported directly from `@hai3/uikit`
- **AND** the component is imported at build time (not via registry)
- **AND** tree-shaking eliminates these components in production builds

#### Scenario: Buttons use UIKit Button component
- **WHEN** StudioPanel renders buttons (collapse, close, etc.)
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

The system SHALL style the StudioPanel with modern glassmorphism design patterns using pure Tailwind classes.

#### Scenario: Panel has glassmorphic appearance
- **WHEN** StudioPanel is rendered
- **THEN** the panel background uses `bg-white/20` (light) or `bg-black/50` (dark) for transparency
- **AND** the panel has backdrop-filter blur using `backdrop-blur-md` (16px blur)
- **AND** the panel has color saturation boost using `backdrop-saturate-[180%]`
- **AND** the panel has a subtle border using `border-white/30` (light) or `border-white/20` (dark)
- **AND** the panel casts a custom shadow using `shadow-[0_8px_32px_rgba(0,0,0,0.2)]`
- **AND** no external CSS files are used for glassmorphic effects

### Requirement: Package Independence

The system SHALL implement the studio package as a standalone workspace package that can be excluded from production builds.

#### Scenario: Package is in monorepo workspaces
- **WHEN** package.json is read
- **THEN** `packages/studio` is listed in workspaces array
- **AND** the package has name `@hai3/studio`
- **AND** the package has its own package.json, tsconfig.json, and build configuration

#### Scenario: Package dependencies
- **WHEN** `@hai3/studio` package.json is inspected
- **THEN** it depends on `@hai3/uikit-contracts` for type definitions (ButtonVariant, etc.)
- **AND** it depends on `@hai3/uicore` for Redux hooks, actions, registries, and events
- **AND** it depends on `@hai3/uikit` for direct component imports
- **AND** it has peerDependencies on `react` and `react-dom`

#### Scenario: Direct uikit dependency is safe for production
- **WHEN** application is built for production with `vite build`
- **THEN** the conditional import `if (import.meta.env.DEV)` is eliminated by tree-shaking
- **AND** the entire `@hai3/studio` package is excluded from bundle
- **AND** all `@hai3/uikit` components imported by studio are also excluded
- **AND** platforms do not need to register studio-specific components

#### Scenario: Package exports are tree-shakeable
- **WHEN** package is built with tsup
- **THEN** package.json has `"type": "module"` and `"sideEffects": false`
- **AND** exports use ESM format for optimal tree-shaking
- **AND** individual exports are granular (not barrel exports)

### Requirement: Conditional Loading

The system SHALL load the studio package only in development mode using conditional imports.

#### Scenario: Studio loads in development
- **WHEN** application runs with `import.meta.env.DEV === true`
- **THEN** StudioOverlay component is dynamically imported
- **AND** StudioOverlay is rendered in the React tree
- **AND** studio panel becomes available to users

#### Scenario: Studio excluded in production
- **WHEN** application is built with `vite build` for production
- **THEN** the conditional import branch is eliminated by tree-shaking
- **AND** the `@hai3/studio` package code is completely excluded from bundle
- **AND** no studio-related code or styles are in production build

#### Scenario: Conditional import uses dynamic import
- **WHEN** studio is loaded in development mode
- **THEN** the import uses dynamic `import()` syntax for code-splitting
- **AND** studio bundle is loaded as a separate chunk
- **AND** main bundle does not include studio code even in development

### Requirement: Glassmorphic Button Component

The system SHALL provide a reusable GlassmorphicButton component for the collapsed toggle button.

#### Scenario: Button uses Ghost variant to prevent background conflicts
- **WHEN** GlassmorphicButton is rendered
- **THEN** it uses ButtonVariant.Ghost to avoid default button backgrounds
- **AND** glassmorphic styling (transparency, blur) works correctly
- **AND** background content is visible through the button with blur effect

#### Scenario: Button accepts icon as prop
- **WHEN** GlassmorphicButton is instantiated
- **THEN** it accepts an icon prop of type React.ReactNode
- **AND** the icon is rendered centered within the circular button
- **AND** any icon component can be passed (not hardcoded)

#### Scenario: Button supports drag cursor states
- **WHEN** isDragging prop is true
- **THEN** cursor changes to 'grabbing'
- **AND** when isDragging is false, cursor shows 'grab'

### Requirement: Independent Button and Panel Positioning

The system SHALL maintain separate positions for the collapsed button and expanded panel.

#### Scenario: Button position is independent
- **WHEN** user drags the collapsed button
- **THEN** button position is saved to `hai3:studio:buttonPosition`
- **AND** panel position (`hai3:studio:position`) remains unchanged
- **AND** expanding panel does not move to button's position

#### Scenario: Panel position is independent
- **WHEN** user drags the expanded panel
- **THEN** panel position is saved to `hai3:studio:position`
- **AND** button position (`hai3:studio:buttonPosition`) remains unchanged
- **AND** collapsing panel shows button at its own saved position

#### Scenario: Drag hook supports both positioning modes
- **WHEN** useDraggable hook is called with storageKey parameter
- **THEN** it emits the appropriate event (PositionChanged or ButtonPositionChanged)
- **AND** persistence effect saves to the correct localStorage key
- **AND** multiple draggable elements can coexist with independent positions

### Requirement: Click vs Drag Distinction

The system SHALL distinguish between clicks and drags on the collapsed button.

#### Scenario: Small movement is treated as click
- **WHEN** user presses mouse down on collapsed button
- **AND** moves mouse less than 5 pixels
- **AND** releases mouse button
- **THEN** panel expands (button click behavior)
- **AND** button position does not change

#### Scenario: Large movement is treated as drag
- **WHEN** user presses mouse down on collapsed button
- **AND** moves mouse 5 pixels or more
- **THEN** button follows cursor (drag behavior)
- **AND** panel does not expand on mouse release

### Requirement: Pure Tailwind Glassmorphism

The system SHALL implement all glassmorphic styling using Tailwind utility classes without external CSS files.

#### Scenario: Panel uses Tailwind glassmorphic classes
- **WHEN** StudioPanel is rendered
- **THEN** background uses `bg-white/20 dark:bg-black/50`
- **AND** backdrop blur uses `backdrop-blur-md` (16px)
- **AND** color saturation uses `backdrop-saturate-[180%]`
- **AND** border uses `border-white/30 dark:border-white/20`
- **AND** shadow uses `shadow-[0_8px_32px_rgba(0,0,0,0.2)]`
- **AND** no external CSS files are imported

#### Scenario: Button uses matching glassmorphic classes
- **WHEN** GlassmorphicButton is rendered
- **THEN** styling matches panel's glassmorphic classes
- **AND** blur effect works when positioned over content
- **AND** background content is visible with appropriate blur

### Requirement: Dropdown Portal and Z-Index Management

The system SHALL render dropdown menus in a high-z-index portal to appear above the glassmorphic panel.

#### Scenario: Portal container is created
- **WHEN** StudioPanel mounts
- **THEN** a portal container div is rendered with `z-[99999]`
- **AND** portal container has `fixed` positioning
- **AND** portal container has `pointer-events-none` to allow click-through
- **AND** portal container reference is registered with StudioContext

#### Scenario: Dropdowns render in portal
- **WHEN** ThemeSelector, LanguageSelector, or ScreensetSelector are rendered
- **THEN** they pass `container={portalContainer}` to DropdownMenuContent
- **AND** dropdown content renders inside the portal container
- **AND** dropdown content has `className="z-[99999] pointer-events-auto"`

#### Scenario: Dropdowns appear above panel
- **WHEN** user opens a dropdown (theme, language, screenset)
- **THEN** dropdown menu is visible above the glassmorphic panel
- **AND** dropdown is not obscured by panel's backdrop-blur stacking context
- **AND** dropdown menu is interactive (clicks work)

#### Scenario: Nested dropdowns work correctly
- **WHEN** user hovers over screenset category to open submenu
- **THEN** submenu renders in portal with `container={portalContainer}`
- **AND** submenu appears above both main menu and panel
- **AND** submenu has same z-index override as main dropdown

### Requirement: UIKit Component Organization

The system SHALL organize Studio-specific UIKit components following screenset patterns.

#### Scenario: Icons are in uikit/icons folder
- **WHEN** StudioIcon is defined
- **THEN** it is located in `packages/studio/src/uikit/icons/`
- **AND** it exports a constant STUDIO_ICON_ID
- **AND** it follows the same pattern as screenset icons

#### Scenario: Composite components are in uikit/composite folder
- **WHEN** GlassmorphicButton is defined
- **THEN** it is located in `packages/studio/src/uikit/composite/`
- **AND** it follows the same pattern as screenset composite components
- **AND** it can be reused in different contexts within studio

