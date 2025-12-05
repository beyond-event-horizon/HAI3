# Spec Delta: uikit-base

## ADDED Requirements

### Requirement: Tabs Component
The UI kit SHALL provide Tabs, TabsList, TabsTrigger, and TabsContent components built on @radix-ui/react-tabs for organizing content into switchable tabbed panels with proper ARIA accessibility.

#### Scenario: Tab Panel Navigation
Given a user viewing tabbed content
When the user clicks on a tab trigger
Then the corresponding tab content panel is displayed and the trigger shows active state

### Requirement: Tabs Demo Example
The UI kit demo SHALL provide an example for the Tabs component in the Navigation category demonstrating multiple tab panels with form content (Account/Password tabs) using Card, Input, and Button components, using `tk()` for translations.

#### Scenario: Demo Example Display
Given a user viewing the Navigation category in UIKitElementsScreen
When the Tabs example is rendered
Then functional tab panels with form inputs are displayed and switchable

### Requirement: Tabs in Category System
The UI kit element registry SHALL include 'Tabs' in the IMPLEMENTED_ELEMENTS array to mark it as an available component in the Navigation category.

#### Scenario: Category Menu Shows Tabs
Given a user viewing the UIKit category menu
When the Navigation category is selected
Then 'Tabs' appears as an implemented element

### Requirement: Tabs Translations
The UI kit translations SHALL provide localized strings for all 36 supported languages with keys including:
- `tabs_heading` - Section heading
- `tabs_account` - Account tab label
- `tabs_password` - Password tab label
- `tabs_account_title` - Account card title
- `tabs_account_description` - Account card description
- `tabs_password_title` - Password card title
- `tabs_password_description` - Password card description
- `tabs_name` - Name field label
- `tabs_username` - Username field label
- `tabs_current_password` - Current password field label
- `tabs_new_password` - New password field label
- `tabs_save_changes` - Save changes button
- `tabs_save_password` - Save password button

#### Scenario: Translated Tabs Labels
Given a user viewing the tabs demo in a non-English language
When translations are loaded
Then all tabs labels and form fields display in the selected language

