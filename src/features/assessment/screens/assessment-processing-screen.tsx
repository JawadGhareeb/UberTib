import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Pressable, View } from 'react-native';
import Animated, {
  Easing,
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { AssessmentScaffold } from '@/features/assessment/components/assessment-scaffold';
import { AppIcon, AppText } from '@/shared/components/ui';

const steps = [
  ['نجمع', { ios: 'tray.full.fill', android: 'inventory_2', web: 'inventory_2' }],
  ['نرتب', { ios: 'slider.horizontal.3', android: 'tune', web: 'tune' }],
  ['نجهّز', { ios: 'sparkles', android: 'auto_awesome', web: 'auto_awesome' }],
] as const;

export function AssessmentProcessingScreen() {
  const router = useRouter();
  const { outcome } = useLocalSearchParams<{
    outcome?: 'result' | 'needs-more-info' | 'manual-review';
  }>();
  const pulse = useSharedValue(0.94);

  useEffect(() => {
    pulse.value = withRepeat(
      withTiming(1.05, {
        duration: 900,
        easing: Easing.inOut(Easing.quad),
        reduceMotion: ReduceMotion.System,
      }),
      -1,
      true,
    );

    const timer = setTimeout(() => {
      if (outcome === 'needs-more-info') {
        router.replace('/assessment/needs-more-info');
        return;
      }

      if (outcome === 'manual-review') {
        router.replace('/assessment/manual-review');
        return;
      }

      router.replace('/assessment/result');
    }, 2200);
    return () => clearTimeout(timer);
  }, [outcome, pulse, router]);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  return (
    <AssessmentScaffold phase="المعالجة" scroll={false} title="نراجع معلومات حالتك">
      <View className="pt-2">
        <View className="h-[300px] items-center justify-center rounded-[22px] bg-surface-subtle">
          <Animated.View
            className="h-28 w-28 items-center justify-center rounded-full bg-action-subtle"
            style={pulseStyle}
          >
            <View className="h-20 w-20 items-center justify-center rounded-full bg-surface-default">
              <AppIcon
                name={{ ios: 'sparkles', android: 'auto_awesome', web: 'auto_awesome' }}
                size={34}
                tone="action"
              />
            </View>
          </Animated.View>

          <View className="mt-7 flex-row items-center justify-center gap-3">
            {steps.map(([label, icon], index) => (
              <View className="items-center" key={label}>
                <View
                  className={`h-12 w-12 items-center justify-center rounded-[15px] ${
                    index === 1 ? 'bg-action-primary' : 'bg-surface-default'
                  }`}
                >
                  <AppIcon name={icon} size={20} tone={index === 1 ? 'onAction' : 'action'} />
                </View>
                <AppText
                  className="mt-1.5 text-type-caption text-content-secondary"
                  variant="caption"
                >
                  {label}
                </AppText>
              </View>
            ))}
          </View>
        </View>

        <View className="mt-3 h-[46px] flex-row items-center justify-end gap-2 rounded-[13px] bg-action-subtle px-3">
          <AppText className="flex-1 text-type-label text-content-link" variant="label">
            الآن: نرتب المعلومات المرتبطة بحالتك
          </AppText>
          <AppIcon
            name={{ ios: 'slider.horizontal.3', android: 'tune', web: 'tune' }}
            size={18}
            tone="action"
          />
        </View>

        <View className="mt-3 rounded-[14px] border border-border-subtle bg-surface-default p-3">
          <AppText className="font-ui-bold text-type-caption" variant="label">
            شو عم نعمل؟
          </AppText>
          <AppText className="mt-1.5 text-type-label  text-content-secondary" variant="caption">
            نفهم المعلومات ونجهّز نتائج البحث عن الخدمة الأقرب، بدون إصدار تشخيص نهائي.
          </AppText>
        </View>

        <View className="mt-3 flex-row items-center gap-3 rounded-[14px] bg-tone-info-fill p-3">
          <View className="min-w-0 flex-1 items-end">
            <AppText className="font-ui-bold text-type-label text-tone-info-text" variant="label">
              إجاباتك محفوظة
            </AppText>
            <AppText className="mt-1 text-type-caption text-content-secondary" variant="caption">
              يمكنك العودة للرئيسية وسنخبرك عند الجاهزية.
            </AppText>
          </View>
          <AppIcon
            name={{ ios: 'checkmark.shield.fill', android: 'verified_user', web: 'verified_user' }}
            size={22}
            tone="info"
          />
        </View>

        <View className="mt-2 flex-row items-center justify-end gap-2 rounded-[11px] bg-surface-subtle px-3 py-2.5">
          <AppText className="flex-1 text-type-caption text-content-secondary" variant="caption">
            إذا انقطع الاتصال، يمكنك إعادة المحاولة دون فقدان الإجابات.
          </AppText>
          <AppIcon
            name={{ ios: 'wifi.exclamationmark', android: 'wifi', web: 'wifi' }}
            size={16}
            tone="secondary"
          />
        </View>

        <Pressable
          accessibilityRole="button"
          className="mt-3 h-[50px] flex-row items-center justify-center gap-2 rounded-[12px] border border-action-primary bg-surface-default"
          onPress={() => router.replace('/(tabs)/home')}
        >
          <AppText className="font-ui-bold text-content-link" variant="label">
            العودة للرئيسية
          </AppText>
          <AppIcon
            name={{ ios: 'house.fill', android: 'home', web: 'home' }}
            size={18}
            tone="action"
          />
        </Pressable>
      </View>
    </AssessmentScaffold>
  );
}
