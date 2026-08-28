import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LightTheme, DarkTheme } from '../constants/colors';

const THEME_STORAGE_KEY = '@smarttour_theme_mode';

const ThemeContext = createContext({
  theme: LightTheme,
  isDark: false,
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    loadSavedTheme();
  }, []);

  const loadSavedTheme = async () => {
    try {
      const saved = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (saved !== null) {
        setIsDark(saved === 'dark');
      }
    } catch (e) {
      console.warn('Error loading theme preference', e);
    }
  };

  const toggleTheme = async () => {
    try {
      const nextMode = !isDark;
      setIsDark(nextMode);
      await AsyncStorage.setItem(THEME_STORAGE_KEY, nextMode ? 'dark' : 'light');
    } catch (e) {
      console.warn('Error saving theme preference', e);
    }
  };

  const theme = isDark ? DarkTheme : LightTheme;

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
