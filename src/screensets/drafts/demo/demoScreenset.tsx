import { type ScreensetConfig, uikitRegistry } from '@hai3/uicore';
import { HelloWorldScreen, HELLO_WORLD_SCREEN_ID } from './screens/helloworld/HelloWorldScreen';
import { CurrentThemeScreen, CURRENT_THEME_SCREEN_ID } from './screens/theme/CurrentThemeScreen';
import { ProfileScreen, PROFILE_SCREEN_ID } from './screens/profile/ProfileScreen';
import { WorldIcon, WORLD_ICON_ID } from './uikit/icons/WorldIcon';
import { PaletteIcon, PALETTE_ICON_ID } from './uikit/icons/PaletteIcon';
import { UserIcon, USER_ICON_ID } from './uikit/icons/UserIcon';

/**
 * Demo Screenset ID
 * Well-known constant defined where it belongs
 */
export const DEMO_SCREENSET_ID = 'demo';

/**
 * Register screenset-specific icons
 * Screenset is responsible for registering its own icons
 */
uikitRegistry.registerIcons({
  [WORLD_ICON_ID]: <WorldIcon />,
  [PALETTE_ICON_ID]: <PaletteIcon />,
  [USER_ICON_ID]: <UserIcon />,
});

/**
 * Demo Screenset Configuration
 * Self-contained - knows about its own screens, icons, and structure
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
        label: 'Hello World',
        icon: WORLD_ICON_ID,
      },
      screen: HelloWorldScreen,
    },
    {
      menuItem: {
        id: CURRENT_THEME_SCREEN_ID,
        label: 'Current Theme',
        icon: PALETTE_ICON_ID,
      },
      screen: CurrentThemeScreen,
    },
    {
      menuItem: {
        id: PROFILE_SCREEN_ID,
        label: 'User Profile',
        icon: USER_ICON_ID,
      },
      screen: ProfileScreen,
    },
  ],
};
