import { View } from 'react-native';

import { AppIcon, AppText, Button } from '@/shared/components/ui';

export function ProviderResultsEmptyState({
  hasServiceDoctors,
  hasFilters,
  onClearFilters,
  onExploreCheckup,
  onExploreServices,
  isCheckup,
}: {
  hasServiceDoctors: boolean;
  hasFilters: boolean;
  onClearFilters: () => void;
  onExploreCheckup: () => void;
  onExploreServices: () => void;
  isCheckup: boolean;
}) {
  const title = !hasServiceDoctors
    ? 'ما في أطباء مسجلين لهالخدمة حالياً'
    : hasFilters
      ? 'ما لقينا أطباء حسب الفلاتر المختارة'
      : 'ما في أطباء لعرضهم حالياً';
  const description = !hasServiceDoctors
    ? 'ما لقينا أطباء للخدمة المختارة حالياً. جرّب خدمة أخرى أو غيّر التصفية.'
    : hasFilters
      ? 'جرّب تخفف الشروط أو تمسح الفلاتر لتشوف جميع أطباء الخدمة.'
      : 'جرّب خدمة ثانية أو ارجع لاكتشاف الخدمات.';

  return (
    <View className="items-center gap-3 rounded-[16px] border border-border-subtle bg-surface-default px-5 py-8">
      <View className="h-[60px] w-[60px] items-center justify-center rounded-[18px] bg-action-subtle">
        <AppIcon
          name={{
            ios: 'person.crop.circle.badge.questionmark',
            android: 'person_search',
            web: 'person_search',
          }}
          size={32}
          tone="action"
        />
      </View>
      <AppText variant="heading-4" align="center" className="font-ui-bold">
        {title}
      </AppText>
      <AppText variant="label" align="center" className="text-content-secondary">
        {description}
      </AppText>
      <Button
        className="mt-2 w-full"
        label={
          hasServiceDoctors && hasFilters
            ? 'مسح الفلاتر وعرض الأطباء'
            : isCheckup
              ? 'استكشف الخدمات'
              : 'عرض أطباء الفحص العام'
        }
        variant="outline"
        onPress={
          hasServiceDoctors && hasFilters
            ? onClearFilters
            : isCheckup
              ? onExploreServices
              : onExploreCheckup
        }
      />
    </View>
  );
}
