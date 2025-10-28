import React from 'react';
import { IconButton, ButtonVariant, IconButtonSize } from '@/uikit';
import { useAppSelector, useAppDispatch } from '@/core/hooks/useRedux';
import { toggleMenu } from '../menu/menuSlice';

/**
 * Core Header component
 * Self-contained domain - renders own HTML
 */

export interface HeaderProps {
  // All configuration is managed via Redux
}

export const Header: React.FC<HeaderProps> = () => {
  const dispatch = useAppDispatch();
  const { logo, actions, showMenuToggle } = useAppSelector((state) => state.header);

  const handleMenuToggle = (): void => {
    dispatch(toggleMenu());
  };

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-background border-b border-border h-16 w-full">
      <div className="flex items-center gap-4">
        {logo && <div className="flex-shrink-0">{logo}</div>}
        {showMenuToggle && (
          <IconButton
            variant={ButtonVariant.Ghost}
            size={IconButtonSize.Small}
            onClick={handleMenuToggle}
            aria-label="Toggle menu"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </IconButton>
        )}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </header>
  );
};

Header.displayName = 'Header';
