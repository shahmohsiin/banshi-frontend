export type ThemeMode = 'light' | 'dark';

export const lightTheme = {
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
    
    // Background colors
    background: '#FFFFFF',
    surface: '#F8F9FA',
    card: '#FFFFFF',
    
    // Text colors
    text: '#000000',
    textSecondary: '#666666',
    textTertiary: '#999999',
    
    // Border colors
    border: '#E0E0E0',
    borderLight: '#F0F0F0',
    
    // Status colors
    running: '#25D366',
    closed: '#FF3B30',
    pending: '#FF9500',
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

export const darkTheme = {
  colors: {
    primary: '#FF6B35', // Keep same primary color
    secondary: '#FF4500', // Keep same secondary color
    white: '#FFFFFF',
    black: '#000000',
    red: '#FF6B6B', // Softer red for dark mode
    green: '#4ECDC4', // Softer green for dark mode
    blue: '#74B9FF', // Softer blue for dark mode
    gray: '#2D3436', // Dark gray
    darkGray: '#636E72', // Lighter dark gray
    lightGray: '#636E72', // Adjusted for dark mode
    error: '#FF6B6B',
    success: '#4ECDC4',
    
    // Background colors
    background: '#1A1A1A',
    surface: '#2D2D2D',
    card: '#2D2D2D',
    
    // Text colors
    text: '#FFFFFF',
    textSecondary: '#B0B0B0',
    textTertiary: '#808080',
    
    // Border colors
    border: '#404040',
    borderLight: '#333333',
    
    // Status colors
    running: '#4ECDC4',
    closed: '#FF6B6B',
    pending: '#FFA726',
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

export const theme = lightTheme; // Default theme for backward compatibility

export type Theme = typeof lightTheme; 