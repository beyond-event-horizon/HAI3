/**
 * Core Icons Registry
 * Registers app-level icons used by layout components
 * Screenset-specific icons are registered by their screensets
 */

import { iconService } from '@hai3/uicore';
import { MenuIcon, MENU_ICON_ID, CloseIcon, CLOSE_ICON_ID } from '@hai3/uikit';
import { HAI3_LOGO_ICON_ID } from './HAI3LogoIcon'; // Auto-registers on import
import { HAI3_LOGO_TEXT_ICON_ID } from './HAI3LogoTextIcon'; // Auto-registers on import

// Re-export icon IDs for use by layout components
export { MENU_ICON_ID, CLOSE_ICON_ID, HAI3_LOGO_ICON_ID, HAI3_LOGO_TEXT_ICON_ID };

// Register core framework icons
iconService.register(MENU_ICON_ID, <MenuIcon />);
iconService.register(CLOSE_ICON_ID, <CloseIcon />);
