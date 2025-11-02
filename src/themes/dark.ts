/**
 * Dark theme for HAI3
 */

import type { Theme } from '@hai3/uikit';
import { tailwindColors as colors } from '@hai3/uikit';

/**
 * Dark theme ID
 */
export const DARK_THEME_ID = 'dark' as const;

export const darkTheme: Theme = {
  name: DARK_THEME_ID,
  colors: {
    // Dark theme - using Tailwind colors directly
    primary: colors.zinc[50],
    secondary: colors.zinc[800],
    accent: colors.zinc[400],
    background: colors.zinc[950],
    foreground: colors.zinc[50],
    muted: colors.zinc[800],
    border: colors.zinc[800],
    error: colors.red[900],
    warning: colors.orange[500],
    success: colors.green[500],
    info: colors.sky[500],
    mainMenu: {
      DEFAULT: colors.black,
      foreground: colors.zinc[400],
      hover: colors.zinc[900],
      selected: colors.zinc[500],
    },
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4rem',
  },
  typography: {
    fontFamily: {
      sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'monospace'],
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
    lineHeight: {
      tight: '1.25',
      normal: '1.5',
      relaxed: '1.75',
    },
  },
  borderRadius: {
    none: '0',
    sm: '0.125rem',
    md: '0.25rem',
    lg: '0.5rem',
    xl: '1rem',
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.4)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.5)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.6)',
  },
  transitions: {
    fast: '150ms',
    base: '200ms',
    slow: '300ms',
    slower: '500ms',
  },
};
