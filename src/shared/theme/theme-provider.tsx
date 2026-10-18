import type { PropsWithChildren } from 'react';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import { vars } from 'nativewind';

import { secureStorage } from '@/shared/storage/secure-storage';
import { getThemeColors, theme, type ThemeColors, type ThemeScheme } from '@/shared/theme';

type ThemeContextValue = {
  scheme: ThemeScheme;
  colors: ThemeColors;
  setScheme: (scheme: ThemeScheme) => void;
  toggleScheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function rgbChannels(hex: string): string {
  const normalized = hex.replace('#', '');
  const value = Number.parseInt(normalized, 16);
  const red = (value >> 16) & 255;
  const green = (value >> 8) & 255;
  const blue = value & 255;

  return `${red} ${green} ${blue}`;
}

function createThemeVariables(colors: ThemeColors) {
  return vars({
    '--brand-mark': rgbChannels(theme.brand.mark),
    '--surface-canvas': rgbChannels(colors.surface.canvas),
    '--surface-default': rgbChannels(colors.surface.default),
    '--surface-subtle': rgbChannels(colors.surface.subtle),
    '--surface-inverse': rgbChannels(colors.surface.inverse),
    '--surface-scrim': rgbChannels(colors.surface.scrim),
    '--text-primary': rgbChannels(colors.text.primary),
    '--text-secondary': rgbChannels(colors.text.secondary),
    '--text-placeholder': rgbChannels(colors.text.placeholder),
    '--text-disabled': rgbChannels(colors.text.disabled),
    '--text-link': rgbChannels(colors.text.link),
    '--text-on-action': rgbChannels(colors.text.onAction),
    '--text-on-destructive': rgbChannels(colors.text.onDestructive),
    '--text-on-inverse': rgbChannels(colors.text.onInverse),
    '--border-subtle': rgbChannels(colors.border.subtle),
    '--border-default': rgbChannels(colors.border.default),
    '--border-strong': rgbChannels(colors.border.strong),
    '--border-emphasis': rgbChannels(colors.border.emphasis),
    '--focus-ring': rgbChannels(colors.focus.ring),
    '--focus-ring-contrast': rgbChannels(colors.focus.ringContrast),
    '--state-selected': rgbChannels(colors.state.selected),
    '--state-selected-border': rgbChannels(colors.state.selectedBorder),
    '--state-readonly': rgbChannels(colors.state.readonly),
    '--state-readonly-border': rgbChannels(colors.state.readonlyBorder),
    '--action-primary': rgbChannels(colors.action.primary),
    '--action-primary-active': rgbChannels(colors.action.primaryActive),
    '--action-subtle': rgbChannels(colors.action.subtle),
    '--action-secondary-surface': rgbChannels(colors.action.secondarySurface),
    '--action-secondary-border': rgbChannels(colors.action.secondaryBorder),
    '--action-secondary-text': rgbChannels(colors.action.secondaryText),
    '--action-destructive': rgbChannels(colors.action.destructive),
    '--action-destructive-active': rgbChannels(colors.action.destructiveActive),
    '--tone-neutral-fill': rgbChannels(colors.tone.neutral.fill),
    '--tone-neutral-border': rgbChannels(colors.tone.neutral.border),
    '--tone-neutral-text': rgbChannels(colors.tone.neutral.text),
    '--tone-info-fill': rgbChannels(colors.tone.info.fill),
    '--tone-info-border': rgbChannels(colors.tone.info.border),
    '--tone-info-text': rgbChannels(colors.tone.info.text),
    '--tone-success-fill': rgbChannels(colors.tone.success.fill),
    '--tone-success-border': rgbChannels(colors.tone.success.border),
    '--tone-success-text': rgbChannels(colors.tone.success.text),
    '--tone-warning-fill': rgbChannels(colors.tone.warning.fill),
    '--tone-warning-border': rgbChannels(colors.tone.warning.border),
    '--tone-warning-text': rgbChannels(colors.tone.warning.text),
    '--tone-danger-fill': rgbChannels(colors.tone.danger.fill),
    '--tone-danger-border': rgbChannels(colors.tone.danger.border),
    '--tone-danger-text': rgbChannels(colors.tone.danger.text),
    '--tone-restricted-fill': rgbChannels(colors.tone.restricted.fill),
    '--tone-restricted-border': rgbChannels(colors.tone.restricted.border),
    '--tone-restricted-text': rgbChannels(colors.tone.restricted.text),
  });
}

export function ThemeProvider({ children }: PropsWithChildren) {
  // New installs always start light. An explicitly saved preference still wins.
  const [scheme, setSchemeState] = useState<ThemeScheme>('light');
  const [themeReady, setThemeReady] = useState(false);
  const colors = useMemo(() => getThemeColors(scheme), [scheme]);
  const variables = useMemo(() => createThemeVariables(colors), [colors]);

  useEffect(() => {
    let active = true;

    const hydrateTheme = async () => {
      try {
        const storedScheme = await secureStorage.getThemeScheme();

        if (active && (storedScheme === 'light' || storedScheme === 'dark')) {
          setSchemeState(storedScheme);
        }
      } catch {
        // Storage can be temporarily unavailable; keep the safe Light default.
      } finally {
        if (active) {
          setThemeReady(true);
        }
      }
    };

    void hydrateTheme();

    return () => {
      active = false;
    };
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({
      scheme,
      colors,
      setScheme: (nextScheme) => {
        setSchemeState(nextScheme);
        void secureStorage.setThemeScheme(nextScheme);
      },
      toggleScheme: () => {
        setSchemeState((current) => {
          const nextScheme = current === 'dark' ? 'light' : 'dark';
          void secureStorage.setThemeScheme(nextScheme);

          return nextScheme;
        });
      },
    }),
    [colors, scheme],
  );

  return (
    <ThemeContext.Provider value={value}>
      <View className="flex-1" style={[variables, { backgroundColor: colors.surface.canvas }]}>
        {themeReady ? children : null}
      </View>
    </ThemeContext.Provider>
  );
}

export function useAppTheme(): ThemeContextValue {
  const value = useContext(ThemeContext);

  if (!value) {
    throw new Error('useAppTheme must be used inside ThemeProvider');
  }

  return value;
}
