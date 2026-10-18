import { useEffect } from 'react';
import { BackHandler, Platform, Pressable, ScrollView, View } from 'react-native';
import Animated, { FadeInLeft, FadeInRight, LinearTransition, ReduceMotion } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  type OnboardingIllustrationKind,
  OnboardingIllustration,
} from '@/features/app-entry/components/onboarding-illustrations';
import { useAppDirection } from '@/providers/app-direction-provider';
import { AppText, Button } from '@/shared/components/ui';
import { theme } from '@/shared/theme';
import { cn } from '@/shared/utils/cn';

export interface OnboardingSlide {
  title: string;
  copy: string;
  illustration: OnboardingIllustrationKind;
}

interface OnboardingScreenProps {
  slide: OnboardingSlide;
  index: number;
  total: number;
  onNext: () => void;
  onBack: () => void;
  onGoToSlide: (target: number) => void;
  onSkip: () => void;
  transitionDirection: 'forward' | 'backward';
}

export function OnboardingScreen({
  slide,
  index,
  total,
  onNext,
  onBack,
  onGoToSlide,
  onSkip,
  transitionDirection,
}: OnboardingScreenProps) {
  const last = index === total - 1;
  const { rowClassName } = useAppDirection();
  const slideEntrance = (transitionDirection === 'forward' ? FadeInLeft : FadeInRight)
    .duration(theme.motion.duration.overlay)
    .reduceMotion(ReduceMotion.System);

  useEffect(() => {
    if (Platform.OS !== 'android' || index === 0) return;

    const backSubscription = BackHandler.addEventListener('hardwareBackPress', () => {
      onBack();
      return true;
    });

    return () => backSubscription.remove();
  }, [index, onBack]);

  return (
    <SafeAreaView className="flex-1 bg-surface-canvas">
      <ScrollView
        className="flex-1"
        bounces={false}
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="mx-auto w-full max-w-[430px] flex-1 gap-3 px-5 pb-5">
          <View className="h-9 flex-row items-center justify-between">
            <View className="flex-row items-center gap-1.5" style={{ direction: 'ltr' }}>
              {Array.from({ length: total }, (_, dotIndex) => (
                <Pressable
                  accessibilityLabel={`الانتقال إلى الصفحة ${dotIndex + 1} من ${total}`}
                  accessibilityRole="tab"
                  accessibilityState={{ selected: dotIndex === index }}
                  className="h-9 w-8 items-center justify-center"
                  key={dotIndex}
                  onPress={() => onGoToSlide(dotIndex)}
                >
                  <Animated.View
                    className={cn(
                      'h-[7px] rounded-full',
                      dotIndex === index ? 'w-5 bg-action-primary' : 'w-[7px] bg-border-default',
                    )}
                    layout={LinearTransition.duration(theme.motion.duration.stateChange)
                      .reduceMotion(ReduceMotion.System)}
                  />
                </Pressable>
              ))}
            </View>

            <Pressable
              accessibilityRole="button"
              className="min-h-target-comfortable min-w-[56px] items-end justify-center"
              onPress={onSkip}
            >
              <AppText className="text-content-secondary" variant="label">
                تخطي
              </AppText>
            </Pressable>
          </View>

          <Animated.View
            className="h-[340px] overflow-hidden rounded-[24px] bg-surface-subtle"
            entering={slideEntrance}
            key={`${index}-${slide.illustration}`}
          >
            <OnboardingIllustration kind={slide.illustration} />
          </Animated.View>

          <Animated.View
            className="min-h-[118px] gap-2"
            entering={slideEntrance}
            key={`${index}-${slide.title}`}
          >
            <AppText
              className="font-ui-bold"
              style={{
                fontSize: theme.typography['onboarding-title'].fontSize,
                lineHeight: theme.typography['onboarding-title'].lineHeight,
              }}
              variant="heading-2"
            >
              {slide.title}
            </AppText>
            <AppText
              className="text-content-secondary"
              style={{
                fontSize: theme.typography['onboarding-copy'].fontSize,
                lineHeight: theme.typography['onboarding-copy'].lineHeight,
              }}
              variant="body"
            >
              {slide.copy}
            </AppText>
          </Animated.View>

          <View className="min-h-0 flex-1 justify-end gap-[9px]">
            <View className={cn(rowClassName, 'gap-2')}>
              {index > 0 ? (
                <Button
                  accessibilityLabel="العودة إلى الخطوة السابقة"
                  className="h-[52px] flex-1 rounded-[12px] px-2"
                  endIcon={{ ios: 'arrow.right', android: 'arrow_forward', web: 'arrow_forward' }}
                  label="السابق"
                  onPress={onBack}
                  variant="secondary"
                />
              ) : null}
              <Button
                className={cn('h-[52px] rounded-[12px]', index > 0 ? 'flex-[2]' : 'flex-1')}
                endIcon={{ ios: 'arrow.left', android: 'arrow_back', web: 'arrow_back' }}
                label={last ? 'ابدأ مع UperTib' : 'التالي'}
                onPress={onNext}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
