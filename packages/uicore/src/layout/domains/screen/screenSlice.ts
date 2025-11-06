import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { LayoutDomains } from '../../layoutSlice';

/**
 * Screen slice for managing screen state
 */

export interface ScreenState {
  activeScreen: string | null;
  loading: boolean;
}

const initialState: ScreenState = {
  activeScreen: null,
  loading: false,
};

const screenSlice = createSlice({
  name: LayoutDomains.Screen,
  initialState,
  reducers: {
    setActiveScreen: (state, action: PayloadAction<string>) => {
      state.activeScreen = action.payload;
    },
    setScreenLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    clearActiveScreen: (state) => {
      state.activeScreen = null;
    },
  },
});

export const { setActiveScreen, setScreenLoading, clearActiveScreen } = screenSlice.actions;
export default screenSlice.reducer;
