import React from 'react';
import { UIKIT_CATEGORIES, IMPLEMENTED_ELEMENTS, getElementId } from './uikitCategories';
import { ExpandableButton } from '../../uikit/icons/ExpandableButton';
import { MenuItemButton } from '../../uikit/icons/MenuItemButton';

interface CategoryMenuProps {
  selectedCategory: string | null;
  onCategorySelect: (categoryId: string) => void;
  activeElementId?: string;
  onElementClick?: (elementId: string) => void;
}

/**
 * Category Menu Component
 * Navigation menu with collapsible categories for UI Kit elements
 */
export const CategoryMenu: React.FC<CategoryMenuProps> = ({
  selectedCategory,
  onCategorySelect,
  activeElementId,
  onElementClick,
}) => {

  return (
    <nav className="w-64 border-r border-border pr-4">
      <div className="sticky top-4">
        <h3 className="mb-4 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          Categories
        </h3>
        <div className="space-y-1">
          {UIKIT_CATEGORIES.map((category) => {
            const isExpanded = selectedCategory === category.id;
            const implementedCount = category.elements.filter(el => 
              IMPLEMENTED_ELEMENTS.includes(el)
            ).length;
            const hasImplemented = implementedCount > 0;

            return (
              <div key={category.id} className="space-y-1">
                <ExpandableButton
                  onClick={() => onCategorySelect(category.id)}
                  isExpanded={isExpanded}
                  isActive={isExpanded}
                  badge={hasImplemented ? implementedCount : undefined}
                  showChevron={hasImplemented}
                  disabled={!hasImplemented}
                >
                  {category.label}
                </ExpandableButton>
                
                {isExpanded && (
                  <div className="ml-4 space-y-0.5 py-1">
                    {category.elements.map((element) => {
                      const isImplemented = IMPLEMENTED_ELEMENTS.includes(element);
                      if (!isImplemented) return null;
                      
                      const elementId = getElementId(element);
                      const isActiveElement = activeElementId === elementId;
                      
                      return (
                        <MenuItemButton
                          key={element}
                          isActive={isActiveElement}
                          onClick={() => onElementClick?.(elementId)}
                        >
                          {element}
                        </MenuItemButton>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        <div className="mt-6 p-3 bg-muted/50 rounded-md">
          <p className="text-xs text-muted-foreground">
            <span className="font-semibold">{IMPLEMENTED_ELEMENTS.length}</span> of{' '}
            <span className="font-semibold">
              {UIKIT_CATEGORIES.reduce((acc, cat) => acc + cat.elements.length, 0)}
            </span>{' '}
            elements implemented
          </p>
        </div>
      </div>
    </nav>
  );
};

CategoryMenu.displayName = 'CategoryMenu';

