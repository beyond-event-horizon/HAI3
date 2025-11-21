/**
 * Chat Messages Slice
 * Manages messages in current thread, editing, and streaming
 * Following Flux: Effects dispatch these reducers after listening to events
 */

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '@hai3/uicore';
import type { Message } from '../types';
import { CHAT_SCREENSET_ID } from '../ids';

const SLICE_KEY = `${CHAT_SCREENSET_ID}/messages` as const;

export interface MessagesState {
  messages: Message[];
  isStreaming: boolean;
  editingMessageId: string | null;
  editedContent: string;
}

const initialState: MessagesState = {
  messages: [],
  isStreaming: false,
  editingMessageId: null,
  editedContent: '',
};

export const messagesSlice = createSlice({
  name: SLICE_KEY,
  initialState,
  reducers: {
    setMessages: (state, action: PayloadAction<Message[]>) => {
      state.messages = action.payload;
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
    },
    updateMessage: (state, action: PayloadAction<{ messageId: string; updates: Partial<Message> }>) => {
      const message = state.messages.find((m) => m.id === action.payload.messageId);
      if (message) {
        Object.assign(message, action.payload.updates);
      }
    },
    toggleMessageRawMarkdown: (state, action: PayloadAction<{ messageId: string }>) => {
      const message = state.messages.find((m) => m.id === action.payload.messageId);
      if (message) {
        message.showRawMarkdown = !message.showRawMarkdown;
      }
    },
    removeMessage: (state, action: PayloadAction<{ messageId: string }>) => {
      state.messages = state.messages.filter((m) => m.id !== action.payload.messageId);
    },
    removeMessagesAfter: (state, action: PayloadAction<{ messageId: string }>) => {
      const index = state.messages.findIndex((m) => m.id === action.payload.messageId);
      if (index !== -1) {
        state.messages = state.messages.slice(0, index + 1);
      }
    },
    setEditingMessageId: (state, action: PayloadAction<string | null>) => {
      state.editingMessageId = action.payload;
    },
    setEditedContent: (state, action: PayloadAction<string>) => {
      state.editedContent = action.payload;
    },
    setIsStreaming: (state, action: PayloadAction<boolean>) => {
      state.isStreaming = action.payload;
    },
  },
});

export const {
  setMessages,
  addMessage,
  updateMessage,
  toggleMessageRawMarkdown,
  removeMessage,
  removeMessagesAfter,
  setEditingMessageId,
  setEditedContent,
  setIsStreaming,
} = messagesSlice.actions;

// Export reducer with proper name for validation
const messagesReducer = messagesSlice.reducer;
Object.defineProperty(messagesReducer, 'name', { value: SLICE_KEY });
export default messagesReducer;

// Module augmentation - extends uicore RootState
declare module '@hai3/uicore' {
  interface RootState {
    [SLICE_KEY]: MessagesState;
  }
}

/**
 * Type-safe selector for messages state
 */
export const selectMessagesState = (state: RootState): MessagesState => {
  return state[SLICE_KEY];
};
