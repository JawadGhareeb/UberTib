import { View } from 'react-native';

import {
  AppliedFilterChips,
  type AppliedFilterItem,
} from '@/shared/components/filters/applied-filter-chips';
import {
  type BookingAdvancedFilters,
  type CaseAdvancedFilters,
  type CareBookingQuickFilter,
  type CareCaseQuickFilter,
  type CareMainTab,
} from '../model/care-tab-filters';

const bookingStatusLabels: Record<BookingAdvancedFilters['status'], string> = {
  all: '',
  confirmed: 'مؤكد',
  pending: 'بانتظار التأكيد',
  completed: 'مكتمل',
  cancelled: 'ملغى',
};
const bookingPeriodLabels: Record<BookingAdvancedFilters['period'], string> = {
  all: '',
  future: 'القادمة',
  past: 'السابقة',
};

/** All dismiss actions update only their own tab and their own filter field. */
export function CareAppliedFilterChips({
  tab,
  caseQuick,
  bookingQuick,
  caseFilters,
  bookingFilters,
  onCaseQuickChange,
  onBookingQuickChange,
  onCaseChange,
  onBookingChange,
  onClearAll,
  inset = false,
}: {
  tab: CareMainTab;
  caseQuick: CareCaseQuickFilter;
  bookingQuick: CareBookingQuickFilter;
  caseFilters: CaseAdvancedFilters;
  bookingFilters: BookingAdvancedFilters;
  onCaseQuickChange: (value: CareCaseQuickFilter) => void;
  onBookingQuickChange: (value: CareBookingQuickFilter) => void;
  onCaseChange: (value: CaseAdvancedFilters) => void;
  onBookingChange: (value: BookingAdvancedFilters) => void;
  onClearAll?: () => void;
  inset?: boolean;
}) {
  const items: AppliedFilterItem[] = [];

  if (tab === 'cases') {
    if (caseQuick !== 'الكل') {
      items.push({
        key: 'case-status',
        label: caseQuick,
        onRemove: () => onCaseQuickChange('الكل'),
      });
    }
    if (caseFilters.actionRequired) {
      items.push({
        key: 'case-action',
        label: 'مطلوب مني إجراء',
        onRemove: () => onCaseChange({ ...caseFilters, actionRequired: false }),
      });
    }
    if (caseFilters.provider) {
      items.push({
        key: 'case-provider',
        label: caseFilters.provider,
        onRemove: () => onCaseChange({ ...caseFilters, provider: '' }),
      });
    }
    if (caseFilters.clinic) {
      items.push({
        key: 'case-clinic',
        label: caseFilters.clinic,
        onRemove: () => onCaseChange({ ...caseFilters, clinic: '' }),
      });
    }
  } else {
    if (bookingQuick !== 'الكل') {
      items.push({
        key: 'booking-quick',
        label: bookingQuick,
        onRemove: () => onBookingQuickChange('الكل'),
      });
    }
    if (bookingFilters.status !== 'all') {
      items.push({
        key: 'booking-status',
        label: bookingStatusLabels[bookingFilters.status],
        onRemove: () => onBookingChange({ ...bookingFilters, status: 'all' }),
      });
    }
    if (bookingFilters.period !== 'all') {
      items.push({
        key: 'booking-period',
        label: bookingPeriodLabels[bookingFilters.period],
        onRemove: () => onBookingChange({ ...bookingFilters, period: 'all' }),
      });
    }
    if (bookingFilters.dateFrom) {
      items.push({
        key: 'booking-from',
        label: 'من ' + bookingFilters.dateFrom,
        onRemove: () => onBookingChange({ ...bookingFilters, dateFrom: null }),
      });
    }
    if (bookingFilters.dateTo) {
      items.push({
        key: 'booking-to',
        label: 'حتى ' + bookingFilters.dateTo,
        onRemove: () => onBookingChange({ ...bookingFilters, dateTo: null }),
      });
    }
    if (bookingFilters.provider) {
      items.push({
        key: 'booking-provider',
        label: bookingFilters.provider,
        onRemove: () => onBookingChange({ ...bookingFilters, provider: '' }),
      });
    }
    if (bookingFilters.clinic) {
      items.push({
        key: 'booking-clinic',
        label: bookingFilters.clinic,
        onRemove: () => onBookingChange({ ...bookingFilters, clinic: '' }),
      });
    }
    if (bookingFilters.patient) {
      items.push({
        key: 'booking-patient',
        label: bookingFilters.patient,
        onRemove: () => onBookingChange({ ...bookingFilters, patient: '' }),
      });
    }
  }

  if (!items.length) return null;

  return (
    <View className={inset ? 'px-4' : undefined}>
      <AppliedFilterChips items={items} onClearAll={onClearAll} />
    </View>
  );
}
