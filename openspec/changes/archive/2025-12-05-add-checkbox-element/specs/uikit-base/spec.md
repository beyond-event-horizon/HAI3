# Spec Delta: uikit-base

## ADDED Requirements

### Requirement: Checkbox Component
The UI kit SHALL provide a Checkbox component built on @radix-ui/react-checkbox for boolean input selection with proper accessibility, checked/unchecked states, and disabled state support.

#### Scenario: Checkbox Toggle
Given a user viewing a form with checkboxes
When the user clicks on a checkbox
Then the checkbox toggles between checked and unchecked states with visual indicator

### Requirement: Checkbox Demo Examples
The UI kit demo SHALL provide examples for the Checkbox component in the Forms & Inputs category demonstrating basic checkbox with label, checked checkbox with description, disabled checkbox, and card-style checkbox with custom styling, using `tk()` for translations.

#### Scenario: Demo Example Display
Given a user viewing the Forms & Inputs category in UIKitElementsScreen
When the Checkbox examples are rendered
Then four checkbox variants are displayed showing different use cases

### Requirement: Checkbox in Category System
The UI kit element registry SHALL include 'Checkbox' in the IMPLEMENTED_ELEMENTS array to mark it as an available component in the Forms & Inputs category.

#### Scenario: Category Menu Shows Checkbox
Given a user viewing the UIKit category menu
When the Forms & Inputs category is selected
Then 'Checkbox' appears as an implemented element

### Requirement: Checkbox Translations
The UI kit translations SHALL provide localized strings for all 36 supported languages with keys including:
- `checkbox_heading` - Section heading
- `checkbox_basic_label` - Basic example label
- `checkbox_with_text_label` - With text example label
- `checkbox_disabled_label` - Disabled example label
- `checkbox_card_label` - Card style example label
- `checkbox_terms` - Accept terms text
- `checkbox_terms_description` - Terms description text
- `checkbox_notifications` - Enable notifications text
- `checkbox_notifications_description` - Notifications description text

#### Scenario: Translated Checkbox Labels
Given a user viewing the checkbox demo in a non-English language
When translations are loaded
Then all checkbox labels and descriptions display in the selected language

