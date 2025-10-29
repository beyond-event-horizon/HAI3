import React, { useEffect } from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuIcon,
  SidebarMenuLabel,
} from '@hai3/uikit';
import { useAppSelector, useAppDispatch } from '@/core/hooks/useRedux';
import { setSelectedScreen } from '@/core/layout/layoutSlice';
import { iconService } from '@/core/icons/iconService';

export interface MenuProps {}

/**
 * Menu Domain - Uses tailored shadcn sidebar components
 * Composes shadcn primitives with Redux state management
 */
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
    <Sidebar collapsed={collapsed}>
      <SidebarContent>
        <SidebarMenu>
          {items.map((item) => {
            const icon = iconService.get(item.icon || '');
            const isActive = selectedScreen === item.id;

            return (
              <SidebarMenuItem key={item.id}>
                <SidebarMenuButton
                  isActive={isActive}
                  tooltip={item.label}
                  onClick={() => dispatch(setSelectedScreen(item.id))}
                >
                  {icon && <SidebarMenuIcon>{icon}</SidebarMenuIcon>}
                  <SidebarMenuLabel>{item.label}</SidebarMenuLabel>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
};

Menu.displayName = 'Menu';
