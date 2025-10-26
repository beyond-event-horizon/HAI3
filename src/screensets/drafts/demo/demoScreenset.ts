import { type ScreensetConfig } from '@hai3/uicore';
import { HelloWorldScreen, HELLO_WORLD_SCREEN_ID } from './screens/helloworld/HelloWorldScreen';
import { CurrentThemeScreen, CURRENT_THEME_SCREEN_ID } from './screens/theme/CurrentThemeScreen';
import { WORLD_ICON_ID } from './uikit/icons/WorldIcon';
import { PALETTE_ICON_ID } from './uikit/icons/PaletteIcon';
import './uikit/icons/WorldIcon'; // Auto-registers on import
import './uikit/icons/PaletteIcon'; // Auto-registers on import

/**
 * Demo Screenset ID
 * Well-known constant defined where it belongs
 */
export const DEMO_SCREENSET_ID = 'demo';

/**
 * Demo Screenset Configuration
 * Self-contained - knows about its own screens, icons, and structure
 */
export const demoScreenset: ScreensetConfig = {
  id: DEMO_SCREENSET_ID,
  name: 'Demo',
  category: 'drafts',
  defaultScreen: HELLO_WORLD_SCREEN_ID,
  screens: {
    [HELLO_WORLD_SCREEN_ID]: HelloWorldScreen,
    [CURRENT_THEME_SCREEN_ID]: CurrentThemeScreen,
  },
  menuItems: [
    {
      id: HELLO_WORLD_SCREEN_ID,
      label: 'Hello World',
      icon: WORLD_ICON_ID,
    },
    {
      id: CURRENT_THEME_SCREEN_ID,
      label: 'Current Theme',
      icon: PALETTE_ICON_ID,
    },
  ],
};
