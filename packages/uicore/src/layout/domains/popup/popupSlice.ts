import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { LayoutDomains } from '../../layoutSlice';

/**
 * Popup slice for managing popup state
 */

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
  name: LayoutDomains.Popup,
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
