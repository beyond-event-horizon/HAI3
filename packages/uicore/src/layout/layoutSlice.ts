import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { UICORE_ID } from '../core/constants';

/**
 * Layout slice for managing layout state
 * Note: Theme names are defined in app's theme registry
 */

const DOMAIN_ID = 'layout';
const SLICE_KEY = `${UICORE_ID}/${DOMAIN_ID}` as const;

// Layout domain IDs for nested slices
export const LAYOUT_DOMAINS = {
  HEADER: 'header',
  FOOTER: 'footer',
  MENU: 'menu',
  SIDEBAR: 'sidebar',
  SCREEN: 'screen',
  POPUP: 'popup',
  OVERLAY: 'overlay',
} as const;

export interface LayoutState {
  theme: string;
  currentScreenset: string; // Format: "category:screensetId"
  selectedScreen: string | null; // Currently selected screen ID
}

const initialState: LayoutState = {
  theme: '', // Set by app
  currentScreenset: '', // Set by app
  selectedScreen: null,
};

const layoutSlice = createSlice({
  name: SLICE_KEY,
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<string>) => {
      state.theme = action.payload;
    },
    setCurrentScreenset: (state, action: PayloadAction<string>) => {
      state.currentScreenset = action.payload;
    },
    setSelectedScreen: (state, action: PayloadAction<string | null>) => {
      state.selectedScreen = action.payload;
    },
  },
});

export const { setTheme, setCurrentScreenset, setSelectedScreen } = layoutSlice.actions;
export default layoutSlice.reducer;

// Ensure reducer name matches slice key (convention for self-containment)
Object.defineProperty(layoutSlice.reducer, 'name', { value: SLICE_KEY });
