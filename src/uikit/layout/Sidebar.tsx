import React from 'react';
import { cn } from '@/lib/utils';

/**
 * Sidebar component for HAI3 UI-Core
 * Provides contextual sidebar panels that can be positioned left or right
 */

export interface SidebarProps {
  className?: string;
  children?: React.ReactNode;
  position?: 'left' | 'right';
  collapsed?: boolean;
  width?: string;
  collapsedWidth?: string;
  title?: string;
  onToggle?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  className,
  children,
  position = 'left',
  collapsed = false,
  width = '256px',
  collapsedWidth = '64px',
  title,
  onToggle,
}) => {
  return (
    <aside
      className={cn(
        'flex flex-col bg-background border-border transition-all duration-300',
        position === 'left' ? 'border-r' : 'border-l',
        className
      )}
      style={{
        width: collapsed ? collapsedWidth : width,
      }}
    >
      {title && (
        <div
          className={cn(
            'flex items-center justify-between px-4 py-3 border-b border-border',
            collapsed && 'justify-center'
          )}
        >
          {!collapsed && (
            <h2 className="text-sm font-semibold">{title}</h2>
          )}
          {onToggle && (
            <button
              onClick={onToggle}
              className="p-1 rounded hover:bg-accent transition-colors"
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={cn(
                  'transition-transform',
                  collapsed && position === 'left' && 'rotate-180',
                  collapsed && position === 'right' && 'rotate-0'
                )}
              >
                {position === 'left' ? (
                  <polyline points="15 18 9 12 15 6" />
                ) : (
                  <polyline points="9 18 15 12 9 6" />
                )}
              </svg>
            </button>
          )}
        </div>
      )}
      <div className={cn('flex-1 overflow-auto p-4', collapsed && 'p-2')}>
        {children}
      </div>
    </aside>
  );
};

Sidebar.displayName = 'Sidebar';
