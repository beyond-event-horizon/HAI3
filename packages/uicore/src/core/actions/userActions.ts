/**
 * User Actions - Async actions for user data
 * Following Flux architecture pattern
 */

import type { AppDispatch } from '../../store';
import { eventBus } from '../events/eventBus';
import { UserEvents } from '../events/eventTypes';
import { apiRegistry } from '../../api/apiRegistry';
import { ACCOUNTS_DOMAIN } from '../../api/accounts/AccountsApiService';
import type { ApiError } from '../../api/accounts/api';
import { changeLanguage } from './i18nActions';

/**
 * Fetch current user
 * Uses AccountsApiService (accounts domain: users, tenants, auth)
 * Type-safe access via getService() - type inferred from ApiServicesMap
 * Mock handling is transparent - managed by BaseApiService interceptor
 * Emits events for success/failure
 * Sets language from user preference after fetch
 * Follows Flux: Action → Event → Effect → Slice
 */
export const fetchCurrentUser = () => (_dispatch: AppDispatch): void => {
  // Emit start event - effect will set loading
  eventBus.emit(UserEvents.UserFetchStarted);
  
  const accountsService = apiRegistry.getService(ACCOUNTS_DOMAIN);
  
  // Fire and forget - action returns void immediately
  // Results handled via events
  accountsService.getCurrentUser()
    .then(response => {
      // Emit success event
      eventBus.emit(UserEvents.UserFetched, {
        user: response.user,
      });
      
      // Set language from user preference
      // Action -> Action is allowed (actions can call other actions)
      // Effect -> Action is NOT allowed (would be circular)
      changeLanguage(response.user.language);
    })
    .catch(error => {
      // Emit failure event
      const apiError = error as ApiError;
      eventBus.emit(UserEvents.UserFetchFailed, {
        error: {
          code: apiError.code || 'UNKNOWN_ERROR',
          message: apiError.message || 'Failed to fetch user',
        },
      });
    });
};
