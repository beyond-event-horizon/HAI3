import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { ThemeName } from '@/styles/themeRegistry';

/**
 * Layout slice for managing layout state
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

interface LayoutState {
  theme: ThemeName;
}

const initialState: LayoutState = {
  theme: 'light',
};

const layoutSlice = createSlice({
  name: LAYOUT_SLICE_NAME,
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<ThemeName>) => {
      state.theme = action.payload;
    },
  },
});

export const { setTheme } = layoutSlice.actions;
export default layoutSlice.reducer;
