import type { DentitionMode } from '@/features/assessment/state/assessment-session-provider';
import { SectionTabs } from '@/shared/components/ui/section-tabs';
import { AppText } from '@/shared/components/ui';
import { View } from 'react-native';

const modes: { value: DentitionMode; label: string }[] = [
  { value: 'permanent', label: 'دائمة' },
  { value: 'primary', label: 'لبنية' },
  { value: 'mixed', label: 'مختلطة' },
  { value: 'uncertain', label: 'غير متأكد' },
];

export function DentitionModeControl({
  value,
  onChange,
}: {
  value: DentitionMode;
  onChange: (next: DentitionMode) => void;
}) {
  return (
    <View className="gap-2">
      <View className="flex-row-reverse items-center justify-between gap-2">
        <AppText variant="label" className="font-ui-semibold">
          نمط الأسنان
        </AppText>
        <AppText variant="caption" className="text-content-secondary">
          يمكنك تغييره
        </AppText>
      </View>
      <SectionTabs items={modes} value={value} onValueChange={onChange} />
    </View>
  );
}
