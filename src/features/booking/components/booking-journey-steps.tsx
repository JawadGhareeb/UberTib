import { View } from 'react-native';

import { AppIcon, AppText } from '@/shared/components/ui';
import { cn } from '@/shared/utils/cn';

export type BookingJourneyStep = 'slots' | 'patient' | 'summary';

const steps: { key: BookingJourneyStep; title: string }[] = [
  { key: 'slots', title: 'اختيار الموعد' },
  { key: 'patient', title: 'تحديد المريض' },
  { key: 'summary', title: 'ملخص الحالة والمرفقات' },
];

/**
 * Patient booking has three ordered steps, then a final booking confirmation.
 * This is an informational journey indicator, not a shortcut that can bypass
 * selecting a slot or checking delegation permission.
 */
export function BookingJourneySteps({ current }: { current: BookingJourneyStep }) {
  const currentIndex = steps.findIndex((item) => item.key === current);

  return (
    <View className="gap-[5px]" accessibilityLabel="مسار الرحلة">
      <AppText align="right" className="font-ui-bold text-content-primary" variant="label">
        مسار الرحلة
      </AppText>
      {steps.map((step, index) => (
        <View
          accessibilityLabel={`${step.title}، ${index + 1} من 3${index === currentIndex ? '، الخطوة الحالية' : ''}`}
          className={cn(
            'min-h-[34px] flex-row-reverse items-center gap-2 rounded-[10px] px-3 py-[6px]',
            index === currentIndex ? 'bg-action-subtle' : 'bg-surface-subtle',
          )}
          key={step.key}
        >
          <AppIcon
            name={{ ios: 'arrow.left', android: 'arrow_back', web: 'arrow_back' }}
            size={14}
            tone="action"
          />
          <AppText
            align="right"
            className={cn('min-w-0 flex-1', index === currentIndex ? 'font-ui-bold text-content-link' : 'font-ui-semibold text-content-primary')}
            style={{ fontSize: 11.5, lineHeight: 18 }}
            variant="label"
          >
            {step.title}
          </AppText>
        </View>
      ))}
    </View>
  );
}
