import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, View } from 'react-native';

import { AssessmentScaffold } from '@/features/assessment/components/assessment-scaffold';
import { DentalArchSelector } from '@/features/assessment/components/dental-arch-selector';
import { DentitionModeControl } from '@/features/assessment/components/dentition-mode-control';
import { useAssessmentSession } from '@/features/assessment/state/assessment-session-provider';
import { useAppDirection } from '@/providers/app-direction-provider';
import { AppIcon, AppText } from '@/shared/components/ui';
import { useAppTheme } from '@/shared/theme/theme-provider';
import { cn } from '@/shared/utils/cn';

const regions = ['يمين علوي', 'يسار علوي', 'يمين سفلي', 'يسار سفلي'] as const;

export function AssessmentLocationScreen() {
  const router = useRouter();
  const { returnTo } = useLocalSearchParams<{ returnTo?: string }>();
  const { rowClassName } = useAppDirection();
  const { colors } = useAppTheme();
  const {
    location,
    patient,
    dentitionMode,
    selectedTeeth,
    setDentitionMode,
    setLocation,
    setRegionLocation,
    toggleTooth,
    clearDentalSelection,
  } = useAssessmentSession();
  const [showRegions, setShowRegions] = useState(false);
  const patientLabel =
    patient === 'adam' ? 'آدم الخطيب' : patient === 'nour' ? 'نور الخطيب' : 'ريم الخطيب';

  const suggestion =
    dentitionMode === 'primary'
      ? 'اقتراح بداية من ملف الطفل فقط — لا نؤكد حالة بزوغ الأسنان.'
      : dentitionMode === 'mixed'
        ? 'اقتراح بداية حسب العمر فقط — تحقّق بصرياً أو اختر «غير متأكد».'
        : dentitionMode === 'uncertain'
          ? 'إذا لم تكن متأكداً من نمط الأسنان، اختر المكان فقط وسيتحقق الطبيب لاحقاً.'
          : 'اضغط على السن أو المنطقة الأقرب. يمكنك تحديد أكثر من سن متجاور.';

  return (
    <AssessmentScaffold
      onPrimary={() => {
        if (returnTo === 'review') {
          if (router.canGoBack()) router.back();
          else router.replace('/assessment/review');
        } else {
          router.push('/assessment/questions');
        }
      }}
      primaryDisabled={!location}
      primaryLabel="متابعة"
      phase={
        dentitionMode === 'primary'
          ? 'المكان • لبنية'
          : dentitionMode === 'mixed'
            ? 'المكان • مختلطة'
            : 'المكان'
      }
      title="أين تشعر بالمشكلة؟"
      topContent={
        <View className="gap-2 pt-1">
          <View className="self-end rounded-full bg-surface-subtle px-3 py-1.5">
            <AppText className="text-type-label text-content-secondary" variant="caption">
              {patientLabel}
            </AppText>
          </View>
          <AppText className="text-content-secondary" variant="body">
            {suggestion}
          </AppText>
        </View>
      }
    >
      <DentitionModeControl value={dentitionMode} onChange={setDentitionMode} />

      <View className="mt-3 rounded-[14px] bg-action-primary px-4 py-4">
        <View className={cn('items-center gap-2', rowClassName)}>
          <View className="h-10 w-10 items-center justify-center rounded-full bg-surface-default/15">
            <AppIcon
              name={{ ios: 'lightbulb.fill', android: 'lightbulb', web: 'lightbulb' }}
              size={16}
              tone="onAction"
            />
          </View>
          <View className="min-w-0 flex-1 items-end">
            <AppText
              className="font-ui-bold"
              style={{ color: colors.text.onAction }}
              variant="label"
            >
              اختيار المكان
            </AppText>
            <AppText className="mt-1" style={{ color: colors.text.onAction }} variant="caption">
              اضغط على السن أو المنطقة الأقرب. يمكنك تغيير الاختيار قبل المتابعة.
            </AppText>
          </View>
        </View>
      </View>

      <View className="mt-2">
        <DentalArchSelector
          location={location}
          mode={dentitionMode}
          onClear={() => {
            clearDentalSelection();
            setShowRegions(false);
          }}
          onSelectGum={() => {
            setShowRegions(false);
            setRegionLocation('منطقة اللثة');
          }}
          onSelectRegion={() => setShowRegions((current) => !current)}
          onToggleTooth={(tooth) => {
            setShowRegions(false);
            toggleTooth(tooth);
          }}
          selectedTeeth={selectedTeeth}
        />
      </View>

      {showRegions ? (
        <View className="mt-2 rounded-[14px] border border-border-default bg-surface-default p-3">
          <AppText className="font-ui-bold text-type-label">اختر المنطقة الأقرب</AppText>
          <View className={cn('mt-2 flex-wrap gap-2', rowClassName)}>
            {regions.map((region) => (
              <Pressable
                accessibilityRole="button"
                className="min-h-11 w-[48%] items-center justify-center rounded-[10px] border border-action-secondary-border bg-surface-subtle px-2"
                key={region}
                onPress={() => {
                  setRegionLocation(region);
                  setShowRegions(false);
                }}
              >
                <AppText className="text-type-label" variant="label">
                  {region}
                </AppText>
              </Pressable>
            ))}
          </View>
        </View>
      ) : null}

      <Pressable
        accessibilityRole="button"
        accessibilityState={{ selected: location === 'لا أعرف السن بدقة' }}
        className={cn(
          'mt-3 h-12 items-center justify-center gap-2 rounded-[12px] border',
          rowClassName,
          location === 'لا أعرف السن بدقة'
            ? 'border-action-primary bg-action-subtle'
            : 'border-border-default bg-surface-default',
        )}
        onPress={() => {
          setShowRegions(false);
          setLocation('لا أعرف السن بدقة');
        }}
      >
        <AppText
          className={cn(
            'font-ui-semibold text-type-label',
            location === 'لا أعرف السن بدقة' && 'text-content-link',
          )}
          variant="label"
        >
          لا أعرف السن بدقة
        </AppText>
        <AppIcon
          name={{ ios: 'questionmark.circle', android: 'help_outline', web: 'help_outline' }}
          size={19}
          tone="action"
        />
      </Pressable>
    </AssessmentScaffold>
  );
}
