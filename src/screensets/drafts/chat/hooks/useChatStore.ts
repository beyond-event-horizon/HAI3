/**
 * useChatStore - React hook for chat store
 * Provides reactive access to chat state
 */

import { useEffect, useState } from 'react';
import { chatStore, type ChatState } from '../store/chatStore';

export function useChatStore<T>(selector: (state: ChatState) => T): T {
  const [value, setValue] = useState<T>(() => selector(chatStore.getState()));

  useEffect(() => {
    const unsubscribe = chatStore.subscribe((state) => {
      setValue(selector(state));
    });
    return unsubscribe;
  }, [selector]);

  return value;
}

// Convenience hook for full state
export function useFullChatStore(): ChatState {
  return useChatStore((state) => state);
}
