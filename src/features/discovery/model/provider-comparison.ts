import {
  getMockProvider,
  getMockProviderPriceFact,
} from '@/features/discovery/mocks/providers.mock';
import {
  findPenFamily,
  type getPenDoctorsForService,
} from '@/features/discovery/presentation/pen-discovery-data';
import type { AppIconName } from '@/shared/components/ui/app-icon';

export type ComparisonDoctor = ReturnType<typeof getPenDoctorsForService>[number];

export type ComparisonRowKey =
  'rating' | 'price' | 'appointment' | 'clinic' | 'included' | 'conditions';

/** Shared dimensions keep every doctor aligned with its fixed criterion label. */
export const comparisonHeaderHeight = 200;
export const comparisonRowDefinitions: readonly {
  key: ComparisonRowKey;
  label: string;
  height: number;
  icon: AppIconName;
}[] = [
  {
    key: 'rating',
    label: 'التقييم',
    height: 86,
    icon: { ios: 'star', android: 'star', web: 'star' },
  },
  {
    key: 'price',
    label: 'سعر الخدمة',
    height: 99,
    icon: { ios: 'creditcard', android: 'payments', web: 'payments' },
  },
  {
    key: 'appointment',
    label: 'أقرب موعد',
    height: 105,
    icon: { ios: 'calendar', android: 'event', web: 'event' },
  },
  {
    key: 'clinic',
    label: 'العيادة والمنطقة',
    height: 100,
    icon: { ios: 'building.2', android: 'business', web: 'business' },
  },
  {
    key: 'included',
    label: 'يشمل السعر',
    height: 118,
    icon: { ios: 'doc.text', android: 'description', web: 'description' },
  },
  {
    key: 'conditions',
    label: 'الملاحظات',
    height: 116,
    icon: { ios: 'info.circle', android: 'info', web: 'info' },
  },
] as const;

/** Use only service-scoped provider facts, never generated or generic prices. */
export function getComparisonFacts(doctor: ComparisonDoctor, serviceCode: string | null) {
  const provider = getMockProvider(doctor.id);
  const price = provider
    ? serviceCode
      ? getMockProviderPriceFact(provider, serviceCode)
      : undefined
    : undefined;

  const priceType = !serviceCode
    ? 'حدد الخدمة لعرض السعر'
    : !price
      ? 'السعر غير متاح'
      : price.mode === 'range'
        ? 'نطاق تقريبي'
        : price.mode === 'requires-plan'
          ? 'يتحدد بعد الفحص'
          : price.mode === 'free'
            ? 'خدمة مجانية حسب البيانات'
            : 'سعر معلن ضمن النموذج';

  return {
    initials: provider?.initials ?? 'د',
    rating: provider?.reviews ? provider.rating.toFixed(1) : '—',
    reviews: provider?.reviews ? `${provider.reviews} تقييم` : 'لا توجد تقييمات',
    price: serviceCode ? doctor.price : 'حسب الخدمة المختارة',
    priceType,
    appointment: serviceCode ? doctor.next : (provider?.nextAvailable ?? doctor.next),
    clinic: doctor.branch,
    area: doctor.area,
    included: serviceCode
      ? (price?.includesSummary ?? 'التفاصيل تُراجع مع الطبيب بعد الفحص.')
      : (provider?.serviceCodes.map((code) => findPenFamily(code)?.title ?? code).join('، ') ??
        'الخدمات حسب الطبيب'),
    conditions: serviceCode
      ? (price?.extraCostSummary ?? 'الشروط والتكلفة النهائية تُراجع عند الحجز.')
      : 'حدد الخدمة من الفلاتر لمقارنة الأسعار وبنود العلاج بدقة.',
  };
}
