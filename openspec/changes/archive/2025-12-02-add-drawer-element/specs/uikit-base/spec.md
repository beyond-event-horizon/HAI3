## ADDED Requirements

### Requirement: Drawer Component

The system SHALL provide a Drawer component in the `@hai3/uikit` package for mobile-friendly overlay panels, built on the vaul library.

#### Scenario: Drawer component is available

- **WHEN** importing Drawer from `@hai3/uikit`
- **THEN** the Drawer component and its sub-components are available
- **AND** components include: Drawer, DrawerTrigger, DrawerPortal, DrawerOverlay, DrawerClose, DrawerContent, DrawerHeader, DrawerFooter, DrawerTitle, DrawerDescription

#### Scenario: Drawer supports multiple directions

- **WHEN** using DrawerContent with direction prop
- **THEN** the drawer can slide from bottom, top, left, or right
- **AND** each direction has appropriate styling and animations

#### Scenario: Drawer has touch gesture support

- **WHEN** using Drawer on touch devices
- **THEN** the drawer supports drag-to-dismiss gestures
- **AND** the drawer shows a visual drag handle for bottom direction

#### Scenario: Drawer styling follows theme

- **WHEN** rendering Drawer components
- **THEN** the overlay uses theme-aware background opacity
- **AND** the content uses bg-background, border-border, and text-foreground tokens
- **AND** all animations are smooth (animate-in/animate-out)

### Requirement: Drawer Demo Examples

The system SHALL provide Drawer examples in the Layout & Structure category of the UI Kit demo.

#### Scenario: Drawer section in LayoutElements

- **WHEN** viewing the Layout & Structure category
- **THEN** a Drawer section is displayed with heading and examples
- **AND** the section includes data-element-id="element-drawer" for navigation

#### Scenario: Drawer section ordering

- **WHEN** viewing the Layout & Structure category
- **THEN** the Drawer section appears after Dialog and before Sheet
- **AND** the order matches the category elements order: Card, Dialog, Drawer, Sheet

#### Scenario: Drawer examples use translations

- **WHEN** Drawer examples are rendered
- **THEN** all text content uses the `tk()` translation helper
- **AND** all translated text is wrapped with TextLoader component

#### Scenario: Multiple drawer direction examples

- **WHEN** viewing the Drawer section
- **THEN** at least one example demonstrating drawer functionality is shown
- **AND** the example includes a trigger button and content with header/footer

### Requirement: Drawer in Category System

The system SHALL include Drawer as an implemented element in the Layout & Structure category.

#### Scenario: Drawer in IMPLEMENTED_ELEMENTS

- **WHEN** checking `uikitCategories.ts`
- **THEN** 'Drawer' is included in the IMPLEMENTED_ELEMENTS array
- **AND** Drawer appears in the Layout & Structure category navigation menu

### Requirement: Drawer Translations

The system SHALL provide Drawer translations across all supported languages (36 languages).

#### Scenario: Drawer translation keys

- **WHEN** Drawer component is used in the demo
- **THEN** translation keys exist for all Drawer elements
- **AND** keys include: drawer_heading, drawer_open, drawer_title, drawer_description, drawer_close

#### Scenario: Translation files completeness

- **WHEN** checking translation files in `src/screensets/demo/screens/uikit/i18n/`
- **THEN** all 36 language files include Drawer translation keys
- **AND** translations are contextually appropriate for each language

