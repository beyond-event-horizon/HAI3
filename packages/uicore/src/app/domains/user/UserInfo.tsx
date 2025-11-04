import React, { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../../hooks/useRedux';
import { fetchCurrentUser } from '../../../core/actions';
import { uikitRegistry } from '../../../uikit/uikitRegistry';
import { UiKitComponent } from '../../../uikit/uikitContracts';

/**
 * UserInfo Domain Component
 * Business logic layer - manages user data fetching and state
 * No styling - all presentation in uikit
 */
export interface UserInfoProps {
  // All configuration is managed via Redux
}

export const UserInfo: React.FC<UserInfoProps> = () => {
  const dispatch = useAppDispatch();
  const { user, loading } = useAppSelector((state) => state.app);

  // Fetch user on mount if not already loaded
  useEffect(() => {
    if (!user) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch, user]);

  const UserInfoUI = uikitRegistry.getComponent(UiKitComponent.UserInfo);

  // Show loading state
  if (loading && !user) {
    return <UserInfoUI loading={true} />;
  }

  // Don't render if no user and not loading
  if (!user) {
    return null;
  }

  const displayName = `${user.firstName || ''} ${user.lastName || ''}`.trim();

  return (
    <UserInfoUI
      displayName={displayName || undefined}
      email={user.email || undefined}
      avatarUrl={user.avatarUrl}
      loading={false}
    />
  );
};

UserInfo.displayName = 'UserInfo';
