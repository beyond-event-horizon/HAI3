/**
 * Theme exports for HAI3
 */

import { lightTheme } from './themes/light';
import { darkTheme } from './themes/dark';
import { draculaTheme } from './themes/dracula';
import { draculaLargeTheme } from './themes/dracula-large';

export { lightTheme } from './themes/light';
export { darkTheme } from './themes/dark';
export { draculaTheme } from './themes/dracula';
export { draculaLargeTheme } from './themes/dracula-large';
export type { Theme } from './themeTypes';

export const themes = {
  light: lightTheme,
  dark: darkTheme,
  dracula: draculaTheme,
  'dracula-large': draculaLargeTheme,
};

export type ThemeName = keyof typeof themes;
