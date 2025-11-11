/**
 * Chat Store Initialization
 * Registers chat slice and initializes effects
 * Following Flux architecture with self-contained screenset pattern
 */

import { configureStore } from '@reduxjs/toolkit';
import chatReducer, { type ChatState } from './slices/chatSlice';
import { initializeChatEffects } from './effects/chatEffects';
import './events/chatEvents'; // Import to trigger module augmentation

/**
 * Chat store - isolated for this screenset
 * In a full implementation, this would be merged into the global store
 * For now, keeping it isolated for the draft screenset
 */
export const chatStore = configureStore({
  reducer: {
    chat: chatReducer,
  },
});

// Initialize effects
initializeChatEffects(chatStore.dispatch);

// Export types
export type ChatRootState = ReturnType<typeof chatStore.getState>;
export type ChatDispatch = typeof chatStore.dispatch;

// Selector helper
export const selectChat = (state: ChatRootState): ChatState => state.chat;
