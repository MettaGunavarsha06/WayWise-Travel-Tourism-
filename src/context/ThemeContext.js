import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  resolveTheme,
  GlassmorphismLightTheme,
  THEMES_LIST,
} from '../constants/colors';

const THEME_NAME_STORAGE_KEY = '@waywise_active_theme_name';
const DARK_MODE_STORAGE_KEY = '@waywise_theme_dark_mode';

const ThemeContext = createContext({
  theme: GlassmorphismLightTheme,
  themeName: 'glass_horizon',
  isDark: false,
  setThemeName: () => {},
  toggleTheme: () => {},
  setIsDark: () => {},
  themesList: THEMES_LIST,
});

export const ThemeProvider = ({ children }) => {
  const [themeName, setThemeNameState] = useState('glass_horizon');
  const [isDark, setIsDarkState] = useState(false);

  useEffect(() => {
    loadSavedSettings();
  }, []);

  const loadSavedSettings = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem(THEME_NAME_STORAGE_KEY);
      if (savedTheme) {
        if (savedTheme === 'light') {
          setThemeNameState('emerald_nature');
        } else if (savedTheme === 'dark') {
          setThemeNameState('emerald_nature');
          setIsDarkState(true);
        } else {
          setThemeNameState(savedTheme);
        }
      }

      const savedDarkMode = await AsyncStorage.getItem(DARK_MODE_STORAGE_KEY);
      if (savedDarkMode !== null) {
        setIsDarkState(savedDarkMode === 'true');
      }
    } catch (e) {
      console.warn('Error loading theme settings', e);
    }
  };

  const setThemeName = async (name) => {
    setThemeNameState(name);
    try {
      await AsyncStorage.setItem(THEME_NAME_STORAGE_KEY, name);
    } catch (e) {
      console.warn('Error saving theme preference', e);
    }
  };

  const toggleTheme = async () => {
    try {
      const nextDark = !isDark;
      setIsDarkState(nextDark);
      await AsyncStorage.setItem(DARK_MODE_STORAGE_KEY, nextDark ? 'true' : 'false');
    } catch (e) {
      console.warn('Error toggling dark mode', e);
    }
  };

  const setIsDark = async (value) => {
    try {
      setIsDarkState(value);
      await AsyncStorage.setItem(DARK_MODE_STORAGE_KEY, value ? 'true' : 'false');
    } catch (e) {
      console.warn('Error setting dark mode', e);
    }
  };

  const currentTheme = resolveTheme(themeName, isDark);

  return (
    <ThemeContext.Provider
      value={{
        theme: currentTheme,
        themeName,
        isDark,
        setThemeName,
        toggleTheme,
        setIsDark,
        themesList: THEMES_LIST,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
