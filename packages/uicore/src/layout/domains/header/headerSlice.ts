import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { ReactNode } from 'react';
import { LayoutDomains } from '@/core/layout/layoutSlice';

/**
 * Header slice for managing header configuration
 */

export interface HeaderState {
  logo: string; // Logo text (serializable)
  actions: ReactNode; // Keep ReactNode for flexibility, but avoid storing in Redux
  showMenuToggle: boolean;
}

const initialState: HeaderState = {
  logo: '',
  actions: null,
  showMenuToggle: true,
};

const headerSlice = createSlice({
  name: LayoutDomains.Header,
  initialState,
  reducers: {
    setHeaderLogo: (state, action: PayloadAction<string>) => {
      state.logo = action.payload;
    },
    setHeaderActions: (state, action: PayloadAction<ReactNode>) => {
      state.actions = action.payload;
    },
    setShowMenuToggle: (state, action: PayloadAction<boolean>) => {
      state.showMenuToggle = action.payload;
    },
    setHeaderConfig: (state, action: PayloadAction<Partial<HeaderState>>) => {
      return { ...state, ...action.payload };
    },
  },
});

export const { setHeaderLogo, setHeaderActions, setShowMenuToggle, setHeaderConfig } = headerSlice.actions;
export default headerSlice.reducer;
