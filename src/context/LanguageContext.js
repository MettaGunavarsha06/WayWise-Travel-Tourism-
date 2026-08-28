import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { languages, translations } from '../data/translations';

const LANGUAGE_STORAGE_KEY = '@smarttour_language_code';

const LanguageContext = createContext({
  currentLanguage: 'en',
  languages: [],
  setLanguage: () => {},
  t: (key) => key,
});

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguageState] = useState('en');

  useEffect(() => {
    loadSavedLanguage();
  }, []);

  const loadSavedLanguage = async () => {
    try {
      const saved = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (saved && translations[saved]) {
        setCurrentLanguageState(saved);
      }
    } catch (e) {
      console.warn('Error loading language', e);
    }
  };

  const setLanguage = async (code) => {
    if (translations[code]) {
      setCurrentLanguageState(code);
      try {
        await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, code);
      } catch (e) {
        console.warn('Error saving language', e);
      }
    }
  };

  const t = (key) => {
    const dict = translations[currentLanguage] || translations['en'];
    return dict[key] || translations['en'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, languages, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
