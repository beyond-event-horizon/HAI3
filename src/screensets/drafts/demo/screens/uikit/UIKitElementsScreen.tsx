import React, { useState, useEffect } from 'react';
import { useTranslation, TextLoader } from '@hai3/uicore';
import { CategoryMenu } from './CategoryMenu';
import { DataDisplayElements } from '../../components/DataDisplayElements';
import { LayoutElements } from '../../components/LayoutElements';
import { ActionElements } from '../../components/ActionElements';
import { FeedbackElements } from '../../components/FeedbackElements';
import { MediaElements } from '../../components/MediaElements';
import { FormElements } from '../../components/FormElements';
import { OverlayElements } from '../../components/OverlayElements';
import { DEMO_SCREENSET_ID } from '../../demoScreenset';
import { UIKIT_CATEGORIES, IMPLEMENTED_ELEMENTS, getElementId } from './uikitCategories';
/**
 * UI Kit Elements Screen ID
 */
export const UI_KIT_ELEMENTS_SCREEN_ID = 'uikit';

/**
 * UI Kit Elements Screen
 * Demo page with available UI Kit elements and styles annotations
 */
export const UIKitElementsScreen: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>('layout');
  const [activeElementId, setActiveElementId] = useState<string>('');
  const { t } = useTranslation();

  // Set initial active element on mount
  useEffect(() => {
    if (selectedCategory && !activeElementId) {
      const category = UIKIT_CATEGORIES.find(cat => cat.id === selectedCategory);
      if (category) {
        const firstImplementedElement = category.elements.find(el => 
          IMPLEMENTED_ELEMENTS.includes(el)
        );
        if (firstImplementedElement) {
          const elementId = getElementId(firstImplementedElement);
          setActiveElementId(elementId);
        }
      }
    }
  }, [selectedCategory, activeElementId]);

  // Handle category selection
  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    
    // Find first implemented element in the category and set it as active
    const category = UIKIT_CATEGORIES.find(cat => cat.id === categoryId);
    if (category) {
      const firstImplementedElement = category.elements.find(el => 
        IMPLEMENTED_ELEMENTS.includes(el)
      );
      if (firstImplementedElement) {
        const elementId = getElementId(firstImplementedElement);
        setActiveElementId(elementId);
        
        // Scroll to the element instantly
        const targetElement = document.querySelector(`[data-element-id="${elementId}"]`);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'auto', block: 'start' });
        }
      }
    }
  };

  // Handle element click from menu
  const handleElementClick = (elementId: string) => {
    setActiveElementId(elementId);
    const targetElement = document.querySelector(`[data-element-id="${elementId}"]`);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'auto', block: 'start' });
    }
  };

  // Render the appropriate category component
  const renderCategoryElements = () => {
    switch (selectedCategory) {
      case 'data-display':
        return <DataDisplayElements />;
      case 'layout':
        return <LayoutElements />;
      case 'actions':
        return <ActionElements />;
      case 'feedback':
        return <FeedbackElements />;
      case 'media':
        return <MediaElements />;
      case 'forms':
        return <FormElements />;
      case 'overlays':
        return <OverlayElements />;
      default:
        return (
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">
              Select a category from the menu to view elements
            </p>
          </div>
        );
    }
  };


  return (
    <div className="flex flex-col gap-8 p-8">
      <div className="flex flex-col gap-4">
        <TextLoader skeletonClassName="h-10 w-48">
          <h1 className="text-4xl font-bold">
            {t(`screenset.${DEMO_SCREENSET_ID}:screens.${UI_KIT_ELEMENTS_SCREEN_ID}.title`)}
          </h1>
        </TextLoader>
        <TextLoader skeletonClassName="h-6 w-full">
          <p className="text-muted-foreground">
            {t(`screenset.${DEMO_SCREENSET_ID}:screens.${UI_KIT_ELEMENTS_SCREEN_ID}.description`)}
          </p>
        </TextLoader>
      </div>

      <div className="flex gap-8">
        {/* Category Navigation */}
        <CategoryMenu 
          selectedCategory={selectedCategory}
          onCategorySelect={handleCategorySelect}
          activeElementId={activeElementId}
          onElementClick={handleElementClick}
        />

        {/* Content Area */}
        <div className="flex-1 max-w-3xl flex flex-col gap-8">
          {renderCategoryElements()}
        </div>
      </div>
    </div>
  );
};

UIKitElementsScreen.displayName = 'UIKitElementsScreen';

