/**
 * Chat Threads Slice
 * Manages thread list and selection
 * Following Flux: Effects dispatch these reducers after listening to events
 */

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '@hai3/uicore';
import type { Thread } from '../types';
import { CHAT_SCREENSET_ID } from '../ids';

const SLICE_KEY = `${CHAT_SCREENSET_ID}/threads` as const;

export interface ThreadsState {
  threads: Thread[];
  currentThreadId: string | null;
}

const initialState: ThreadsState = {
  threads: [],
  currentThreadId: null,
};

export const threadsSlice = createSlice({
  name: SLICE_KEY,
  initialState,
  reducers: {
    setThreads: (state, action: PayloadAction<Thread[]>) => {
      state.threads = action.payload;
    },
    setCurrentThreadId: (state, action: PayloadAction<string | null>) => {
      state.currentThreadId = action.payload;
    },
    addThread: (state, action: PayloadAction<Thread>) => {
      state.threads.unshift(action.payload);
    },
    removeThread: (state, action: PayloadAction<{ threadId: string }>) => {
      state.threads = state.threads.filter((t) => t.id !== action.payload.threadId);
    },
    updateThread: (state, action: PayloadAction<{ threadId: string; updates: Partial<Thread> }>) => {
      const thread = state.threads.find((t) => t.id === action.payload.threadId);
      if (thread) {
        Object.assign(thread, action.payload.updates);
      }
    },
  },
});

export const {
  setThreads,
  setCurrentThreadId,
  addThread,
  removeThread,
  updateThread,
} = threadsSlice.actions;

// Export reducer with proper name for validation
const threadsReducer = threadsSlice.reducer;
Object.defineProperty(threadsReducer, 'name', { value: SLICE_KEY });
export default threadsReducer;

// Module augmentation - extends uicore RootState
declare module '@hai3/uicore' {
  interface RootState {
    [SLICE_KEY]: ThreadsState;
  }
}

/**
 * Type-safe selector for threads state
 */
export const selectThreadsState = (state: RootState): ThreadsState => {
  return state[SLICE_KEY];
};
