import React from 'react';
import { cn } from '@/lib/utils';

/**
 * Menu component for HAI3 UI-Core
 * Provides main navigation menu with collapsible support
 */

export interface MenuItem {
  id: string;
  label: string;
  icon?: string; // Icon identifier (e.g., 'home', 'settings') - map to actual icon in rendering component
  href?: string;
  onClick?: () => void;
  children?: MenuItem[];
  badge?: string | number;
}

export interface MenuProps {
  className?: string;
  items: MenuItem[];
  collapsed?: boolean;
  onItemClick?: (item: MenuItem) => void;
  activeItemId?: string;
  getIcon?: (id: string) => React.ReactNode | undefined; // Function to get icon by ID (from iconService)
}

const MenuItemComponent: React.FC<{
  item: MenuItem;
  collapsed?: boolean;
  active?: boolean;
  onClick?: (item: MenuItem) => void;
  level?: number;
  getIcon?: (id: string) => React.ReactNode | undefined;
}> = ({ item, collapsed, active, onClick, level = 0, getIcon }) => {
  const handleClick = (): void => {
    if (onClick) {
      onClick(item);
    }
    if (item.onClick) {
      item.onClick();
    }
  };

  return (
    <div>
      <button
        onClick={handleClick}
        className={cn(
          'flex items-center gap-3 w-full px-4 py-2.5 rounded-md',
          'text-sm font-medium transition-colors',
          'hover:bg-accent hover:text-accent-foreground',
          active && 'bg-accent text-accent-foreground',
          collapsed && 'justify-center px-2',
          level > 0 && 'ml-4'
        )}
        title={collapsed ? item.label : undefined}
      >
        {item.icon && getIcon && (
          <span className="flex-shrink-0 w-5 h-5">{getIcon(item.icon)}</span>
        )}
        {!collapsed && (
          <>
            <span className="flex-1 text-left">{item.label}</span>
            {item.badge && (
              <span className="px-2 py-0.5 text-xs rounded-full bg-primary text-primary-foreground">
                {item.badge}
              </span>
            )}
          </>
        )}
      </button>
      {!collapsed && item.children && (
        <div className="mt-1">
          {item.children.map((child) => (
            <MenuItemComponent
              key={child.id}
              item={child}
              collapsed={collapsed}
              active={child.id === item.id}
              onClick={onClick}
              level={level + 1}
              getIcon={getIcon}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const Menu: React.FC<MenuProps> = ({
  className,
  items,
  collapsed = false,
  onItemClick,
  activeItemId,
  getIcon,
}) => {
  return (
    <nav
      className={cn(
        'flex flex-col gap-1 p-3',
        'bg-background',
        collapsed ? 'w-16' : 'w-64',
        'transition-all duration-300',
        className
      )}
    >
      {items.map((item) => (
        <MenuItemComponent
          key={item.id}
          item={item}
          collapsed={collapsed}
          active={item.id === activeItemId}
          onClick={onItemClick}
          getIcon={getIcon}
        />
      ))}
    </nav>
  );
};

Menu.displayName = 'Menu';
