import type { StructuralReadState } from '@/shared/types/structural-read-state';

export type MockReadState = StructuralReadState;

export type MockSurface =
  | 'home'
  | 'catalog'
  | 'providers'
  | 'booking'
  | 'care'
  | 'finance'
  | 'reviews'
  | 'claims'
  | 'notifications'
  | 'attention'
  | 'profile'
  | 'representation';

export type MockScenarioId =
  | 'happy-path'
  | 'empty-new-patient'
  | 'auth-challenge-expired'
  | 'auth-attempt-limit'
  | 'auth-challenge-used'
  | 'auth-resend-throttled'
  | 'booking-pending'
  | 'booking-alternative'
  | 'booking-alternative-expired'
  | 'booking-eligibility-review'
  | 'booking-eligibility-restored'
  | 'booking-eligibility-cancelled'
  | 'booking-revalidation-slot-unavailable'
  | 'booking-revalidation-eligibility-lost'
  | 'booking-revalidation-branch-unavailable'
  | 'booking-revalidation-service-unpublished'
  | 'provider-eligibility-unavailable'
  | 'care-plan-pending'
  | 'care-plan-amended'
  | 'care-plan-amendment-accepted'
  | 'care-stage-reopened'
  | 'follow-up-due'
  | 'follow-up-overdue'
  | 'follow-up-completed'
  | 'finance-lifecycle'
  | 'claim-under-review'
  | 'claim-decision'
  | 'protection-claim-eligible'
  | 'review-verification-pending'
  | 'claim-appeal-eligible'
  | 'review-appeal-eligible'
  | 'representation-pending'
  | 'stale-offline'
  | 'partial-failure'
  | 'permission-loss';

export interface MockScenarioDefinition {
  id: MockScenarioId;
  label: string;
  description: string;
  surfaceStates?: Partial<Record<MockSurface, MockReadState>>;
  flags?: {
    emptyNewPatient?: boolean;
    authChallengeExpired?: boolean;
    authAttemptLimit?: boolean;
    authChallengeUsed?: boolean;
    authResendThrottled?: boolean;
    bookingPending?: boolean;
    bookingAlternative?: boolean;
    bookingAlternativeExpired?: boolean;
    bookingEligibilityReview?: boolean;
    bookingEligibilityRestored?: boolean;
    bookingEligibilityCancelled?: boolean;
    bookingRevalidationSlotUnavailable?: boolean;
    bookingRevalidationEligibilityLost?: boolean;
    bookingRevalidationBranchUnavailable?: boolean;
    bookingRevalidationServiceUnpublished?: boolean;
    providerEligibilityUnavailable?: boolean;
    carePlanPending?: boolean;
    carePlanAmended?: boolean;
    carePlanAmendmentAccepted?: boolean;
    careStageReopened?: boolean;
    followUpDue?: boolean;
    followUpOverdue?: boolean;
    followUpCompleted?: boolean;
    financeLifecycle?: boolean;
    claimUnderReview?: boolean;
    claimDecision?: boolean;
    protectionClaimEligible?: boolean;
    reviewVerificationPending?: boolean;
    claimAppealEligible?: boolean;
    reviewAppealEligible?: boolean;
    representationPending?: boolean;
  };
}

export const defaultMockScenarioId: MockScenarioId = 'happy-path';

export const mockScenarios: Record<MockScenarioId, MockScenarioDefinition> = {
  'happy-path': {
    id: 'happy-path',
    label: 'المسار الطبيعي',
    description: 'كل البيانات الأساسية متاحة والحالات مستقرة.',
  },
  'empty-new-patient': {
    id: 'empty-new-patient',
    label: 'مريض جديد',
    description: 'لا توجد حجوزات أو حالات علاجية أو سجلات سابقة بعد.',
    flags: { emptyNewPatient: true },
    surfaceStates: {
      booking: 'empty-no-data',
      care: 'empty-no-data',
      finance: 'empty-no-data',
      reviews: 'empty-no-data',
      claims: 'empty-no-data',
      notifications: 'empty-no-data',
      attention: 'empty-no-data',
    },
  },
  'auth-challenge-expired': {
    id: 'auth-challenge-expired',
    label: 'انتهت صلاحية رمز التحقق',
    description: 'رمز التحقق لم يعد صالحاً ويجب طلب تحدٍ جديد بدلاً من إعادة استخدامه.',
    flags: { authChallengeExpired: true },
  },
  'auth-attempt-limit': {
    id: 'auth-attempt-limit',
    label: 'تم بلوغ حد محاولات التحقق',
    description: 'تم استهلاك محاولات التحقق المسموحة للتحدي الحالي ويجب إنشاء تحدٍ جديد.',
    flags: { authAttemptLimit: true },
  },
  'auth-challenge-used': {
    id: 'auth-challenge-used',
    label: 'رمز تحقق مستخدم سابقاً',
    description: 'التحدي أحادي الاستخدام ولا يمكن قبول الرمز مرة ثانية بعد استهلاكه.',
    flags: { authChallengeUsed: true },
  },
  'auth-resend-throttled': {
    id: 'auth-resend-throttled',
    label: 'إعادة إرسال الرمز ضمن مهلة الانتظار',
    description: 'إعادة الإرسال موقوفة مؤقتاً حتى انتهاء مهلة الـresend لمنع إنشاء تحديات متكررة.',
    flags: { authResendThrottled: true },
  },
  'booking-pending': {
    id: 'booking-pending',
    label: 'حجز قيد التأكيد',
    description: 'تم إرسال الحجز لكن النتيجة النهائية لم تُحسم بعد.',
    flags: { bookingPending: true },
  },
  'booking-alternative': {
    id: 'booking-alternative',
    label: 'اقتراح موعد بديل',
    description: 'طلب الحجز الأصلي غير مؤكد، وهناك موعد بديل بانتظار قرار المريض ضمن مهلة محددة.',
    flags: { bookingAlternative: true },
  },
  'booking-alternative-expired': {
    id: 'booking-alternative-expired',
    label: 'انتهت مهلة الموعد البديل',
    description: 'انتهت مهلة قبول الموعد البديل، والحجز أغلق بدون تأكيد وبدون أي عقوبة على المريض.',
    flags: { bookingAlternativeExpired: true },
  },
  'booking-eligibility-review': {
    id: 'booking-eligibility-review',
    label: 'الحجز تحت مراجعة الأهلية',
    description:
      'حجز مؤكد تم وضعه مؤقتاً تحت مراجعة أهلية مقدم الخدمة، ولا يجب اعتباره قابلاً للحضور حالياً.',
    flags: { bookingEligibilityReview: true },
  },
  'booking-eligibility-restored': {
    id: 'booking-eligibility-restored',
    label: 'تمت استعادة أهلية الحجز',
    description: 'اكتملت المراجعة بقرار أهلية جديد وعاد الحجز من ELIGIBILITY_REVIEW إلى مؤكد.',
    flags: { bookingEligibilityRestored: true },
  },
  'booking-eligibility-cancelled': {
    id: 'booking-eligibility-cancelled',
    label: 'إلغاء بسبب أهلية مقدم الخدمة',
    description: 'انتهت مهلة المراجعة بدون استعادة الأهلية، فأغلق الحجز بدون عقوبة على المريض.',
    flags: { bookingEligibilityCancelled: true },
  },
  'booking-revalidation-slot-unavailable': {
    id: 'booking-revalidation-slot-unavailable',
    label: 'الموعد لم يعد متاحاً عند الإرسال',
    description: 'فشل commit revalidation لأن السعة تغيرت قبل إنشاء طلب الحجز.',
    flags: { bookingRevalidationSlotUnavailable: true },
  },
  'booking-revalidation-eligibility-lost': {
    id: 'booking-revalidation-eligibility-lost',
    label: 'تغيرت أهلية مقدم الخدمة قبل الإرسال',
    description:
      'فشل commit revalidation لأن مقدم الخدمة لم يعد مؤهلاً لهذا السياق عند لحظة الإرسال.',
    flags: { bookingRevalidationEligibilityLost: true },
  },
  'booking-revalidation-branch-unavailable': {
    id: 'booking-revalidation-branch-unavailable',
    label: 'الفرع غير جاهز للحجز',
    description: 'فشل commit revalidation لأن جاهزية الفرع تغيرت قبل إرسال الطلب.',
    flags: { bookingRevalidationBranchUnavailable: true },
  },
  'booking-revalidation-service-unpublished': {
    id: 'booking-revalidation-service-unpublished',
    label: 'الخدمة لم تعد منشورة',
    description: 'فشل commit revalidation لأن الخدمة توقفت عن النشر قبل إرسال الحجز.',
    flags: { bookingRevalidationServiceUnpublished: true },
  },
  'provider-eligibility-unavailable': {
    id: 'provider-eligibility-unavailable',
    label: 'خيار مقدم الخدمة لم يعد مؤهلاً',
    description:
      'تغيرت الأهلية أثناء فتح بطاقة القرار، لذلك يتم سحب إجراء الحجز ويبقى تفسير الحالة متاحاً.',
    flags: { providerEligibilityUnavailable: true },
  },
  'care-plan-pending': {
    id: 'care-plan-pending',
    label: 'خطة علاج قيد الموافقة',
    description: 'الخطة موجودة لكنها لم تصبح مرجعاً مقبولاً بعد.',
    flags: { carePlanPending: true },
  },
  'care-plan-amended': {
    id: 'care-plan-amended',
    label: 'تعديل على خطة مقبولة',
    description:
      'تم اقتراح نسخة جديدة بعد خطة مقبولة، ويجب عرض ما تغير والسبب وفرق السعر قبل قبولها.',
    flags: { carePlanAmended: true },
  },
  'care-plan-amendment-accepted': {
    id: 'care-plan-amendment-accepted',
    label: 'تم اعتماد تعديل الخطة',
    description:
      'يمثل authoritative response بعد قبول التعديل: تصبح النسخة الجديدة حاكمة وتُنشأ لقطة مالية جديدة دون تغيير اللقطة التاريخية السابقة.',
    flags: { carePlanAmendmentAccepted: true },
  },
  'care-stage-reopened': {
    id: 'care-stage-reopened',
    label: 'مرحلة علاج أُعيد فتحها',
    description: 'مرحلة كانت مكتملة ثم أعيد فتحها كتسجيل تصحيحي مع سبب وتوقيت واضحين.',
    flags: { careStageReopened: true },
  },
  'follow-up-due': {
    id: 'follow-up-due',
    label: 'متابعة مستحقة الآن',
    description: 'المتابعة أصبحت مستحقة ويجب أن تظهر كإجراء مطلوب حتى بدون وصول إشعار.',
    flags: { followUpDue: true },
  },
  'follow-up-overdue': {
    id: 'follow-up-overdue',
    label: 'متابعة متأخرة',
    description: 'انقضى موعد المتابعة ولم تُسجّل كمكتملة بعد.',
    flags: { followUpOverdue: true },
  },
  'follow-up-completed': {
    id: 'follow-up-completed',
    label: 'متابعة مكتملة',
    description: 'تم تنفيذ المتابعة وأصبحت جزءاً من السجل بدلاً من كونها إجراء مطلوباً.',
    flags: { followUpCompleted: true },
  },
  'finance-lifecycle': {
    id: 'finance-lifecycle',
    label: 'دورة مالية متعددة الحالات',
    description:
      'يعرض السجل المالي حالات reported وconfirmed وdisputed وrefund pending وrefunded بشكل منفصل.',
    flags: { financeLifecycle: true },
  },
  'claim-under-review': {
    id: 'claim-under-review',
    label: 'مطالبة قيد المراجعة',
    description: 'المطالبة موجودة ولا يوجد إجراء متكرر مطلوب من المريض حالياً.',
    flags: { claimUnderReview: true },
  },
  'claim-decision': {
    id: 'claim-decision',
    label: 'قرار مطالبة صادر',
    description:
      'صدر قرار نهائي للمطالبة مع مصدر القرار وأثره، من دون اعتبار أن المنصة نفذت أي تحويل مالي.',
    flags: { claimDecision: true },
  },
  'protection-claim-eligible': {
    id: 'protection-claim-eligible',
    label: 'حماية فعالة على الحالة',
    description:
      'الشروط المقبولة للحالة تحتوي حماية فعالة، لذلك تصبح مطالبة الحماية متاحة وفق النسخة والسياسة الحاكمة.',
    flags: { protectionClaimEligible: true },
  },
  'review-verification-pending': {
    id: 'review-verification-pending',
    label: 'تقييم بانتظار التحقق',
    description: 'تم استلام التقييم لكنه لم يصبح منشوراً قبل اكتمال التحقق من التجربة وحالة النشر.',
    flags: { reviewVerificationPending: true },
  },
  'claim-appeal-eligible': {
    id: 'claim-appeal-eligible',
    label: 'استئناف متاح',
    description: 'صدر قرار وأصبح الاستئناف متاحاً ضمن المهلة.',
    flags: { claimAppealEligible: true },
  },
  'review-appeal-eligible': {
    id: 'review-appeal-eligible',
    label: 'استئناف تقييم متاح',
    description: 'صدر قرار على التقييم وأصبح الاستئناف متاحاً ضمن المهلة.',
    flags: { reviewAppealEligible: true },
  },
  'representation-pending': {
    id: 'representation-pending',
    label: 'تمثيل قيد التحقق',
    description: 'تم استلام طلب التمثيل وما زالت المراجعة جارية.',
    flags: { representationPending: true },
  },
  'stale-offline': {
    id: 'stale-offline',
    label: 'بيانات قديمة بدون اتصال',
    description: 'يتم عرض آخر بيانات آمنة مع توضيح وقت آخر تحديث.',
    surfaceStates: {
      home: 'stale',
      catalog: 'stale',
      providers: 'stale',
      booking: 'stale',
      care: 'stale',
      finance: 'stale',
      reviews: 'stale',
      claims: 'stale',
      notifications: 'stale',
      attention: 'stale',
      profile: 'stale',
      representation: 'stale',
    },
  },
  'partial-failure': {
    id: 'partial-failure',
    label: 'تحميل جزئي',
    description: 'جزء من البيانات متاح وجزء آخر تعذر تحميله.',
    surfaceStates: {
      home: 'partial',
      providers: 'partial',
      booking: 'partial',
      care: 'partial',
      notifications: 'partial',
      profile: 'partial',
    },
  },
  'permission-loss': {
    id: 'permission-loss',
    label: 'فقدان صلاحية',
    description: 'المحتوى الحساس غير متاح لأن الصلاحية لم تعد فعالة.',
    surfaceStates: {
      care: 'error-permission',
      finance: 'error-permission',
      reviews: 'error-permission',
      claims: 'error-permission',
      representation: 'error-permission',
    },
  },
};

export function getMockScenario(id: MockScenarioId): MockScenarioDefinition {
  return mockScenarios[id];
}

export function getMockSurfaceState(
  scenario: MockScenarioDefinition,
  surface: MockSurface,
): MockReadState {
  return scenario.surfaceStates?.[surface] ?? 'success';
}
