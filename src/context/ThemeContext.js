import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  GlassHorizonTheme,
  VintageVoyagerTheme,
  DarkTheme,
  LightTheme,
  THEMES_LIST,
} from '../constants/colors';

const THEME_STORAGE_KEY = '@waywise_active_theme_name';

const THEME_MAP = {
  glass_horizon: GlassHorizonTheme,
  vintage_voyager: VintageVoyagerTheme,
  dark: DarkTheme,
  light: LightTheme,
};

const ThemeContext = createContext({
  theme: GlassHorizonTheme,
  themeName: 'glass_horizon',
  isDark: false,
  setThemeName: () => {},
  toggleTheme: () => {},
  themesList: THEMES_LIST,
});

export const ThemeProvider = ({ children }) => {
  const [themeName, setThemeNameState] = useState('glass_horizon');

  useEffect(() => {
    loadSavedTheme();
  }, []);

  const loadSavedTheme = async () => {
    try {
      const saved = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (saved && THEME_MAP[saved]) {
        setThemeNameState(saved);
      } else if (saved === 'dark') {
        setThemeNameState('dark');
      } else if (saved === 'light') {
        setThemeNameState('light');
      }
    } catch (e) {
      console.warn('Error loading theme preference', e);
    }
  };

  const setThemeName = async (name) => {
    if (THEME_MAP[name]) {
      setThemeNameState(name);
      try {
        await AsyncStorage.setItem(THEME_STORAGE_KEY, name);
      } catch (e) {
        console.warn('Error saving theme preference', e);
      }
    }
  };

  const toggleTheme = async () => {
    try {
      const nextTheme = themeName === 'dark' ? 'glass_horizon' : 'dark';
      setThemeNameState(nextTheme);
      await AsyncStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    } catch (e) {
      console.warn('Error toggling theme', e);
    }
  };

  const currentTheme = THEME_MAP[themeName] || GlassHorizonTheme;
  const isDark = currentTheme.isDark;

  return (
    <ThemeContext.Provider
      value={{
        theme: currentTheme,
        themeName,
        isDark,
        setThemeName,
        toggleTheme,
        themesList: THEMES_LIST,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
