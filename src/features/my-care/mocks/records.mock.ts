import type { MockScenarioDefinition } from '@/shared/mock';
import { getMockCareCase } from '@/features/my-care/mocks/care.mock';

export const mockFinancialRecord = {
  caseId: 'case-001',
  acceptedTerms: {
    snapshotReference: 'FTS-CASE001-V2',
    planVersionLabel: 'الخطة 2',
    service: 'علاج العصب',
    patient: 'أحمد خالد',
    totalLabel: '2,250 ل.س',
    acceptedAtLabel: '8 سبتمبر 2026 · 10:05 ص',
    provider: 'د. ليان يوسف',
    branch: 'مركز نور الأسنان · الجميلية',
    paymentModeLabel: 'دفع مباشر للعيادة',
    currencyLabel: 'ليرة سورية',
    stagesLabel: '3 مراحل علاجية',
    dueStructureLabel: 'دفعتان خارج UperTib حسب تقدم الخطة',
    cancellationTermsLabel: 'الإلغاء يخضع لحالة الموعد والخدمة وقت الطلب وفق النسخة الحاكمة.',
    refundTermsLabel: 'أي طلب استرداد يُراجع وفق الشروط المقبولة والأحداث المالية المسجلة.',
    protectionStateLabel: 'الحماية الممولة غير مفعلة لهذه النسخة',
    protectionClaimEligible: false,
    policyVersionLabel: 'سياسة الشروط المالية v2026.09',
  },
  events: [
    {
      id: 'financial-event-001',
      title: 'دفعة خارج المنصة',
      amountLabel: '750 ل.س',
      dateLabel: '14 سبتمبر 2026 · 5:40 م',
      statusLabel: 'مؤكدة من العيادة',
      state: 'confirmed' as const,
      detail: 'تم تسجيل الدفعة كحدث مالي خارجي مرتبط بالخطة المقبولة.',
    },
    {
      id: 'financial-event-002',
      title: 'المبلغ المتبقي وفق الخطة',
      amountLabel: '1,500 ل.س',
      dateLabel: 'بعد تأكيد الدفعة الأولى',
      statusLabel: 'معلومة مرجعية',
      state: 'agreed' as const,
      detail: 'القيمة مرتبطة بلقطة الخطة الحالية ولا تعني أن المنصة تحتفظ بالمبلغ.',
    },
  ],
} as const;

/** Verified, reported and agreed money movements are distinct across cases. */
const additionalFinancialEvents: Record<
  string,
  {
    id: string;
    title: string;
    amountLabel: string;
    dateLabel: string;
    statusLabel: string;
    state: 'confirmed' | 'agreed' | 'reported';
    detail: string;
  }[]
> = {
  'case-002': [
    {
      id: 'case-002-financial-1',
      title: 'دفعة نقدية موثقة',
      amountLabel: '2,500 ل.س',
      dateLabel: '24 آب 2026 · 1:00 م',
      statusLabel: 'مؤكدة من العيادة',
      state: 'confirmed',
      detail: 'تم توثيق استلام مبلغ الحشوة بعد إكمال الزيارة.',
    },
  ],
  'case-003': [
    {
      id: 'case-003-financial-1',
      title: 'دفعة مباشرة للعيادة',
      amountLabel: '1,500 ل.س',
      dateLabel: '18 أيلول 2026 · 3:30 م',
      statusLabel: 'مؤكدة من العيادة',
      state: 'confirmed',
      detail: 'سجلت العيادة استلام الدفعة الأولى من خطة اللثة.',
    },
    {
      id: 'case-003-financial-2',
      title: 'المبلغ المتبقي حسب الخطة',
      amountLabel: '2,000 ل.س',
      dateLabel: 'بعد الجلسة القادمة',
      statusLabel: 'معلومة مرجعية',
      state: 'agreed',
      detail: 'هذا الاستحقاق مرجعي وليس إثباتاً للدفع.',
    },
  ],
  'case-004': [
    {
      id: 'case-004-financial-1',
      title: 'دفعة تاج خزفي مؤكدة',
      amountLabel: '9,000 ل.س',
      dateLabel: '20 أيلول 2026 · 12:15 م',
      statusLabel: 'مؤكدة من العيادة',
      state: 'confirmed',
      detail: 'تم توثيق استلام الدفعة من العيادة وإغلاق الحالة.',
    },
  ],
  'case-005': [
    {
      id: 'case-005-financial-1',
      title: 'المبلغ المتفق عليه ضمن الخطة',
      amountLabel: '3,500 ل.س',
      dateLabel: 'بعد جلسة تقييم الطفل',
      statusLabel: 'معلومة مرجعية',
      state: 'agreed',
      detail: 'لا يوجد إيصال دفع مؤكد في السجل.',
    },
  ],
  'case-007': [
    {
      id: 'case-007-financial-1',
      title: 'دفعة أبلغ عنها المريض',
      amountLabel: '1,100 ل.س',
      dateLabel: '14 تشرين الأول 2026 · 6:00 م',
      statusLabel: 'مبلّغ عنها · غير مؤكدة',
      state: 'reported',
      detail: 'إبلاغ المريض لا يُعد تأكيد استلام من العيادة.',
    },
    {
      id: 'case-007-financial-2',
      title: 'الرصيد المتفق عليه',
      amountLabel: '2,100 ل.س',
      dateLabel: 'حسب مراحل الخطة',
      statusLabel: 'معلومة مرجعية',
      state: 'agreed',
      detail: 'القيمة لا تعني تنفيذ تحويل مالي.',
    },
  ],
  'case-008': [
    {
      id: 'case-008-financial-1',
      title: 'رسوم جلسة التبييض',
      amountLabel: '4,750 ل.س',
      dateLabel: '12 آب 2026 · 6:10 م',
      statusLabel: 'مؤكدة من العيادة',
      state: 'confirmed',
      detail: 'وثقت العيادة استلام كامل الرسوم بعد الجلسة.',
    },
  ],
  'case-009': [
    {
      id: 'case-009-financial-1',
      title: 'دفعة تصنيع الطقم',
      amountLabel: '4,300 ل.س',
      dateLabel: '16 سبتمبر 2026 · 2:00 م',
      statusLabel: 'مؤكدة من العيادة',
      state: 'confirmed',
      detail: 'تم توثيق الدفعة الأولى للخطة المقبولة.',
    },
    {
      id: 'case-009-financial-2',
      title: 'الرصيد المتبقي للتسليم',
      amountLabel: '4,400 ل.س',
      dateLabel: 'عند التسليم النهائي',
      statusLabel: 'معلومة مرجعية',
      state: 'agreed',
      detail: 'يخضع السداد للشروط المقبولة عند التسليم.',
    },
  ],
  'case-010': [
    {
      id: 'case-010-financial-1',
      title: 'دفعة الدعامات',
      amountLabel: '4,000 ل.س',
      dateLabel: '15 سبتمبر 2026 · 3:00 م',
      statusLabel: 'مؤكدة من العيادة',
      state: 'confirmed',
      detail: 'تم توثيق استلام الدفعة الأولى.',
    },
    {
      id: 'case-010-financial-2',
      title: 'الرصيد المتبقي للتاج',
      amountLabel: '7,000 ل.س',
      dateLabel: 'عند تركيب التعويض',
      statusLabel: 'معلومة مرجعية',
      state: 'agreed',
      detail: 'المبلغ المتبقي ليس دفعة مؤكدة بعد.',
    },
  ],
};

export function getMockFinancialEventsForScenario(
  scenario: MockScenarioDefinition,
  caseId = 'case-001',
) {
  if (caseId !== 'case-001') return additionalFinancialEvents[caseId] ?? [];
  // Accepted amendment changes the due balance, not the previously confirmed payment.
  const activeEvents = scenario.flags?.carePlanAmendmentAccepted
    ? mockFinancialRecord.events.map((event) =>
        event.id === 'financial-event-002' ? { ...event, amountLabel: '2,125 ل.س' } : event,
      )
    : mockFinancialRecord.events;
  if (!scenario.flags?.financeLifecycle) {
    return activeEvents;
  }

  return [
    {
      id: 'financial-event-reported',
      title: 'دفعة أبلغ عنها المريض',
      amountLabel: '1,000 ل.س',
      dateLabel: '20 سبتمبر 2026 · 8:25 ص',
      statusLabel: 'مبلّغ عنها · غير مؤكدة',
      state: 'reported' as const,
      detail:
        'المريض سجل دفعة خارج المنصة. هذا Assertion فقط ولا يصبح حقيقة مالية مستقرة قبل رد الطرف المقابل.',
    },
    {
      id: 'financial-event-disputed',
      title: 'حدث مالي محل اعتراض',
      amountLabel: '750 ل.س',
      dateLabel: '19 سبتمبر 2026 · 4:10 م',
      statusLabel: 'متنازع عليه',
      state: 'disputed' as const,
      detail:
        'تم تسجيل اعتراض على الحدث الأصلي، والاعتراض أُضيف كسجل مستقل بدون تعديل الـAssertion السابق.',
    },
    {
      id: 'financial-event-refund-pending',
      title: 'استرداد معتمد بانتظار التنفيذ الخارجي',
      amountLabel: '500 ل.س',
      dateLabel: '18 سبتمبر 2026 · 12:40 م',
      statusLabel: 'بانتظار تنفيذ خارجي',
      state: 'refund-pending' as const,
      detail:
        'الاستحقاق والقرار مسجلان، لكن تنفيذ الاسترداد نفسه يتم خارج UperTib ولم يتم تأكيده بعد.',
    },
    {
      id: 'financial-event-refunded',
      title: 'استرداد منفذ خارج المنصة',
      amountLabel: '400 ل.س',
      dateLabel: '15 سبتمبر 2026 · 3:15 م',
      statusLabel: 'تم الاسترداد',
      state: 'refunded' as const,
      detail: 'تم توثيق تنفيذ الاسترداد الخارجي بعد تأكيده من الأطراف، والمنصة سجلت الحدث فقط.',
    },
    ...activeEvents,
  ];
}

export function getMockFinancialRecordForScenario(
  scenario: MockScenarioDefinition,
  caseId = 'case-001',
) {
  if (caseId !== 'case-001') {
    const careCase = getMockCareCase(caseId);
    if (!careCase || careCase.planAcceptedAtLabel === 'بانتظار موافقة المريض') {
      // No accepted financial snapshot exists for proposed-only plans.
      return { ...mockFinancialRecord, caseId: 'unavailable' };
    }
    return {
      ...mockFinancialRecord,
      caseId,
      acceptedTerms: {
        ...mockFinancialRecord.acceptedTerms,
        snapshotReference: `FTS-${caseId.toUpperCase()}-V1`,
        planVersionLabel: careCase.planVersionLabel,
        service: careCase.service,
        patient: caseId === 'case-005' ? 'سارة خالد' : 'أحمد خالد',
        totalLabel: careCase.acceptedTotalLabel,
        acceptedAtLabel: careCase.planAcceptedAtLabel,
        provider: careCase.provider,
        branch: careCase.branch,
        stagesLabel: `${careCase.stages.length} مراحل علاجية`,
        dueStructureLabel: 'دفعات مباشرة للعيادة حسب الخطة المقبولة',
        protectionStateLabel: 'الحماية الممولة غير مفعلة لهذه الخدمة',
        protectionClaimEligible: false,
      },
    };
  }
  if (scenario.flags?.carePlanAmendmentAccepted) {
    return {
      ...mockFinancialRecord,
      acceptedTerms: {
        ...mockFinancialRecord.acceptedTerms,
        snapshotReference: 'FTS-CASE001-V3',
        supersedesSnapshotReference: mockFinancialRecord.acceptedTerms.snapshotReference,
        planVersionLabel: 'الخطة 3',
        totalLabel: '2,875 ل.س',
        acceptedAtLabel: '20 سبتمبر 2026 · 11:40 ص',
        dueStructureLabel: 'دفعتان خارج UperTib حسب الخطة 3 المقبولة',
        policyVersionLabel: 'سياسة الشروط المالية v2026.09',
      },
    };
  }

  if (!scenario.flags?.protectionClaimEligible) {
    return mockFinancialRecord;
  }

  return {
    ...mockFinancialRecord,
    acceptedTerms: {
      ...mockFinancialRecord.acceptedTerms,
      protectionStateLabel: 'حماية فعالة على هذه النسخة المقبولة',
      protectionClaimEligible: true,
      policyVersionLabel: 'سياسة الحماية v2026.09',
    },
  };
}

export const mockReviewRecord = {
  eligibleExperience: {
    id: 'experience-diagnosis-001',
    caseId: 'case-001',
    title: 'جلسة الفحص والتشخيص',
    provider: 'د. ليان يوسف',
    dateLabel: '7 سبتمبر 2026',
    windowLabel: 'متاح للتقييم حتى 7 أكتوبر',
  },
  existingReview: {
    id: 'review-001',
    caseId: 'case-001',
    title: 'جلسة سابقة من علاج العصب',
    provider: 'د. ليان يوسف',
    rating: 5,
    comment: 'التجربة كانت واضحة والمواعيد منظمة، والشرح قبل العلاج كان ممتازاً.',
    submittedAtLabel: '25 أغسطس 2026',
    statusLabel: 'منشور · تجربة موثقة',
    appealEligible: false,
  },
} as const;

export function getMockReviewRecordForScenario(scenario: MockScenarioDefinition) {
  if (scenario.flags?.reviewVerificationPending) {
    return {
      ...mockReviewRecord,
      existingReview: {
        ...mockReviewRecord.existingReview,
        statusLabel: 'التحقق من التجربة قيد المعالجة',
        appealEligible: false,
        verificationDetail:
          'تم استلام التقييم، لكنه ما صار منشوراً قبل اكتمال التحقق من ارتباطه بتجربة مكتملة ومؤهلة.',
      },
    };
  }

  if (!scenario.flags?.reviewAppealEligible) {
    return mockReviewRecord;
  }

  return {
    ...mockReviewRecord,
    existingReview: {
      ...mockReviewRecord.existingReview,
      statusLabel: 'تم إيقاف النشر · قرار قابل للاستئناف',
      appealEligible: true,
      retirementReason: 'تم إيقاف النشر بقرار متعلق بأهلية النشر وفق السياسة الحاكمة.',
      appealDeadlineLabel: 'الاستئناف متاح حتى 30 سبتمبر',
    },
  };
}

export const mockClaims = [
  {
    id: 'claim-001',
    caseId: 'case-001',
    type: 'refund',
    typeLabel: 'طلب استرداد',
    title: 'طلب مراجعة جزء من التكلفة',
    amountLabel: '1,500 ل.س',
    statusLabel: 'قيد المراجعة',
    deadlineLabel: 'الرد المتوقع قبل 25 سبتمبر',
    evidenceProgressLabel: '2 من 3 مكتملة',
    evidence: [
      { id: 'e1', title: 'نسخة الخطة المقبولة', status: 'complete' as const },
      { id: 'e2', title: 'سجل الدفعة الخارجية', status: 'complete' as const },
      { id: 'e3', title: 'شرح سبب الطلب', status: 'pending' as const },
    ],
    history: [
      { id: 'h1', title: 'تم إنشاء الطلب', dateLabel: '17 سبتمبر · 9:20 ص' },
      { id: 'h2', title: 'بدأت المراجعة', dateLabel: '18 سبتمبر · 11:00 ص' },
    ],
    appealEligible: false,
  },
  {
    id: 'claim-002',
    caseId: 'case-001',
    type: 'protection',
    typeLabel: 'مطالبة حماية',
    title: 'مطالبة سابقة مرتبطة بالخدمة',
    amountLabel: '—',
    statusLabel: 'مغلقة',
    deadlineLabel: 'انتهت المراجعة',
    evidenceProgressLabel: '3 من 3 مكتملة',
    evidence: [
      { id: 'e1', title: 'السجل السريري المطلوب', status: 'complete' as const },
      { id: 'e2', title: 'إثبات الخطة الحاكمة', status: 'complete' as const },
      { id: 'e3', title: 'بيان سبب المطالبة', status: 'complete' as const },
    ],
    history: [
      { id: 'h1', title: 'تم إنشاء المطالبة', dateLabel: '3 سبتمبر' },
      { id: 'h2', title: 'اكتملت الأدلة', dateLabel: '5 سبتمبر' },
      { id: 'h3', title: 'أغلقت المراجعة', dateLabel: '14 سبتمبر' },
    ],
    appealEligible: false,
  },
  {
    id: 'claim-dispute-demo',
    caseId: 'case-001',
    type: 'external-payment-dispute',
    typeLabel: 'نزاع دفعة خارجية',
    title: 'قرار نزاع على دفعة شام كاش',
    amountLabel: '1,500 ل.س',
    statusLabel: 'قرار جزئي',
    deadlineLabel: 'الاستئناف حسب المهلة الحاكمة في هذه المعاينة',
    evidenceProgressLabel: '2 من 3 تمت مراجعتها',
    evidence: [
      { id: 'pd-1', title: 'إيصال الدفع الخارجي', status: 'complete' as const },
      { id: 'pd-2', title: 'إجابة العيادة', status: 'complete' as const },
      { id: 'pd-3', title: 'مرجع التحويل المتبقي', status: 'pending' as const },
    ],
    history: [
      { id: 'pd-h1', title: 'تم إنشاء النزاع', dateLabel: '22 حزيران' },
      { id: 'pd-h2', title: 'ردت العيادة', dateLabel: '23 حزيران' },
      { id: 'pd-h3', title: 'قرار جزئي موثّق', dateLabel: '24 حزيران' },
    ],
    decision: {
      outcomeLabel: 'مقبول جزئياً · 1,000 ل.س مثبت / 500 ل.س غير مثبت',
      confirmedAmountLabel: '1,000 ل.س',
      unverifiedAmountLabel: '500 ل.س',
      appealDeadlineLabel: '30 حزيران 2026 · مثال تصميمي',
      sourceLabel: 'فريق مراجعة المدفوعات · محاكاة',
      reason: 'ظهر إثبات خارجي لـ1,000 ل.س؛ لم يتوفر إثبات للمبلغ المتبقي في هذه المحاكاة.',
      effectLabel: 'القرار لا ينفذ أي تحويل؛ الدفعة تمت خارج المنصة.',
      decidedAtLabel: '24 حزيران 2026 · محاكاة',
      governingPolicyLabel: 'اللقطة المالية 2 · شروط النزاع',
    },
    appealEligible: true,
  },
  // Additional issue, refund and execution flows linked to actual care cases.
  {
    id: 'claim-003',
    caseId: 'case-003',
    type: 'clinical',
    typeLabel: 'مراجعة إجراء علاجي',
    title: 'مراجعة جلسة تنظيف عميق',
    amountLabel: '—',
    statusLabel: 'قيد المراجعة',
    deadlineLabel: 'الرد المتوقع في 30 تشرين الأول',
    evidenceProgressLabel: '2 من 3 مكتملة',
    evidence: [
      { id: 'claim-003-evidence-1', title: 'نسخة الخطة العلاجية', status: 'complete' as const },
      { id: 'claim-003-evidence-2', title: 'ملخص الجلسة الأولى', status: 'complete' as const },
      { id: 'claim-003-evidence-3', title: 'ملاحظات المريض', status: 'pending' as const },
    ],
    history: [
      { id: 'claim-003-history-1', title: 'إرسال الطلب', dateLabel: '19 تشرين الأول' },
      { id: 'claim-003-history-2', title: 'بدء المراجعة', dateLabel: '20 تشرين الأول' },
    ],
    appealEligible: false,
  },
  {
    id: 'claim-004',
    caseId: 'case-004',
    type: 'refund',
    typeLabel: 'طلب استرداد',
    title: 'مراجعة تكلفة تاج خزفي',
    amountLabel: '500 ل.س',
    statusLabel: 'مغلقة',
    deadlineLabel: 'اكتملت المراجعة في 1 تشرين الأول',
    evidenceProgressLabel: '3 من 3 مكتملة',
    evidence: [
      { id: 'claim-004-evidence-1', title: 'الخطة المقبولة', status: 'complete' as const },
      { id: 'claim-004-evidence-2', title: 'سجل التثبيت', status: 'complete' as const },
      { id: 'claim-004-evidence-3', title: 'تفاصيل الطلب', status: 'complete' as const },
    ],
    history: [
      { id: 'claim-004-history-1', title: 'إنشاء الطلب', dateLabel: '25 أيلول' },
      { id: 'claim-004-history-2', title: 'القرار النهائي', dateLabel: '1 تشرين الأول' },
    ],
    appealEligible: false,
  },
  {
    id: 'claim-005',
    caseId: 'case-007',
    type: 'appointment',
    typeLabel: 'اعتراض على موعد',
    title: 'تأجيل جلسة استكمال العلاج',
    amountLabel: '—',
    statusLabel: 'قيد المراجعة',
    deadlineLabel: 'الرد المتوقع في 23 تشرين الأول',
    evidenceProgressLabel: '2 من 3 مكتملة',
    evidence: [
      { id: 'claim-005-evidence-1', title: 'تأكيد الموعد السابق', status: 'complete' as const },
      { id: 'claim-005-evidence-2', title: 'شرح سبب الطلب', status: 'complete' as const },
      { id: 'claim-005-evidence-3', title: 'مرفقات إضافية', status: 'pending' as const },
    ],
    history: [
      { id: 'claim-005-history-1', title: 'تسجيل المشكلة', dateLabel: '20 تشرين الأول' },
      { id: 'claim-005-history-2', title: 'إحالة للعيادة', dateLabel: '21 تشرين الأول' },
    ],
    appealEligible: false,
  },
  {
    id: 'claim-006',
    caseId: 'case-009',
    type: 'refund-execution',
    typeLabel: 'متابعة تنفيذ استرداد',
    title: 'طلب إثبات استرداد خارجي',
    amountLabel: '600 ل.س',
    statusLabel: 'بانتظار مستند',
    deadlineLabel: 'بانتظار إثبات التحويل من العيادة',
    evidenceProgressLabel: '1 من 3 مكتملة',
    evidence: [
      { id: 'claim-006-evidence-1', title: 'القرار المعتمد', status: 'complete' as const },
      { id: 'claim-006-evidence-2', title: 'بيان التحويل الخارجي', status: 'pending' as const },
      { id: 'claim-006-evidence-3', title: 'رقم مرجع العملية', status: 'pending' as const },
    ],
    history: [
      { id: 'claim-006-history-1', title: 'تسجيل الاستحقاق', dateLabel: '13 تشرين الأول' },
      { id: 'claim-006-history-2', title: 'طلب مرجع التحويل', dateLabel: '18 تشرين الأول' },
    ],
    appealEligible: false,
  },
  {
    id: 'claim-007',
    caseId: 'case-005',
    type: 'clinical',
    typeLabel: 'استفسار عن العلاج',
    title: 'استفسار حول خيارات الترميم للطفل',
    amountLabel: '—',
    statusLabel: 'تم الرد',
    deadlineLabel: 'تم الرد في 19 تشرين الأول',
    evidenceProgressLabel: '2 من 2 مكتملة',
    evidence: [
      { id: 'claim-007-evidence-1', title: 'ملخص الحالة', status: 'complete' as const },
      { id: 'claim-007-evidence-2', title: 'استفسار ولي الأمر', status: 'complete' as const },
    ],
    history: [
      { id: 'claim-007-history-1', title: 'فتح الاستفسار', dateLabel: '17 تشرين الأول' },
      { id: 'claim-007-history-2', title: 'إضافة رد العيادة', dateLabel: '19 تشرين الأول' },
    ],
    appealEligible: false,
  },
] as const;

export function getMockClaimsForScenario(scenario: MockScenarioDefinition) {
  if (scenario.flags?.claimDecision) {
    return mockClaims.map((claim, index) =>
      index === 0
        ? {
            ...claim,
            statusLabel: 'صدر القرار',
            deadlineLabel: 'أغلقت مرحلة المراجعة في 20 سبتمبر',
            evidenceProgressLabel: '3 من 3 مكتملة',
            evidence: claim.evidence.map((item) => ({ ...item, status: 'complete' as const })),
            history: [
              ...claim.history,
              {
                id: 'h3-decision',
                title: 'صدر قرار المراجعة البشرية',
                dateLabel: '20 سبتمبر · 10:15 ص',
              },
            ],
            decision: {
              outcomeLabel: 'مقبولة جزئياً',
              sourceLabel: 'مراجعة بشرية · فريق المطالبات',
              reason:
                'تم قبول الجزء المرتبط بالخدمة غير المنفذة ورفض الجزء الذي لا تغطيه الشروط الحاكمة.',
              effectLabel:
                'تم تسجيل التزام خارجي على الطرف المعني. UperTib لم يجمع أو يحول أو ينفذ أي مبلغ.',
              decidedAtLabel: '20 سبتمبر 2026 · 10:15 ص',
              governingPolicyLabel: 'سياسة المطالبات v2026.09',
            },
            appealEligible: false,
          }
        : claim,
    );
  }

  if (scenario.flags?.claimAppealEligible) {
    return mockClaims.map((claim, index) =>
      index === 0
        ? {
            ...claim,
            statusLabel: 'مرفوضة',
            deadlineLabel: 'الاستئناف متاح حتى 28 سبتمبر',
            evidenceProgressLabel: '3 من 3 مكتملة',
            evidence: claim.evidence.map((item) => ({ ...item, status: 'complete' as const })),
            history: [
              ...claim.history,
              { id: 'h3-scenario', title: 'صدر القرار: مرفوضة', dateLabel: '19 سبتمبر · 9:30 ص' },
            ],
            decision: {
              outcomeLabel: 'مرفوضة',
              sourceLabel: 'مراجعة بشرية · فريق المطالبات',
              reason: 'الأدلة المقدمة لا تحقق شرط الاستحقاق وفق النسخة والسياسة الحاكمة.',
              effectLabel: 'لم ينشأ التزام مالي جديد. القرار قابل للاستئناف ضمن المهلة الظاهرة.',
              decidedAtLabel: '19 سبتمبر 2026 · 9:30 ص',
              governingPolicyLabel: 'سياسة المطالبات v2026.09',
            },
            appealEligible: true,
          }
        : claim,
    );
  }

  if (scenario.flags?.claimUnderReview) {
    return mockClaims.map((claim) => ({
      ...claim,
      statusLabel: 'قيد المراجعة',
      deadlineLabel: 'الرد المتوقع قبل 25 سبتمبر',
      appealEligible: false,
    }));
  }

  return mockClaims;
}

export function getMockClaimForScenario(claimId: string, scenario: MockScenarioDefinition) {
  return getMockClaimsForScenario(scenario).find((claim) => claim.id === claimId);
}

export function getMockClaim(claimId: string) {
  return mockClaims.find((claim) => claim.id === claimId);
}
