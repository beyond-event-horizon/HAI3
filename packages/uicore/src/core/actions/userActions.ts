/**
 * User Actions - Async actions for user data
 * Following Flux architecture pattern
 */

import type { AppDispatch } from '../../store';
import { eventBus } from '../events/eventBus';
import { UserEvents } from '../events/eventTypes';
import { apiServices } from '../../api/apiServices';
import { ACCOUNTS_DOMAIN } from '../../api/accounts/AccountsApiService';
import { setLoading } from '../../app/appSlice';
import type { ApiError } from '../../api/accounts/api';

/**
 * Fetch current user
 * Uses AccountsApiService (accounts domain: users, tenants, auth)
 * Type-safe access via getService() - type inferred from ApiServicesMap
 * Mock handling is transparent - managed by BaseApiService interceptor
 * Emits events for success/failure
 */
export const fetchCurrentUser = () => async (dispatch: AppDispatch): Promise<void> => {
  try {
    dispatch(setLoading(true));
    
    const accountsService = apiServices.getService(ACCOUNTS_DOMAIN);
    const response = await accountsService.getCurrentUser();

    // Emit success event
    eventBus.emit(UserEvents.UserFetched, {
      user: response.user,
    });
  } catch (error) {
    // Emit failure event
    const apiError = error as ApiError;
    eventBus.emit(UserEvents.UserFetchFailed, {
      error: {
        code: apiError.code || 'UNKNOWN_ERROR',
        message: apiError.message || 'Failed to fetch user',
      },
    });
  }
};
