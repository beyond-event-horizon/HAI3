/**
 * Light theme for HAI3
 */

import type { Theme } from '@hai3/uikit';

export const lightTheme: Theme = {
  name: 'light',
  colors: {
    primary: 'hsl(0 0% 9%)',
    secondary: 'hsl(0 0% 96.1%)',
    accent: 'hsl(0 0% 96.1%)',
    background: 'hsl(0 0% 100%)',
    foreground: 'hsl(0 0% 3.9%)',
    muted: 'hsl(0 0% 96.1%)',
    border: 'hsl(0 0% 89.8%)',
    error: 'hsl(0 84.2% 60.2%)',
    warning: 'hsl(38 92% 50%)',
    success: 'hsl(142 76% 36%)',
    info: 'hsl(199 89% 48%)',
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
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
  },
  transitions: {
    fast: '150ms',
    base: '200ms',
    slow: '300ms',
    slower: '500ms',
  },
};
