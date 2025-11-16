/**
 * UI Kit Element Categories
 * Organized grouping of all UI Kit elements
 */

import { toLower } from 'lodash';

export interface UIKitCategory {
  id: string;
  label: string;
  elements: string[];
}

export const UIKIT_CATEGORIES: UIKitCategory[] = [
  {
    id: 'layout',
    label: 'Layout & Structure',
    elements: [
      'Card',
      'Dialog',
      'Sheet',
      'Drawer',
      'Separator',
      'Aspect Ratio',
      'Resizable',
      'Scroll Area',
      'Sidebar',
    ],
  },
  {
    id: 'navigation',
    label: 'Navigation',
    elements: [
      'Navigation Menu',
      'Breadcrumb',
      'Pagination',
      'Tabs',
      'Menubar',
    ],
  },
  {
    id: 'forms',
    label: 'Forms & Inputs',
    elements: [
      'Input',
      'Input Group',
      'Input OTP',
      'Textarea',
      'Select',
      'Native Select',
      'Combobox',
      'Checkbox',
      'Radio Group',
      'Switch',
      'Date Picker',
      'Calendar',
      'Field',
      'Form',
      'Label',
    ],
  },
  {
    id: 'actions',
    label: 'Actions & Buttons',
    elements: [
      'Button',
      'Button Group',
      'Toggle',
      'Toggle Group',
      'Command',
    ],
  },
  {
    id: 'feedback',
    label: 'Feedback & Status',
    elements: [
      'Alert',
      'Alert Dialog',
      'Toast',
      'Sonner',
      'Progress',
      'Spinner',
      'Skeleton',
      'Empty',
    ],
  },
  {
    id: 'data-display',
    label: 'Data Display',
    elements: [
      'Table',
      'Data Table',
      'Chart',
      'Avatar',
      'Badge',
      'Typography',
      'Kbd',
      'Item',
    ],
  },
  {
    id: 'overlays',
    label: 'Overlays & Popovers',
    elements: [
      'Popover',
      'Tooltip',
      'Hover Card',
      'Context Menu',
      'Dropdown Menu',
    ],
  },
  {
    id: 'media',
    label: 'Media & Content',
    elements: [
      'Carousel',
      'Slider',
    ],
  },
  {
    id: 'disclosure',
    label: 'Disclosure',
    elements: [
      'Accordion',
      'Collapsible',
    ],
  },
];

/**
 * Get category by ID
 */
export function getCategoryById(categoryId: string): UIKitCategory | undefined {
  return UIKIT_CATEGORIES.find(cat => cat.id === categoryId);
}

/**
 * Get category ID for an element
 */
export function getCategoryIdForElement(elementName: string): string | undefined {
  const category = UIKIT_CATEGORIES.find(cat => 
    cat.elements.includes(elementName)
  );
  return category?.id;
}

/**
 * Get normalized element ID (for DOM IDs)
 */
export function getElementId(elementName: string): string {
  return `element-${toLower(elementName).replace(/\s+/g, '-')}`;
}

/**
 * Currently implemented elements (matching UIKitElementsScreen)
 */
export const IMPLEMENTED_ELEMENTS = [
  'Avatar',
  'Badge',
  'Button',
  'Card',
  'Dialog',
  'Progress',
  'Select',
  'Sheet',
  'Skeleton',
  'Slider',
  'Spinner',
  'Switch',
  'Tooltip',
];

