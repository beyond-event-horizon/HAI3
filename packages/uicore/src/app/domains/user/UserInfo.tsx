import React, { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../../hooks/useRedux';
import { fetchCurrentUser } from '../../../core/actions';
import { UserInfo as UserInfoUI } from '@hai3/uikit';

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
  const { user } = useAppSelector((state) => state.app);

  // Fetch user on mount if not already loaded
  useEffect(() => {
    if (!user) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch, user]);

  // Don't render if user not loaded yet
  if (!user) {
    return null;
  }

  return (
    <UserInfoUI
      firstName={user.firstName}
      lastName={user.lastName}
      avatarUrl={user.avatarUrl}
    />
  );
};

UserInfo.displayName = 'UserInfo';
