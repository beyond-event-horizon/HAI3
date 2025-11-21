/**
 * User Events
 * Events related to user data and authentication
 */

import type { ApiUser } from '../../../api/services/accounts/api';

export enum UserEvents {
  FetchStarted = 'uicore/user/fetchStarted',
  Fetched = 'uicore/user/fetched',
  FetchFailed = 'uicore/user/fetchFailed',
}

export interface UserFetchedPayload {
  user: ApiUser;
}

export interface UserFetchFailedPayload {
  error: {
    code: string;
    message: string;
  };
}

/**
 * Type map: ties each UserEvent to its payload type
 * Uses string literal types as keys (event string values)
 * Ensures type safety when emitting/subscribing to events
 */
export interface UserEventPayloadMap {
  'uicore/user/fetchStarted': void; // No payload needed
  'uicore/user/fetched': UserFetchedPayload;
  'uicore/user/fetchFailed': UserFetchFailedPayload;
}
