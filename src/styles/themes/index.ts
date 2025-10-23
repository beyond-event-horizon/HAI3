/**
 * Theme exports for HAI3
 */

import { lightTheme } from './light';
import { darkTheme } from './dark';

export { lightTheme } from './light';
export { darkTheme } from './dark';
export type { Theme } from './types';

export const themes = {
  light: lightTheme,
  dark: darkTheme,
};

export type ThemeName = keyof typeof themes;
