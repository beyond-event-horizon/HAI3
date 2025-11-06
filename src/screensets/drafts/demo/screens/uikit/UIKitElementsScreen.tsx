import React from 'react';

/**
 * UI Kit Elements Screen ID
 */
export const UI_KIT_ELEMENTS_SCREEN_ID = 'uikit';

/**
 * UI Kit Elements Screen
 * Demo page with available UI Kit elements and styles annotations
 */
export const UIKitElementsScreen: React.FC = () => {
  return (
    <div className="flex flex-col gap-8 p-8">
      <div className="flex flex-col gap-4">
        <h1 className="text-4xl font-bold">UI Kit Elements</h1>
        <p className="text-muted-foreground">
          Demo page with available UI Kit elements and styles annotations
        </p>
      </div>

      <div className="max-w-2xl">
        <div className="flex flex-col gap-2 p-6 border border-border rounded-lg bg-background">
          {/* Placeholder for future UI Kit elements */}
        </div>
      </div>
    </div>
  );
};

UIKitElementsScreen.displayName = 'UIKitElementsScreen';

