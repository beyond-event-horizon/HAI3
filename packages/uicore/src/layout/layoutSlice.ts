import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

/**
 * Layout slice for managing layout state
 * Note: Theme names are defined in app's theme registry
 */

export enum LayoutDomains {
  Header = 'header',
  Footer = 'footer',
  Menu = 'menu',
  Sidebar = 'sidebar',
  Screen = 'screen',
  Popup = 'popup',
  Overlay = 'overlay',
}

const LAYOUT_SLICE_NAME = 'layout';

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
  name: LAYOUT_SLICE_NAME,
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
