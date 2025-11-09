import React, { useEffect } from 'react';
import { useAppSelector, useAppDispatch, fetchCurrentUser, useTranslation } from '@hai3/uicore';
import { Button, Card, CardContent, CardFooter } from '@hai3/uikit';
import { DEMO_SCREENSET_ID } from '../../demoScreenset';

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
  const { t } = useTranslation();

  useEffect(() => {
    // Fetch user data on mount
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">
          {t(`screenset.${DEMO_SCREENSET_ID}:screens.${PROFILE_SCREEN_ID}.loading`)}
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <p className="text-destructive">
          {t(`screenset.${DEMO_SCREENSET_ID}:screens.${PROFILE_SCREEN_ID}.error_prefix`)} {error}
        </p>
        <Button onClick={() => dispatch(fetchCurrentUser())}>
          {t(`screenset.${DEMO_SCREENSET_ID}:screens.${PROFILE_SCREEN_ID}.retry`)}
        </Button>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <p className="text-muted-foreground">
          {t(`screenset.${DEMO_SCREENSET_ID}:screens.${PROFILE_SCREEN_ID}.no_user_data`)}
        </p>
        <Button onClick={() => dispatch(fetchCurrentUser())}>
          {t(`screenset.${DEMO_SCREENSET_ID}:screens.${PROFILE_SCREEN_ID}.load_user`)}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 p-8">
      <div className="flex flex-col gap-4">
        <h1 className="text-4xl font-bold">
          {t(`screenset.${DEMO_SCREENSET_ID}:screens.${PROFILE_SCREEN_ID}.title`)}
        </h1>
        <p className="text-muted-foreground">
          {t(`screenset.${DEMO_SCREENSET_ID}:screens.${PROFILE_SCREEN_ID}.welcome`)}
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
                <span className="font-medium">{t(`screenset.${DEMO_SCREENSET_ID}:screens.${PROFILE_SCREEN_ID}.role_label`)}:</span>{' '}
                <span className="capitalize">{user.role}</span>
              </p>
              {user.extra?.department && (
                <p className="text-sm">
                  <span className="font-medium">{t(`screenset.${DEMO_SCREENSET_ID}:screens.${PROFILE_SCREEN_ID}.department_label`)}:</span>{' '}
                  {user.extra.department}
                </p>
              )}
              <p className="text-sm text-muted-foreground">
                {t(`screenset.${DEMO_SCREENSET_ID}:screens.${PROFILE_SCREEN_ID}.id_label`)}: {user.id}
              </p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-border">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium">
                  {t(`screenset.${DEMO_SCREENSET_ID}:screens.${PROFILE_SCREEN_ID}.created_label`)}
                </p>
                <p className="text-muted-foreground">
                  {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="font-medium">
                  {t(`screenset.${DEMO_SCREENSET_ID}:screens.${PROFILE_SCREEN_ID}.last_updated_label`)}
                </p>
                <p className="text-muted-foreground">
                  {new Date(user.updatedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter>
          <Button onClick={() => dispatch(fetchCurrentUser())}>
            {t(`screenset.${DEMO_SCREENSET_ID}:screens.${PROFILE_SCREEN_ID}.refresh`)}
          </Button>
        </CardFooter>
      </Card>

    </div>
  );
};

ProfileScreen.displayName = 'ProfileScreen';
