import type { AssessmentPatient } from '@/features/assessment/state/assessment-session-provider';

/** Presentation fixtures are consistent throughout this mock assessment; they are not medical records. */
export const ASSESSMENT_PATIENT_FIXTURES: Record<
  AssessmentPatient,
  { name: string; age: number; note: string }
> = {
  self: { name: 'ريم الخطيب', age: 34, note: 'أنا شخصياً' },
  adam: { name: 'آدم الخطيب', age: 8, note: 'ابني' },
  nour: { name: 'نور الخطيب', age: 17, note: 'ابنتي' },
};
