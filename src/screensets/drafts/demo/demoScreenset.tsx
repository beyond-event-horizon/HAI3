import { type ScreensetConfig, uikitRegistry, i18nRegistry, Language, type TranslationDictionary } from '@hai3/uicore';
import { HELLO_WORLD_SCREEN_ID, CURRENT_THEME_SCREEN_ID, PROFILE_SCREEN_ID, UI_KIT_ELEMENTS_SCREEN_ID } from './screens/screenIds';
import { WorldIcon, WORLD_ICON_ID } from './uikit/icons/WorldIcon';
import { PaletteIcon, PALETTE_ICON_ID } from './uikit/icons/PaletteIcon';
import { UserIcon, USER_ICON_ID } from './uikit/icons/UserIcon';
import { ShadcnIcon, SHADCN_ICON_ID } from './uikit/icons/ShadcnIcon';

/**
 * Demo Screenset ID
 * Well-known constant defined where it belongs
 */
export const DEMO_SCREENSET_ID = 'demo';

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

i18nRegistry.registerLoader(`screenset.${DEMO_SCREENSET_ID}`, async (language: Language): Promise<TranslationDictionary> => {
  const module = await TRANSLATIONS[language]();
  return module.default;
});

// 36 languages supported with native translations
// Complete coverage of major tech platform languages (Google, Facebook, Microsoft, Apple)

/**
 * Register screenset-specific icons
 * Screenset is responsible for registering its own icons
 */
uikitRegistry.registerIcons({
  [WORLD_ICON_ID]: <WorldIcon />,
  [PALETTE_ICON_ID]: <PaletteIcon />,
  [USER_ICON_ID]: <UserIcon />,
  [SHADCN_ICON_ID]: <ShadcnIcon />,
});

/**
 * Demo Screenset Configuration
 * Self-contained - knows about its own screens, icons, translations, and structure
 * All screens are lazy-loaded for optimal performance
 */
export const demoScreenset: ScreensetConfig = {
  id: DEMO_SCREENSET_ID,
  name: 'Demo',
  category: 'drafts',
  defaultScreen: HELLO_WORLD_SCREEN_ID,
  menu: [
    {
      menuItem: {
        id: HELLO_WORLD_SCREEN_ID,
        label: `screenset.${DEMO_SCREENSET_ID}:screens.${HELLO_WORLD_SCREEN_ID}.title`,
        icon: WORLD_ICON_ID,
      },
      screen: () => import('./screens/helloworld/HelloWorldScreen'),
    },
    {
      menuItem: {
        id: CURRENT_THEME_SCREEN_ID,
        label: `screenset.${DEMO_SCREENSET_ID}:screens.${CURRENT_THEME_SCREEN_ID}.title`,
        icon: PALETTE_ICON_ID,
      },
      screen: () => import('./screens/theme/CurrentThemeScreen'),
    },
    {
      menuItem: {
        id: PROFILE_SCREEN_ID,
        label: `screenset.${DEMO_SCREENSET_ID}:screens.${PROFILE_SCREEN_ID}.title`,
        icon: USER_ICON_ID,
      },
      screen: () => import('./screens/profile/ProfileScreen'),
    },
    {
      menuItem: {
        id: UI_KIT_ELEMENTS_SCREEN_ID,
        label: `screenset.${DEMO_SCREENSET_ID}:screens.${UI_KIT_ELEMENTS_SCREEN_ID}.title`,
        icon: SHADCN_ICON_ID,
      },
      screen: () => import('./screens/uikit/UIKitElementsScreen'),
    },
  ],
};
