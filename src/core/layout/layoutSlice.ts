import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

/**
 * Layout slice for managing layout state
 */

export enum Theme {
  Light = 'light',
  Dark = 'dark',
}

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
  theme: Theme;
}

const initialState: LayoutState = {
  theme: Theme.Light,
};

const layoutSlice = createSlice({
  name: LAYOUT_SLICE_NAME,
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<Theme>) => {
      state.theme = action.payload;
    },
    toggleTheme: (state) => {
      state.theme = state.theme === Theme.Light ? Theme.Dark : Theme.Light;
    },
  },
});

export const { setTheme, toggleTheme } = layoutSlice.actions;
export default layoutSlice.reducer;
