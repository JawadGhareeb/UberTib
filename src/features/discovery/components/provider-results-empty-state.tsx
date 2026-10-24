import { EmptyState } from '@/shared/components/ui';

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
    <EmptyState
      title={title}
      description={description}
      icon={{ ios: 'magnifyingglass', android: 'search', web: 'search' }}
      actionLabel={
        hasServiceDoctors && hasFilters
          ? 'مسح الفلاتر وعرض الأطباء'
          : isCheckup
            ? 'استكشف الخدمات'
            : 'عرض أطباء الفحص العام'
      }
      onAction={
        hasServiceDoctors && hasFilters
          ? onClearFilters
          : isCheckup
            ? onExploreServices
            : onExploreCheckup
      }
    />
  );
}
