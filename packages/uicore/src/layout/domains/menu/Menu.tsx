import React from 'react';
import { useAppSelector, useAppDispatch } from '@/core/hooks/useRedux';
import { setSelectedScreen } from '@/core/layout/layoutSlice';
import { iconService } from '@/core/icons/iconService';

export interface MenuProps {}

export const Menu: React.FC<MenuProps> = () => {
  const { items, collapsed, visible } = useAppSelector((state) => state.menu);
  const selectedScreen = useAppSelector((state) => state.layout.selectedScreen);
  const dispatch = useAppDispatch();

  if (!visible) return null;

  return (
    <nav className={`flex flex-col gap-1 p-3 bg-background transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'}`}>
      {items.map((item) => {
        const icon = iconService.get(item.icon || '');
        return (
          <button
            key={item.id}
            onClick={() => dispatch(setSelectedScreen(item.id))}
            className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground ${selectedScreen === item.id ? 'bg-accent text-accent-foreground' : ''} ${collapsed ? 'justify-center px-2' : ''}`}
            title={collapsed ? item.label : undefined}
          >
            {icon && <span className="flex-shrink-0 w-5 h-5">{icon}</span>}
            {!collapsed && <span className="flex-1 text-left">{item.label}</span>}
          </button>
        );
      })}
    </nav>
  );
};

Menu.displayName = 'Menu';
