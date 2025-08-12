import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Appearance, AppearancePreferences, ColorSchemeName } from 'react-native';
import { ThemeMode, lightTheme, darkTheme } from '../theme';

// Add 'system' as a possible mode
export type ThemeModeWithSystem = ThemeMode | 'system';

interface ThemeContextType {
  themeMode: ThemeModeWithSystem;
  theme: typeof lightTheme;
  toggleTheme: () => void;
  setThemeMode: (mode: ThemeModeWithSystem) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = '@banshi_theme_mode';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeMode, setThemeModeState] = useState<ThemeModeWithSystem>('system');
  const [deviceColorScheme, setDeviceColorScheme] = useState<ColorSchemeName>(Appearance.getColorScheme());

  useEffect(() => {
    // Load saved theme mode on app start
    loadThemeMode();
    // Listen to device color scheme changes
    const listener = Appearance.addChangeListener(({ colorScheme }: AppearancePreferences) => {
      setDeviceColorScheme(colorScheme);
    });
    return () => listener.remove();
  }, []);

  const loadThemeMode = async () => {
    try {
      const savedThemeMode = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (savedThemeMode === 'dark' || savedThemeMode === 'light' || savedThemeMode === 'system') {
        setThemeModeState(savedThemeMode as ThemeModeWithSystem);
      } else {
        setThemeModeState('system');
      }
    } catch (error) {
      // Silent error handling for production
    }
  };

  const saveThemeMode = async (mode: ThemeModeWithSystem) => {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
    } catch (error) {
      // Silent error handling for production
    }
  };

  const setThemeMode = (mode: ThemeModeWithSystem) => {
    setThemeModeState(mode);
    saveThemeMode(mode);
  };

  // Toggle: system -> dark -> light -> system
  const toggleTheme = () => {
    let newMode: ThemeModeWithSystem;
    if (themeMode === 'system') newMode = 'dark';
    else if (themeMode === 'dark') newMode = 'light';
    else newMode = 'system';
    setThemeMode(newMode);
  };

  // Determine which theme to use
  let effectiveTheme: typeof lightTheme;
  if (themeMode === 'system') {
    effectiveTheme = deviceColorScheme === 'dark' ? darkTheme : lightTheme;
  } else {
    effectiveTheme = themeMode === 'dark' ? darkTheme : lightTheme;
  }

  return (
    <ThemeContext.Provider value={{ themeMode, theme: effectiveTheme, toggleTheme, setThemeMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}; 