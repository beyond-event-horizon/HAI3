# Spec Delta: uikit-base

## ADDED Requirements

### Requirement: Input Demo Examples
The UI kit demo SHALL provide examples for the Input component in the Forms & Inputs category demonstrating basic email input, file input, disabled state, and input with label, using `tk()` for translations.

#### Scenario: Demo Example Display
Given a user viewing the Forms & Inputs category in UIKitElementsScreen
When the Input examples are rendered
Then four input variants are displayed: email, file, disabled, and labeled

### Requirement: Input in Category System
The UI kit element registry SHALL include 'Input' in the IMPLEMENTED_ELEMENTS array to mark it as an available component in the Forms & Inputs category.

#### Scenario: Category Menu Shows Input
Given a user viewing the UIKit category menu
When the Forms & Inputs category is selected
Then 'Input' appears as an implemented element

### Requirement: Input Demo Translations
The UI kit translations SHALL provide localized strings for all 36 supported languages with keys including:
- `input_heading` - Section heading
- `input_default_label` - Default input label
- `input_file_label` - File input label
- `input_disabled_label` - Disabled input label
- `input_with_label_label` - Input with label example label
- `input_email_placeholder` - Email placeholder text
- `input_email_label` - Email label text

#### Scenario: Translated Input Labels
Given a user viewing the input demo in a non-English language
When translations are loaded
Then all input labels and placeholders display in the selected language

