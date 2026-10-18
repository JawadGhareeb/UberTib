import { Pressable, View } from 'react-native';

import { CareV5Badge, CareV5Card } from '@/features/my-care/components/care-v5-ui';
import { AppIcon, AppText } from '@/shared/components/ui';
import { cn } from '@/shared/utils/cn';

export interface BookingCaseCardData {
  id: string;
  bookingId: string;
  title: string;
  meta: string;
  status: string;
  tone: 'primary' | 'warning' | 'info';
  amount: string;
  note: string;
  completedSteps?: number;
}

export function BookingCaseCard({
  careCase,
  onPress,
}: {
  careCase: BookingCaseCardData;
  onPress: () => void;
}) {
  const iconTone = careCase.tone === 'warning' ? 'warning' : careCase.tone === 'info' ? 'info' : 'action';
  const badgeBackground = careCase.tone === 'warning' ? 'bg-tone-warning-fill' : careCase.tone === 'info' ? 'bg-tone-info-fill' : 'bg-action-subtle';
  const noteColor = careCase.tone === 'warning' ? 'text-tone-warning-text' : careCase.tone === 'info' ? 'text-tone-info-text' : 'text-content-link';

  return (
    <Pressable
      accessibilityLabel={`${careCase.title}، ${careCase.status}، عرض الحالة`}
      accessibilityRole="button"
      onPress={onPress}
    >
      <CareV5Card className="min-h-[116px] px-3 py-[10px]">
        <View className="flex-row items-center gap-2">
          <CareV5Badge label={careCase.status} tone={careCase.tone} />
          <AppText
            align="right"
            className="min-w-0 flex-1 font-ui-bold"
            numberOfLines={1}
            style={{ fontSize: 13, lineHeight: 20 }}
            variant="label"
          >
            {careCase.title}
          </AppText>
          <View className={cn('h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[10px]', badgeBackground)}>
            <AppIcon
              name={{ ios: 'cross.case', android: 'medical_services', web: 'medical_services' }}
              size={19}
              tone={iconTone}
            />
          </View>
        </View>

        <AppText
          align="right"
          className="mt-1 w-full text-content-secondary"
          numberOfLines={1}
          style={{ fontSize: 10, lineHeight: 17 }}
          variant="caption"
        >
          {careCase.meta}
        </AppText>

        <View className="mt-[7px] flex-row items-center justify-between gap-2">
          <AppText
            direction="ltr"
            className="shrink-0 font-ui-bold"
            numberOfLines={1}
            style={{ fontSize: 11, lineHeight: 17 }}
            variant="label"
          >
            {careCase.amount}
          </AppText>
          <AppText
            align="right"
            className={cn('min-w-0 flex-1 font-ui-medium', noteColor)}
            numberOfLines={1}
            style={{ fontSize: 10.5, lineHeight: 17 }}
            variant="caption"
          >
            {careCase.note}
          </AppText>
        </View>

        {typeof careCase.completedSteps === 'number' ? (
          <View
            accessibilityLabel={`تقدّم العلاج: ${careCase.completedSteps} من 4`}
            className="mt-[6px] flex-row gap-1"
          >
            {[0, 1, 2, 3].map((step) => (
              <View
                className={cn(
                  'h-[5px] flex-1 rounded-full',
                  step < (careCase.completedSteps ?? 0) ? 'bg-action-primary' : 'bg-border-subtle',
                )}
                key={step}
              />
            ))}
          </View>
        ) : null}
      </CareV5Card>
    </Pressable>
  );
}
