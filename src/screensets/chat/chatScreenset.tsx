/**
 * Chat Screenset
 * Full-featured chat interface with threads, messages, and LLM controls
 */

import { type ScreensetConfig, ScreensetCategory, uikitRegistry, registerSlice, I18nRegistry, Language, apiRegistry, screensetRegistry } from '@hai3/uicore';
import { CHAT_SCREENSET_ID, CHAT_SCREEN_ID } from './ids';
import { MessageSquareIcon, MESSAGE_SQUARE_ICON_ID } from './uikit/icons/MessageSquareIcon';
import { chatReducer, initializeChatEffects } from './chatStore';

// Import for side effect - register API service
import { CHAT_DOMAIN } from './api/ChatApiService';
import './api/ChatApiService';
import { chatMockMap } from './api/mocks';

// Register mock data for API service
apiRegistry.registerMocks(CHAT_DOMAIN, chatMockMap);

/**
 * Screenset-level translations
 * All 36 languages must be provided for type safety
 */
const screensetTranslations = I18nRegistry.createLoader({
  [Language.English]: () => import('./i18n/en.json'),
  [Language.Arabic]: () => import('./i18n/ar.json'),
  [Language.Bengali]: () => import('./i18n/bn.json'),
  [Language.Czech]: () => import('./i18n/cs.json'),
  [Language.Danish]: () => import('./i18n/da.json'),
  [Language.German]: () => import('./i18n/de.json'),
  [Language.Greek]: () => import('./i18n/el.json'),
  [Language.Spanish]: () => import('./i18n/es.json'),
  [Language.Persian]: () => import('./i18n/fa.json'),
  [Language.Finnish]: () => import('./i18n/fi.json'),
  [Language.French]: () => import('./i18n/fr.json'),
  [Language.Hebrew]: () => import('./i18n/he.json'),
  [Language.Hindi]: () => import('./i18n/hi.json'),
  [Language.Hungarian]: () => import('./i18n/hu.json'),
  [Language.Indonesian]: () => import('./i18n/id.json'),
  [Language.Italian]: () => import('./i18n/it.json'),
  [Language.Japanese]: () => import('./i18n/ja.json'),
  [Language.Korean]: () => import('./i18n/ko.json'),
  [Language.Malay]: () => import('./i18n/ms.json'),
  [Language.Dutch]: () => import('./i18n/nl.json'),
  [Language.Norwegian]: () => import('./i18n/no.json'),
  [Language.Polish]: () => import('./i18n/pl.json'),
  [Language.Portuguese]: () => import('./i18n/pt.json'),
  [Language.Romanian]: () => import('./i18n/ro.json'),
  [Language.Russian]: () => import('./i18n/ru.json'),
  [Language.Swedish]: () => import('./i18n/sv.json'),
  [Language.Swahili]: () => import('./i18n/sw.json'),
  [Language.Tamil]: () => import('./i18n/ta.json'),
  [Language.Thai]: () => import('./i18n/th.json'),
  [Language.Tagalog]: () => import('./i18n/tl.json'),
  [Language.Turkish]: () => import('./i18n/tr.json'),
  [Language.Ukrainian]: () => import('./i18n/uk.json'),
  [Language.Urdu]: () => import('./i18n/ur.json'),
  [Language.Vietnamese]: () => import('./i18n/vi.json'),
  [Language.ChineseSimplified]: () => import('./i18n/zh.json'),
  [Language.ChineseTraditional]: () => import('./i18n/zh-TW.json'),
});

/**
 * Register screenset-specific icons
 * Screenset is responsible for registering its own icons
 * Screen-level translations are registered by each screen component when it mounts
 */
uikitRegistry.registerIcons({
  [MESSAGE_SQUARE_ICON_ID]: <MessageSquareIcon />,
});

/**
 * Register chat slice dynamically with uicore store
 * Screensets can add their state without modifying uicore package
 */
registerSlice(CHAT_SCREENSET_ID, chatReducer, initializeChatEffects);

/**
 * Chat Screenset Configuration
 * Self-contained - knows about its own screens, icons, and structure
 * Chat state is now part of global uicore store via dynamic registration
 * All screens are lazy-loaded for optimal performance
 */
export const chatScreenset: ScreensetConfig = {
  id: CHAT_SCREENSET_ID,
  name: 'Chat',
  category: ScreensetCategory.Mockups,
  defaultScreen: CHAT_SCREEN_ID,
  localization: screensetTranslations,
  menu: [
    {
      menuItem: {
        id: CHAT_SCREEN_ID,
        label: `screenset.${CHAT_SCREENSET_ID}:menu_items.chat.label`,
        icon: MESSAGE_SQUARE_ICON_ID,
      },
      screen: () => import('./screens/chat/ChatScreen'),
    },
  ],
};

/**
 * Self-register screenset
 * Auto-discovered via Vite glob import in screensetRegistry.tsx
 * This side effect runs when the module is imported
 */
screensetRegistry.register(chatScreenset);
