/**
 * Theme exports for HAI3
 */

import { lightTheme } from './light';
import { darkTheme } from './dark';
import { draculaTheme } from './dracula';

export { lightTheme } from './light';
export { darkTheme } from './dark';
export { draculaTheme } from './dracula';
export type { Theme } from './types';

export const themes = {
  light: lightTheme,
  dark: darkTheme,
  dracula: draculaTheme,
};

export type ThemeName = keyof typeof themes;
