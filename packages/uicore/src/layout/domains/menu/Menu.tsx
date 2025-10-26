import React from 'react';
import { Menu as UIKitMenu } from '@/uikit';
import { useAppSelector } from '@/core/hooks/useRedux';

/**
 * Core Menu component
 * Wraps UI Kit Menu and manages its own configuration via Redux
 */

export interface MenuProps {
  // All configuration is managed via Redux
}

export const Menu: React.FC<MenuProps> = () => {
  const { collapsed, items, visible } = useAppSelector((state) => state.menu);

  if (!visible) return null;

  return (
    <UIKitMenu
      items={items}
      collapsed={collapsed}
      className="border-r border-border overflow-y-auto"
    />
  );
};

Menu.displayName = 'Menu';
