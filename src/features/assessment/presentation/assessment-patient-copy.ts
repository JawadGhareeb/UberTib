import type { AssessmentPatient } from '@/features/assessment/state/assessment-session-provider';

/** Presentation fixtures are consistent throughout this mock assessment; they are not medical records. */
export const ASSESSMENT_PATIENT_FIXTURES: Record<
  AssessmentPatient,
  { name: string; age: number; note: string }
> = {
  self: { name: 'أحمد خالد', age: 34, note: 'أنا شخصياً' },
  adam: { name: 'سارة خالد', age: 8, note: 'ابنتي' },
  nour: { name: 'نور الخطيب', age: 17, note: 'ابنتي' },
};
