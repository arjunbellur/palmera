import { ColorSchemeName } from 'react-native';

/**
 * Palmera Brand Theme
 * Premium luxury travel experience
 * "Escape. Indulge. Experience."
 */

export interface PalmeraTheme {
  colors: {
    // Core Brand
    forestGreen: string;
    gold: string;
    midnightBlue: string;
    sandBeige: string;
    offWhite: string;
    charcoal: string;

    // Semantic
    background: string;
    surface: string;
    surfaceSecondary: string;
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    textSecondary: string;
    textMuted: string;
    border: string;
    borderHover: string;

    // Status
    success: string;
    warning: string;
    error: string;
    info: string;

    // Component-specific
    buttonPrimary: string;
    buttonPrimaryText: string;
    buttonSecondary: string;
    buttonSecondaryText: string;
    cardBg: string;
    cardBorder: string;
    navigationActive: string;
    navigationHover: string;
  };
  typography: {
    fontFamily: {
      heading: string;
      body: string;
    };
    fontSize: {
      xs: number;
      sm: number;
      base: number;
      lg: number;
      xl: number;
      '2xl': number;
      '3xl': number;
      '4xl': number;
      '5xl': number;
    };
    fontWeight: {
      light: '300';
      normal: '400';
      medium: '500';
      semibold: '600';
      bold: '700';
      extrabold: '800';
    };
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    '2xl': number;
    '3xl': number;
  };
  borderRadius: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
    full: number;
  };
}

const lightTheme: PalmeraTheme = {
  colors: {
    // Core Brand
    forestGreen: '#2E5339',
    gold: '#D4AF37',
    midnightBlue: '#191970',
    sandBeige: '#E6D5B8',
    offWhite: '#F9F7F4',
    charcoal: '#2C2C2C',

    // Semantic - Light Mode
    background: '#F9F7F4',
    surface: '#FFFFFF',
    surfaceSecondary: '#E6D5B8',
    primary: '#2E5339',
    secondary: '#D4AF37',
    accent: '#191970',
    text: '#2C2C2C',
    textSecondary: '#666666',
    textMuted: '#999999',
    border: '#E6D5B8',
    borderHover: '#D4AF37',

    // Status
    success: '#2E5339',
    warning: '#D4AF37',
    error: '#DC2626',
    info: '#191970',

    // Component-specific
    buttonPrimary: '#D4AF37',
    buttonPrimaryText: '#2C2C2C',
    buttonSecondary: 'transparent',
    buttonSecondaryText: '#2E5339',
    cardBg: '#FFFFFF',
    cardBorder: '#E6D5B8',
    navigationActive: '#2E5339',
    navigationHover: '#D4AF37',
  },
  typography: {
    fontFamily: {
      heading: 'Playfair Display',
      body: 'Inter',
    },
    fontSize: {
      xs: 12,
      sm: 14,
      base: 16,
      lg: 18,
      xl: 20,
      '2xl': 24,
      '3xl': 30,
      '4xl': 36,
      '5xl': 48,
    },
    fontWeight: {
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    '2xl': 48,
    '3xl': 64,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 16,
    xl: 24,
    full: 9999,
  },
};

const darkTheme: PalmeraTheme = {
  ...lightTheme,
  colors: {
    ...lightTheme.colors,
    
    // Semantic - Dark Mode
    background: '#191970', // Midnight Blue
    surface: '#2C2C2C', // Charcoal
    surfaceSecondary: '#2E5339', // Forest Green
    primary: '#D4AF37', // Gold
    secondary: '#2E5339', // Forest Green
    accent: '#D4AF37', // Gold
    text: '#F9F7F4', // Off-White
    textSecondary: '#E6D5B8',
    textMuted: '#999999',
    border: '#2E5339',
    borderHover: '#D4AF37',

    // Component-specific - Dark Mode
    buttonPrimary: '#D4AF37',
    buttonPrimaryText: '#2C2C2C',
    buttonSecondary: 'transparent',
    buttonSecondaryText: '#D4AF37',
    cardBg: '#2C2C2C',
    cardBorder: '#2E5339',
    navigationActive: '#D4AF37',
    navigationHover: '#2E5339',
  },
};

export const getTheme = (colorScheme: ColorSchemeName): PalmeraTheme => {
  return colorScheme === 'dark' ? darkTheme : lightTheme;
};

export const palmeraTheme = lightTheme;
export const palmeraDarkTheme = darkTheme;

// Theme context for dynamic switching
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';

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

// Export for easy access
export default {
  light: lightTheme,
  dark: darkTheme,
  get: getTheme,
};
