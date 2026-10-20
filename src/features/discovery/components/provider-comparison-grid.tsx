import { useCallback, useRef } from 'react';
import {
  ScrollView,
  View,
  useWindowDimensions,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';

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

/** Vertically scrolling criteria, fixed doctor header and synchronized horizontal doctor columns. */
export function ProviderComparisonGrid({
  doctors,
  serviceCode,
  onRemove,
  onViewProfile,
  onChoose,
}: {
  doctors: readonly ComparisonDoctor[];
  serviceCode: string;
  onRemove: (providerId: string) => void;
  onViewProfile: (providerId: string) => void;
  onChoose: (providerId: string) => void;
}) {
  const { width: screenWidth } = useWindowDimensions();
  const headerScrollRef = useRef<ScrollView>(null);
  const rowsScrollRef = useRef<ScrollView>(null);
  const lastHorizontalX = useRef(0);

  const labelWidth = screenWidth <= 340 ? 62 : 74;
  const contentWidth = Math.min(screenWidth, maxScreenWidth) - 32;
  const doctorViewport = Math.max(0, contentWidth - labelWidth - columnGap);
  const doctorWidth = Math.max(95, Math.floor((doctorViewport - columnGap) / 2));
  const requiresScroll =
    doctorWidth * doctors.length + columnGap * (doctors.length - 1) > doctorViewport;

  // A single remembered offset prevents two programmatic scroll events from chasing each other.
  const synchronizeHorizontal = useCallback(
    (source: 'header' | 'rows', event: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (!requiresScroll) return;
      const offset = Math.max(0, event.nativeEvent.contentOffset.x);
      if (Math.abs(offset - lastHorizontalX.current) < 1) return;
      lastHorizontalX.current = offset;
      const target = source === 'header' ? rowsScrollRef : headerScrollRef;
      target.current?.scrollTo({ x: offset, animated: false });
    },
    [requiresScroll],
  );

  const doctorColumns = (mode: 'header' | 'rows') => (
    <View className="flex-row-reverse items-start gap-2">
      {doctors.map((doctor) =>
        mode === 'header' ? (
          <ProviderComparisonDoctorHeader
            key={doctor.id}
            doctor={doctor}
            width={doctorWidth}
            onRemove={() => onRemove(doctor.id)}
            onViewProfile={() => onViewProfile(doctor.id)}
            onChoose={() => onChoose(doctor.id)}
          />
        ) : (
          <ProviderComparisonDoctorRows
            key={doctor.id}
            doctor={doctor}
            serviceCode={serviceCode}
            width={doctorWidth}
          />
        ),
      )}
    </View>
  );

  return (
    <View className="min-h-0 flex-1 gap-2">
      <View className="flex-row-reverse items-start gap-2">
        <View
          style={{ width: labelWidth, height: comparisonHeaderHeight }}
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

        <ScrollView
          ref={headerScrollRef}
          horizontal
          nestedScrollEnabled
          scrollEnabled={requiresScroll}
          showsHorizontalScrollIndicator={false}
          style={{ width: doctorViewport }}
          scrollEventThrottle={16}
          onScroll={(event) => synchronizeHorizontal('header', event)}
          accessibilityLabel="بروفايلات الأطباء، اسحب أفقياً لعرض طبيب آخر"
        >
          {doctorColumns('header')}
        </ScrollView>
      </View>

      <ScrollView
        className="min-h-0 flex-1"
        nestedScrollEnabled
        showsVerticalScrollIndicator
        accessibilityLabel="معايير المقارنة"
      >
        <View className="flex-row-reverse items-start gap-2">
          <View style={{ width: labelWidth }} className="gap-2">
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
            ref={rowsScrollRef}
            horizontal
            nestedScrollEnabled
            scrollEnabled={requiresScroll}
            showsHorizontalScrollIndicator={requiresScroll}
            style={{ width: doctorViewport }}
            scrollEventThrottle={16}
            onScroll={(event) => synchronizeHorizontal('rows', event)}
            accessibilityLabel="قيم مقارنة الأطباء، اسحب أفقياً لعرض بقية الأطباء"
          >
            {doctorColumns('rows')}
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
}
