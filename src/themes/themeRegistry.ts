/**
 * Theme Registry for HAI3 Demo App
 * Self-registers themes with UI Core on import
 * App just needs to import this file
 */

import { themeService } from '@hai3/uicore';
import { applyTheme } from '@hai3/uikit';
import { defaultTheme, DEFAULT_THEME_ID } from './default';
import { lightTheme, LIGHT_THEME_ID } from './light';
import { darkTheme, DARK_THEME_ID } from './dark';
import { draculaTheme, DRACULA_THEME_ID } from './dracula';
import { draculaLargeTheme, DRACULA_LARGE_THEME_ID } from './dracula-large';

// Set the apply function from UI Kit
themeService.setApplyFunction(applyTheme);

// Register all themes (default theme first, becomes the default selection)
themeService.register(DEFAULT_THEME_ID, defaultTheme);
themeService.register(LIGHT_THEME_ID, lightTheme);
themeService.register(DARK_THEME_ID, darkTheme);
themeService.register(DRACULA_THEME_ID, draculaTheme);
themeService.register(DRACULA_LARGE_THEME_ID, draculaLargeTheme);
