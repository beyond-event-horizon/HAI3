/**
 * Chat Copy Slice
 * Redux slice for chat copy state management
 * Following Flux: Effects dispatch these reducers after listening to events
 */

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '@hai3/uicore';
import type { Message, Thread, AttachedFile, Context } from '../types';
import { DEFAULT_MODEL } from '../constants/modelConstants';
import { CHAT_COPY_SCREENSET_ID } from '../ids';
import '../events/chatCopyEvents'; // Import to trigger module augmentation

export interface ChatCopyState {
  threads: Thread[];
  messages: Message[];
  currentThreadId: string | null;
  currentModel: string;
  currentContext: string[];
  availableContexts: Context[];
  inputValue: string;
  isStreaming: boolean;
  attachedFiles: AttachedFile[];
  editingMessageId: string | null;
  editedContent: string;
}

// Initialize with empty state - data will be loaded from API
const initialState: ChatCopyState = {
  threads: [],
  messages: [],
  currentThreadId: null,
  currentModel: DEFAULT_MODEL,
  currentContext: [],
  availableContexts: [],
  inputValue: '',
  isStreaming: false,
  attachedFiles: [],
  editingMessageId: null,
  editedContent: '',
};

export const chatCopySlice = createSlice({
  name: CHAT_COPY_SCREENSET_ID,
  initialState,
  reducers: {
    // Thread management
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

    // Message management
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

    // Editing
    setEditingMessageId: (state, action: PayloadAction<string | null>) => {
      state.editingMessageId = action.payload;
    },
    setEditedContent: (state, action: PayloadAction<string>) => {
      state.editedContent = action.payload;
    },

    // Model and context
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

    // Files
    setAttachedFiles: (state, action: PayloadAction<AttachedFile[]>) => {
      state.attachedFiles = action.payload;
    },
    addFileToList: (state, action: PayloadAction<{ file: AttachedFile }>) => {
      state.attachedFiles.push(action.payload.file);
    },
    removeFileFromList: (state, action: PayloadAction<{ fileId: string }>) => {
      state.attachedFiles = state.attachedFiles.filter(f => f.id !== action.payload.fileId);
    },

    // Input
    setInputValue: (state, action: PayloadAction<string>) => {
      state.inputValue = action.payload;
    },

    // Streaming
    setIsStreaming: (state, action: PayloadAction<boolean>) => {
      state.isStreaming = action.payload;
    },

    // Reset
    resetChatCopy: () => initialState,
  },
});

export const {
  setThreads,
  setCurrentThreadId,
  addThread,
  removeThread,
  updateThread,
  setMessages,
  addMessage,
  updateMessage,
  toggleMessageRawMarkdown,
  removeMessage,
  removeMessagesAfter,
  setEditingMessageId,
  setEditedContent,
  setCurrentModel,
  setCurrentContext,
  setAvailableContexts,
  addContextToList,
  removeContextFromList,
  setAttachedFiles,
  addFileToList,
  removeFileFromList,
  setInputValue,
  setIsStreaming,
  resetChatCopy,
} = chatCopySlice.actions;

// Export reducer with proper name for validation
const chatCopyReducer = chatCopySlice.reducer;
Object.defineProperty(chatCopyReducer, 'name', { value: CHAT_COPY_SCREENSET_ID });
export default chatCopyReducer;

// Module augmentation - extends uicore RootState with chatCopy slice
declare module '@hai3/uicore' {
  interface RootState {
    [CHAT_COPY_SCREENSET_ID]: ChatCopyState;
  }
}

/**
 * Type-safe selector for chat copy state
 * Usage in components: const chatCopy = useAppSelector(selectChatCopyState);
 * Usage in effects: const chatCopy = selectChatCopyState(store.getState());
 */
export const selectChatCopyState = (state: RootState): ChatCopyState => {
  return state[CHAT_COPY_SCREENSET_ID];
};

// Re-export effects for registration
export { initializeChatCopyEffects } from '../effects/chatCopyEffects';
