import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { LayoutDomains } from '@/core/layout/layoutSlice';

/**
 * Overlay slice for managing overlay state
 */

interface OverlayState {
  visible: boolean;
}

const initialState: OverlayState = {
  visible: false,
};

const overlaySlice = createSlice({
  name: LayoutDomains.Overlay,
  initialState,
  reducers: {
    showOverlay: (state) => {
      state.visible = true;
    },
    hideOverlay: (state) => {
      state.visible = false;
    },
    setOverlayVisible: (state, action: PayloadAction<boolean>) => {
      state.visible = action.payload;
    },
  },
});

export const { showOverlay, hideOverlay, setOverlayVisible } = overlaySlice.actions;
export default overlaySlice.reducer;
