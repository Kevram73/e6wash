// Upwork-inspired design system for E6Wash
export const upworkTheme = {
  colors: {
    // Primary colors (inspired by Upwork's green)
    primary: {
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0',
      300: '#86efac',
      400: '#4ade80',
      500: '#14a800', // Upwork's main green
      600: '#16a34a',
      700: '#15803d',
      800: '#166534',
      900: '#14532d',
    },
    // Neutral colors (Upwork's grays)
    neutral: {
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#e5e5e5',
      300: '#d4d4d4',
      400: '#a3a3a3',
      500: '#737373',
      600: '#525252',
      700: '#404040',
      800: '#262626',
      900: '#171717',
    },
    // Background colors
    background: {
      primary: '#ffffff',
      secondary: '#f7f7f7', // Upwork's light gray background
      tertiary: '#fafafa',
    },
    // Text colors
    text: {
      primary: '#2c2c2c', // Upwork's dark gray
      secondary: '#525252',
      tertiary: '#737373',
      inverse: '#ffffff',
    },
    // Status colors
    success: '#14a800',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
  },
  spacing: {
    xs: '0.25rem',   // 4px
    sm: '0.5rem',    // 8px
    md: '1rem',      // 16px
    lg: '1.5rem',    // 24px
    xl: '2rem',      // 32px
    '2xl': '3rem',   // 48px
    '3xl': '4rem',   // 64px
    '4xl': '6rem',   // 96px
  },
  borderRadius: {
    sm: '0.25rem',   // 4px
    md: '0.5rem',    // 8px
    lg: '0.75rem',   // 12px
    xl: '1rem',      // 16px
    '2xl': '1.5rem', // 24px
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  },
  typography: {
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
      mono: ['JetBrains Mono', 'monospace'],
    },
    fontSize: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      base: '1rem',     // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',  // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem', // 36px
      '5xl': '3rem',    // 48px
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
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
};

// CSS variables for easy theming
export const upworkCSSVariables = `
  :root {
    --color-primary-50: ${upworkTheme.colors.primary[50]};
    --color-primary-100: ${upworkTheme.colors.primary[100]};
    --color-primary-200: ${upworkTheme.colors.primary[200]};
    --color-primary-300: ${upworkTheme.colors.primary[300]};
    --color-primary-400: ${upworkTheme.colors.primary[400]};
    --color-primary-500: ${upworkTheme.colors.primary[500]};
    --color-primary-600: ${upworkTheme.colors.primary[600]};
    --color-primary-700: ${upworkTheme.colors.primary[700]};
    --color-primary-800: ${upworkTheme.colors.primary[800]};
    --color-primary-900: ${upworkTheme.colors.primary[900]};
    
    --color-neutral-50: ${upworkTheme.colors.neutral[50]};
    --color-neutral-100: ${upworkTheme.colors.neutral[100]};
    --color-neutral-200: ${upworkTheme.colors.neutral[200]};
    --color-neutral-300: ${upworkTheme.colors.neutral[300]};
    --color-neutral-400: ${upworkTheme.colors.neutral[400]};
    --color-neutral-500: ${upworkTheme.colors.neutral[500]};
    --color-neutral-600: ${upworkTheme.colors.neutral[600]};
    --color-neutral-700: ${upworkTheme.colors.neutral[700]};
    --color-neutral-800: ${upworkTheme.colors.neutral[800]};
    --color-neutral-900: ${upworkTheme.colors.neutral[900]};
    
    --color-background-primary: ${upworkTheme.colors.background.primary};
    --color-background-secondary: ${upworkTheme.colors.background.secondary};
    --color-background-tertiary: ${upworkTheme.colors.background.tertiary};
    
    --color-text-primary: ${upworkTheme.colors.text.primary};
    --color-text-secondary: ${upworkTheme.colors.text.secondary};
    --color-text-tertiary: ${upworkTheme.colors.text.tertiary};
    --color-text-inverse: ${upworkTheme.colors.text.inverse};
    
    --color-success: ${upworkTheme.colors.success};
    --color-warning: ${upworkTheme.colors.warning};
    --color-error: ${upworkTheme.colors.error};
    --color-info: ${upworkTheme.colors.info};
  }
`;
