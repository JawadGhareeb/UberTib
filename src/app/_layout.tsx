import '../../global.css';

import {
  IBMPlexSansArabic_400Regular,
  IBMPlexSansArabic_500Medium,
  IBMPlexSansArabic_600SemiBold,
  IBMPlexSansArabic_700Bold,
  useFonts,
} from '@expo-google-fonts/ibm-plex-sans-arabic';
import { Stack } from 'expo-router';
import * as NativeSplashScreen from 'expo-splash-screen';
import { I18nManager, Image, StatusBar, View } from 'react-native';
import { useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { HeroUINativeProvider } from 'heroui-native/provider';

import { AppProviders } from '@/providers/app-providers';
import { RootErrorBoundary } from '@/shared/components/error-boundary/root-error-boundary';
import { useAppTheme } from '@/shared/theme/use-app-theme';
import { initializePreferredTheme } from '@/shared/theme/theme-preference';

// Same direction model used by Scent World:
// - React Native / Yoga always stays physically LTR.
// - The app owns Arabic reading direction through AppDirectionProvider.
// This avoids device-locale RTL mirroring the layout a second time.
I18nManager.allowRTL(false);
I18nManager.forceRTL(false);
I18nManager.swapLeftAndRightInRTL?.(false);

function RootNavigator() {
  const { colors, scheme } = useAppTheme();

  useEffect(() => {
    // Expo Go may keep the native splash surface visible after JS mounts.
    // Hide it explicitly only once the app navigator has committed.
    void NativeSplashScreen.hideAsync().catch((error: unknown) => {
      if (__DEV__) console.warn('[UberTib startup] Could not hide native splash', error);
    });
  }, []);

  return (
    <>
      <StatusBar
        barStyle={scheme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
      />
      <Stack
        screenOptions={{
          contentStyle: {
            backgroundColor: colors.surface.canvas,
          },
          headerShown: false,
        }}
      />
    </>
  );
}

export default function RootLayout() {
  const [themeReady, setThemeReady] = useState(false);
  const [fontsLoaded] = useFonts({
    IBMPlexSansArabic_400Regular,
    IBMPlexSansArabic_500Medium,
    IBMPlexSansArabic_600SemiBold,
    IBMPlexSansArabic_700Bold,
  });

  useEffect(() => {
    let active = true;
    void initializePreferredTheme().finally(() => {
      if (active) setThemeReady(true);
    });
    return () => {
      active = false;
    };
  }, []);

  if (!fontsLoaded || !themeReady) {
    // Never show an empty screen while the Arabic fonts load.
    // This requires no custom font and uses the bundled logo on every platform.
    return (
      <View
        style={{
          alignItems: 'center',
          backgroundColor: '#F9F9F9',
          flex: 1,
          justifyContent: 'center',
        }}
      >
        <StatusBar barStyle="dark-content" />
        <Image
          accessibilityLabel="UperTib"
          resizeMode="contain"
          source={require('../shared/assets/icon.png')}
          style={{ height: 110, width: 110 }}
        />
      </View>
    );
  }

  return (
    <SafeAreaProvider style={{ flex: 1 }}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <RootErrorBoundary>
          {/* Portalled HeroUI content must remain under the app's direction/theme contexts. */}
          <AppProviders>
            <HeroUINativeProvider config={{ isRTL: true, devInfo: { stylingPrinciples: false } }}>
              <View style={{ direction: 'ltr', flex: 1 }}>
                <RootNavigator />
              </View>
            </HeroUINativeProvider>
          </AppProviders>
        </RootErrorBoundary>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
