/**
 * Chat Copy Store Configuration
 *
 * Exports chat copy reducer and effects for dynamic registration with uicore store.
 * Module augmentation extends uicore RootState to include chatCopy slice.
 */

import type { RootState } from '@hai3/uicore';
import chatCopyReducer, { type ChatCopyState } from './slices/chatCopySlice';
import { initializeChatCopyEffects } from './effects/chatCopyEffects';
import { CHAT_COPY_SCREENSET_ID } from './ids';
import './events/chatCopyEvents'; // Import to trigger module augmentation

/**
 * State key enum for type-safe module augmentation
 * Uses template literal to compute key from CHAT_COPY_SCREENSET_ID at compile time
 * When CHAT_COPY_SCREENSET_ID changes (e.g., during screenset duplication),
 * this enum value automatically updates, and so does the RootState augmentation
 */
export enum ChatCopyStateKeys {
  State = `${CHAT_COPY_SCREENSET_ID}`
}

// Module augmentation - extends uicore RootState with chatCopy slice
// Uses enum key so it auto-updates when CHAT_COPY_SCREENSET_ID changes
declare module '@hai3/uicore' {
  interface RootState {
    [ChatCopyStateKeys.State]: ChatCopyState;
  }
}

/**
 * Type-safe selector for chat copy state
 * Works everywhere (components and effects) thanks to proper RootState typing
 *
 * Usage in components:
 *   const chatCopy = useAppSelector(selectChatCopyState);
 *
 * Usage in effects:
 *   const chatCopy = selectChatCopyState(store.getState());
 *
 * This is fully type-safe because:
 * - RootState is explicitly defined and augmented via ChatCopyStateKeys enum
 * - store.getState() is typed to return RootState
 * - Module augmentation extends RootState when CHAT_COPY_SCREENSET_ID changes
 * - No casting needed anywhere!
 */
export const selectChatCopyState = (state: RootState): ChatCopyState => {
  return state[ChatCopyStateKeys.State];
};

// Export for dynamic registration
export { chatCopyReducer, initializeChatCopyEffects };
export type { ChatCopyState };
