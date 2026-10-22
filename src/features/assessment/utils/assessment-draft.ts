import type {
  AssessmentSavedFields,
  LocalCareDraft,
} from '@/features/my-care/state/care-draft-provider';

export type AssessmentDraftRoute = Extract<LocalCareDraft['route'], `/assessment/${string}`>;

const routeDescriptions = {
  '/assessment/start': 'بداية تحديد الحالة',
  '/assessment/patient': 'اختيار المريض',
  '/assessment/complaint': 'تحديد المشكلة',
  '/assessment/location': 'مكان المشكلة',
  '/assessment/questions': 'تفاصيل الأعراض',
  '/assessment/health': 'مراجعة المعلومات الصحية',
  '/assessment/media': 'الصور والملفات',
  '/assessment/review': 'مراجعة الإجابات',
  '/assessment/needs-more-info': 'توضيح مكان المشكلة',
  '/assessment/manual-review': 'المراجعة الأولية',
} as const satisfies Record<AssessmentDraftRoute, string>;

export function isAssessmentDraftRoute(path: string): path is AssessmentDraftRoute {
  return Object.prototype.hasOwnProperty.call(routeDescriptions, path);
}

export function buildAssessmentDraft(
  route: AssessmentDraftRoute,
  assessment: AssessmentSavedFields,
  returnTo?: string,
): Omit<LocalCareDraft, 'updatedAt'> {
  return {
    id: 'assessment-' + assessment.patient,
    kind: 'assessment',
    title: assessment.complaint || 'ساعدني أحدد حالتي',
    detail: [routeDescriptions[route], assessment.location || undefined]
      .filter(Boolean)
      .join(' · '),
    route,
    params: returnTo === 'review' ? { returnTo: 'review' } : {},
    assessment,
  };
}
