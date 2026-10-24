import {
  getMockProviderDistanceKm,
  type MockProvider,
} from '@/features/discovery/mocks/providers.mock';
import {
  getDoctorClassification,
  type ScientificGrade,
  type FinancialGrade,
} from '@/features/discovery/model/doctor-classification';

/**
 * Patient-facing, per-service/per-branch presentation contract.
 * The backend must supply verified eligibility, grades, branch ID, evidence
 * status and verification dates. Never infer these from a service listing.
 * The mock adapter below explicitly reports unverified demonstration facts.
 */
export type ProviderEligibility = 'verified' | 'pending' | 'ineligible';
export type ProviderEvidenceStatus = 'verified' | 'pending' | 'unavailable';
export type ProviderDisplayOrigin = 'demo' | 'backend';

export interface ProviderPresentationFacts {
  providerId: string;
  branchId: string | null;
  branchName: string;
  serviceCode: string;
  domainCode: string | null;
  origin: ProviderDisplayOrigin;
  eligibility: ProviderEligibility;
  evidenceStatus: ProviderEvidenceStatus;
  verifiedAt: string | null;
  lastUpdatedLabel: string | null;
  distanceKm: number | null;
  scientific: ScientificGrade | null;
  scientificLabel: string;
  pricing: FinancialGrade | null;
  pricingLabel: string;
  protection: FinancialGrade | null;
  protectionLabel: string;
  rating: number | null;
  verifiedVisitCount: number | null;
}

/** Demo adapter, NOT a real clinical eligibility/credential check. */
export function getMockProviderPresentation(
  provider: MockProvider,
  serviceCode: string,
): ProviderPresentationFacts | null {
  if (!provider.serviceCodes.includes(serviceCode)) return null;
  const facts = getDoctorClassification(provider, serviceCode);
  return {
    providerId: provider.id,
    branchId: null, // Mock has no stable facility identity.
    branchName: provider.branch,
    serviceCode,
    domainCode: null, // Await authoritative domain/service mapping from backend.
    origin: 'demo',
    eligibility: 'pending',
    evidenceStatus: 'unavailable',
    verifiedAt: null,
    lastUpdatedLabel: provider.assessmentFreshnessLabel,
    distanceKm: getMockProviderDistanceKm(provider),
    scientific: facts.scientific,
    scientificLabel: facts.scientificLabel,
    pricing: facts.pricing,
    pricingLabel: facts.pricing ? facts.pricingLabel : 'غير محددة',
    protection: facts.protection,
    protectionLabel: facts.protection ? facts.protectionLabel : 'غير مفعّلة بالنموذج',
    rating: provider.reviews ? provider.rating : null,
    verifiedVisitCount: null, // Fixture review count is NOT a verified-visit count.
  };
}

export function getEligibilityDisplay(facts: ProviderPresentationFacts): string {
  if (facts.origin === 'demo') return 'الخدمة متوفرة لدى الطبيب';
  if (facts.eligibility === 'verified') return 'مؤهل لهذه الخدمة والفرع';
  if (facts.eligibility === 'ineligible') return 'غير مؤهل لهذه الخدمة والفرع';
  return 'الأهلية قيد المراجعة';
}

export function getVerificationDisplay(facts: ProviderPresentationFacts): string {
  if (facts.origin === 'demo') return facts.lastUpdatedLabel ?? 'بيانات تجريبية';
  return facts.verifiedAt && facts.evidenceStatus === 'verified'
    ? 'آخر تحقق: ' + facts.verifiedAt
    : 'قيد التحديث';
}
