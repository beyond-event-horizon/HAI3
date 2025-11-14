/**
 * Chat Screenset
 * Full-featured chat interface with threads, messages, and LLM controls
 */

import { type ScreensetConfig, uikitRegistry, i18nRegistry, Language, type TranslationDictionary, registerSlice } from '@hai3/uicore';
import { CHAT_SCREEN_ID } from './screens/screenIds';
import { MessageSquareIcon, MESSAGE_SQUARE_ICON_ID } from './uikit/icons/MessageSquareIcon';
import { chatReducer, initializeChatEffects } from './chatStore';

/**
 * Chat Screenset ID
 * Well-known constant defined where it belongs
 */
export const CHAT_SCREENSET_ID = 'chat';

/**
 * Register translations
 * All screenset configuration in one place
 * Record<Language, ...> enforces ALL 36 languages at compile time
 */
const TRANSLATIONS: Record<Language, () => Promise<{ default: TranslationDictionary }>> = {
  [Language.English]: () => import('./i18n/en.json'),
  [Language.Arabic]: () => import('./i18n/ar.json'),
  [Language.Spanish]: () => import('./i18n/es.json'),
  [Language.French]: () => import('./i18n/fr.json'),
  [Language.German]: () => import('./i18n/de.json'),
  [Language.Italian]: () => import('./i18n/it.json'),
  [Language.Portuguese]: () => import('./i18n/pt.json'),
  [Language.Dutch]: () => import('./i18n/nl.json'),
  [Language.Russian]: () => import('./i18n/ru.json'),
  [Language.Polish]: () => import('./i18n/pl.json'),
  [Language.Ukrainian]: () => import('./i18n/uk.json'),
  [Language.Czech]: () => import('./i18n/cs.json'),
  [Language.Hebrew]: () => import('./i18n/he.json'),
  [Language.Persian]: () => import('./i18n/fa.json'),
  [Language.Urdu]: () => import('./i18n/ur.json'),
  [Language.Turkish]: () => import('./i18n/tr.json'),
  [Language.ChineseSimplified]: () => import('./i18n/zh.json'),
  [Language.ChineseTraditional]: () => import('./i18n/zh-TW.json'),
  [Language.Japanese]: () => import('./i18n/ja.json'),
  [Language.Korean]: () => import('./i18n/ko.json'),
  [Language.Vietnamese]: () => import('./i18n/vi.json'),
  [Language.Thai]: () => import('./i18n/th.json'),
  [Language.Indonesian]: () => import('./i18n/id.json'),
  [Language.Hindi]: () => import('./i18n/hi.json'),
  [Language.Bengali]: () => import('./i18n/bn.json'),
  [Language.Swedish]: () => import('./i18n/sv.json'),
  [Language.Danish]: () => import('./i18n/da.json'),
  [Language.Norwegian]: () => import('./i18n/no.json'),
  [Language.Finnish]: () => import('./i18n/fi.json'),
  [Language.Greek]: () => import('./i18n/el.json'),
  [Language.Romanian]: () => import('./i18n/ro.json'),
  [Language.Hungarian]: () => import('./i18n/hu.json'),
  [Language.Malay]: () => import('./i18n/ms.json'),
  [Language.Tagalog]: () => import('./i18n/tl.json'),
  [Language.Tamil]: () => import('./i18n/ta.json'),
  [Language.Swahili]: () => import('./i18n/sw.json'),
};

i18nRegistry.registerLoader(`screenset.${CHAT_SCREENSET_ID}`, async (language: Language): Promise<TranslationDictionary> => {
  const module = await TRANSLATIONS[language]();
  return module.default;
});

/**
 * Register screenset-specific icons
 * Screenset is responsible for registering its own icons
 */
uikitRegistry.registerIcons({
  [MESSAGE_SQUARE_ICON_ID]: <MessageSquareIcon />,
});

/**
 * Register chat slice dynamically with uicore store
 * Screensets can add their state without modifying uicore package
 */
registerSlice('chat', chatReducer, initializeChatEffects);

/**
 * Chat Screenset Configuration
 * Self-contained - knows about its own screens, icons, and structure
 * Chat state is now part of global uicore store via dynamic registration
 * All screens are lazy-loaded for optimal performance
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
        label: `screenset.${CHAT_SCREENSET_ID}:screens.${CHAT_SCREEN_ID}.title`,
        icon: MESSAGE_SQUARE_ICON_ID,
      },
      screen: () => import('./screens/chat/ChatScreen'),
    },
  ],
};
