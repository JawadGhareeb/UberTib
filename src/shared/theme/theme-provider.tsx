import type { PropsWithChildren } from 'react';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import { Uniwind } from 'uniwind';

import { secureStorage } from '@/shared/storage/secure-storage';
import { getThemeColors, type ThemeColors, type ThemeScheme } from '@/shared/theme';

type ThemeContextValue = {
  scheme: ThemeScheme;
  colors: ThemeColors;
  setScheme: (scheme: ThemeScheme) => void;
  toggleScheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: PropsWithChildren) {
  const [scheme, setSchemeState] = useState<ThemeScheme>('light');
  const [themeReady, setThemeReady] = useState(false);
  const colors = useMemo(() => getThemeColors(scheme), [scheme]);

  useEffect(() => {
    let active = true;
    const hydrateTheme = async () => {
      try {
        const stored = await secureStorage.getThemeScheme();
        if (active && (stored === 'light' || stored === 'dark')) {
          setSchemeState(stored);
          Uniwind.setTheme(stored);
        } else if (active) {
          Uniwind.setTheme('light');
        }
      } catch {
        if (active) Uniwind.setTheme('light');
      } finally {
        if (active) setThemeReady(true);
      }
    };
    void hydrateTheme();
    return () => {
      active = false;
    };
  }, []);

  const setScheme = (next: ThemeScheme) => {
    setSchemeState(next);
    Uniwind.setTheme(next);
    void secureStorage.setThemeScheme(next);
  };

  const value = useMemo<ThemeContextValue>(
    () => ({
      scheme,
      colors,
      setScheme,
      toggleScheme: () => setScheme(scheme === 'dark' ? 'light' : 'dark'),
    }),
    [colors, scheme],
  );

  return (
    <ThemeContext.Provider value={value}>
      <View className="flex-1" style={{ backgroundColor: colors.surface.canvas }}>
        {themeReady ? children : null}
      </View>
    </ThemeContext.Provider>
  );
}

export function useAppTheme(): ThemeContextValue {
  const value = useContext(ThemeContext);
  if (!value) throw new Error('useAppTheme must be used inside ThemeProvider');
  return value;
}
