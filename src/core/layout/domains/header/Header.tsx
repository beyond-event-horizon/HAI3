import React from 'react';
import { Header as UIKitHeader, Button } from '@/uikit';
import { useAppSelector, useAppDispatch } from '@/core/hooks/useRedux';
import { toggleMenu } from '../menu/menuSlice';

/**
 * Core Header component
 * Wraps UI Kit Header and manages its own configuration via Redux
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
    <UIKitHeader logo={logo} actions={actions}>
      {showMenuToggle && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleMenuToggle}
          className="p-2"
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
        </Button>
      )}
    </UIKitHeader>
  );
};

Header.displayName = 'Header';
