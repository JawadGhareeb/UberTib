import { Tabs } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import Animated, { FadeIn, ReduceMotion } from 'react-native-reanimated';

import { TabMark } from '@/shared/components/navigation';
import {
  PATIENT_TAB_BAR_HEIGHT,
  PATIENT_TAB_HEIGHT,
} from '@/shared/components/navigation/patient-tab-metrics';
import { theme } from '@/shared/theme';
import { useAppTheme } from '@/shared/theme/theme-provider';
import { cn } from '@/shared/utils/cn';

type TabRouteName = 'profile' | 'care' | 'discover' | 'home';

const tabItems = {
  profile: { label: 'حسابي', kind: 'profile' },
  care: { label: 'علاجي', kind: 'care' },
  discover: { label: 'حجوزاتي', kind: 'discover' },
  home: { label: 'الرئيسية', kind: 'home' },
} as const;

interface TabButtonProps {
  routeName: TabRouteName;
  focused: boolean;
  onPress: () => void;
  onLongPress: () => void;
}

function TabButton({ routeName, focused, onPress, onLongPress }: TabButtonProps) {
  const { colors } = useAppTheme();
  const item = tabItems[routeName];

  return (
    <Pressable
      accessibilityLabel={item.label}
      accessibilityRole="tab"
      accessibilityState={{ selected: focused }}
      className="relative h-[52px] flex-1 items-center justify-center gap-1 rounded-[12px]"
      onLongPress={onLongPress}
      onPress={onPress}
    >
      {focused ? (
        <Animated.View
          className={cn(
            'absolute inset-0 rounded-[12px]',
            focused ? 'bg-action-subtle' : 'bg-transparent',
          )}
          entering={FadeIn.duration(theme.motion.duration.tabSelection).reduceMotion(
            ReduceMotion.System,
          )}
        >
        </Animated.View>
      ) : null}
      <TabMark
        activeTintColor={colors.text.link}
        focused={focused}
        inactiveTintColor={colors.text.secondary}
        kind={item.kind}
      />
      <Text
        style={{
          color: focused ? colors.text.link : colors.text.secondary,
          fontFamily: focused ? theme.font.semibold : theme.font.medium,
          fontSize: 10,
          lineHeight: 14,
          textAlign: 'center',
          writingDirection: 'rtl',
        }}
      >
        {item.label}
      </Text>
    </Pressable>
  );
}

export default function PatientTabsLayout() {
  return (
    <Tabs
      initialRouteName="home"
      screenOptions={{ headerShown: false, tabBarHideOnKeyboard: true }}
      tabBar={({ state, navigation, insets }) => (
        <View
          className="absolute bottom-0 left-0 right-0 rounded-t-[18px] border-t border-border-subtle bg-surface-default px-3 pt-2"
          style={{
            height: PATIENT_TAB_BAR_HEIGHT + Math.max(insets.bottom, 8),
            paddingBottom: Math.max(insets.bottom, 8),
          }}
        >
          <View className="mx-auto h-[52px] w-full max-w-[430px] flex-row items-center gap-1" style={{ height: PATIENT_TAB_HEIGHT }}>
            {state.routes.map((route, index) => {
              const routeName = route.name as TabRouteName;
              if (!tabItems[routeName]) return null;
              const focused = state.index === index;
              return (
                <TabButton
                  focused={focused}
                  key={route.key}
                  onLongPress={() => navigation.emit({ type: 'tabLongPress', target: route.key })}
                  onPress={() => {
                    const event = navigation.emit({
                      canPreventDefault: true,
                      target: route.key,
                      type: 'tabPress',
                    });
                    if (!focused && !event.defaultPrevented)
                      navigation.navigate(route.name, route.params);
                  }}
                  routeName={routeName}
                />
              );
            })}
          </View>
        </View>
      )}
    >
      <Tabs.Screen name="profile" options={{ title: 'حسابي' }} />
      <Tabs.Screen name="care" options={{ title: 'علاجي' }} />
      <Tabs.Screen name="discover" options={{ title: 'حجوزاتي' }} />
      <Tabs.Screen name="home" options={{ title: 'الرئيسية' }} />
    </Tabs>
  );
}
