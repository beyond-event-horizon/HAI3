/**
 * Chat Store Configuration
 *
 * Exports chat reducer and effects for dynamic registration with uicore store.
 * Module augmentation extends uicore RootState to include chat slice.
 */

import type { RootState } from '@hai3/uicore';
import chatReducer, { type ChatState } from './slices/chatSlice';
import { initializeChatEffects } from './effects/chatEffects';
import { CHAT_SCREENSET_ID } from './ids';
import './events/chatEvents'; // Import to trigger module augmentation

/**
 * State key enum for type-safe module augmentation
 * Uses template literal to compute key from CHAT_SCREENSET_ID at compile time
 * When CHAT_SCREENSET_ID changes (e.g., during screenset duplication),
 * this enum value automatically updates, and so does the RootState augmentation
 */
export enum ChatStateKeys {
  State = `${CHAT_SCREENSET_ID}`
}

// Module augmentation - extends uicore RootState with chat slice
// Uses enum key so it auto-updates when CHAT_SCREENSET_ID changes
declare module '@hai3/uicore' {
  interface RootState {
    [ChatStateKeys.State]: ChatState;
  }
}

/**
 * Type-safe selector for chat state
 * Works everywhere (components and effects) thanks to proper RootState typing
 *
 * Usage in components:
 *   const chat = useAppSelector(selectChatState);
 *
 * Usage in effects:
 *   const chat = selectChatState(store.getState());
 *
 * This is fully type-safe because:
 * - RootState is explicitly defined and augmented via ChatStateKeys enum
 * - store.getState() is typed to return RootState
 * - Module augmentation extends RootState when CHAT_SCREENSET_ID changes
 * - No casting needed anywhere!
 */
export const selectChatState = (state: RootState): ChatState => {
  return state[ChatStateKeys.State];
};

// Export for dynamic registration
export { chatReducer, initializeChatEffects };
export type { ChatState };
