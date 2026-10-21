import { Pressable, Text, View } from 'react-native';
import { TabMark } from './tab-mark';
import type { PatientTabName } from './patient-tab-configuration';
import { theme } from '@/shared/theme';
import { useAppTheme } from '@/shared/theme/use-app-theme';
import { cn } from '@/shared/utils/cn';

export function PatientTabItem({
  name,
  label,
  focused,
  onPress,
  onLongPress,
}: {
  name: PatientTabName;
  label: string;
  focused: boolean;
  onPress: () => void;
  onLongPress: () => void;
}) {
  const { colors } = useAppTheme();

  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="tab"
      accessibilityState={{ selected: focused }}
      className={cn(
        'min-h-[54px] flex-row-reverse items-center justify-center rounded-full',
        focused ? 'bg-action-primary px-3' : 'bg-transparent',
      )}
      style={{ flex: focused ? 1.95 : 1 }}
      onLongPress={onLongPress}
      onPress={onPress}
    >
      <TabMark
        kind={name}
        focused={focused}
        activeTintColor={colors.text.onAction}
        inactiveTintColor={colors.text.secondary}
      />
      {focused ? (
        <View className="min-w-0 items-center justify-center">
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
        </View>
      ) : null}
    </Pressable>
  );
}
