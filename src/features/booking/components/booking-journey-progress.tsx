import { View } from 'react-native';

import { AppText } from '@/shared/components/ui';

/** Direct booking only: date/slot, booking subject, then optional details + review. */
const steps = ['اختيار الموعد', 'تحديد المريض', 'مراجعة الحجز'] as const;

export function BookingJourneyProgress({ step }: { step: 1 | 2 | 3 }) {
  return (
    <View className="gap-2 pb-1">
      <View className="flex-row-reverse items-center justify-between">
        <AppText align="right" variant="label" className="font-ui-semibold">
          {steps[step - 1]}
        </AppText>
        <AppText direction="ltr" variant="label" className="font-ui-semibold text-content-link">
          {step}/{steps.length}
        </AppText>
      </View>
      <View
        accessibilityRole="progressbar"
        accessibilityValue={{ min: 0, max: steps.length, now: step }}
        className="w-full overflow-hidden rounded-full bg-border-subtle"
        style={{ height: 6 }}
      >
        <View
          className="h-full rounded-full bg-action-primary"
          style={{ width: `${(step / steps.length) * 100}%` }}
        />
      </View>
    </View>
  );
}
