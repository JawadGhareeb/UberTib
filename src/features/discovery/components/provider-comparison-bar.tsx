import { View } from 'react-native';
import Animated, { FadeInUp, FadeOutDown, ReduceMotion } from 'react-native-reanimated';

import { AppText, Button } from '@/shared/components/ui';
import { theme } from '@/shared/theme';

/** Mounted only while doctors are selected; entering and exiting are both animated. */
export function ProviderComparisonBar({
  count,
  bottom,
  onCompare,
}: {
  count: number;
  bottom: number;
  onCompare: () => void;
}) {
  return (
    <Animated.View
      className="absolute left-0 right-0 px-4"
      style={{ bottom }}
      entering={FadeInUp.duration(theme.motion.duration.overlay).reduceMotion(ReduceMotion.System)}
      exiting={FadeOutDown.duration(theme.motion.duration.overlay).reduceMotion(
        ReduceMotion.System,
      )}
    >
      <View className="mx-auto min-h-[58px] w-full max-w-[398px] flex-row-reverse items-center gap-3 rounded-[14px] border border-border-subtle bg-surface-default px-3 py-2">
        <View className="min-w-0 flex-1 items-end gap-0.5">
          <AppText align="right" variant="label" className="font-ui-bold">
            أطباء للمقارنة: {count} من 3
          </AppText>
          <AppText align="right" variant="caption" className="text-content-secondary">
            {count === 3 ? 'الحد الأقصى ثلاثة أطباء' : 'اختر طبيبين على الأقل'}
          </AppText>
        </View>
        <Button
          className="min-h-[42px]"
          label="مقارنة"
          disabled={count < 2}
          onPress={onCompare}
          size="compact"
        />
      </View>
    </Animated.View>
  );
}
