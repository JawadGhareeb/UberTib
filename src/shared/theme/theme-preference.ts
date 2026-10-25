import { Uniwind } from 'uniwind';
import { Appearance, Platform } from 'react-native';

import { secureStorage } from '@/shared/storage/secure-storage';
import type { ThemeScheme } from '@/shared/theme';

/** Run once before mounting navigation, so persisted Dark never flashes Light. */
function applyNativeTheme(scheme: ThemeScheme): void {
  // The app setting is authoritative for both Uniwind and native system surfaces
  // (keyboard, pickers, dialogs and status/nav bar on supported platforms).
  Uniwind.setTheme(scheme);
  if (Platform.OS !== 'web') Appearance.setColorScheme(scheme);
}

export async function initializePreferredTheme(): Promise<void> {
  let preferred: ThemeScheme = 'light';
  try {
    const saved = await secureStorage.getThemeScheme();
    if (saved === 'light' || saved === 'dark') preferred = saved;
  } catch {
    // Storage may be unavailable on a new device. Use branded Light default.
  }
  applyNativeTheme(preferred);
}

/** Apply via Uniwind's global theme engine; persist but never block the UI. */
export function setPreferredTheme(scheme: ThemeScheme): void {
  applyNativeTheme(scheme);
  void secureStorage.setThemeScheme(scheme).catch(() => undefined);
}
