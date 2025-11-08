/**
 * App Actions - Application lifecycle actions
 * Following Flux architecture pattern
 */

import type { AppDispatch } from '../../store';
import { fetchCurrentUser } from './userActions';

/**
 * Bootstrap application
 * Dispatches user fetch - DOES NOT wait for result
 * User language is automatically set by UserFetched effect in appEffects
 * App renders immediately with skeleton loaders while data loads
 * 
 * @internal
 * This action is internal to uicore and should not be called by applications.
 * It is automatically dispatched by the Layout component on mount.
 */
export const bootstrapApp = () => (dispatch: AppDispatch): void => {
  // Dispatch user fetch - don't await
  // appEffects listens to UserFetched and sets language from user.language
  dispatch(fetchCurrentUser());
};
