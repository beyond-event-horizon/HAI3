/**
 * Default theme configuration for HAI3 UI-Core
 * This theme provides the base design tokens that can be extended or overridden
 */

export interface ThemeConfig {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    foreground: string;
    muted: string;
    border: string;
  };
  spacing: {
    headerHeight: string;
    footerHeight: string;
    sidebarWidth: string;
    sidebarCollapsedWidth: string;
  };
  typography: {
    fontFamily: string;
    fontSize: {
      xs: string;
      sm: string;
      base: string;
      lg: string;
      xl: string;
      '2xl': string;
    };
  };
  layout: {
    maxWidth: string;
    containerPadding: string;
  };
}

export const defaultTheme: ThemeConfig = {
  name: 'default',
  colors: {
    primary: 'hsl(221.2 83.2% 53.3%)',
    secondary: 'hsl(210 40% 96.1%)',
    accent: 'hsl(210 40% 96.1%)',
    background: 'hsl(0 0% 100%)',
    foreground: 'hsl(222.2 84% 4.9%)',
    muted: 'hsl(210 40% 96.1%)',
    border: 'hsl(214.3 31.8% 91.4%)',
  },
  spacing: {
    headerHeight: '64px',
    footerHeight: '48px',
    sidebarWidth: '256px',
    sidebarCollapsedWidth: '64px',
  },
  typography: {
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
    },
  },
  layout: {
    maxWidth: '1280px',
    containerPadding: '1rem',
  },
};
