import React, { useEffect } from 'react';
import { Button, ButtonVariant } from '@hai3/uikit';
import { useAppSelector, useAppDispatch } from '@/core/hooks/useRedux';
import { setSelectedScreen } from '@/core/layout/layoutSlice';
import { iconService } from '@/core/icons/iconService';

export interface MenuProps {}

export const Menu: React.FC<MenuProps> = () => {
  const { items, collapsed, visible } = useAppSelector((state) => state.menu);
  const selectedScreen = useAppSelector((state) => state.layout.selectedScreen);
  const dispatch = useAppDispatch();

  // Select first item as default when items change (Menu handles its own behavior)
  useEffect(() => {
    if (items.length > 0 && !selectedScreen) {
      dispatch(setSelectedScreen(items[0].id));
    }
  }, [items, selectedScreen, dispatch]);

  if (!visible) return null;

  return (
    <nav className={`flex flex-col gap-1 p-3 bg-background transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'}`}>
      {items.map((item) => {
        const icon = iconService.get(item.icon || '');
        const isSelected = selectedScreen === item.id;
        return (
          <Button
            key={item.id}
            variant={isSelected ? ButtonVariant.Secondary : ButtonVariant.Ghost}
            onClick={() => dispatch(setSelectedScreen(item.id))}
            className={`w-full overflow-hidden ${collapsed ? 'justify-center px-2' : 'justify-start'}`}
            title={collapsed ? item.label : undefined}
          >
            {icon && <span className="flex-shrink-0 w-5 h-5">{icon}</span>}
            {!collapsed && <span className="flex-1 text-left whitespace-nowrap">{item.label}</span>}
          </Button>
        );
      })}
    </nav>
  );
};

Menu.displayName = 'Menu';
