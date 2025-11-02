import React, { useEffect } from 'react';
import { useAppSelector, useAppDispatch, fetchCurrentUser } from '@hai3/uicore';
import { Button, Card, CardContent, CardFooter } from '@hai3/uikit';

/**
 * Profile Screen ID
 */
export const PROFILE_SCREEN_ID = 'profile';

/**
 * Profile Screen
 * Demonstrates API integration with Flux architecture
 * - Fetches user data on mount
 * - Displays user info from Redux state
 * - Shows loading/error states
 */
export const ProfileScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user, loading, error } = useAppSelector((state) => state.app);

  useEffect(() => {
    // Fetch user data on mount
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Loading user data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <p className="text-destructive">Error: {error}</p>
        <Button onClick={() => dispatch(fetchCurrentUser())}>Retry</Button>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <p className="text-muted-foreground">No user data</p>
        <Button onClick={() => dispatch(fetchCurrentUser())}>Load User</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 p-8">
      <div className="flex flex-col gap-4">
        <h1 className="text-4xl font-bold">User Profile</h1>
        <p className="text-muted-foreground">
          API integration demo using Flux architecture
        </p>
      </div>

      <Card className="max-w-2xl">
        <CardContent className="pt-6">
          <div className="flex items-center gap-6">
            {user.avatarUrl && (
              <img
                src={user.avatarUrl}
                alt={`${user.firstName} ${user.lastName}`}
                className="w-24 h-24 rounded-full"
              />
            )}
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl font-semibold">
                {user.firstName} {user.lastName}
              </h2>
              <p className="text-muted-foreground">{user.email}</p>
              <p className="text-sm">
                <span className="font-medium">Role:</span>{' '}
                <span className="capitalize">{user.role}</span>
              </p>
              {user.extra?.department && (
                <p className="text-sm">
                  <span className="font-medium">Department:</span>{' '}
                  {user.extra.department}
                </p>
              )}
              <p className="text-sm text-muted-foreground">
                ID: {user.id}
              </p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-border">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium">Created</p>
                <p className="text-muted-foreground">
                  {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="font-medium">Last Updated</p>
                <p className="text-muted-foreground">
                  {new Date(user.updatedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter>
          <Button onClick={() => dispatch(fetchCurrentUser())}>Refresh</Button>
        </CardFooter>
      </Card>

    </div>
  );
};

ProfileScreen.displayName = 'ProfileScreen';
