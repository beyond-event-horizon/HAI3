import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { ReactNode } from 'react';
import { UICORE_ID } from '../../../core/constants';
import { LAYOUT_DOMAINS } from '../../layoutSlice';

/**
 * Sidebar slice for managing sidebar state and configuration
 */

const DOMAIN_ID = LAYOUT_DOMAINS.SIDEBAR;
const SLICE_KEY = `${UICORE_ID}/${DOMAIN_ID}` as const;

export enum SidebarPosition {
  Left = 'left',
  Right = 'right',
}

export interface SidebarState {
  collapsed: boolean;
  position: SidebarPosition;
  title: string | null;
  content: ReactNode;
  visible: boolean;
}

const initialState: SidebarState = {
  collapsed: false,
  position: SidebarPosition.Left,
  title: null,
  content: null,
  visible: false,
};

const sidebarSlice = createSlice({
  name: SLICE_KEY,
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.collapsed = !state.collapsed;
    },
    setSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.collapsed = action.payload;
    },
    setSidebarPosition: (state, action: PayloadAction<SidebarPosition>) => {
      state.position = action.payload;
    },
    setSidebarTitle: (state, action: PayloadAction<string | null>) => {
      state.title = action.payload;
    },
    setSidebarContent: (state, action: PayloadAction<ReactNode>) => {
      state.content = action.payload;
    },
    setSidebarVisible: (state, action: PayloadAction<boolean>) => {
      state.visible = action.payload;
    },
    setSidebarConfig: (state, action: PayloadAction<Partial<SidebarState>>) => {
      return { ...state, ...action.payload };
    },
  },
});

export const {
  toggleSidebar,
  setSidebarCollapsed,
  setSidebarPosition,
  setSidebarTitle,
  setSidebarContent,
  setSidebarVisible,
  setSidebarConfig,
} = sidebarSlice.actions;
export default sidebarSlice.reducer;

// Ensure reducer name matches slice key (convention for self-containment)
Object.defineProperty(sidebarSlice.reducer, 'name', { value: SLICE_KEY });
