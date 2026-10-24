import {
  getMockProvider,
  getMockProviderPriceFact,
  getMockProviderDistanceKm,
} from '@/features/discovery/mocks/providers.mock';
import {
  findPenFamily,
  type getPenDoctorsForService,
} from '@/features/discovery/presentation/pen-discovery-data';
import {
  getMockProviderPresentation,
  getEligibilityDisplay,
  getVerificationDisplay,
} from '@/features/discovery/model/provider-presentation';
import { getDoctorClassification } from '@/features/discovery/model/doctor-classification';
import type { AppIconName } from '@/shared/components/ui/app-icon';

export type ComparisonDoctor = ReturnType<typeof getPenDoctorsForService>[number];

export type ComparisonRowKey =
  | 'rating'
  | 'scientific'
  | 'pricing'
  | 'protection'
  | 'eligibility'
  | 'verification'
  | 'distance'
  | 'price'
  | 'appointment'
  | 'clinic'
  | 'included'
  | 'conditions';

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
    key: 'scientific',
    label: 'التصنيف العلمي',
    height: 100,
    icon: { ios: 'seal', android: 'workspace_premium', web: 'workspace_premium' },
  },
  {
    key: 'pricing',
    label: 'الفئة السعرية',
    height: 87,
    icon: { ios: 'creditcard', android: 'payments', web: 'payments' },
  },
  {
    key: 'protection',
    label: 'مستوى الحماية',
    height: 107,
    icon: { ios: 'shield', android: 'verified_user', web: 'verified_user' },
  },
  {
    key: 'eligibility',
    label: 'الأهلية',
    height: 103,
    icon: { ios: 'checkmark.seal', android: 'verified', web: 'verified' },
  },
  {
    key: 'verification',
    label: 'آخر تحقق',
    height: 95,
    icon: { ios: 'calendar', android: 'event', web: 'event' },
  },
  {
    key: 'distance',
    label: 'المسافة',
    height: 88,
    icon: { ios: 'location', android: 'place', web: 'place' },
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

  const presentation =
    provider && serviceCode ? getMockProviderPresentation(provider, serviceCode) : null;
  const classification = provider ? getDoctorClassification(provider) : null;

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
    scientific: classification?.scientificLabel ?? 'قيد التقييم',
    pricing: classification?.pricingLabel ?? 'غير محددة',
    protection: classification?.protectionLabel ?? 'غير مفعّلة',
    eligibility: presentation ? getEligibilityDisplay(presentation) : 'حسب الخدمة',
    verification: presentation
      ? getVerificationDisplay(presentation)
      : (provider?.assessmentFreshnessLabel ?? '—'),
    distance:
      presentation?.distanceKm != null
        ? presentation.distanceKm.toFixed(1) + ' كم'
        : provider
          ? getMockProviderDistanceKm(provider).toFixed(1) + ' كم'
          : '—',
    rating: provider?.reviews ? provider.rating.toFixed(1) : '—',
    reviews: provider?.reviews ? `${provider.reviews} تقييم` : 'لا توجد تقييمات',
    price: serviceCode ? doctor.price : 'حسب الخدمة المختارة',
    priceType,
    appointment: serviceCode ? doctor.next : 'بحسب الخدمة المختارة',
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
