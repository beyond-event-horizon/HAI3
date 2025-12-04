## ADDED Requirements

### Requirement: Aspect Ratio Component

The system SHALL provide an AspectRatio component in the `@hai3/uikit` package for maintaining consistent width-to-height ratios, built on @radix-ui/react-aspect-ratio.

#### Scenario: AspectRatio component is available

- **WHEN** importing AspectRatio from `@hai3/uikit`
- **THEN** the AspectRatio component is available for use

#### Scenario: AspectRatio accepts ratio prop

- **WHEN** using AspectRatio with a ratio prop (e.g., 16/9, 4/3, 1)
- **THEN** the container maintains the specified aspect ratio
- **AND** child content fills the container proportionally

#### Scenario: AspectRatio with images

- **WHEN** placing an image inside AspectRatio
- **THEN** the image is constrained to the specified ratio
- **AND** the image can use object-fit for positioning

### Requirement: Aspect Ratio Demo Examples

The system SHALL provide AspectRatio examples in the Layout & Structure category of the UI Kit demo.

#### Scenario: AspectRatio section in LayoutElements

- **WHEN** viewing the Layout & Structure category
- **THEN** an Aspect Ratio section is displayed with heading and examples
- **AND** the section includes data-element-id="element-aspect-ratio" for navigation

#### Scenario: AspectRatio section ordering

- **WHEN** viewing the Layout & Structure category
- **THEN** the Aspect Ratio section appears first (before Card)
- **AND** the order matches the category elements order

#### Scenario: AspectRatio examples use translations

- **WHEN** AspectRatio examples are rendered
- **THEN** all text content uses the `tk()` translation helper
- **AND** all translated text is wrapped with TextLoader component

#### Scenario: Multiple aspect ratio examples

- **WHEN** viewing the Aspect Ratio section
- **THEN** examples demonstrate common ratios (16:9, 1:1)
- **AND** each example shows visual content within the ratio container

### Requirement: Aspect Ratio in Category System

The system SHALL include Aspect Ratio as an implemented element in the Layout & Structure category.

#### Scenario: Aspect Ratio in IMPLEMENTED_ELEMENTS

- **WHEN** checking `uikitCategories.ts`
- **THEN** 'Aspect Ratio' is included in the IMPLEMENTED_ELEMENTS array
- **AND** Aspect Ratio appears in the Layout & Structure category navigation menu

### Requirement: Aspect Ratio Translations

The system SHALL provide Aspect Ratio translations across all supported languages (36 languages).

#### Scenario: Aspect Ratio translation keys

- **WHEN** AspectRatio component is used in the demo
- **THEN** translation keys exist for all AspectRatio elements
- **AND** keys include: aspect_ratio_heading, aspect_ratio_16_9_label, aspect_ratio_1_1_label

#### Scenario: Translation files completeness

- **WHEN** checking translation files in `src/screensets/demo/screens/uikit/i18n/`
- **THEN** all 36 language files include Aspect Ratio translation keys
- **AND** translations are contextually appropriate for each language

