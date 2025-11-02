/**
 * User Events
 * Events related to user data and authentication
 */

import type { ApiUser } from '../../../api/accounts/api';

export enum UserEvents {
  UserFetched = 'user/userFetched',
  UserFetchFailed = 'user/userFetchFailed',
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
  'user/userFetched': UserFetchedPayload;
  'user/userFetchFailed': UserFetchFailedPayload;
}
