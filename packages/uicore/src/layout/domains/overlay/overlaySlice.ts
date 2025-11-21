import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { UICORE_ID } from '../../../core/constants';
import { LAYOUT_DOMAINS } from '../../layoutSlice';

/**
 * Overlay slice for managing overlay state
 */

const DOMAIN_ID = LAYOUT_DOMAINS.OVERLAY;
const SLICE_KEY = `${UICORE_ID}/${DOMAIN_ID}` as const;

export interface OverlayState {
  visible: boolean;
}

const initialState: OverlayState = {
  visible: false,
};

const overlaySlice = createSlice({
  name: SLICE_KEY,
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

// Ensure reducer name matches slice key (convention for self-containment)
Object.defineProperty(overlaySlice.reducer, 'name', { value: SLICE_KEY });
