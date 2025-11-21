/**
 * Chat Composer Slice
 * Manages input composition (text and file attachments)
 * Following Flux: Effects dispatch these reducers after listening to events
 */

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '@hai3/uicore';
import type { AttachedFile } from '../types';
import { CHAT_SCREENSET_ID } from '../ids';

const SLICE_KEY = `${CHAT_SCREENSET_ID}/composer` as const;

export interface ComposerState {
  inputValue: string;
  attachedFiles: AttachedFile[];
}

const initialState: ComposerState = {
  inputValue: '',
  attachedFiles: [],
};

export const composerSlice = createSlice({
  name: SLICE_KEY,
  initialState,
  reducers: {
    setInputValue: (state, action: PayloadAction<string>) => {
      state.inputValue = action.payload;
    },
    setAttachedFiles: (state, action: PayloadAction<AttachedFile[]>) => {
      state.attachedFiles = action.payload;
    },
    addFileToList: (state, action: PayloadAction<{ file: AttachedFile }>) => {
      state.attachedFiles.push(action.payload.file);
    },
    removeFileFromList: (state, action: PayloadAction<{ fileId: string }>) => {
      state.attachedFiles = state.attachedFiles.filter(f => f.id !== action.payload.fileId);
    },
  },
});

export const {
  setInputValue,
  setAttachedFiles,
  addFileToList,
  removeFileFromList,
} = composerSlice.actions;

// Export the slice object (not just the reducer) for registerSlice()
// The slice.name property is automatically set by createSlice() to SLICE_KEY
export default composerSlice;

// Module augmentation - extends uicore RootState
declare module '@hai3/uicore' {
  interface RootState {
    [SLICE_KEY]: ComposerState;
  }
}

/**
 * Type-safe selector for composer state
 */
export const selectComposerState = (state: RootState): ComposerState => {
  return state[SLICE_KEY];
};
