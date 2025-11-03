/**
 * Dracula theme for HAI3
 * Based on the classic Dracula color scheme
 */

import type { Theme } from '@hai3/uikit';

/**
 * Dracula theme ID
 */
export const DRACULA_THEME_ID = 'dracula' as const;

export const draculaTheme: Theme = {
  name: DRACULA_THEME_ID,
  colors: {
    primary: 'hsl(265 89% 78%)',      // Purple #bd93f9
    secondary: 'hsl(225 27% 51%)',    // Gray-blue #6272a4
    accent: 'hsl(326 100% 74%)',      // Pink #ff79c6
    background: 'hsl(231 15% 18%)',   // Background #282a36
    foreground: 'hsl(60 30% 96%)',    // Foreground #f8f8f2
    muted: 'hsl(232 14% 31%)',        // Muted #44475a
    border: 'hsl(232 14% 31%)',       // Border #44475a
    error: 'hsl(0 100% 67%)',         // Red #ff5555
    warning: 'hsl(65 92% 76%)',       // Yellow #f1fa8c
    success: 'hsl(135 94% 65%)',      // Green #50fa7b
    info: 'hsl(191 97% 77%)',         // Cyan #8be9fd
    mainMenu: {
      DEFAULT: 'hsl(231 15% 14%)',      // darker variant
      foreground: 'hsl(225 27% 51%)',   // #6272a4 - comment
      hover: 'hsl(232 14% 31%)',        // #44475a - current-line
      selected: 'hsl(265 89% 78%)',     // #bd93f9 - purple
      border: 'hsl(232 14% 31%)',       // #44475a - same as border
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
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.4)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.5)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.6)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.7)',
  },
  transitions: {
    fast: '150ms',
    base: '200ms',
    slow: '300ms',
    slower: '500ms',
  },
};
