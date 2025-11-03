import React from 'react';
import { Header as HeaderUI } from '@hai3/uikit'; // Base layout primitive
import { UserInfo } from '../../../app/domains/user/UserInfo';

/**
 * Header Domain
 * Business logic layer - composes header with user info
 * No styling - all presentation in uikit
 */

export interface HeaderProps {
  // All configuration is managed via Redux
}

export const Header: React.FC<HeaderProps> = () => {
  return (
    <HeaderUI>
      <UserInfo />
    </HeaderUI>
  );
};

Header.displayName = 'Header';
