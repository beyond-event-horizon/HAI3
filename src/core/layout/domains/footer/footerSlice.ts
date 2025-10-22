import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { LayoutDomains } from '@/core/layout/layoutSlice';

/**
 * Footer slice for managing footer configuration
 */

interface FooterState {
  copyright: string | null;
  links: Array<{ label: string; href: string }>;
  visible: boolean;
}

const initialState: FooterState = {
  copyright: null,
  links: [],
  visible: true,
};

const footerSlice = createSlice({
  name: LayoutDomains.Footer,
  initialState,
  reducers: {
    setFooterCopyright: (state, action: PayloadAction<string | null>) => {
      state.copyright = action.payload;
    },
    setFooterLinks: (state, action: PayloadAction<Array<{ label: string; href: string }>>) => {
      state.links = action.payload;
    },
    setFooterVisible: (state, action: PayloadAction<boolean>) => {
      state.visible = action.payload;
    },
    setFooterConfig: (state, action: PayloadAction<Partial<FooterState>>) => {
      return { ...state, ...action.payload };
    },
  },
});

export const { setFooterCopyright, setFooterLinks, setFooterVisible, setFooterConfig } = footerSlice.actions;
export default footerSlice.reducer;
