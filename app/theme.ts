export const theme = {
  colors: {
    primary: '#FF6B35', // Vibrant orange
    secondary: '#FF4500', // Darker orange for accents
    white: '#FFFFFF',
    black: '#000000',
    red: '#FF0000',
    green: '#25D366', // WhatsApp green
    blue: '#0088CC', // Telegram blue
    gray: '#F5F5F5',
    darkGray: '#666666',
    lightGray: '#E0E0E0',
    error: '#FF3B30',
    success: '#34C759',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
  },
  typography: {
    h1: {
      fontSize: 24,
      fontWeight: 'bold',
    },
    h2: {
      fontSize: 20,
      fontWeight: 'bold',
    },
    h3: {
      fontSize: 18,
      fontWeight: 'bold',
    },
    body: {
      fontSize: 16,
      fontWeight: 'normal',
    },
    caption: {
      fontSize: 14,
      fontWeight: 'normal',
    },
    small: {
      fontSize: 12,
      fontWeight: 'normal',
    },
  },
} as const;

export type Theme = typeof theme; 