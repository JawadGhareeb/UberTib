import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, View } from 'react-native';

import { AssessmentScaffold } from '@/features/assessment/components/assessment-scaffold';
import { useAssessmentSession } from '@/features/assessment/state/assessment-session-provider';
import { AppIcon, AppText } from '@/shared/components/ui';
import { cn } from '@/shared/utils/cn';

const answers = ['مع البارد', 'مع الساخن', 'عند المضغ', 'بدون سبب واضح', 'لا أعرف'] as const;

const conceptItems = [
  ['المدة', { ios: 'clock', android: 'schedule', web: 'schedule' }],
  ['الشدة', { ios: 'waveform.path.ecg', android: 'monitor_heart', web: 'monitor_heart' }],
  ['حرارة', { ios: 'thermometer', android: 'thermostat', web: 'thermostat' }],
  ['المضغ', { ios: 'fork.knife', android: 'restaurant', web: 'restaurant' }],
  ['إصابة', { ios: 'bandage.fill', android: 'healing', web: 'healing' }],
] as const;

export function AssessmentQuestionsScreen() {
  const router = useRouter();
  const { returnTo } = useLocalSearchParams<{ returnTo?: string }>();
  const { answers: selectedAnswers, toggleAnswer } = useAssessmentSession();

  return (
    <AssessmentScaffold
      onPrimary={() => {
        if (returnTo === 'review') {
          if (router.canGoBack()) router.back();
          else router.replace('/assessment/review');
        } else {
          router.push('/assessment/health');
        }
      }}
      primaryDisabled={selectedAnswers.length === 0}
      primaryLabel="متابعة"
      phase="أسئلة متكيّفة"
      title="تفاصيل الحالة"
      topContent={
        <View className="gap-2 pt-1">
          <View className="flex-row items-center justify-between">
            <View className="rounded-full bg-tone-success-fill px-2.5 py-1.5">
              <AppText className="text-type-caption text-tone-success-text" variant="caption">
                تم الحفظ
              </AppText>
            </View>
            <View className="rounded-full bg-action-subtle px-2.5 py-1.5">
              <AppText className="text-type-caption text-content-link" variant="caption">
                سارة الأحمد
              </AppText>
            </View>
          </View>

          <View className="h-11 rounded-[12px] bg-surface-subtle px-3 py-2">
            <View className="flex-row items-center justify-between">
              <AppText className="text-type-label text-content-secondary" variant="caption">
                المكان ✓ الأعراض — السياق
              </AppText>
              <View className="h-1.5 w-24 overflow-hidden rounded-full bg-border-subtle">
                <View className="h-full w-[55%] rounded-full bg-action-primary" />
              </View>
            </View>
          </View>
        </View>
      }
    >
      <View className="mt-2 rounded-[16px] border border-border-subtle bg-surface-default p-3.5">
        <View className="flex-row items-center justify-between gap-1.5">
          {conceptItems.map(([label, icon]) => (
            <View className="flex-1 items-center gap-1" key={label}>
              <View className="h-9 w-9 items-center justify-center rounded-[11px] bg-action-subtle">
                <AppIcon name={icon} size={17} tone="action" />
              </View>
              <AppText className="text-type-caption text-content-secondary" variant="caption">
                {label}
              </AppText>
            </View>
          ))}
        </View>

        <View className="mt-3">
          <AppText className="text-type-caption text-content-link" variant="caption">
            سؤال مرتبط بالألم
          </AppText>
          <AppText className="mt-1 font-ui-bold text-type-heading-4 ">
            متى يزيد الألم عادةً؟
          </AppText>
          <AppText className="mt-1 text-type-label text-content-secondary" variant="caption">
            يمكنك اختيار أكثر من إجابة
          </AppText>
        </View>

        <View className="mt-3 gap-1.5">
          {answers.map((answer) => {
            const selected = selectedAnswers.includes(answer);

            return (
              <Pressable
                accessibilityRole="checkbox"
                accessibilityState={{ checked: selected }}
                className={cn(
                  'h-10 flex-row items-center justify-between rounded-[11px] border px-3',
                  selected
                    ? 'border-action-primary bg-action-subtle'
                    : 'border-border-subtle bg-surface-canvas',
                )}
                key={answer}
                onPress={() => toggleAnswer(answer)}
              >
                <View
                  className={cn(
                    'h-5 w-5 items-center justify-center rounded-[6px] border',
                    selected
                      ? 'border-action-primary bg-action-primary'
                      : 'border-border-strong bg-surface-default',
                  )}
                >
                  {selected ? (
                    <AppIcon
                      name={{ ios: 'checkmark', android: 'check', web: 'check' }}
                      size={12}
                      tone="onAction"
                    />
                  ) : null}
                </View>
                <AppText
                  className={cn('text-type-label', selected && 'font-ui-bold text-content-link')}
                  variant="label"
                >
                  {answer}
                </AppText>
              </Pressable>
            );
          })}
        </View>

        <View className="mt-3 flex-row items-center justify-end gap-2 rounded-[10px] bg-tone-info-fill px-3 py-2.5">
          <AppIcon
            name={{ ios: 'info.circle.fill', android: 'info', web: 'info' }}
            size={17}
            tone="info"
          />
        </View>
      </View>

      <View className="mt-3 flex-row items-center justify-between rounded-[11px] bg-surface-subtle px-3 py-2.5">
        <Pressable accessibilityRole="button">
          <AppText className="text-type-label text-content-link" variant="label">
            تعديل
          </AppText>
        </Pressable>
        <AppText className="text-type-label text-content-secondary" variant="caption">
          بدأ منذ 3 أيام • الشدة متوسطة
        </AppText>
      </View>
    </AssessmentScaffold>
  );
}
