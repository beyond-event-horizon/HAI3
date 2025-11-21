import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { UICORE_ID } from '../../../core/constants';
import { LAYOUT_DOMAINS } from '../../layoutSlice';

/**
 * Footer slice for managing footer configuration
 */

const DOMAIN_ID = LAYOUT_DOMAINS.FOOTER;
const SLICE_KEY = `${UICORE_ID}/${DOMAIN_ID}` as const;

export interface ScreensetOption {
  category: string;
  screensets: Array<{ id: string; name: string }>;
}

export interface FooterState {
  screensetOptions: ScreensetOption[];
  visible: boolean;
}

const initialState: FooterState = {
  screensetOptions: [],
  visible: true,
};

const footerSlice = createSlice({
  name: SLICE_KEY,
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

// Ensure reducer name matches slice key (convention for self-containment)
Object.defineProperty(footerSlice.reducer, 'name', { value: SLICE_KEY });
