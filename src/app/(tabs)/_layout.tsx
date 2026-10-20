import { Tabs } from 'expo-router';
import { useResolveClassNames } from 'uniwind';

import {
  PatientBottomBar,
  type PatientTabName,
} from '@/shared/components/navigation/patient-bottom-bar';

export default function PatientTabsLayout() {
  // React Navigation owns a separate tab scene surface. Keep its native
  // background in sync with the same Uniwind token as the screen canvas.
  const sceneStyle = useResolveClassNames('bg-surface-canvas');

  return (
    <Tabs
      initialRouteName="home"
      screenOptions={{ headerShown: false, tabBarHideOnKeyboard: true, sceneStyle }}
      tabBar={({ state, navigation, insets }) => (
        <PatientBottomBar
          active={(state.routes[state.index]?.name ?? 'home') as PatientTabName}
          bottomInset={Math.max(insets.bottom, 8)}
          onLongPress={(name) => {
            const route = state.routes.find((item) => item.name === name);
            if (route) navigation.emit({ type: 'tabLongPress', target: route.key });
          }}
          onSelect={(name) => {
            const route = state.routes.find((item) => item.name === name);
            if (!route) return;
            const event = navigation.emit({
              canPreventDefault: true,
              target: route.key,
              type: 'tabPress',
            });
            if (state.routes[state.index]?.name !== name && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          }}
        />
      )}
    >
      <Tabs.Screen name="profile" options={{ title: 'حسابي' }} />
      <Tabs.Screen name="care" options={{ title: 'علاجي' }} />
      <Tabs.Screen name="discover" options={{ title: 'اكتشف' }} />
      <Tabs.Screen name="home" options={{ title: 'الرئيسية' }} />
    </Tabs>
  );
}
