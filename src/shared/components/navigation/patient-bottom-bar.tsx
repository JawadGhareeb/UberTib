import { useRouter } from 'expo-router';
import { View, useWindowDimensions } from 'react-native';

import {
  PATIENT_TAB_BAR_HEIGHT,
  PATIENT_TAB_HEIGHT,
} from '@/shared/components/navigation/patient-tab-metrics';
import { useAppTheme } from '@/shared/theme/use-app-theme';
import { patientTabDestinations, type PatientTabName } from './patient-tab-configuration';
import { PatientTabItem } from './patient-tab-item';

export type { PatientTabName } from './patient-tab-configuration';

export function PatientBottomBar({
  active,
  onSelect,
  onLongPress,
  bottomInset = 8,
}: {
  active: PatientTabName;
  onSelect?: (name: PatientTabName) => void;
  onLongPress?: (name: PatientTabName) => void;
  bottomInset?: number;
}) {
  const router = useRouter();
  const { colors } = useAppTheme();
  const { width: windowWidth } = useWindowDimensions();

  return (
    <View
      pointerEvents="box-none"
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: Math.max(bottomInset, 14),
        alignItems: 'center',
      }}
    >
      <View
        className="rounded-full border border-border-subtle bg-surface-default px-1.5 py-1"
        style={{
          width: Math.max(0, Math.min(windowWidth - 40, 420)),
          height: PATIENT_TAB_BAR_HEIGHT,
          borderRadius: 36,
          backgroundColor: colors.surface.default,
          shadowColor: colors.surface.scrim,
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 0.14,
          shadowRadius: 14,
          elevation: 9,
        }}
      >
        <View
          className="w-full flex-row items-center justify-between gap-1"
          style={{ height: PATIENT_TAB_HEIGHT, direction: 'ltr' }}
        >
          {patientTabDestinations.map(({ name, label }) => (
            <PatientTabItem
              key={name}
              name={name}
              label={label}
              focused={name === active}
              onLongPress={() => onLongPress?.(name)}
              onPress={() => (onSelect ? onSelect(name) : router.replace(`/(tabs)/${name}`))}
            />
          ))}
        </View>
      </View>
    </View>
  );
}
