# Spec Delta: uikit-base

## ADDED Requirements

### Requirement: Pagination Component
The UI kit SHALL provide Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext, and PaginationEllipsis components for building accessible pagination controls with page links, navigation arrows, and ellipsis for truncated page ranges.

#### Scenario: Basic Pagination Navigation
Given a user viewing paginated content
When the pagination component is rendered
Then the pagination displays previous/next controls and page number links with proper ARIA labels

### Requirement: Pagination Demo Example
The UI kit demo SHALL provide an example for the Pagination component in the Navigation category demonstrating previous/next navigation, numbered page links with active state, and ellipsis for truncated ranges, using `tk()` for translations.

#### Scenario: Demo Example Display
Given a user viewing the Navigation category in UIKitElementsScreen
When the Pagination example is rendered
Then a functional pagination with numbered pages and navigation controls is displayed

### Requirement: Pagination in Category System
The UI kit element registry SHALL include 'Pagination' in the IMPLEMENTED_ELEMENTS array to mark it as an available component in the Navigation category.

#### Scenario: Category Menu Shows Pagination
Given a user viewing the UIKit category menu
When the Navigation category is selected
Then 'Pagination' appears as an implemented element

### Requirement: Pagination Translations
The UI kit translations SHALL provide localized strings for all 36 supported languages with keys including:
- `pagination_heading` - Section heading
- `pagination_previous` - Previous button label
- `pagination_next` - Next button label

#### Scenario: Translated Pagination Labels
Given a user viewing the pagination demo in a non-English language
When translations are loaded
Then all pagination labels display in the selected language

