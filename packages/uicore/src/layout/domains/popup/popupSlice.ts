import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { UICORE_ID } from '../../../core/constants';
import { LAYOUT_DOMAINS } from '../../layoutSlice';

/**
 * Popup slice for managing popup state
 */

const DOMAIN_ID = LAYOUT_DOMAINS.POPUP;
const SLICE_KEY = `${UICORE_ID}/${DOMAIN_ID}` as const;

export interface PopupState {
  id: string;
  title: string;
  component: string;
  props?: Record<string, unknown>;
  zIndex: number;
}

export interface PopupSliceState {
  stack: PopupState[];
}

const initialState: PopupSliceState = {
  stack: [],
};

const popupSlice = createSlice({
  name: SLICE_KEY,
  initialState,
  reducers: {
    openPopup: (state, action: PayloadAction<Omit<PopupState, 'zIndex'>>) => {
      const zIndex = 1000 + state.stack.length * 10;
      state.stack.push({ ...action.payload, zIndex });
    },
    closePopup: (state, action: PayloadAction<string>) => {
      state.stack = state.stack.filter(
        (popup) => popup.id !== action.payload
      );
    },
    closeTopPopup: (state) => {
      state.stack.pop();
    },
    closeAllPopups: (state) => {
      state.stack = [];
    },
  },
});

export const { openPopup, closePopup, closeTopPopup, closeAllPopups } = popupSlice.actions;

export default popupSlice.reducer;
