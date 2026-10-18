import '../../global.css';

import {
  IBMPlexSansArabic_400Regular,
  IBMPlexSansArabic_500Medium,
  IBMPlexSansArabic_600SemiBold,
  IBMPlexSansArabic_700Bold,
  useFonts,
} from '@expo-google-fonts/ibm-plex-sans-arabic';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { I18nManager, Image, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { HeroUINativeProvider } from 'heroui-native/provider';

import { AppProviders } from '@/providers/app-providers';
import { useAppTheme } from '@/shared/theme/theme-provider';

// Same direction model used by Scent World:
// - React Native / Yoga always stays physically LTR.
// - The app owns Arabic reading direction through AppDirectionProvider.
// This avoids device-locale RTL mirroring the layout a second time.
I18nManager.allowRTL(false);
I18nManager.forceRTL(false);
I18nManager.swapLeftAndRightInRTL?.(false);

function RootNavigator() {
  const { colors, scheme } = useAppTheme();

  return (
    <>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
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
  const [fontsLoaded] = useFonts({
    IBMPlexSansArabic_400Regular,
    IBMPlexSansArabic_500Medium,
    IBMPlexSansArabic_600SemiBold,
    IBMPlexSansArabic_700Bold,
  });

  if (!fontsLoaded) {
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
        <StatusBar style="dark" />
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
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <HeroUINativeProvider config={{ isRTL: true }}>
          <View style={{ direction: 'ltr', flex: 1 }}>
            <AppProviders>
              <RootNavigator />
            </AppProviders>
          </View>
        </HeroUINativeProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
