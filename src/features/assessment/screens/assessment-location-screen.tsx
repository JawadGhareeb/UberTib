import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { SectionTabs } from '@/shared/components/ui/section-tabs';
import { Radio } from 'heroui-native';

import { AssessmentScaffold } from '@/features/assessment/components/assessment-scaffold';
import { DentalArchSelector } from '@/features/assessment/components/dental-arch-selector';
import { DentitionModeControl } from '@/features/assessment/components/dentition-mode-control';
import { ASSESSMENT_PATIENT_FIXTURES } from '@/features/assessment/presentation/assessment-patient-copy';
import { useAssessmentSession } from '@/features/assessment/state/assessment-session-provider';
import { AppIcon, AppText } from '@/shared/components/ui';
import { cn } from '@/shared/utils/cn';

const regions = ['يمين علوي', 'يسار علوي', 'يمين سفلي', 'يسار سفلي'] as const;

export function AssessmentLocationScreen() {
  const router = useRouter();
  const { returnTo } = useLocalSearchParams<{ returnTo?: string }>();
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
  const patientName = ASSESSMENT_PATIENT_FIXTURES[patient].name;

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
      phase="المكان"
      title="حدد مكان المشكلة"
      topContent={
        <View className="flex-row-reverse items-center justify-between">
          <AppText variant="label" className="text-content-secondary">
            حدد السن أو المنطقة اللي بتوجعك.
          </AppText>
          <AppText variant="caption" className="text-content-link">
            {patientName}
          </AppText>
        </View>
      }
    >
      <DentitionModeControl value={dentitionMode} onChange={setDentitionMode} />
      <SectionTabs
        items={[
          { value: 'chart', label: 'تحديد من الرسم' },
          { value: 'region', label: 'اختيار المنطقة' },
        ]}
        value={showRegions ? 'region' : 'chart'}
        onValueChange={(next) => setShowRegions(next === 'region')}
        solidActive
      />
      {showRegions ? (
        <View className="gap-3 rounded-[17px] border border-border-subtle bg-surface-default p-3">
          <AppText align="right" variant="heading-4" className="font-ui-bold">
            أي جهة هي الأقرب للمشكلة؟
          </AppText>
          <AppText align="right" variant="caption" className="text-content-secondary">
            ما في داعي تعرف رقم السن. اختر المنطقة الأقرب.
          </AppText>
          <View className="flex-row-reverse flex-wrap justify-between gap-y-2">
            {regions.map((region) => (
              <Radio
                key={region}
                isSelected={location === region}
                onSelectedChange={() => setRegionLocation(region)}
                className={cn(
                  'min-h-[65px] w-[48.5%] flex-row-reverse items-center justify-center gap-2 rounded-[12px] border px-2',
                  location === region
                    ? 'border-action-primary bg-action-subtle'
                    : 'border-border-subtle bg-surface-subtle',
                )}
              >
                <Radio.Indicator />
                <AppText
                  variant="label"
                  className={
                    location === region ? 'font-ui-bold text-content-link' : 'text-content-primary'
                  }
                >
                  {region}
                </AppText>
              </Radio>
            ))}
          </View>
        </View>
      ) : (
        <DentalArchSelector
          location={location}
          mode={dentitionMode}
          selectedTeeth={selectedTeeth}
          onClear={clearDentalSelection}
          onToggleTooth={toggleTooth}
        />
      )}

      <Pressable
        accessibilityRole="button"
        accessibilityState={{ selected: location === 'لا أعرف السن بدقة' }}
        className={cn(
          'min-h-[47px] flex-row-reverse items-center justify-center gap-2 rounded-[12px] border',
          location === 'لا أعرف السن بدقة'
            ? 'border-action-primary bg-action-subtle'
            : 'border-border-subtle bg-surface-default',
        )}
        onPress={() => setLocation('لا أعرف السن بدقة')}
      >
        <AppIcon
          name={{ ios: 'questionmark.circle', android: 'help_outline', web: 'help_outline' }}
          size={18}
          tone="action"
        />
        <AppText variant="label" className="font-ui-semibold">
          لا أعرف السن بالتحديد
        </AppText>
      </Pressable>
    </AssessmentScaffold>
  );
}
