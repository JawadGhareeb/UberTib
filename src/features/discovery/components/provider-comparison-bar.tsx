import { useEffect, useState } from 'react';
import { Pressable, View } from 'react-native';
import Animated, {
  Easing,
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { AppText } from '@/shared/components/ui';
import { theme } from '@/shared/theme';

/** A fixed-height tray; animate only its opacity/translation, never its layout. */
export function ProviderComparisonBar({
  count,
  bottom,
  onCompare,
}: {
  count: number;
  bottom: number;
  onCompare: () => void;
}) {
  const visible = count > 0;
  const [lastCount, setLastCount] = useState(count || 1);
  const reveal = useSharedValue(0);

  // Retain the previous label while the tray fades out.
  if (count > 0 && count !== lastCount) setLastCount(count);

  useEffect(() => {
    reveal.value = withTiming(visible ? 1 : 0, {
      duration: theme.motion.duration.overlay,
      easing: Easing.out(Easing.cubic),
      reduceMotion: ReduceMotion.System,
    });
  }, [count, reveal, visible]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: reveal.value,
    transform: [{ translateY: (1 - reveal.value) * 22 }],
  }));

  const displayedCount = visible ? count : lastCount;

  return (
    <View
      pointerEvents={visible ? 'box-none' : 'none'}
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom,
        height: 72,
        paddingHorizontal: 16,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
      }}
    >
      <Animated.View
        style={[
          { width: '100%', maxWidth: 398, height: 68, flexGrow: 0, flexShrink: 0 },
          animatedStyle,
        ]}
      >
        <View
          className="rounded-[14px] border border-border-subtle bg-surface-default"
          style={{
            width: '100%',
            height: 68,
            flexDirection: 'row-reverse',
            alignItems: 'center',
            paddingHorizontal: 12,
            gap: 12,
          }}
        >
          <View style={{ flex: 1, minWidth: 0, alignItems: 'flex-end', justifyContent: 'center' }}>
            <AppText
              align="right"
              variant="label"
              className="font-ui-bold"
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.85}
            >
              أطباء للمقارنة: {displayedCount} من 3
            </AppText>
            <AppText
              align="right"
              variant="caption"
              className="text-content-secondary"
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.85}
            >
              {displayedCount === 3 ? 'الحد الأقصى ثلاثة أطباء' : 'اختر طبيبين على الأقل'}
            </AppText>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="مقارنة الأطباء المحددين"
            accessibilityState={{ disabled: count < 2 }}
            disabled={count < 2}
            onPress={onCompare}
            className={
              'items-center justify-center rounded-[10px] ' +
              (count < 2 ? 'bg-surface-subtle' : 'bg-action-primary')
            }
            style={{ width: 108, height: 42, flexGrow: 0, flexShrink: 0 }}
          >
            <AppText
              align="center"
              numberOfLines={1}
              variant="label"
              className={
                'font-ui-bold ' + (count < 2 ? 'text-content-disabled' : 'text-content-on-action')
              }
            >
              مقارنة
            </AppText>
          </Pressable>
        </View>
      </Animated.View>
    </View>
  );
}
