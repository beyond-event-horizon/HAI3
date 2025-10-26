import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { ReactNode } from 'react';
import { LayoutDomains } from '@/core/layout/layoutSlice';

/**
 * Sidebar slice for managing sidebar state and configuration
 */

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
  name: LayoutDomains.Sidebar,
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
