import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ThemeContext = createContext();

const lightTheme = {
  background: '#FFFFFF',
  surface: '#F8FAFC',
  surfaceSecondary: '#F1F5F9',
  primary: '#3B82F6',
  secondary: '#8B5CF6',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  text: '#1F2937',
  textSecondary: '#6B7280',
  textTertiary: '#9CA3AF',
  border: '#E5E7EB',
  borderLight: '#F3F4F6',
  shadow: 'rgba(0, 0, 0, 0.1)',
  overlay: 'rgba(0, 0, 0, 0.5)',
};

const darkTheme = {
  background: '#111827',
  surface: '#1F2937',
  surfaceSecondary: '#374151',
  primary: '#60A5FA',
  secondary: '#A78BFA',
  success: '#34D399',
  warning: '#FBBF24',
  error: '#F87171',
  text: '#F9FAFB',
  textSecondary: '#D1D5DB',
  textTertiary: '#9CA3AF',
  border: '#374151',
  borderLight: '#4B5563',
  shadow: 'rgba(0, 0, 0, 0.3)',
  overlay: 'rgba(0, 0, 0, 0.7)',
};

export function ThemeProvider({ children }) {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeMode] = useState('system');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadThemePreference();
  }, []);

  const loadThemePreference = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('themeMode');
      if (savedTheme) {
        setThemeMode(savedTheme);
      }
    } catch (error) {
      console.error('Error loading theme preference:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveThemePreference = async (mode) => {
    try {
      await AsyncStorage.setItem('themeMode', mode);
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  };

  const toggleTheme = () => {
    const modes = ['light', 'dark', 'system'];
    const currentIndex = modes.indexOf(themeMode);
    const nextMode = modes[(currentIndex + 1) % modes.length];
    setThemeMode(nextMode);
    saveThemePreference(nextMode);
  };

  const getEffectiveTheme = () => {
    if (themeMode === 'system') {
      return systemColorScheme === 'dark' ? 'dark' : 'light';
    }
    return themeMode;
  };

  const theme = getEffectiveTheme();
  const colors = theme === 'dark' ? darkTheme : lightTheme;

  const value = {
    theme,
    themeMode,
    colors,
    toggleTheme,
    isLoading,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}