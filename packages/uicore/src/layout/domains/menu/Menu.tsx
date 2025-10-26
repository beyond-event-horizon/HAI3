import React, { useEffect } from 'react';
import { Menu as UIKitMenu } from '@/uikit';
import { useAppSelector, useAppDispatch } from '@/core/hooks/useRedux';
import { setSelectedScreen } from '@/core/layout/layoutSlice';
import { iconService } from '@/core/icons/iconService';

/**
 * Core Menu component
 * Wraps UI Kit Menu and manages its own configuration via Redux
 * 
 * Responsibilities:
 * - Receives menu items from Footer (screenset orchestration)
 * - Selects first item by default when items change
 * - Highlights currently selected screen
 * - Provides icon lookup from iconService
 */

export interface MenuProps {
  // All configuration is managed via Redux
}

export const Menu: React.FC<MenuProps> = () => {
  const dispatch = useAppDispatch();
  const { collapsed, items, visible } = useAppSelector((state) => state.menu);
  const selectedScreen = useAppSelector((state) => state.layout.selectedScreen);

  // Select first item by default when items change and nothing is selected
  useEffect(() => {
    if (items.length > 0 && !selectedScreen) {
      dispatch(setSelectedScreen(items[0].id));
    }
  }, [items, selectedScreen, dispatch]);

  // Handle menu item clicks
  const handleItemClick = (item: { id: string }): void => {
    dispatch(setSelectedScreen(item.id));
  };

  if (!visible) return null;

  return (
    <UIKitMenu
      items={items}
      collapsed={collapsed}
      activeItemId={selectedScreen || undefined}
      onItemClick={handleItemClick}
      getIcon={(id: string) => iconService.get(id)}
      className="border-r border-border overflow-y-auto"
    />
  );
};

Menu.displayName = 'Menu';
