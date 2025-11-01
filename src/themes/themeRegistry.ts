/**
 * Theme Registry for HAI3 Demo App
 * Self-registers themes with UI Core on import
 * App just needs to import this file
 */

import { themeService } from '@hai3/uicore';
import { applyTheme } from '@hai3/uikit';
import { defaultTheme } from './default';
import { lightTheme } from './light';
import { darkTheme } from './dark';
import { draculaTheme } from './dracula';
import { draculaLargeTheme } from './dracula-large';

// Set the apply function from UI Kit
themeService.setApplyFunction(applyTheme);

// Register all themes (default theme first, becomes the default selection)
themeService.register('default', defaultTheme);
themeService.register('light', lightTheme);
themeService.register('dark', darkTheme);
themeService.register('dracula', draculaTheme);
themeService.register('dracula-large', draculaLargeTheme);
