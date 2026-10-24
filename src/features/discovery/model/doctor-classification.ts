import type { MockProvider } from '@/features/discovery/mocks/providers.mock';

/**
 * DEMONSTRATION ONLY — these are synthetic category scenarios for the mobile UI,
 * not a credential check, performance score or real protection entitlement.
 * The real S/P/H assignment must come from the verified provider+service+branch API.
 */
export type ScientificGrade = 'A' | 'B' | 'C' | 'D' | 'F' | 'pending';
export type FinancialGrade = 'A' | 'B' | 'C' | 'D';
export type ProtectionGrade = FinancialGrade | null;

interface MockProviderClassificationFixture {
  scientific: ScientificGrade;
  pricing: FinancialGrade | null;
  protection: ProtectionGrade;
}

const fixtures: Record<string, MockProviderClassificationFixture> = {
  'provider-layan': {
    scientific: 'A',
    pricing: 'B',
    protection: 'A',
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
  },
  'provider-dima': { scientific: 'B', pricing: 'C', protection: 'B' },
  'provider-fadi': {
    scientific: 'A',
    pricing: 'B',
    protection: 'A',
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
  F: 'لا يستوفي شروط المجال أو الفرع',
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
  serviceCode: string | null;
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
  serviceCode: string | null = null,
): DoctorClassificationView {
  // A doctor being in the catalog does not verify a classification or protection.
  const source = fixtures[provider.id];
  // UI mock categories are attached to the doctor and remain identical
  // in search, service results, comparison, and profile views.
  const scientific: ScientificGrade = source?.scientific ?? 'pending';
  const scientificAllowsPricing = scientific !== 'pending' && scientific !== 'F';
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
    pricingLabel: pricing ? pricingLabels[pricing] : 'الفئة السعرية غير محددة',
    protection,
    protectionLabel: protection ? protectionLabels[protection] : 'الحماية غير مفعّلة',
    rating: provider.reviews > 0 ? provider.rating : null,
    reviews: provider.reviews,
    priceLabel: serviceCode
      ? (provider.prices[serviceCode]?.displayLabel ?? 'السعر بعد الفحص')
      : 'حدد الخدمة لعرض سعرها',
    verified: false,
  };
}
export type DoctorBadgeCategory = 'scientific' | 'pricing' | 'protection';
export type DoctorBadgeGrade = ScientificGrade | FinancialGrade;
export type DoctorCategoryBadge = {
  key: DoctorBadgeCategory;
  grade: DoctorBadgeGrade;
  label: string;
};

/** Keep tab identity category-scoped: the same letter means different things in S, P and H. */
export type DoctorGradeTab =
  | 'all'
  | `scientific:${ScientificGrade}`
  | `pricing:${FinancialGrade}`
  | `protection:${FinancialGrade}`;

export const doctorGradeTabs: readonly { value: DoctorGradeTab; label: string }[] = [
  { value: 'all', label: 'الكل' },
  ...(['A', 'B', 'C', 'D', 'F', 'pending'] as const).map((grade) => ({
    value: `scientific:${grade}` as const,
    label: scientificLabels[grade],
  })),
  ...(['A', 'B', 'C', 'D'] as const).map((grade) => ({
    value: `pricing:${grade}` as const,
    label: pricingLabels[grade],
  })),
  ...(['A', 'B', 'C', 'D'] as const).map((grade) => ({
    value: `protection:${grade}` as const,
    label: protectionLabels[grade],
  })),
];

/**
 * Doctor badges are intentionally independent of a selected service.
 * The service is used only for appointment prices; classifications here
 * are doctor-level display fixtures pending an authoritative API contract.
 */
export function getDoctorCategoryBadges(provider: MockProvider): DoctorCategoryBadge[] {
  const facts = getDoctorClassification(provider);
  const badges: DoctorCategoryBadge[] = [
    {
      key: 'scientific',
      grade: facts.scientific,
      label: facts.scientificLabel,
    },
  ];
  if (facts.pricing) {
    badges.push({ key: 'pricing', grade: facts.pricing, label: facts.pricingLabel });
  }
  if (facts.protection) {
    badges.push({ key: 'protection', grade: facts.protection, label: facts.protectionLabel });
  }
  return badges;
}

export function matchesDoctorGrade(provider: MockProvider, tab: DoctorGradeTab): boolean {
  if (tab === 'all') return true;
  const [category, grade] = tab.split(':') as [DoctorBadgeCategory, DoctorBadgeGrade];
  return getDoctorCategoryBadges(provider).some(
    (badge) => badge.key === category && badge.grade === grade,
  );
}
