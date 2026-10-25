import { memo } from 'react';
import { View } from 'react-native';

import { AppIcon } from '@/shared/components/ui/app-icon';
import { useAppTheme } from '@/shared/theme/use-app-theme';

type TabMarkKind = 'home' | 'discover' | 'care' | 'profile';

interface TabMarkProps {
  kind: TabMarkKind;
  focused: boolean;
  activeTintColor?: string;
  inactiveTintColor?: string;
}

const iconNames = {
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

/**
 * Show exactly one synchronous SVG icon per tab.
 *
 * Expo Symbols on Android renders an empty placeholder while it loads its
 * icon font. The former implementation had two font-backed SymbolViews behind
 * overlapping Reanimated views; tab switches could leave an icon invisible
 * until a subsequent interaction. AppIcon uses bundled Lucide SVG paths and
 * does not depend on async font loading or animated opacity layers.
 */
export const TabMark = memo(function TabMark({
  kind,
  focused,
  activeTintColor,
  inactiveTintColor,
}: TabMarkProps) {
  const { colors } = useAppTheme();

  return (
    <View
      style={{
        width: 32,
        height: 32,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <AppIcon
        name={focused ? iconNames[kind].active : iconNames[kind].inactive}
        size={focused ? 23 : 22}
        color={
          focused
            ? (activeTintColor ?? colors.text.onAction)
            : (inactiveTintColor ?? colors.text.secondary)
        }
      />
    </View>
  );
});
