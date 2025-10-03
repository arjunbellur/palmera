import { useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { getTheme, PalmeraTheme, ColorSchemeName } from '../theme/palmeraTheme';

export function useTheme() {
  const systemColorScheme = useColorScheme();
  const [colorScheme, setColorScheme] = useState<ColorSchemeName>(systemColorScheme || 'light');

  useEffect(() => {
    setColorScheme(systemColorScheme || 'light');
  }, [systemColorScheme]);

  const toggleTheme = () => {
    setColorScheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const theme: PalmeraTheme = getTheme(colorScheme);

  return {
    theme,
    colorScheme,
    toggleTheme,
    isDark: colorScheme === 'dark',
  };
}
