import { SymbolView } from 'expo-symbols';
import medium from 'expo-symbols/androidWeights/medium';
import regular from 'expo-symbols/androidWeights/regular';
import { useEffect } from 'react';
import { View, type ColorValue } from 'react-native';
import Animated, {
  Easing,
  ReduceMotion,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { theme } from '@/shared/theme';
import { useAppTheme } from '@/shared/theme/use-app-theme';

type TabMarkKind = 'home' | 'discover' | 'care' | 'profile';

interface TabMarkProps {
  kind: TabMarkKind;
  focused: boolean;
  activeTintColor?: ColorValue;
  inactiveTintColor?: ColorValue;
}

const symbolNames = {
  home: {
    active: { ios: 'house.fill', android: 'home_filled', web: 'home_filled' },
    inactive: { ios: 'house', android: 'home', web: 'home' },
  },
  discover: {
    active: { ios: 'square.grid.2x2.fill', android: 'grid_view', web: 'grid_view' },
    inactive: { ios: 'square.grid.2x2', android: 'grid_view', web: 'grid_view' },
  },
  care: {
    active: { ios: 'heart.text.square.fill', android: 'favorite', web: 'favorite' },
    inactive: { ios: 'heart.text.square', android: 'favorite_border', web: 'favorite_border' },
  },
  profile: {
    active: { ios: 'person.fill', android: 'person', web: 'person' },
    inactive: { ios: 'person', android: 'person_outline', web: 'person_outline' },
  },
} as const;

export function TabMark({ kind, focused, activeTintColor, inactiveTintColor }: TabMarkProps) {
  const { colors } = useAppTheme();
  const progress = useSharedValue(focused ? 1 : 0);
  const activeSymbol = symbolNames[kind].active;
  const inactiveSymbol = symbolNames[kind].inactive;

  useEffect(() => {
    progress.value = withTiming(focused ? 1 : 0, {
      duration: theme.motion.duration.stateChange,
      easing: Easing.out(Easing.cubic),
      reduceMotion: ReduceMotion.System,
    });
  }, [focused, progress]);

  const inactiveIconStyle = useAnimatedStyle(() => ({
    opacity: 1 - progress.value,
    transform: [{ scale: interpolate(progress.value, [0, 1], [1, 0.92]) }],
  }));

  const activeIconStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ scale: interpolate(progress.value, [0, 1], [0.9, 1]) }],
  }));

  return (
    <View className="h-8 w-8 items-center justify-center">
      <Animated.View className="absolute items-center justify-center" style={inactiveIconStyle}>
        <SymbolView
          name={inactiveSymbol}
          size={22}
          tintColor={inactiveTintColor ?? colors.text.secondary}
          weight={{ android: regular, ios: 'regular' }}
        />
      </Animated.View>

      <Animated.View className="absolute items-center justify-center" style={activeIconStyle}>
        <SymbolView
          name={activeSymbol}
          size={23}
          tintColor={activeTintColor ?? colors.action.primary}
          weight={{ android: medium, ios: 'semibold' }}
        />
      </Animated.View>
    </View>
  );
}
