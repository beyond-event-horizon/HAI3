/**
 * User Events
 * Events related to user data and authentication
 */

import type { ApiUser } from '../../../api/services/accounts/api';
import { UICORE_ID } from '../../constants';

const DOMAIN_ID = 'user';

export enum UserEvents {
  FetchStarted = `${UICORE_ID}/${DOMAIN_ID}/fetchStarted`,
  Fetched = `${UICORE_ID}/${DOMAIN_ID}/fetched`,
  FetchFailed = `${UICORE_ID}/${DOMAIN_ID}/fetchFailed`,
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
