/**
 * Chat Screenset
 * Full-featured chat interface with threads, messages, and LLM controls
 */

import { type ScreensetConfig, uikitRegistry } from '@hai3/uicore';
import { ChatScreen, CHAT_SCREEN_ID } from './screens/chat/ChatScreen';
import { MessageSquareIcon, MESSAGE_SQUARE_ICON_ID } from './uikit/icons/MessageSquareIcon';

/**
 * Chat Screenset ID
 * Well-known constant defined where it belongs
 */
export const CHAT_SCREENSET_ID = 'chat';

/**
 * Register screenset-specific icons
 * Screenset is responsible for registering its own icons
 */
uikitRegistry.registerIcons({
  [MESSAGE_SQUARE_ICON_ID]: <MessageSquareIcon />,
});

/**
 * Chat Screenset Configuration
 * Self-contained - knows about its own screens, icons, and structure
 */
export const chatScreenset: ScreensetConfig = {
  id: CHAT_SCREENSET_ID,
  name: 'Chat',
  category: 'drafts',
  defaultScreen: CHAT_SCREEN_ID,
  menu: [
    {
      menuItem: {
        id: CHAT_SCREEN_ID,
        label: 'Chat',
        icon: MESSAGE_SQUARE_ICON_ID,
      },
      screen: ChatScreen,
    },
  ],
};
