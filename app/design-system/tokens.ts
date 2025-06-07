// Design tokens - färger, typografi, spacing
export const colors = {
  background: 'hsl(34, 14%, 90%)', // Warm gray #E8E5E1
  foreground: 'hsl(0, 0%, 18%)', // Dark charcoal #2D2D2D
  primary: 'hsl(0, 77%, 24%)', // Burgundy #6D0E0E
  muted: 'hsl(33, 25%, 94%)',
  mutedForeground: 'hsl(0, 0%, 40%)',
  border: 'hsl(30, 10%, 84%)',
  card: 'hsl(0, 0%, 100%)',
  secondary: 'hsl(30, 10%, 94%)',
} as const;

export const typography = {
  serif: '"Georgia", "Times New Roman", serif',
  sansSerif: '"Inter", "Helvetica Neue", Arial, sans-serif',
  cursive: '"La Belle Aurore", cursive',
} as const;

export const spacing = {
  xs: '0.25rem', // 4px
  sm: '0.5rem',  // 8px
  md: '1rem',    // 16px
  lg: '1.5rem',  // 24px
  xl: '2rem',    // 32px
  '2xl': '3rem', // 48px
  '3xl': '4rem', // 64px
} as const;

export const borderRadius = {
  sm: '0.125rem',
  md: '0.375rem',
  lg: '0.5rem',
  xl: '0.75rem',
} as const;