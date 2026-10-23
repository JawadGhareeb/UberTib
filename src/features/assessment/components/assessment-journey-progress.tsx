import { View } from 'react-native';
import { AppText } from '@/shared/components/ui';

const steps = [
  { phase: 'البدء', label: 'بداية التقييم' },
  { phase: 'المريض', label: 'اختيار المريض' },
  { phase: 'المشكلة الرئيسية', label: 'تحديد المشكلة' },
  { phase: 'المكان', label: 'تحديد السن' },
  { phase: 'أسئلة متكيّفة', label: 'الأعراض' },
  { phase: 'السياق الصحي', label: 'المعلومات الصحية' },
  { phase: 'الصور والملفات', label: 'المرفقات' },
  { phase: 'المراجعة والموافقة', label: 'المراجعة النهائية' },
] as const;

export function getAssessmentStep(phase: string) {
  const index = steps.findIndex((step) => step.phase === phase || phase.startsWith(step.phase));
  if (index >= 0) return index + 1;
  return steps.length;
}

/** A single progress rail, with the actual step number rather than three separate bars. */
export function AssessmentJourneyProgress({ phase }: { phase: string }) {
  const number = getAssessmentStep(phase);
  const label = steps[number - 1]?.label ?? 'النتيجة';
  return (
    <View className="gap-2 pb-1 pt-1">
      <View className="flex-row-reverse items-center justify-between">
        <AppText variant="label" className="font-ui-semibold">
          {label}
        </AppText>
        <AppText direction="ltr" variant="label" className="font-ui-semibold text-content-link">
          {number}/{steps.length}
        </AppText>
      </View>
      <View
        accessibilityRole="progressbar"
        accessibilityValue={{ min: 0, max: steps.length, now: number }}
        className="w-full overflow-hidden rounded-full bg-border-subtle"
        style={{ height: 6, flexShrink: 0 }}
      >
        <View
          className="self-end rounded-full bg-action-primary"
          style={{ width: `${(number / steps.length) * 100}%`, height: 6 }}
        />
      </View>
    </View>
  );
}