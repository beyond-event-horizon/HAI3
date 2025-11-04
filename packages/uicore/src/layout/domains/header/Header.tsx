import React from 'react';
import { UserInfo } from '../../../app/domains/user/UserInfo';
import { uikitRegistry } from '../../../uikit/uikitRegistry';
import { UiKitComponent } from '@hai3/uikit-contracts';

/**
 * Header Domain
 * Business logic layer - composes header with user info
 * No styling - all presentation in uikit
 */

export interface HeaderProps {
  // All configuration is managed via Redux
}

export const Header: React.FC<HeaderProps> = () => {
  const HeaderUI = uikitRegistry.getComponent(UiKitComponent.Header);
  
  return (
    <HeaderUI>
      <UserInfo />
    </HeaderUI>
  );
};

Header.displayName = 'Header';
