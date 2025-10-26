/**
 * Theme exports for HAI3 Demo App
 * Each platform defines its own themes and registry
 */

import { lightTheme } from './light';
import { darkTheme } from './dark';
import { draculaTheme } from './dracula';
import { draculaLargeTheme } from './dracula-large';

export { lightTheme } from './light';
export { darkTheme } from './dark';
export { draculaTheme } from './dracula';
export { draculaLargeTheme } from './dracula-large';
export type { Theme } from '@hai3/uikit';

export const themes = {
  light: lightTheme,
  dark: darkTheme,
  dracula: draculaTheme,
  'dracula-large': draculaLargeTheme,
};

export type ThemeName = keyof typeof themes;
