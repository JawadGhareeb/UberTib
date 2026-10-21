import { useLocalSearchParams, useRouter } from 'expo-router';
import { View } from 'react-native';
import { Checkbox } from 'heroui-native';

import { AssessmentScaffold } from '@/features/assessment/components/assessment-scaffold';
import { ASSESSMENT_PATIENT_FIXTURES } from '@/features/assessment/presentation/assessment-patient-copy';
import { useAssessmentSession } from '@/features/assessment/state/assessment-session-provider';
import { AppIcon, AppText, TextField } from '@/shared/components/ui';
import { cn } from '@/shared/utils/cn';

const answers = ['مع البارد', 'مع الساخن', 'عند المضغ', 'بدون سبب واضح', 'لا أعرف'] as const;

export function AssessmentQuestionsScreen() {
  const router = useRouter();
  const { returnTo } = useLocalSearchParams<{ returnTo?: string }>();
  const {
    patient,
    complaint,
    details,
    setDetails,
    answers: selectedAnswers,
    toggleAnswer,
  } = useAssessmentSession();
  const question =
    complaint.includes('ألم') || complaint.includes('حساسية')
      ? 'متى بيزيد الألم عادةً؟'
      : 'بأي حالات بتلاحظ المشكلة؟';

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
      title="تفاصيل الأعراض"
      topContent={
        <View className="flex-row-reverse items-center justify-between gap-2">
          <AppText variant="label" className="min-w-0 flex-1 text-content-secondary">
            اختر كل الإجابات اللي بتنطبق عليك.
          </AppText>
          <AppText variant="caption" className="text-content-link">
            {ASSESSMENT_PATIENT_FIXTURES[patient].name}
          </AppText>
        </View>
      }
    >
      <View className="gap-3 rounded-[17px] border border-border-subtle bg-surface-default p-3">
        <View className="flex-row-reverse items-center gap-2">
          <View className="h-11 w-11 items-center justify-center rounded-[12px] bg-action-subtle">
            <AppIcon
              name={{ ios: 'waveform.path.ecg', android: 'monitor_heart', web: 'monitor_heart' }}
              size={21}
              tone="action"
            />
          </View>
          <View className="min-w-0 flex-1 items-end gap-1">
            <AppText variant="caption" className="text-content-link">
              أسئلة حسب المشكلة المختارة
            </AppText>
            <AppText align="right" variant="heading-4" className="font-ui-bold">
              {question}
            </AppText>
          </View>
        </View>
        <View className="gap-2">
          {answers.map((answer) => {
            const selected = selectedAnswers.includes(answer);
            return (
              <Checkbox
                key={answer}
                isSelected={selected}
                onSelectedChange={() => toggleAnswer(answer)}
                accessibilityLabel={answer}
                className={cn(
                  'min-h-[52px] w-full flex-row-reverse items-center gap-3 rounded-[12px] border px-3 py-2.5',
                  selected
                    ? 'border-action-primary bg-action-subtle'
                    : 'border-border-subtle bg-surface-default',
                )}
              >
                <Checkbox.Indicator />
                <AppText
                  align="right"
                  variant="label"
                  className={
                    selected
                      ? 'min-w-0 flex-1 font-ui-semibold text-content-link'
                      : 'min-w-0 flex-1 text-content-primary'
                  }
                >
                  {answer}
                </AppText>
              </Checkbox>
            );
          })}
        </View>
      </View>
      <View className="gap-1.5">
        <TextField
          label="معلومات إضافية (اختياري)"
          multiline
          maxLength={240}
          placeholder="خبرنا أي تفاصيل إضافية ممكن تساعد الطبيب"
          value={details}
          onChangeText={setDetails}
        />
        <AppText align="left" direction="ltr" variant="caption" className="text-content-secondary">
          {details.length} / 240
        </AppText>
      </View>
      <View className="flex-row-reverse items-center gap-2 rounded-[11px] bg-tone-info-fill p-3">
        <AppIcon
          name={{ ios: 'info.circle', android: 'info_outline', web: 'info_outline' }}
          size={17}
          tone="info"
        />
        <AppText align="right" variant="caption" className="min-w-0 flex-1 text-tone-info-text">
          إجاباتك بتساعد على التوجيه الأولي، والطبيب بيحدد التشخيص النهائي بعد الفحص.
        </AppText>
      </View>
    </AssessmentScaffold>
  );
}
