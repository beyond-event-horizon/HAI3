# Spec Delta: uikit-base

## ADDED Requirements

### Requirement: Menubar Component
The UI kit SHALL provide Menubar, MenubarMenu, MenubarTrigger, MenubarContent, MenubarItem, MenubarSeparator, MenubarLabel, MenubarCheckboxItem, MenubarRadioGroup, MenubarRadioItem, MenubarSub, MenubarSubTrigger, MenubarSubContent, MenubarShortcut, MenubarGroup, and MenubarPortal components for building desktop-style menu bar interfaces with support for submenus, checkbox items, radio groups, and keyboard navigation.

#### Scenario: Desktop Menu Interface
Given a user viewing an application with a menubar
When the menubar component is rendered
Then the menubar displays menu triggers with accessible dropdown menus and keyboard navigation

### Requirement: Menubar Demo Example
The UI kit demo SHALL provide an example for the Menubar component in the Navigation category demonstrating a complete menu bar with File, Edit, and View menus including submenus, checkboxes, radio items, and keyboard shortcuts using `tk()` for translations.

#### Scenario: Demo Example Display
Given a user viewing the Navigation category in UIKitElementsScreen
When the Menubar example is rendered
Then a functional menu bar with multiple menus and interactive items is displayed

### Requirement: Menubar in Category System
The UI kit element registry SHALL include 'Menubar' in the IMPLEMENTED_ELEMENTS array to mark it as an available component in the Navigation category.

#### Scenario: Category Menu Shows Menubar
Given a user viewing the UIKit category menu
When the Navigation category is selected
Then 'Menubar' appears as an implemented element

### Requirement: Menubar Translations
The UI kit translations SHALL provide localized strings for all 36 supported languages with keys including:
- `menubar_heading` - Section heading
- `menubar_file` - File menu
- `menubar_edit` - Edit menu
- `menubar_view` - View menu
- `menubar_profiles` - Profiles menu
- `menubar_new_tab` - New Tab item
- `menubar_new_window` - New Window item
- `menubar_new_incognito` - New Incognito Window item (disabled)
- `menubar_share` - Share submenu
- `menubar_email` - Email item
- `menubar_messages` - Messages item
- `menubar_notes` - Notes item
- `menubar_print` - Print item
- `menubar_undo` - Undo item
- `menubar_redo` - Redo item
- `menubar_find` - Find submenu
- `menubar_search_web` - Search the web item
- `menubar_find_file` - Find... item
- `menubar_find_next` - Find Next item
- `menubar_find_previous` - Find Previous item
- `menubar_cut` - Cut item
- `menubar_copy` - Copy item
- `menubar_paste` - Paste item
- `menubar_always_show_bookmarks` - Always Show Bookmarks Bar checkbox
- `menubar_always_show_full_urls` - Always Show Full URLs checkbox
- `menubar_reload` - Reload item
- `menubar_force_reload` - Force Reload item (disabled)
- `menubar_toggle_fullscreen` - Toggle Fullscreen item
- `menubar_hide_sidebar` - Hide Sidebar item
- `menubar_edit_profile` - Edit profile item
- `menubar_add_profile` - Add Profile item

#### Scenario: Translated Menubar Labels
Given a user viewing the menubar demo in a non-English language
When translations are loaded
Then all menubar labels display in the selected language

