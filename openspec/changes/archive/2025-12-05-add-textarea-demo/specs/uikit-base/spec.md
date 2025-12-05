# Spec Delta: uikit-base

## ADDED Requirements

### Requirement: Textarea Demo Examples
The UI kit demo SHALL provide examples for the Textarea component in the Forms & Inputs category demonstrating default textarea with placeholder and disabled state, using `tk()` for translations.

#### Scenario: Demo Example Display
Given a user viewing the Forms & Inputs category in UIKitElementsScreen
When the Textarea examples are rendered
Then two textarea variants are displayed: default and disabled

### Requirement: Textarea in Category System
The UI kit element registry SHALL include 'Textarea' in the IMPLEMENTED_ELEMENTS array to mark it as an available component in the Forms & Inputs category.

#### Scenario: Category Menu Shows Textarea
Given a user viewing the UIKit category menu
When the Forms & Inputs category is selected
Then 'Textarea' appears as an implemented element

### Requirement: Textarea Demo Translations
The UI kit translations SHALL provide localized strings for all 36 supported languages with keys including:
- `textarea_heading` - Section heading
- `textarea_default_label` - Default textarea label
- `textarea_disabled_label` - Disabled textarea label
- `textarea_placeholder` - Placeholder text

#### Scenario: Translated Textarea Labels
Given a user viewing the textarea demo in a non-English language
When translations are loaded
Then all textarea labels and placeholders display in the selected language

