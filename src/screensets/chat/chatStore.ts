/**
 * Chat Store Configuration
 * 
 * Exports chat reducer and effects for dynamic registration with uicore store.
 * Module augmentation extends uicore RootState to include chat slice.
 */

import chatReducer, { type ChatState } from './slices/chatSlice';
import { initializeChatEffects } from './effects/chatEffects';
import './events/chatEvents'; // Import to trigger module augmentation

// Module augmentation - extends uicore RootState with chat slice
declare module '@hai3/uicore' {
  interface RootState {
    chat: ChatState;
  }
}

// Export for dynamic registration
export { chatReducer, initializeChatEffects };
export type { ChatState };
