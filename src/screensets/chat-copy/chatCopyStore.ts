/**
 * Chat Copy Store Configuration
 *
 * Exports chat copy reducer and effects for dynamic registration with uicore store.
 * Module augmentation extends uicore RootState to include chatCopy slice.
 */

import chatCopyReducer, { type ChatCopyState } from './slices/chatCopySlice';
import { initializeChatCopyEffects } from './effects/chatCopyEffects';
import './events/chatCopyEvents'; // Import to trigger module augmentation

// Module augmentation - extends uicore RootState with chatCopy slice
declare module '@hai3/uicore' {
  interface RootState {
    chatCopy: ChatCopyState;
  }
}

// Export for dynamic registration
export { chatCopyReducer, initializeChatCopyEffects };
export type { ChatCopyState };
