# Spec Delta: uikit-base

## ADDED Requirements

### Requirement: Breadcrumb Component
The UI kit SHALL provide Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator, and BreadcrumbEllipsis components for building accessible navigation breadcrumbs with customizable separators, aria labels, and slot support for custom link components.

#### Scenario: Basic Breadcrumb Navigation
Given a user viewing a deeply nested page
When the breadcrumb component is rendered
Then the breadcrumb displays the navigation hierarchy with proper ARIA attributes

### Requirement: Breadcrumb Demo Examples
The UI kit demo SHALL provide examples for the Breadcrumb component in the Navigation category including:
- Default breadcrumb with custom separator (slash instead of chevron)
- Dropdown breadcrumb showing collapsed items in a dropdown menu

All examples SHALL use the `tk()` helper for translations.

#### Scenario: Demo Examples Display
Given a user viewing the Navigation category in UIKitElementsScreen
When the Breadcrumb examples are rendered
Then two distinct breadcrumb variations are displayed with appropriate labels

### Requirement: Breadcrumb in Category System
The UI kit element registry SHALL include 'Breadcrumb' in the IMPLEMENTED_ELEMENTS array to mark it as an available component in the Navigation category.

#### Scenario: Category Menu Shows Breadcrumb
Given a user viewing the UIKit category menu
When the Navigation category is selected
Then 'Breadcrumb' appears as an implemented element

### Requirement: Breadcrumb Translations
The UI kit translations SHALL provide localized strings for all 36 supported languages with keys including:
- `breadcrumb_heading` - Section heading
- `breadcrumb_custom_separator_label` - Custom separator example label
- `breadcrumb_dropdown_label` - Dropdown example label
- `breadcrumb_home` - Home link text
- `breadcrumb_components` - Components link text
- `breadcrumb_breadcrumb` - Breadcrumb page text
- `breadcrumb_documentation` - Documentation link text
- `breadcrumb_themes` - Themes link text
- `breadcrumb_github` - GitHub link text

#### Scenario: Translated Breadcrumb Labels
Given a user viewing the breadcrumb demo in a non-English language
When translations are loaded
Then all breadcrumb labels display in the selected language

