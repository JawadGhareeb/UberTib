import { Image, StatusBar, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

/**
 * Plain native loading surface for the entry route.
 * Intentionally does not require HeroUI, Arabic fonts or animation to render.
 */
export function AppLoadingScreen() {
  return (
    <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1, backgroundColor: '#F9F9F9' }}>
      <StatusBar barStyle="dark-content" backgroundColor="#F9F9F9" />
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 18 }}>
        <Image
          accessibilityLabel="UberTib"
          resizeMode="contain"
          source={require('../../../shared/assets/icon.png')}
          style={{ width: 110, height: 110 }}
        />
        <Text
          style={{ fontSize: 15, color: '#444444', textAlign: 'center', writingDirection: 'rtl' }}
        >
          جارٍ تهيئة التطبيق…
        </Text>
      </View>
    </SafeAreaView>
  );
}
