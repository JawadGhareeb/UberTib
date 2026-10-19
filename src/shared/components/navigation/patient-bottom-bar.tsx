import { useRouter } from 'expo-router';
import { Pressable, Text, View, useWindowDimensions } from 'react-native';
import Animated, { FadeIn, ReduceMotion } from 'react-native-reanimated';

import { TabMark } from '@/shared/components/navigation/tab-mark';
import {
  PATIENT_TAB_BAR_HEIGHT,
  PATIENT_TAB_HEIGHT,
} from '@/shared/components/navigation/patient-tab-metrics';
import { theme } from '@/shared/theme';
import { useAppTheme } from '@/shared/theme/theme-provider';
import { cn } from '@/shared/utils/cn';

export type PatientTabName = 'profile' | 'care' | 'discover' | 'home';

const destinations: { name: PatientTabName; label: string }[] = [
  { name: 'profile', label: 'حسابي' },
  { name: 'care', label: 'علاجي' },
  { name: 'discover', label: 'اكتشف' },
  { name: 'home', label: 'الرئيسية' },
];

export function PatientBottomBar({
  active,
  onSelect,
  onLongPress,
  bottomInset = 8,
}: {
  active: PatientTabName;
  onSelect?: (name: PatientTabName) => void;
  onLongPress?: (name: PatientTabName) => void;
  bottomInset?: number;
}) {
  const router = useRouter();
  const { colors } = useAppTheme();
  const { width: windowWidth } = useWindowDimensions();

  // Transparent full-width positioning layer, with only the centered capsule visible.
  // Keep physical safe-area clearance so the pill floats above the iOS home indicator.
  return (
    <View
      pointerEvents="box-none"
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: Math.max(bottomInset, 14),
        alignItems: 'center',
      }}
    >
      <View
        className="rounded-full border border-border-subtle bg-surface-default px-1.5 py-1"
        style={{
          width: Math.max(0, Math.min(windowWidth - 40, 420)),
          height: PATIENT_TAB_BAR_HEIGHT,
          borderRadius: 36,
          backgroundColor: colors.surface.default,
          shadowColor: '#111111',
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 0.14,
          shadowRadius: 14,
          elevation: 9,
        }}
      >
        <View
          className="w-full flex-row items-center justify-between gap-1"
          style={{ height: PATIENT_TAB_HEIGHT, direction: 'ltr' }}
        >
          {destinations.map(({ name, label }) => {
            const focused = name === active;
            return (
              <Pressable
                key={name}
                accessibilityLabel={label}
                accessibilityRole="tab"
                accessibilityState={{ selected: focused }}
                className={cn(
                  'min-h-[54px] flex-row-reverse items-center justify-center rounded-full',
                  focused ? 'bg-action-primary px-3' : 'bg-transparent',
                )}
                style={{ flex: focused ? 1.95 : 1 }}
                onLongPress={() => onLongPress?.(name)}
                onPress={() => (onSelect ? onSelect(name) : router.replace(`/(tabs)/${name}`))}
              >
                <TabMark
                  kind={name}
                  focused={focused}
                  activeTintColor={colors.text.onAction}
                  inactiveTintColor={colors.text.secondary}
                />
                {focused ? (
                  <Animated.View
                    entering={FadeIn.duration(theme.motion.duration.tabSelection).reduceMotion(
                      ReduceMotion.System,
                    )}
                    className="min-w-0 items-center justify-center"
                  >
                    <Text
                      numberOfLines={1}
                      style={{
                        color: colors.text.onAction,
                        fontFamily: theme.font.semibold,
                        fontSize: 14,
                        lineHeight: 23,
                        textAlign: 'center',
                        writingDirection: 'rtl',
                        includeFontPadding: true,
                      }}
                    >
                      {label}
                    </Text>
                  </Animated.View>
                ) : null}
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );
}
