import { Switch, View } from 'react-native';

import { AppIcon, AppText, type AppIconName } from '@/shared/components/ui';
import { useAppTheme } from '@/shared/theme/use-app-theme';
import type { ProviderFilterFlags, ProviderFilterKey } from '../utils/provider-filters';

type AdvancedKey = Exclude<ProviderFilterKey, 'area'>;

export const providerAdvancedOptions: readonly {
  key: AdvancedKey;
  label: string;
  detail: string;
  icon: AppIconName;
}[] = [
  {
    key: 'price',
    label: 'سعر معلن قبل الحجز',
    detail: 'إخفاء الخدمات التي يتحدد سعرها بعد الفحص',
    icon: { ios: 'creditcard', android: 'payments', web: 'payments' },
  },
  {
    key: 'rating',
    label: 'التقييم 4.5 فأعلى',
    detail: 'فقط الأطباء الذين لديهم تقييمات',
    icon: { ios: 'star', android: 'star', web: 'star' },
  },
  {
    key: 'soonest',
    label: 'موعد خلال 7 أيام',
    detail: 'حسب مواعيد البيانات التجريبية، وليست حجوزات مؤكدة',
    icon: { ios: 'calendar', android: 'event_available', web: 'event_available' },
  },
  {
    key: 'branch',
    label: 'جاهزية الفرع للخدمة',
    detail: 'حسب معلومات الفروع التجريبية',
    icon: { ios: 'building.2', android: 'business', web: 'business' },
  },
  {
    key: 'payment',
    label: 'الدفع عبر Sham Cash',
    detail: 'حسب طرق الدفع التجريبية المسجّلة',
    icon: { ios: 'receipt', android: 'receipt_long', web: 'receipt_long' },
  },
];

export function ProviderAdvancedFilterOptions({
  value,
  onChange,
}: {
  value: ProviderFilterFlags;
  onChange: (next: ProviderFilterFlags) => void;
}) {
  const { colors } = useAppTheme();

  return (
    <View className="gap-2">
      <AppText align="right" variant="heading-4" className="font-ui-semibold">
        فلاتر إضافية
      </AppText>
      <View className="overflow-hidden rounded-[14px] border border-border-subtle bg-surface-default px-3">
        {providerAdvancedOptions.map((option, index) => (
          <View key={option.key}>
            {index ? <View className="h-px bg-border-subtle" /> : null}
            <View className="min-h-[64px] flex-row-reverse items-center gap-3 py-2.5">
              <View className="h-9 w-9 items-center justify-center rounded-[11px] bg-action-subtle">
                <AppIcon name={option.icon} size={19} tone="action" />
              </View>
              <View className="min-w-0 flex-1 items-end gap-0.5">
                <AppText align="right" variant="label" className="w-full font-ui-semibold">
                  {option.label}
                </AppText>
                <AppText align="right" variant="caption" className="w-full text-content-secondary">
                  {option.detail}
                </AppText>
              </View>
              <Switch
                accessibilityLabel={option.label}
                accessibilityRole="switch"
                value={value[option.key]}
                onValueChange={(enabled) => onChange({ ...value, [option.key]: enabled })}
                thumbColor={colors.surface.default}
                trackColor={{ false: colors.border.strong, true: colors.action.primary }}
              />
            </View>
          </View>
        ))}
      </View>
      <AppText align="right" variant="caption" className="text-content-secondary">
        معلومات المواعيد وجاهزية الفرع وطرق الدفع تجريبية، وتحتاج تأكيداً قبل الحجز.
      </AppText>
    </View>
  );
}
