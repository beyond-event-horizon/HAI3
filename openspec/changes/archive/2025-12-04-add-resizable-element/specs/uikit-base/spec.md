## ADDED Requirements

### Requirement: Resizable Component

The system SHALL provide a Resizable component in the `@hai3/uikit` package for creating resizable panel layouts, built on react-resizable-panels library.

#### Scenario: Resizable component is available

- **WHEN** importing Resizable from `@hai3/uikit`
- **THEN** the Resizable component and its sub-components are available
- **AND** components include: ResizablePanelGroup, ResizablePanel, ResizableHandle

#### Scenario: Horizontal resizable layout

- **WHEN** using ResizablePanelGroup with direction="horizontal"
- **THEN** panels are arranged horizontally
- **AND** ResizableHandle allows resizing panels by dragging

#### Scenario: Vertical resizable layout

- **WHEN** using ResizablePanelGroup with direction="vertical"
- **THEN** panels are arranged vertically
- **AND** ResizableHandle allows resizing panels by dragging

#### Scenario: ResizableHandle with visible grip

- **WHEN** using ResizableHandle with withHandle prop set to true
- **THEN** a visible grip icon is displayed on the handle
- **AND** the grip rotates 90 degrees for vertical layouts

#### Scenario: Resizable styling follows theme

- **WHEN** rendering Resizable components
- **THEN** the handle uses bg-border for the divider line
- **AND** the grip uses bg-border and border-border tokens
- **AND** focus states use ring-ring for accessibility

### Requirement: Resizable Demo Examples

The system SHALL provide Resizable examples in the Layout & Structure category of the UI Kit demo.

#### Scenario: Resizable section in LayoutElements

- **WHEN** viewing the Layout & Structure category
- **THEN** a Resizable section is displayed with heading and examples
- **AND** the section includes data-element-id="element-resizable" for navigation

#### Scenario: Resizable section ordering

- **WHEN** viewing the Layout & Structure category
- **THEN** the Resizable section appears after Drawer and before Sheet
- **AND** the order matches the category elements order

#### Scenario: Resizable examples use translations

- **WHEN** Resizable examples are rendered
- **THEN** all text content uses the `tk()` translation helper
- **AND** all translated text is wrapped with TextLoader component

#### Scenario: Multiple resizable examples

- **WHEN** viewing the Resizable section
- **THEN** three examples are shown: horizontal with grip handle, vertical without handle, and nested layout
- **AND** nested layout demonstrates horizontal panel containing vertical panels

### Requirement: Resizable in Category System

The system SHALL include Resizable as an implemented element in the Layout & Structure category.

#### Scenario: Resizable in IMPLEMENTED_ELEMENTS

- **WHEN** checking `uikitCategories.ts`
- **THEN** 'Resizable' is included in the IMPLEMENTED_ELEMENTS array
- **AND** Resizable appears in the Layout & Structure category navigation menu

### Requirement: Resizable Translations

The system SHALL provide Resizable translations across all supported languages (36 languages).

#### Scenario: Resizable translation keys

- **WHEN** Resizable component is used in the demo
- **THEN** translation keys exist for all Resizable elements
- **AND** keys include: resizable_heading, resizable_horizontal_label, resizable_vertical_label, resizable_nested_label, resizable_panel_one, resizable_panel_two, resizable_panel_three

#### Scenario: Translation files completeness

- **WHEN** checking translation files in `src/screensets/demo/screens/uikit/i18n/`
- **THEN** all 36 language files include Resizable translation keys
- **AND** translations are contextually appropriate for each language

