import React from 'react';
import { cn } from '@/lib/utils';

/**
 * Header component for HAI3 UI-Core
 * Provides a consistent header layout across all screens
 */

export interface HeaderProps {
  className?: string;
  children?: React.ReactNode;
  logo?: React.ReactNode;
  actions?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({
  className,
  children,
  logo,
  actions,
}) => {
  return (
    <header
      className={cn(
        'flex items-center justify-between px-6 py-4',
        'bg-background border-b border-border',
        'h-16 w-full',
        className
      )}
    >
      <div className="flex items-center gap-4">
        {logo && <div className="flex-shrink-0">{logo}</div>}
        {children}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </header>
  );
};

Header.displayName = 'Header';
