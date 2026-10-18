import type { ReactNode } from 'react';
import { View } from 'react-native';

import { AppText } from '@/shared/components/ui/app-text';
import { EmptyState } from '@/shared/components/ui/empty-state';
import { StateView } from '@/shared/components/ui/state-view';
import { StatusIndicator } from '@/shared/components/ui/status-indicator';
import type { StructuralReadState } from '@/shared/types/structural-read-state';

interface ReadStateNoticeProps {
  state: StructuralReadState;
  staleAtLabel?: string;
}

export function ReadStateNotice({ state, staleAtLabel }: ReadStateNoticeProps) {
  if (state === 'loading-refresh') {
    return (
      <View accessibilityLiveRegion="polite" className="mb-4 gap-2">
        <StatusIndicator label="جاري تحديث البيانات" tone="info" />
        <AppText className="text-content-secondary" variant="caption">
          ستبقى البيانات الحالية ظاهرة لحد ما يكتمل التحديث.
        </AppText>
      </View>
    );
  }

  if (state === 'stale') {
    return (
      <View accessibilityLiveRegion="polite" className="mb-4 gap-2">
        <StatusIndicator label="بيانات محفوظة" tone="warning" />
        <AppText className="text-content-secondary" variant="caption">
          تعذر جلب نسخة أحدث. عم نعرض آخر بيانات آمنة
          {staleAtLabel ? ` · ${staleAtLabel}` : ''}.
        </AppText>
      </View>
    );
  }

  if (state === 'partial') {
    return (
      <View accessibilityLiveRegion="polite" className="mb-4 gap-2">
        <StatusIndicator label="بعض البيانات غير متاحة" tone="warning" />
        <AppText className="text-content-secondary" variant="caption">
          الجزء المتاح ظاهر بشكل طبيعي، وباقي البيانات رح ترجع عند نجاح التحديث.
        </AppText>
      </View>
    );
  }

  return null;
}

interface ReadStateBoundaryProps {
  state: StructuralReadState;
  children: ReactNode;
  emptyTitle: string;
  emptyDescription?: string;
  filteredEmptyTitle?: string;
  filteredEmptyDescription?: string;
  errorTitle?: string;
  errorDescription?: string;
  permissionTitle?: string;
  permissionDescription?: string;
  staleAtLabel?: string;
}

export function ReadStateBoundary({
  state,
  children,
  emptyTitle,
  emptyDescription,
  filteredEmptyTitle = 'ما في نتائج مطابقة',
  filteredEmptyDescription = 'جرّب تعديل البحث أو الفلاتر لعرض نتائج ثانية.',
  errorTitle = 'تعذر تحميل البيانات',
  errorDescription = 'صار في مشكلة أثناء جلب البيانات. جرّب مرة ثانية بعد شوي.',
  permissionTitle = 'المحتوى غير متاح بهالصلاحية',
  permissionDescription = 'صلاحيتك الحالية ما عاد تسمح بعرض هالمعلومات.',
  staleAtLabel,
}: ReadStateBoundaryProps) {
  if (state === 'loading-initial') {
    return <StateView loading title="جاري تحميل البيانات" />;
  }

  if (state === 'empty-no-data') {
    return <EmptyState description={emptyDescription} title={emptyTitle} />;
  }

  if (state === 'empty-filtered') {
    return <EmptyState description={filteredEmptyDescription} title={filteredEmptyTitle} />;
  }

  if (state === 'error-fetch') {
    return <StateView description={errorDescription} title={errorTitle} />;
  }

  if (state === 'error-permission') {
    return <StateView description={permissionDescription} title={permissionTitle} />;
  }

  return (
    <>
      <ReadStateNotice staleAtLabel={staleAtLabel} state={state} />
      {children}
    </>
  );
}
