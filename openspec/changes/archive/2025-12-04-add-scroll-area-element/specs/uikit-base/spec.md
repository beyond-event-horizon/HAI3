## ADDED Requirements

### Requirement: Scroll Area Component

The system SHALL provide a Scroll Area component in the `@hai3/uikit` package for creating custom scrollable containers with styled scrollbars, built on @radix-ui/react-scroll-area.

#### Scenario: Scroll Area component is available

- **WHEN** importing ScrollArea from `@hai3/uikit`
- **THEN** the ScrollArea and ScrollBar components are available
- **AND** ScrollArea provides a custom scrollable viewport
- **AND** ScrollBar provides styled scrollbar with configurable orientation

#### Scenario: Vertical scroll support

- **WHEN** using ScrollArea with content taller than the container
- **THEN** a vertical scrollbar appears automatically
- **AND** the scrollbar uses theme-aware styling with bg-border token

#### Scenario: Horizontal scroll support

- **WHEN** using ScrollArea with ScrollBar orientation="horizontal"
- **THEN** a horizontal scrollbar appears for wide content
- **AND** the scrollbar is styled consistently with vertical scrollbars

#### Scenario: Scroll Area styling follows theme

- **WHEN** rendering ScrollArea components
- **THEN** the scrollbar thumb uses bg-border token
- **AND** the viewport supports focus-visible ring styling
- **AND** all animations are smooth transitions

### Requirement: Scroll Area Demo Examples

The system SHALL provide Scroll Area examples in the Layout & Structure category of the UI Kit demo.

#### Scenario: Scroll Area section in LayoutElements

- **WHEN** viewing the Layout & Structure category
- **THEN** a Scroll Area section is displayed with heading and examples
- **AND** the section includes data-element-id="element-scroll-area" for navigation

#### Scenario: Scroll Area examples use translations

- **WHEN** Scroll Area examples are rendered
- **THEN** all text content uses the `tk()` translation helper
- **AND** all translated text is wrapped with TextLoader component

#### Scenario: Multiple scroll area examples

- **WHEN** viewing the Scroll Area section
- **THEN** two examples are shown: vertical scroll and horizontal scroll
- **AND** vertical example shows a list of items in a bounded height container
- **AND** horizontal example shows horizontally scrolling content with images

### Requirement: Scroll Area in Category System

The system SHALL include Scroll Area as an implemented element in the Layout & Structure category.

#### Scenario: Scroll Area in IMPLEMENTED_ELEMENTS

- **WHEN** checking `uikitCategories.ts`
- **THEN** 'Scroll Area' is included in the IMPLEMENTED_ELEMENTS array
- **AND** Scroll Area appears in the Layout & Structure category navigation menu

### Requirement: Scroll Area Translations

The system SHALL provide Scroll Area translations across all supported languages (36 languages).

#### Scenario: Scroll Area translation keys

- **WHEN** Scroll Area component is used in the demo
- **THEN** translation keys exist for all Scroll Area elements
- **AND** keys include: scroll_area_heading, scroll_area_vertical_label, scroll_area_horizontal_label, scroll_area_tags_title, scroll_area_photo_by

#### Scenario: Translation files completeness

- **WHEN** checking translation files in `src/screensets/demo/screens/uikit/i18n/`
- **THEN** all 36 language files include Scroll Area translation keys
- **AND** translations are contextually appropriate for each language

