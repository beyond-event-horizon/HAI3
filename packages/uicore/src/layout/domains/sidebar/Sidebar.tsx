import React from 'react';
import { useAppSelector } from '../../../hooks/useRedux';

export interface SidebarProps {}

export const Sidebar: React.FC<SidebarProps> = () => {
  const { content, position, collapsed, visible } = useAppSelector((state) => state.sidebar);

  if (!visible) return null;

  return (
    <aside className={`flex flex-col bg-background border-border transition-all duration-300 ${position === 'left' ? 'border-r' : 'border-l'} ${collapsed ? 'w-16' : 'w-64'}`}>
      {content}
    </aside>
  );
};

Sidebar.displayName = 'Sidebar';
