import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

interface ThemeContextValue {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);
const THEME_STORAGE_KEY = 'app_theme';

async function loadSavedTheme() {
  if (Platform.OS === 'web') return globalThis.localStorage?.getItem(THEME_STORAGE_KEY) ?? null;
  return SecureStore.getItemAsync(THEME_STORAGE_KEY);
}

async function saveTheme(theme: 'dark' | 'light') {
  if (Platform.OS === 'web') {
    globalThis.localStorage?.setItem(THEME_STORAGE_KEY, theme);
    return;
  }
  await SecureStore.setItemAsync(THEME_STORAGE_KEY, theme);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const userChangedTheme = useRef(false);

  useEffect(() => {
    loadSavedTheme()
      .then((savedTheme) => {
        if (!userChangedTheme.current) setIsDarkMode(savedTheme === 'dark');
      })
      .catch(() => {});
  }, []);

  const toggleTheme = () => {
    userChangedTheme.current = true;
    setIsDarkMode((currentTheme) => {
      const nextTheme = !currentTheme;
      void saveTheme(nextTheme ? 'dark' : 'light').catch(() => {});
      return nextTheme;
    });
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme debe usarse dentro de ThemeProvider');
  return context;
}