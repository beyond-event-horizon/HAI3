import React from 'react';
import { useAppSelector } from '@/core/hooks/useRedux';

/**
 * Core Header component
 * Self-contained domain - renders own HTML
 */

export interface HeaderProps {
  // All configuration is managed via Redux
}

export const Header: React.FC<HeaderProps> = () => {
  const { user } = useAppSelector((state) => state.app);

  return (
    <header className="flex items-center justify-end px-6 py-4 bg-background border-b border-border h-16 w-full">
      <div className="flex items-center gap-4">
        {user && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {user.avatarUrl && (
              <img
                src={user.avatarUrl}
                alt={`${user.firstName} ${user.lastName}`}
                className="w-8 h-8 rounded-full"
              />
            )}
            <span>{user.firstName} {user.lastName}</span>
          </div>
        )}
      </div>
    </header>
  );
};

Header.displayName = 'Header';
