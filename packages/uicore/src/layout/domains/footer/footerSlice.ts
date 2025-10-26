import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { LayoutDomains } from '@/core/layout/layoutSlice';

/**
 * Footer slice for managing footer configuration
 */

export interface ScreensetOption {
  category: string;
  screensets: Array<{ id: string; name: string }>;
}

export interface FooterState {
  availableThemes: string[];
  screensetOptions: ScreensetOption[];
  visible: boolean;
}

const initialState: FooterState = {
  availableThemes: [],
  screensetOptions: [],
  visible: true,
};

const footerSlice = createSlice({
  name: LayoutDomains.Footer,
  initialState,
  reducers: {
    setFooterVisible: (state, action: PayloadAction<boolean>) => {
      state.visible = action.payload;
    },
    setFooterConfig: (state, action: PayloadAction<Partial<FooterState>>) => {
      return { ...state, ...action.payload };
    },
  },
});

export const { setFooterVisible, setFooterConfig } = footerSlice.actions;
export default footerSlice.reducer;
