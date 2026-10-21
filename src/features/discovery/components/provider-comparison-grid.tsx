import { ScrollView, View, useWindowDimensions } from 'react-native';

import {
  ProviderComparisonDoctorHeader,
  ProviderComparisonDoctorRows,
} from '@/features/discovery/components/provider-comparison-column';
import {
  comparisonHeaderHeight,
  comparisonRowDefinitions,
  type ComparisonDoctor,
} from '@/features/discovery/model/provider-comparison';
import { AppIcon, AppText } from '@/shared/components/ui';

const columnGap = 8;
const maxScreenWidth = 430;

/** One horizontal owner for all doctor cards prevents competing scroll events and screen shaking. */
export function ProviderComparisonGrid({
  doctors,
  serviceCode,
  onRemove,
  onViewProfile,
  onChoose,
}: {
  doctors: readonly ComparisonDoctor[];
  serviceCode: string | null;
  onRemove: (providerId: string) => void;
  onViewProfile: (providerId: string) => void;
  onChoose: (providerId: string) => void;
}) {
  const { width: screenWidth } = useWindowDimensions();
  const labelWidth = screenWidth <= 340 ? 62 : 74;
  const contentWidth = Math.min(screenWidth, maxScreenWidth) - 32;
  const doctorViewport = Math.max(0, contentWidth - labelWidth - columnGap);
  const doctorWidth = Math.max(95, Math.floor((doctorViewport - columnGap) / 2));
  const requiresScroll =
    doctorWidth * doctors.length + columnGap * (doctors.length - 1) > doctorViewport;

  return (
    <ScrollView
      className="min-h-0 flex-1"
      nestedScrollEnabled
      directionalLockEnabled
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator
      accessibilityLabel="معايير مقارنة الأطباء"
    >
      <View className="flex-row-reverse items-start gap-2 pb-2">
        <View style={{ width: labelWidth }} className="shrink-0 gap-2">
          <View
            style={{ height: comparisonHeaderHeight }}
            className="items-center justify-center gap-2 rounded-[13px] bg-action-subtle px-1"
          >
            <AppIcon
              name={{ ios: 'person.2', android: 'group', web: 'group' }}
              size={22}
              tone="action"
            />
            <AppText align="center" variant="caption" className="font-ui-bold">
              الأطباء
            </AppText>
            {requiresScroll ? (
              <AppText align="center" variant="caption" className="text-content-secondary">
                اسحب أفقياً
              </AppText>
            ) : null}
          </View>
          {comparisonRowDefinitions.map((row) => (
            <View
              key={row.key}
              style={{ height: row.height }}
              className="items-center justify-center gap-1 rounded-[11px] bg-action-subtle px-1"
            >
              <AppIcon name={row.icon} size={18} tone="action" />
              <AppText
                align="center"
                variant="caption"
                className="font-ui-semibold"
                numberOfLines={3}
              >
                {row.label}
              </AppText>
            </View>
          ))}
        </View>
        <ScrollView
          horizontal
          nestedScrollEnabled
          directionalLockEnabled
          scrollEnabled={requiresScroll}
          bounces={false}
          overScrollMode="never"
          showsHorizontalScrollIndicator={requiresScroll}
          style={{ width: doctorViewport, flexGrow: 0, flexShrink: 0 }}
          accessibilityLabel="اسحب أفقياً لمشاهدة بقية الأطباء"
        >
          <View className="flex-row-reverse items-start gap-2">
            {doctors.map((doctor) => (
              <View key={doctor.id} style={{ width: doctorWidth }} className="gap-2">
                <ProviderComparisonDoctorHeader
                  doctor={doctor}
                  width={doctorWidth}
                  onRemove={() => onRemove(doctor.id)}
                  onViewProfile={() => onViewProfile(doctor.id)}
                  onChoose={() => onChoose(doctor.id)}
                />
                <ProviderComparisonDoctorRows
                  doctor={doctor}
                  serviceCode={serviceCode}
                  width={doctorWidth}
                />
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </ScrollView>
  );
}
