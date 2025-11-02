/**
 * Core Icons Registry
 * Defines icon IDs and self-registers core framework icons
 */

import { iconService } from '@hai3/uicore';
import { MenuIcon, CloseIcon } from '@hai3/uikit';

/**
 * Core Icon IDs
 */
export const MENU_ICON_ID = 'menu' as const;
export const CLOSE_ICON_ID = 'close' as const;

// Self-register core icons
iconService.register(MENU_ICON_ID, <MenuIcon />);
iconService.register(CLOSE_ICON_ID, <CloseIcon />);
