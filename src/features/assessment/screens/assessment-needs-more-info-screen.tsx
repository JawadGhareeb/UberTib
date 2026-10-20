import { useRouter } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';
import { Radio } from 'heroui-native';

import { AssessmentScaffold } from '@/features/assessment/components/assessment-scaffold';
import { useAssessmentSession } from '@/features/assessment/state/assessment-session-provider';
import { useAppDirection } from '@/providers/app-direction-provider';
import { AppIcon, AppText, Button } from '@/shared/components/ui';
import { cn } from '@/shared/utils/cn';

const locations = ['يسار علوي', 'يمين علوي', 'يسار سفلي', 'يمين سفلي'] as const;
const unsureOption = 'ما زلت غير متأكد';
type LocationChoice = (typeof locations)[number] | typeof unsureOption;

function isLocationChoice(value: string): value is (typeof locations)[number] {
  return locations.some((option) => option === value);
}

export function AssessmentNeedsMoreInfoScreen() {
  const router = useRouter();
  const { rowClassName } = useAppDirection();
  const { location, setRegionLocation, setLocation } = useAssessmentSession();
  const [selected, setSelected] = useState<LocationChoice | undefined>(
    isLocationChoice(location) ? location : undefined,
  );

  const continueAssessment = () => {
    if (!selected) return;
    if (selected === unsureOption) {
      setLocation('لا أعرف السن بدقة');
      router.replace({ pathname: '/assessment/processing', params: { outcome: 'manual-review' } });
      return;
    }
    // Keep the answer within the existing assessment; a new clinical result is not assumed.
    setRegionLocation(selected);
    router.replace('/assessment/processing');
  };

  const bookDentalCheckup = () =>
    router.push({
      pathname: '/discover/providers/results',
      params: { serviceCode: 'dental-checkup' },
    });

  return (
    <AssessmentScaffold
      backIcon={{ ios: 'arrow.right', android: 'arrow_forward', web: 'arrow_forward' }}
      phase="معلومات غير كافية"
      title="نحتاج معلومة إضافية"
    >
      <View className="mt-1 min-h-[196px] items-center justify-center rounded-[21px] bg-tone-info-fill px-3 pb-4 pt-2">
        <View
          className={cn(
            'h-[113px] w-[160px] items-center justify-center gap-3 rounded-[30px] bg-surface-default',
            rowClassName,
          )}
        >
          <View className="h-[53px] w-[53px] items-center justify-center rounded-[15px]">
            <AppIcon
              name={{ ios: 'eye.slash.fill', android: 'visibility_off', web: 'visibility_off' }}
              size={42}
              tone="info"
            />
          </View>
          <View className="h-[52px] w-[52px] items-center justify-center rounded-[17px] bg-tone-warning-fill">
            <AppIcon
              name={{ ios: 'questionmark.circle', android: 'help_outline', web: 'help_outline' }}
              size={29}
              tone="warning"
            />
          </View>
        </View>
        <AppText
          align="center"
          className="mt-3 font-ui-bold text-content-primary"
          variant="heading-4"
        >
          معلومة صغيرة تساعدنا نكمل
        </AppText>
        <AppText align="center" className="mt-1 text-content-secondary" variant="caption">
          لن نخمن مكان المشكلة أو الخدمة
        </AppText>
      </View>

      <View className="mt-2 rounded-[16px] border border-border-subtle bg-surface-default px-3 pb-3 pt-2.5">
        <AppText align="right" className="font-ui-semibold text-content-link" variant="caption">
          خطوة واحدة لنكمل
        </AppText>
        <AppText
          align="right"
          className="mt-1 font-ui-bold text-content-primary"
          variant="heading-4"
        >
          أي جهة هي الأقرب للألم؟
        </AppText>
        <View className={cn('mt-3 flex-wrap justify-between gap-y-2', rowClassName)}>
          {locations.map((option) => (
            <Radio
              isSelected={selected === option}
              onSelectedChange={() => setSelected(option)}
              className={cn(
                'min-h-[46px] w-[48.5%] flex-row-reverse items-center justify-center gap-1 rounded-[11px] border px-2',
                selected === option
                  ? 'border-2 border-action-primary bg-action-subtle'
                  : 'border-border-subtle bg-surface-subtle',
              )}
              key={option}
            >
              <Radio.Indicator />
              <AppText
                align="center"
                className={
                  selected === option ? 'font-ui-bold text-content-link' : 'text-content-secondary'
                }
                variant="label"
              >
                {option}
              </AppText>
            </Radio>
          ))}
        </View>
        <Radio
          isSelected={selected === unsureOption}
          onSelectedChange={() => setSelected(unsureOption)}
          className={cn(
            'mt-2 min-h-[42px] flex-row-reverse items-center justify-center gap-2 rounded-[10px] border',
            selected === unsureOption
              ? 'border-action-primary bg-action-subtle'
              : 'border-transparent bg-action-subtle',
          )}
        >
          <Radio.Indicator />
          <AppText align="center" className="font-ui-semibold text-content-link" variant="label">
            {unsureOption}
          </AppText>
        </Radio>
      </View>

      <Button
        className="mt-2 h-[50px] rounded-[12px]"
        disabled={!selected}
        endIcon={{ ios: 'arrow.left', android: 'arrow_back', web: 'arrow_back' }}
        label="إرسال وإعادة التقييم"
        onPress={continueAssessment}
      />

      <View
        className={cn(
          'mt-2 min-h-[52px] items-center gap-2 rounded-[11px] bg-surface-subtle px-3 py-2',
          rowClassName,
        )}
      >
        <AppIcon
          name={{ ios: 'calendar.badge.plus', android: 'event_available', web: 'event_available' }}
          size={18}
          tone="action"
        />
        <View className="min-w-0 flex-1 items-end">
          <AppText
            align="right"
            className="font-ui-semibold text-content-primary"
            variant="caption"
          >
            إذا بقي المكان غير واضح
          </AppText>
          <AppText align="right" className="text-content-secondary" variant="caption">
            يمكنك حجز فحص أسنان عام كبديل آمن
          </AppText>
        </View>
      </View>

      <Button
        className="mt-2 h-[46px] rounded-[11px]"
        endIcon={{ ios: 'calendar.badge.plus', android: 'event_available', web: 'event_available' }}
        label="حجز فحص أسنان عام"
        onPress={bookDentalCheckup}
        size="sm"
        variant="outline"
      />
    </AssessmentScaffold>
  );
}
