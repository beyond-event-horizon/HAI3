import React from 'react';
import { IconButton, ButtonVariant, IconButtonSize } from '@/uikit';
import { useAppSelector, useAppDispatch } from '@/core/hooks/useRedux';
import { toggleMenu } from '../menu/menuSlice';
import { iconService } from '@/core/icons/iconService';

/**
 * Core Header component
 * Self-contained domain - renders own HTML
 */

export interface HeaderProps {
  // All configuration is managed via Redux
}

export const Header: React.FC<HeaderProps> = () => {
  const dispatch = useAppDispatch();
  const { logo, actions, showMenuToggle, menuToggleIcon } = useAppSelector((state) => state.header);

  const handleMenuToggle = (): void => {
    dispatch(toggleMenu());
  };

  const toggleIcon = iconService.get(menuToggleIcon || 'menu');

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-background border-b border-border h-16 w-full">
      <div className="flex items-center gap-4">
        {logo && <div className="flex-shrink-0">{logo}</div>}
        {showMenuToggle && toggleIcon && (
          <IconButton
            variant={ButtonVariant.Ghost}
            size={IconButtonSize.Small}
            onClick={handleMenuToggle}
            aria-label="Toggle menu"
          >
            {toggleIcon}
          </IconButton>
        )}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </header>
  );
};

Header.displayName = 'Header';
