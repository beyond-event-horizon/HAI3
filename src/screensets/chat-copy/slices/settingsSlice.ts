/**
 * Chat Settings Slice
 * Manages model selection and context configuration
 * Following Flux: Effects dispatch these reducers after listening to events
 */

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '@hai3/uicore';
import type { Context } from '../types';
import { CHAT_COPY_SCREENSET_ID } from '../ids';
import { DEFAULT_MODEL } from '../constants/modelConstants';

const SLICE_KEY = `${CHAT_COPY_SCREENSET_ID}/settings` as const;



export interface SettingsState {
  currentModel: string;
  currentContext: string[];
  availableContexts: Context[];
}

const initialState: SettingsState = {
  currentModel: DEFAULT_MODEL,
  currentContext: [],
  availableContexts: [],
};

export const settingsSlice = createSlice({
  name: SLICE_KEY,
  initialState,
  reducers: {
    setCurrentModel: (state, action: PayloadAction<string>) => {
      state.currentModel = action.payload;
    },
    setCurrentContext: (state, action: PayloadAction<string[]>) => {
      state.currentContext = action.payload;
    },
    setAvailableContexts: (state, action: PayloadAction<Context[]>) => {
      state.availableContexts = action.payload;
    },
    addContextToList: (state, action: PayloadAction<{ contextId: string }>) => {
      if (!state.currentContext.includes(action.payload.contextId)) {
        state.currentContext.push(action.payload.contextId);
      }
    },
    removeContextFromList: (state, action: PayloadAction<{ contextId: string }>) => {
      state.currentContext = state.currentContext.filter(id => id !== action.payload.contextId);
    },
  },
});

export const {
  setCurrentModel,
  setCurrentContext,
  setAvailableContexts,
  addContextToList,
  removeContextFromList,
} = settingsSlice.actions;

// Export reducer with proper name for validation
const settingsReducer = settingsSlice.reducer;
Object.defineProperty(settingsReducer, 'name', { value: SLICE_KEY });
export default settingsReducer;

// Module augmentation - extends uicore RootState
declare module '@hai3/uicore' {
  interface RootState {
    [SLICE_KEY]: SettingsState;
  }
}

/**
 * Type-safe selector for settings state
 */
export const selectSettingsState = (state: RootState): SettingsState => {
  return state[SLICE_KEY];
};
