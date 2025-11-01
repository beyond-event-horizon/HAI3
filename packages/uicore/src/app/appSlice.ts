import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { ApiUser } from '../api/accounts/api';

/**
 * App Slice - Application-level state
 * Manages user authentication, tenant, loading/error states, and API configuration
 * Updated by appEffects based on events
 */

const APP_SLICE_NAME = 'app';

export interface AppState {
  user: ApiUser | null;
  tenant: unknown | null; // TODO: Define Tenant type in accounts/api.ts
  loading: boolean;
  error: string | null;
  useMockApi: boolean;
}

const initialState: AppState = {
  user: null,
  tenant: null,
  loading: false,
  error: null,
  useMockApi: true, // Default to mock API
};

const appSlice = createSlice({
  name: APP_SLICE_NAME,
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<ApiUser | null>) => {
      state.user = action.payload;
    },
    setTenant: (state, action: PayloadAction<unknown | null>) => {
      state.tenant = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    setUseMockApi: (state, action: PayloadAction<boolean>) => {
      state.useMockApi = action.payload;
    },
  },
});

export const { setUser, setTenant, setLoading, setError, clearError, setUseMockApi } = appSlice.actions;

export default appSlice.reducer;
