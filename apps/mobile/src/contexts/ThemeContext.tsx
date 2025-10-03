import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { getTheme, PalmeraTheme, ColorSchemeName } from '../theme/palmeraTheme';

interface ThemeContextType {
  theme: PalmeraTheme;
  colorScheme: ColorSchemeName;
  toggleTheme: () => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemColorScheme = useColorScheme();
  const [colorScheme, setColorScheme] = useState<ColorSchemeName>(systemColorScheme || 'light');

  useEffect(() => {
    setColorScheme(systemColorScheme || 'light');
  }, [systemColorScheme]);

  const toggleTheme = () => {
    setColorScheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const theme = getTheme(colorScheme);
  const isDark = colorScheme === 'dark';

  return (
    <ThemeContext.Provider value={{ theme, colorScheme, toggleTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeContext() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
}
