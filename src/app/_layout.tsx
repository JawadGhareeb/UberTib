import '../../global.css';

import {
  IBMPlexSansArabic_400Regular,
  IBMPlexSansArabic_500Medium,
  IBMPlexSansArabic_600SemiBold,
  IBMPlexSansArabic_700Bold,
  useFonts,
} from '@expo-google-fonts/ibm-plex-sans-arabic';
import { Stack } from 'expo-router';
import { I18nManager, StatusBar, View } from 'react-native';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { HeroUINativeProvider } from 'heroui-native/provider';

import { AppProviders } from '@/shared/components/app-providers';
import { AuthAccessDialog } from '@/features/auth/components/auth-access-dialog';
import { useAppTheme } from '@/shared/theme/use-app-theme';
import { initializePreferredTheme } from '@/shared/theme/theme-preference';

// Yoga remains physically LTR; individual Arabic layouts manage their own RTL.
I18nManager.allowRTL(false);
I18nManager.forceRTL(false);
I18nManager.swapLeftAndRightInRTL?.(false);

function RootNavigator() {
  const { colors, scheme } = useAppTheme();

  return (
    <>
      <StatusBar
        barStyle={scheme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
      />
      <View style={{ flex: 1, backgroundColor: colors.surface.canvas }}>
        <Stack
          screenOptions={{
            contentStyle: { backgroundColor: colors.surface.canvas },
            headerShown: false,
          }}
        />
      </View>
    </>
  );
}

export default function RootLayout() {
  // Font loading is non-blocking. The entry route owns the initial branded
  // loading experience, as it did in the legacy app.
  useFonts({
    IBMPlexSansArabic_400Regular,
    IBMPlexSansArabic_500Medium,
    IBMPlexSansArabic_600SemiBold,
    IBMPlexSansArabic_700Bold,
  });

  useEffect(() => {
    // Preserve non-blocking theme restoration even if device storage is unavailable.
    void initializePreferredTheme().catch(() => undefined);
  }, []);

  // Always mount the router. No native SplashScreen hold or startup overlay
  // here: the index route chooses the in-app loader, intro, or destination.
  return (
    <SafeAreaProvider style={{ flex: 1 }}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <AppProviders>
          <HeroUINativeProvider config={{ isRTL: true, devInfo: { stylingPrinciples: false } }}>
            <View style={{ direction: 'ltr', flex: 1 }}>
              <RootNavigator />
              <AuthAccessDialog />
            </View>
          </HeroUINativeProvider>
        </AppProviders>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
