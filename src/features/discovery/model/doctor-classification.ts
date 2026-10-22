import type { MockProvider } from '@/features/discovery/mocks/providers.mock';

/**
 * DEMONSTRATION ONLY — these are synthetic category scenarios for the mobile UI,
 * not a credential check, performance score or real protection entitlement.
 * The real S/P/H assignment must come from the verified provider+service+branch API.
 */
export type ScientificGrade = 'A' | 'B' | 'C' | 'D' | 'pending';
export type FinancialGrade = 'A' | 'B' | 'C' | 'D';
export type ProtectionGrade = FinancialGrade | null;

interface MockProviderClassificationFixture {
  scientific: ScientificGrade;
  pricing: FinancialGrade | null;
  protection: ProtectionGrade;
  scientificByService?: Record<string, ScientificGrade>;
}

const fixtures: Record<string, MockProviderClassificationFixture> = {
  'provider-layan': {
    scientific: 'A',
    pricing: 'B',
    protection: 'A',
    scientificByService: { 'root-retreatment': 'B' },
  },
  'provider-omar': { scientific: 'B', pricing: 'B', protection: null },
  'provider-karim': { scientific: 'C', pricing: 'D', protection: 'D' },
  'provider-rima': { scientific: 'A', pricing: 'C', protection: 'A' },
  'provider-rama': { scientific: 'B', pricing: 'C', protection: 'C' },
  'provider-yazan': { scientific: 'D', pricing: 'D', protection: null },
  'provider-rana': { scientific: 'pending', pricing: null, protection: null },
  'provider-nour-hassan': { scientific: 'B', pricing: 'B', protection: 'B' },
  'provider-nour': { scientific: 'B', pricing: 'B', protection: null },
  'provider-samer': { scientific: 'B', pricing: 'C', protection: 'C' },
  'provider-hala': { scientific: 'A', pricing: 'B', protection: 'B' },
  'provider-majed': {
    scientific: 'A',
    pricing: 'C',
    protection: 'A',
    scientificByService: { 'dental-checkup': 'B' },
  },
  'provider-dima': { scientific: 'B', pricing: 'C', protection: 'B' },
  'provider-fadi': {
    scientific: 'A',
    pricing: 'B',
    protection: 'A',
    scientificByService: { 'root-retreatment': 'B' },
  },
  'provider-rasha': { scientific: 'C', pricing: 'C', protection: null },
  'provider-tarek': { scientific: 'C', pricing: 'D', protection: 'D' },
  'provider-lina': { scientific: 'B', pricing: 'B', protection: 'B' },
  'provider-bassam': { scientific: 'D', pricing: 'D', protection: null },
  'provider-salwa': { scientific: 'B', pricing: 'C', protection: 'C' },
  'provider-anas': { scientific: 'C', pricing: 'C', protection: null },
};

export const scientificLabels: Record<ScientificGrade, string> = {
  A: 'أداء سريري مرجعي',
  B: 'أداء سريري متقدم',
  C: 'أداء سريري معياري',
  D: 'أداء ضمن نطاق محافظ',
  pending: 'الأداء قيد التقييم',
};

export const pricingLabels: Record<FinancialGrade, string> = {
  A: 'فئة سعرية عليا',
  B: 'فئة سعرية متقدمة',
  C: 'فئة سعرية متوسطة',
  D: 'فئة سعرية اقتصادية',
};

export const protectionLabels: Record<FinancialGrade, string> = {
  A: 'حماية موسّعة',
  B: 'حماية مرتفعة',
  C: 'حماية أساسية',
  D: 'حماية محدودة',
};

export const protectionMaximums: Record<FinancialGrade, string> = {
  A: '100%',
  B: '70%',
  C: '50%',
  D: '30%',
};

export type DoctorClassificationView = {
  providerId: string;
  serviceCode: string;
  branch: string;
  scientific: ScientificGrade;
  scientificLabel: string;
  pricing: FinancialGrade | null;
  pricingLabel: string;
  protection: ProtectionGrade;
  protectionLabel: string;
  rating: number | null;
  reviews: number;
  priceLabel: string;
  verified: false;
};

const order: Record<FinancialGrade, number> = { A: 0, B: 1, C: 2, D: 3 };

export function getDoctorClassification(
  provider: MockProvider,
  serviceCode: string,
): DoctorClassificationView {
  // A doctor being in the catalog does not verify a classification or protection.
  const source = fixtures[provider.id];
  const serviceIsAvailable = provider.serviceCodes.includes(serviceCode);
  const scientific: ScientificGrade = serviceIsAvailable
    ? (source?.scientificByService?.[serviceCode] ?? source?.scientific ?? 'pending')
    : 'pending';
  const scientificAllowsPricing = scientific !== 'pending';
  const pricing: FinancialGrade | null =
    scientificAllowsPricing && source?.pricing && order[source.pricing] >= order[scientific]
      ? source.pricing
      : null;
  const protection: ProtectionGrade =
    pricing &&
    provider.protectionActive &&
    source?.protection &&
    order[source.protection] <= order[pricing]
      ? source.protection
      : null;

  return {
    providerId: provider.id,
    serviceCode,
    branch: provider.branch,
    scientific,
    scientificLabel: scientificLabels[scientific],
    pricing,
    pricingLabel: pricing ? pricingLabels[pricing] : 'السعر حسب الخدمة',
    protection,
    protectionLabel: protection ? protectionLabels[protection] : 'الحماية غير مفعّلة',
    rating: provider.reviews > 0 ? provider.rating : null,
    reviews: provider.reviews,
    priceLabel: provider.prices[serviceCode]?.displayLabel ?? 'السعر بعد الفحص',
    verified: false,
  };
}
