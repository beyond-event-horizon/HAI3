import React from 'react';
import { Sidebar as UIKitSidebar } from '@/uikit';
import { useAppSelector, useAppDispatch } from '@/core/hooks/useRedux';
import { toggleSidebar } from './sidebarSlice';

/**
 * Core Sidebar component
 * Wraps UI Kit Sidebar and manages its own configuration via Redux
 */

export interface SidebarProps {
  // All configuration is managed via Redux
}

export const Sidebar: React.FC<SidebarProps> = () => {
  const dispatch = useAppDispatch();
  const { collapsed, position, title, content, visible } = useAppSelector((state) => state.sidebar);

  if (!visible) return null;

  const handleToggle = (): void => {
    dispatch(toggleSidebar());
  };

  return (
    <UIKitSidebar
      collapsed={collapsed}
      position={position}
      title={title || undefined}
      onToggle={handleToggle}
      className="overflow-y-auto"
    >
      {content}
    </UIKitSidebar>
  );
};

Sidebar.displayName = 'Sidebar';
