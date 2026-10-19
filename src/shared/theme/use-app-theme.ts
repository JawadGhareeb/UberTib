import { useUniwind } from 'uniwind';

import { getThemeColors, type ThemeColors, type ThemeScheme } from '@/shared/theme';
import { setPreferredTheme } from '@/shared/theme/theme-preference';

type AppTheme = {
  scheme: ThemeScheme;
  colors: ThemeColors;
  setScheme: (next: ThemeScheme) => void;
  toggleScheme: () => void;
};

/** Uniwind is the only theme store. Colors are read from the same tokens.json
 * that generates the light/dark Tailwind utilities for native-only props.
 * No React provider, duplicated React state or imperative per-screen palette.
 */
export function useAppTheme(): AppTheme {
  const { theme } = useUniwind();
  const scheme: ThemeScheme = theme === 'dark' ? 'dark' : 'light';
  return {
    scheme,
    colors: getThemeColors(scheme),
    setScheme: setPreferredTheme,
    toggleScheme: () => setPreferredTheme(scheme === 'dark' ? 'light' : 'dark'),
  };
}
