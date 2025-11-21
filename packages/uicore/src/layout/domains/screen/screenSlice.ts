import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { UICORE_ID } from '../../../core/constants';
import { LAYOUT_DOMAINS } from '../../layoutSlice';

/**
 * Screen slice for managing screen state
 */

const DOMAIN_ID = LAYOUT_DOMAINS.SCREEN;
const SLICE_KEY = `${UICORE_ID}/${DOMAIN_ID}` as const;

export interface ScreenState {
  activeScreen: string | null;
  loading: boolean;
}

const initialState: ScreenState = {
  activeScreen: null,
  loading: false,
};

const screenSlice = createSlice({
  name: SLICE_KEY,
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
