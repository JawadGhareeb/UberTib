import type { Href } from 'expo-router';

import type { MockScenarioDefinition } from '@/shared/mock';

interface MockAttentionItem {
  id: string;
  title: string;
  detail: string;
  actionLabel: string;
  href: Href;
  tone: 'info' | 'warning';
}

interface MockNotification {
  id: string;
  title: string;
  detail: string;
  timeLabel: string;
  unread: boolean;
  href: Href;
}

export const mockNeedsAttention: MockAttentionItem[] = [
  {
    id: 'attention-booking',
    title: 'موعدك غداً',
    detail: 'فحص الأسنان · 10:30 ص',
    actionLabel: 'عرض الحجز',
    href: '/booking/booking-001' as const,
    tone: 'info' as const,
  },
  {
    id: 'attention-follow-up',
    title: 'متابعة علاج مستحقة',
    detail: 'راجع تعليمات الجلسة القادمة ضمن حالة علاج العصب.',
    actionLabel: 'فتح الحالة',
    href: '/care/case-001/follow-ups' as const,
    tone: 'warning' as const,
  },
  {
    id: 'attention-submission',
    title: 'طلب تمثيل قيد المراجعة',
    detail: 'لا تحتاج لإعادة الإرسال. النتيجة ستظهر عند اكتمال المراجعة.',
    actionLabel: 'عرض الطلب',
    href: '/profile/family' as const,
    tone: 'info' as const,
  },
];

export const mockNotifications: MockNotification[] = [
  {
    id: 'notification-001',
    title: 'تم تأكيد موعدك',
    detail: 'فحص الأسنان مع د. ليان منصور.',
    timeLabel: 'منذ ساعتين',
    unread: true,
    href: '/booking/booking-001' as const,
  },
  {
    id: 'notification-002',
    title: 'تم تحديث الحالة العلاجية',
    detail: 'أصبحت مرحلة علاج القنوات هي المرحلة الحالية.',
    timeLabel: 'أمس',
    unread: true,
    href: '/care/case-001/timeline' as const,
  },
  {
    id: 'notification-003',
    title: 'الخطة العلاجية مقبولة',
    detail: 'يمكنك الرجوع لنسخة الخطة والمبلغ المقبول من حالة العلاج.',
    timeLabel: '8 سبتمبر',
    unread: false,
    href: '/care/case-001/plan' as const,
  },
];

export function getMockNeedsAttentionForScenario(scenario: MockScenarioDefinition) {
  const items = [...mockNeedsAttention];

  if (scenario.flags?.bookingAlternative) {
    items.unshift({
      id: 'attention-booking-alternative',
      title: 'موعد بديل بانتظار قرارك',
      detail: 'الحجز غير مؤكد، والاقتراح ينتهي اليوم · 8:00 م.',
      actionLabel: 'مراجعة البديل',
      href: '/booking/booking-001/alternative' as const,
      tone: 'warning' as const,
    });
  }

  if (scenario.flags?.providerEligibilityUnavailable) {
    items.unshift({
      id: 'attention-provider-unavailable',
      title: 'خيار الطبيب لم يعد متاحاً',
      detail: 'تغيرت الأهلية لهذا الطبيب والخدمة والفرع. اختَر خياراً آخر قبل الحجز.',
      actionLabel: 'عرض الخيارات',
      href: '/discover/providers/results' as const,
      tone: 'warning' as const,
    });
  }

  if (scenario.flags?.carePlanAmended) {
    items.unshift({
      id: 'attention-plan-amendment',
      title: 'تعديل على الخطة يحتاج موافقتك',
      detail: 'راجع ما تغير وفرق السعر قبل قبول النسخة الجديدة.',
      actionLabel: 'مراجعة التعديل',
      href: '/care/case-001/plan' as const,
      tone: 'warning' as const,
    });
  }

  if (scenario.flags?.followUpDue || scenario.flags?.followUpOverdue) {
    items.unshift({
      id: 'attention-follow-up-due',
      title: scenario.flags?.followUpOverdue ? 'متابعة علاج متأخرة' : 'متابعة علاج مستحقة اليوم',
      detail: scenario.flags?.followUpOverdue
        ? 'مر موعد المتابعة وما زالت بحاجة لإجراء.'
        : 'المتابعة مستحقة حتى لو ما وصلك إشعار خارجي.',
      actionLabel: 'عرض المتابعة',
      href: '/care/case-001/follow-ups' as const,
      tone: 'warning' as const,
    });
  }

  if (scenario.flags?.financeLifecycle) {
    items.unshift({
      id: 'attention-financial-response',
      title: 'حدث مالي يحتاج ردك',
      detail: 'يوجد حدث مالي مُبلّغ عنه ولم يتحول إلى حقيقة مستقرة قبل تأكيدك أو اعتراضك.',
      actionLabel: 'مراجعة الحدث المالي',
      href: '/care/case-001/financial/timeline' as const,
      tone: 'warning' as const,
    });
  }

  if (scenario.flags?.claimAppealEligible) {
    items.unshift({
      id: 'attention-claim-appeal',
      title: 'مهلة استئناف مطالبة مفتوحة',
      detail: 'الاستئناف متاح حتى 28 سبتمبر.',
      actionLabel: 'مراجعة القرار',
      href: '/care/case-001/claims/claim-001' as const,
      tone: 'warning' as const,
    });
  }

  if (scenario.flags?.reviewAppealEligible) {
    items.unshift({
      id: 'attention-review-appeal',
      title: 'قرار تقييم قابل للاستئناف',
      detail: 'راجع سبب القرار والمهلة قبل إرسال الاستئناف.',
      actionLabel: 'عرض التقييم',
      href: '/care/case-001/reviews/review-001' as const,
      tone: 'warning' as const,
    });
  }

  return items;
}

export function getMockNotificationsForScenario(scenario: MockScenarioDefinition) {
  const items = [...mockNotifications];

  if (scenario.flags?.bookingAlternative) {
    items.unshift({
      id: 'notification-booking-alternative',
      title: 'العيادة اقترحت موعداً بديلاً',
      detail: 'طلب الحجز ما زال غير مؤكد ويحتاج قرارك قبل انتهاء المهلة.',
      timeLabel: 'الآن',
      unread: true,
      href: '/booking/booking-001/alternative' as const,
    });
  }

  if (scenario.flags?.bookingAlternativeExpired) {
    items.unshift({
      id: 'notification-booking-alternative-expired',
      title: 'انتهت مهلة الموعد البديل',
      detail: 'أُغلق طلب الحجز بدون تأكيد وبدون عقوبة عليك.',
      timeLabel: 'الآن',
      unread: true,
      href: '/booking/booking-001' as const,
    });
  }

  if (scenario.flags?.bookingEligibilityReview) {
    items.unshift({
      id: 'notification-booking-eligibility-review',
      title: 'موعدك تحت مراجعة الأهلية',
      detail: 'لا تتوجه للموعد حتى يكتمل التحقق وتظهر الحالة النهائية.',
      timeLabel: 'الآن',
      unread: true,
      href: '/booking/booking-001' as const,
    });
  }

  if (scenario.flags?.bookingEligibilityRestored) {
    items.unshift({
      id: 'notification-booking-eligibility-restored',
      title: 'تم تأكيد الموعد بعد مراجعة الأهلية',
      detail: 'اكتمل التحقق وعاد الحجز إلى الحالة المؤكدة.',
      timeLabel: 'الآن',
      unread: true,
      href: '/booking/booking-001' as const,
    });
  }

  if (scenario.flags?.bookingEligibilityCancelled) {
    items.unshift({
      id: 'notification-booking-eligibility-cancelled',
      title: 'أُلغي الموعد بسبب أهلية مقدم الخدمة',
      detail: 'الإلغاء تم بدون عقوبة عليك ويمكنك اختيار موعد أو مقدم خدمة جديد.',
      timeLabel: 'الآن',
      unread: true,
      href: '/booking/booking-001' as const,
    });
  }

  if (scenario.flags?.providerEligibilityUnavailable) {
    items.unshift({
      id: 'notification-provider-unavailable',
      title: 'تغيرت أهلية خيار كنت تراجعه',
      detail: 'تم سحب إجراء الحجز من بطاقة الطبيب. افتح النتائج لاختيار خيار مؤهل حالياً.',
      timeLabel: 'الآن',
      unread: true,
      href: '/discover/providers/results' as const,
    });
  }

  if (scenario.flags?.carePlanAmended) {
    items.unshift({
      id: 'notification-plan-amended',
      title: 'وصل تعديل على خطتك العلاجية',
      detail: 'النسخة المقبولة الحالية ما زالت الحاكمة حتى توافق على التعديل ويُؤكد.',
      timeLabel: 'الآن',
      unread: true,
      href: '/care/case-001/plan' as const,
    });
  }

  if (scenario.flags?.carePlanAmendmentAccepted) {
    items.unshift({
      id: 'notification-plan-amendment-accepted',
      title: 'تم اعتماد النسخة الجديدة من الخطة',
      detail: 'الخطة 3 أصبحت النسخة الحاكمة وتم إنشاء لقطة مالية جديدة مع حفظ النسخة السابقة.',
      timeLabel: 'الآن',
      unread: true,
      href: '/care/case-001/plan' as const,
    });
  }

  if (scenario.flags?.careStageReopened) {
    items.unshift({
      id: 'notification-stage-reopened',
      title: 'تم تصحيح مرحلة علاجية',
      detail: 'أعيد فتح مرحلة سابقة مع حفظ سبب التصحيح والسجل السابق.',
      timeLabel: 'الآن',
      unread: true,
      href: '/care/case-001/stage/stage-assessment' as const,
    });
  }

  if (scenario.flags?.followUpDue || scenario.flags?.followUpOverdue) {
    items.unshift({
      id: 'notification-follow-up',
      title: scenario.flags?.followUpOverdue ? 'المتابعة أصبحت متأخرة' : 'المتابعة مستحقة الآن',
      detail: 'افتح الحالة لمراجعة المتابعة والإجراء المطلوب.',
      timeLabel: 'الآن',
      unread: true,
      href: '/care/case-001/follow-ups' as const,
    });
  }

  if (scenario.flags?.followUpCompleted) {
    items.unshift({
      id: 'notification-follow-up-completed',
      title: 'تم تسجيل المتابعة كمكتملة',
      detail: 'لم يعد هناك إجراء مطلوب لهذه المتابعة.',
      timeLabel: 'الآن',
      unread: true,
      href: '/care/case-001/follow-ups' as const,
    });
  }

  if (scenario.flags?.reviewVerificationPending) {
    items.unshift({
      id: 'notification-review-verification',
      title: 'تقييمك قيد التحقق',
      detail: 'تم استلام التقييم لكنه لم يصبح منشوراً قبل اكتمال التحقق.',
      timeLabel: 'الآن',
      unread: true,
      href: '/care/case-001/reviews/review-001' as const,
    });
  }

  if (scenario.flags?.claimDecision) {
    items.unshift({
      id: 'notification-claim-decision',
      title: 'صدر قرار على مطالبتك',
      detail: 'افتح المطالبة لعرض مصدر القرار وسببه وأثره.',
      timeLabel: 'الآن',
      unread: true,
      href: '/care/case-001/claims/claim-001' as const,
    });
  }

  if (scenario.flags?.financeLifecycle) {
    items.unshift({
      id: 'notification-finance-disputed',
      title: 'يوجد حدث مالي يحتاج توضيحاً',
      detail: 'تم تسجيل اعتراض على حدث مالي، والسجل الأصلي ما زال محفوظاً.',
      timeLabel: 'الآن',
      unread: true,
      href: '/care/case-001/financial/timeline' as const,
    });
  }

  return items;
}
