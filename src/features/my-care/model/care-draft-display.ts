import { getMockProvider } from '@/features/discovery/mocks/providers.mock';
import type { LocalCareDraft } from '@/features/my-care/state/care-draft-provider';

const stageLabels: Record<LocalCareDraft['route'], string> = {
  '/assessment/start': 'بداية تحديد الحالة',
  '/assessment/patient': 'اختيار المريض',
  '/assessment/complaint': 'تحديد المشكلة',
  '/assessment/location': 'تحديد مكان المشكلة',
  '/assessment/questions': 'تفاصيل الأعراض',
  '/assessment/health': 'مراجعة المعلومات الصحية',
  '/assessment/media': 'إضافة الملفات والصور',
  '/assessment/review': 'مراجعة المعلومات',
  '/assessment/needs-more-info': 'استكمال المعلومات',
  '/assessment/manual-review': 'المراجعة الأولية',
  '/discover/providers/results': 'اختيار الطبيب المناسب',
  '/booking/slots': 'اختيار الموعد',
  '/booking/patient': 'تحديد المريض',
  '/booking/review': 'مراجعة الحجز',
};

/** Display metadata only; a draft does NOT mean a treatment plan has been accepted. */
export function getDraftCaseDisplay(draft: LocalCareDraft) {
  const providerId = draft.booking?.providerId ?? draft.params?.providerId;
  const doctor = providerId ? getMockProvider(providerId) : undefined;
  const provider = doctor?.name ?? 'لم يتم اختيار الطبيب بعد';
  const branch = doctor?.branch ?? 'العيادة غير محددة بعد';
  const stage = stageLabels[draft.route];
  const date = draft.booking?.dateLabel ?? draft.params?.dateLabel;
  const time = draft.booking?.timeLabel ?? draft.params?.timeLabel;
  const details = [stage, date, time].filter(Boolean).join(' · ');
  return {
    title: draft.title,
    provider,
    branch,
    detail: details || draft.detail,
  };
}
