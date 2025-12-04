## ADDED Requirements

### Requirement: Separator Component

The system SHALL provide a Separator component in the `@hai3/uikit` package for visually dividing content sections, built on @radix-ui/react-separator.

#### Scenario: Separator component is available

- **WHEN** importing Separator from `@hai3/uikit`
- **THEN** the Separator component is available
- **AND** it supports horizontal and vertical orientations

#### Scenario: Horizontal separator

- **WHEN** using Separator with default or orientation="horizontal"
- **THEN** a horizontal line is rendered spanning the full width
- **AND** the line uses bg-border token for consistent theming

#### Scenario: Vertical separator

- **WHEN** using Separator with orientation="vertical"
- **THEN** a vertical line is rendered spanning the full height
- **AND** the component uses h-full and w-px styling

#### Scenario: Separator accessibility

- **WHEN** rendering Separator with decorative=true (default)
- **THEN** the separator is marked as decorative for screen readers
- **AND** when decorative=false, it has proper semantic role

### Requirement: Separator Demo Examples

The system SHALL provide Separator examples in the Layout & Structure category of the UI Kit demo.

#### Scenario: Separator section in LayoutElements

- **WHEN** viewing the Layout & Structure category
- **THEN** a Separator section is displayed with heading and examples
- **AND** the section includes data-element-id="element-separator" for navigation

#### Scenario: Separator examples use translations

- **WHEN** Separator examples are rendered
- **THEN** all text content uses the `tk()` translation helper
- **AND** all translated text is wrapped with TextLoader component

#### Scenario: Separator example content

- **WHEN** viewing the Separator section
- **THEN** the example shows both horizontal and vertical separators
- **AND** horizontal separator divides content blocks
- **AND** vertical separators divide inline items

### Requirement: Separator in Category System

The system SHALL include Separator as an implemented element in the Layout & Structure category.

#### Scenario: Separator in IMPLEMENTED_ELEMENTS

- **WHEN** checking `uikitCategories.ts`
- **THEN** 'Separator' is included in the IMPLEMENTED_ELEMENTS array
- **AND** Separator appears in the Layout & Structure category navigation menu

### Requirement: Separator Translations

The system SHALL provide Separator translations across all supported languages (36 languages).

#### Scenario: Separator translation keys

- **WHEN** Separator component is used in the demo
- **THEN** translation keys exist for all Separator elements
- **AND** keys include: separator_heading, separator_title, separator_description, separator_blog, separator_docs, separator_source

#### Scenario: Translation files completeness

- **WHEN** checking translation files in `src/screensets/demo/screens/uikit/i18n/`
- **THEN** all 36 language files include Separator translation keys
- **AND** translations are contextually appropriate for each language

