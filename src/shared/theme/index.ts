import tokens from './tokens.json';

export const theme = tokens;
export const lightTheme = tokens.color;
export const darkTheme = tokens.darkColor;

export type ThemeScheme = 'light' | 'dark';
export type ThemeTone = keyof typeof theme.color.tone;
export type ThemeColors = typeof lightTheme;

export function getThemeColors(scheme: ThemeScheme): ThemeColors {
  return scheme === 'dark' ? darkTheme : lightTheme;
}
