import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { User, Tenant } from './types';

/**
 * Core slice for managing global application state
 * Handles user authentication, tenant information, and global loading/error states
 */

const CORE_SLICE_NAME = 'core';

interface CoreSliceState {
  user: User | null;
  tenant: Tenant | null;
  loading: boolean;
  error: string | null;
}

const initialState: CoreSliceState = {
  user: null,
  tenant: null,
  loading: false,
  error: null,
};

const coreSlice = createSlice({
  name: CORE_SLICE_NAME,
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
    },
    setTenant: (state, action: PayloadAction<Tenant | null>) => {
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
  },
});

export const { setUser, setTenant, setLoading, setError, clearError } =
  coreSlice.actions;

export default coreSlice.reducer;
