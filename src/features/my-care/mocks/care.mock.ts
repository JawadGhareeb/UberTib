import type { MockScenarioDefinition } from '@/shared/mock';

export type CareStageStatus = 'completed' | 'current' | 'upcoming';

export interface MockCareStage {
  id: string;
  title: string;
  status: CareStageStatus;
  statusLabel: string;
  dateLabel: string;
  note: string;
  correction?: {
    previousStatusLabel: string;
    reason: string;
    correctedAtLabel: string;
  };
}

export interface MockTreatmentPlanItem {
  id: string;
  title: string;
  quantityLabel: string;
  priceLabel: string;
  statusLabel: string;
}

export interface MockPlanAmendment {
  caseId: string;
  proposedVersionLabel: string;
  supersedesVersionLabel: string;
  previousAcceptedTotalLabel: string;
  proposedTotalLabel: string;
  priceDifferenceLabel: string;
  reason: string;
  changedItems: {
    id: string;
    title: string;
    change: string;
  }[];
}

export const mockPlanAmendment: MockPlanAmendment = {
  caseId: 'case-001',
  proposedVersionLabel: 'الخطة 3',
  supersedesVersionLabel: 'الخطة 2',
  previousAcceptedTotalLabel: '2,250 ل.س',
  proposedTotalLabel: '2,875 ل.س',
  priceDifferenceLabel: '+625 ل.س',
  reason: 'تم اقتراح تعديل على النسخة المقبولة بعد تقييم بنية السن وشرح خيارات الترميم للمريض.',
  changedItems: [
    {
      id: 'amendment-line-001',
      title: 'بناء قلب للضرس 46',
      change: 'إضافة بند جديد بقيمة 375 ل.س لدعم الترميم بعد تقييم بنية السن.',
    },
    {
      id: 'amendment-line-002',
      title: 'الترميم النهائي',
      change: 'تغيير المادة من كومبوزيت قياسي إلى ترميم خزفي مختبري بفرق 250 ل.س.',
    },
  ],
};

export interface MockFollowUp {
  id: string;
  bookingId?: string;
  title: string;
  dateLabel: string;
  statusLabel: string;
  actionLabel: string;
  note: string;
  state?: 'scheduled' | 'due' | 'overdue' | 'completed' | 'later';
}

export interface MockCareTimelineEvent {
  id: string;
  title: string;
  dateLabel: string;
  detail: string;
}

export interface MockCareCase {
  id: string;
  title: string;
  service: string;
  provider: string;
  branch: string;
  statusLabel: string;
  progress: number;
  startedAtLabel: string;
  nextAction: string;
  nextDateLabel: string;
  acceptedTotalLabel: string;
  planVersionLabel: string;
  planAcceptedAtLabel: string;
  stages: MockCareStage[];
  treatmentPlan: MockTreatmentPlanItem[];
  followUps: MockFollowUp[];
  timeline: MockCareTimelineEvent[];
}

export const mockCareCases: MockCareCase[] = [
  {
    id: 'case-001',
    title: '46 علاج جذور الضرس',
    service: 'علاج العصب',
    provider: 'د. ليان يوسف',
    branch: 'مركز نور الأسنان · الجميلية',
    statusLabel: 'قيد العلاج',
    progress: 66,
    startedAtLabel: 'بدأت في 7 سبتمبر 2026',
    nextAction: 'دليل مالي مطلوب قبل الإكمال',
    nextDateLabel: 'الأربعاء، 28 تشرين الأول · 4:00 م',
    acceptedTotalLabel: '2,250 ل.س',
    planVersionLabel: 'الخطة 2',
    planAcceptedAtLabel: 'تمت الموافقة في 8 سبتمبر 2026',
    stages: [
      {
        id: 'stage-assessment',
        title: 'الفحص والتشخيص',
        status: 'completed',
        statusLabel: 'مكتملة',
        dateLabel: '7 سبتمبر',
        note: 'تم تقييم السن وتأكيد الحاجة لعلاج العصب.',
      },
      {
        id: 'stage-root-canal',
        title: 'تنظيف وعلاج القنوات',
        status: 'current',
        statusLabel: 'الحالية',
        dateLabel: 'من 14 أيلول حتى 28 تشرين الأول',
        note: 'تمت الجلسة الأولى، والجلسة التالية لاستكمال تنظيف القنوات وإغلاقها.',
      },
      {
        id: 'stage-restoration',
        title: 'الترميم النهائي',
        status: 'upcoming',
        statusLabel: 'قادمة',
        dateLabel: 'بعد إكمال العلاج',
        note: 'تبدأ بعد إكمال مرحلة علاج القنوات وتقييم السن.',
      },
      {
        id: 'stage-followup-close',
        title: 'المتابعة وإغلاق الحالة',
        status: 'upcoming',
        statusLabel: 'قادمة',
        dateLabel: 'بعد الترميم النهائي',
        note: 'تُراجع الأدلة النهائية واستجابة السن بعد العلاج قبل إغلاق الحالة.',
      },
    ],
    treatmentPlan: [
      {
        id: 'plan-line-001',
        title: 'علاج عصب للضرس',
        quantityLabel: '1 سن',
        priceLabel: '1,750 ل.س',
        statusLabel: 'ضمن الخطة',
      },
      {
        id: 'plan-line-002',
        title: 'ترميم نهائي',
        quantityLabel: '1 سن',
        priceLabel: '500 ل.س',
        statusLabel: 'ضمن الخطة',
      },
    ],
    followUps: [
      {
        id: 'follow-up-001',
        // This root-canal visit has no linked booking fixture yet; booking-001
        // belongs to a different service and must never be opened from here.
        title: 'جلسة استكمال علاج العصب',
        dateLabel: 'الأربعاء، 28 تشرين الأول · 4:00 م',
        statusLabel: 'محجوزة',
        state: 'scheduled',
        actionLabel: 'عرض الموعد',
        note: 'تجنب المضغ القاسي على الجهة المعالجة حتى موعد الجلسة.',
      },
      {
        id: 'follow-up-002',
        title: 'متابعة بعد إكمال العلاج',
        dateLabel: 'بعد 14 يوماً من الإكمال',
        statusLabel: 'لاحقاً',
        state: 'later',
        actionLabel: 'لا إجراء الآن',
        note: 'تظهر للتأكد من استقرار الحالة بعد إكمال الخطة.',
      },
    ],
    timeline: [
      {
        id: 'event-001',
        title: 'تقييم أولي مساعد',
        dateLabel: '7 سبتمبر',
        detail: 'الملخص الأولي لا يُعد تشخيصاً نهائياً؛ ينتظر الفحص السريري.',
      },
      {
        id: 'event-002',
        title: 'استجابة المركز والموعد',
        dateLabel: '7 سبتمبر',
        detail: 'قبل المركز الحالة وتم تسجيل الموعد في سجل الزيارة.',
      },
      {
        id: 'event-003',
        title: 'تشخيص الطبيب بعد الفحص',
        dateLabel: '8 سبتمبر',
        detail: 'التهاب لبي غير عكوس بالضرس 46؛ سُجّل التشخيص في ملف الحالة.',
      },
      {
        id: 'event-004',
        title: 'قبول الخطة والشروط',
        dateLabel: '8 سبتمبر',
        detail: 'تمت الموافقة على الخطة 2 وشروطها المالية وفق السجل التجريبي.',
      },
      {
        id: 'event-005',
        title: 'المرحلة الأولى والأدلة',
        dateLabel: '14 سبتمبر',
        detail: 'انتهت الجلسة الأولى؛ ما زالت الأشعة النهائية مطلوبة للإكمال.',
      },
      {
        id: 'event-006',
        title: 'دفعة خارجية مسجلة',
        dateLabel: '14 سبتمبر',
        detail: 'تم تسجيل دفعة نقدية في العيادة بقيمة 750 ل.س في السجل التجريبي.',
      },
      {
        id: 'event-007',
        title: 'متابعة مستحقة',
        dateLabel: '20 سبتمبر',
        detail: 'تذكير بموعد المتابعة مع حفظ سجل الزيارة.',
      },
    ],
  },
  {
    id: 'case-002',
    title: 'ترميم حشوة خلفية',
    service: 'حشوات الأسنان',
    provider: 'د. عمر الأحمد',
    branch: 'مركز الفرقان التخصصي',
    statusLabel: 'مكتملة',
    progress: 100,
    startedAtLabel: 'بدأت في 22 أغسطس 2026',
    nextAction: 'لا يوجد إجراء مطلوب',
    nextDateLabel: 'المتابعة الدورية بعد 6 أشهر',
    acceptedTotalLabel: '2,500 ل.س',
    planVersionLabel: 'الخطة 1',
    planAcceptedAtLabel: 'تمت الموافقة في 22 أغسطس 2026',
    stages: [
      {
        id: 'stage-filling-assessment',
        title: 'الفحص والتحضير',
        status: 'completed',
        statusLabel: 'مكتملة',
        dateLabel: '22 أغسطس',
        note: 'تم تقييم السن وتحضيره للترميم.',
      },
      {
        id: 'stage-filling',
        title: 'الترميم النهائي',
        status: 'completed',
        statusLabel: 'مكتملة',
        dateLabel: '24 أغسطس',
        note: 'تم إكمال الحشوة وفحص الإطباق.',
      },
    ],
    treatmentPlan: [
      {
        id: 'plan-line-filling',
        title: 'حشوة تجميلية',
        quantityLabel: '1 سن',
        priceLabel: '2,500 ل.س',
        statusLabel: 'مكتملة',
      },
    ],
    followUps: [
      {
        id: 'follow-up-filling',
        title: 'متابعة دورية',
        dateLabel: 'فبراير 2027',
        statusLabel: 'لاحقاً',
        state: 'later',
        actionLabel: 'لا إجراء الآن',
        note: 'متابعة روتينية ضمن الزيارة الدورية القادمة.',
      },
    ],
    timeline: [
      {
        id: 'event-filling-001',
        title: 'بدء الحالة',
        dateLabel: '22 أغسطس',
        detail: 'تم توثيق الحاجة للترميم بعد الفحص.',
      },
      {
        id: 'event-filling-002',
        title: 'إكمال العلاج',
        dateLabel: '24 أغسطس',
        detail: 'اكتمل الترميم النهائي وأغلقت الحالة.',
      },
    ],
  },
  {
    id: 'case-003',
    title: 'تنظيف وعلاج اللثة',
    service: 'علاج اللثة',
    provider: 'د. رنا الخطيب',
    branch: 'مركز الحمدانية لطب الأسنان',
    statusLabel: 'قيد المتابعة',
    progress: 40,
    startedAtLabel: 'بدأت في 12 سبتمبر 2026',
    nextAction: 'جلسة تنظيف عميق للجهة اليسرى',
    nextDateLabel: 'الخميس، 29 تشرين الأول · 5:00 م',
    acceptedTotalLabel: '3,500 ل.س',
    planVersionLabel: 'الخطة 1',
    planAcceptedAtLabel: 'تمت الموافقة في 12 سبتمبر 2026',
    stages: [
      {
        id: 'stage-gum-assessment',
        title: 'فحص اللثة',
        status: 'completed',
        statusLabel: 'مكتملة',
        dateLabel: '12 سبتمبر',
        note: 'تم تقييم حالة اللثة وتحديد مناطق الالتهاب.',
      },
      {
        id: 'stage-deep-cleaning',
        title: 'التنظيف العميق',
        status: 'current',
        statusLabel: 'الحالية',
        dateLabel: 'من 18 أيلول حتى 29 تشرين الأول',
        note: 'بدأ تنظيف الجهة اليمنى، والجلسة القادمة لاستكمال الجهة اليسرى.',
      },
      {
        id: 'stage-gum-review',
        title: 'إعادة التقييم',
        status: 'upcoming',
        statusLabel: 'قادمة',
        dateLabel: 'بعد أسبوعين',
        note: 'إعادة فحص استجابة اللثة بعد إكمال جلسات التنظيف.',
      },
    ],
    treatmentPlan: [
      {
        id: 'plan-gum-001',
        title: 'تنظيف عميق للثة',
        quantityLabel: 'جلستان',
        priceLabel: '3,000 ل.س',
        statusLabel: 'ضمن الخطة',
      },
      {
        id: 'plan-gum-002',
        title: 'جلسة متابعة',
        quantityLabel: '1 جلسة',
        priceLabel: '500 ل.س',
        statusLabel: 'ضمن الخطة',
      },
    ],
    followUps: [
      {
        id: 'follow-up-gum-001',
        title: 'استكمال التنظيف العميق',
        dateLabel: 'الخميس، 29 تشرين الأول · 5:00 م',
        statusLabel: 'قادمة',
        state: 'scheduled',
        actionLabel: 'عرض التفاصيل',
        note: 'الاستمرار بالتنظيف المنزلي اللطيف حتى موعد الجلسة.',
      },
    ],
    timeline: [
      {
        id: 'event-gum-001',
        title: 'بدء خطة علاج اللثة',
        dateLabel: '12 سبتمبر',
        detail: 'تم اعتماد خطة العلاج بعد فحص اللثة.',
      },
      {
        id: 'event-gum-002',
        title: 'إكمال الجلسة الأولى',
        dateLabel: '18 سبتمبر',
        detail: 'تم تنظيف الجهة اليمنى وتسجيل استجابة جيدة.',
      },
    ],
  },
  {
    id: 'case-004',
    title: 'ترميم وتاج',
    service: 'التركيبات السنية',
    provider: 'د. نور الحسن',
    branch: 'مركز نور الأسنان · الجميلية',
    statusLabel: 'مكتملة',
    progress: 100,
    startedAtLabel: 'بدأت في 2 سبتمبر 2026',
    nextAction: 'متاحة لتقييم التجربة',
    nextDateLabel: 'اكتملت 20 سبتمبر 2026',
    acceptedTotalLabel: '9,000 ل.س',
    planVersionLabel: 'الخطة 1',
    planAcceptedAtLabel: 'تمت الموافقة في 2 سبتمبر 2026',
    stages: [
      {
        id: 'stage-crown-prep',
        title: 'تحضير السن',
        status: 'completed',
        statusLabel: 'مكتملة',
        dateLabel: '2 سبتمبر',
        note: 'تم تحضير السن وأخذ القياسات.',
      },
      {
        id: 'stage-crown-temp',
        title: 'التاج المؤقت',
        status: 'completed',
        statusLabel: 'مكتملة',
        dateLabel: '2 سبتمبر',
        note: 'تم تركيب تاج مؤقت لحين تجهيز التاج النهائي.',
      },
      {
        id: 'stage-crown-lab',
        title: 'تجهيز التاج',
        status: 'completed',
        statusLabel: 'مكتملة',
        dateLabel: '17 سبتمبر',
        note: 'وصل التاج النهائي من المختبر وتمت مراجعته.',
      },
      {
        id: 'stage-crown-fit',
        title: 'التثبيت النهائي',
        status: 'completed',
        statusLabel: 'مكتملة',
        dateLabel: '20 سبتمبر',
        note: 'تم تثبيت التاج وفحص الإطباق وأغلقت الحالة.',
      },
    ],
    treatmentPlan: [
      {
        id: 'plan-crown-001',
        title: 'تاج خزفي',
        quantityLabel: '1 تاج',
        priceLabel: '9,000 ل.س',
        statusLabel: 'ضمن الخطة',
      },
    ],
    followUps: [
      {
        id: 'follow-up-crown-001',
        title: 'تثبيت التاج النهائي',
        dateLabel: '20 سبتمبر · زيارة مكتملة',
        statusLabel: 'مكتملة',
        state: 'completed',
        actionLabel: 'لا إجراء مطلوب',
        note: 'تمت متابعة التثبيت وإغلاق العلاج.',
      },
    ],
    timeline: [
      {
        id: 'event-crown-001',
        title: 'تحضير السن وأخذ القياس',
        dateLabel: '2 سبتمبر',
        detail: 'تم تحضير السن وإرسال القياسات للمختبر.',
      },
      {
        id: 'event-crown-002',
        title: 'اكتملت زيارة التاج النهائي',
        dateLabel: '20 سبتمبر',
        detail: 'تم تثبيت التاج النهائي وتوثيق إكمال الحالة.',
      },
    ],
  },
];

/** Patient-visible reference numbers for development cases (never show internal IDs). */
export function getMockCareReferenceLabel(caseId: string): string {
  return (
    (
      {
        'case-001': '2841',
        'case-002': '2705',
        'case-003': '2910',
        'case-004': '2764',
      } as Record<string, string>
    )[caseId] ?? '—'
  );
}

export function getMockCareCase(caseId: string): MockCareCase | undefined {
  return mockCareCases.find((item) => item.id === caseId);
}

export function getMockCareCaseForScenario(
  caseId: string,
  scenario: MockScenarioDefinition,
): MockCareCase | undefined {
  const careCase = getMockCareCase(caseId);

  if (!careCase) {
    return undefined;
  }

  if (scenario.flags?.carePlanAmendmentAccepted && caseId === 'case-001') {
    return {
      ...careCase,
      acceptedTotalLabel: mockPlanAmendment.proposedTotalLabel,
      planVersionLabel: mockPlanAmendment.proposedVersionLabel,
      planAcceptedAtLabel: 'تمت الموافقة في 20 سبتمبر 2026',
      treatmentPlan: careCase.treatmentPlan.map((item) =>
        item.id === 'plan-line-002'
          ? {
              ...item,
              title: 'ترميم نهائي مدعّم',
              priceLabel: '1,125 ل.س',
              statusLabel: 'ضمن الخطة المقبولة',
            }
          : item,
      ),
      timeline: [
        ...careCase.timeline,
        {
          id: 'event-amendment-accepted',
          title: 'تم اعتماد تعديل الخطة',
          dateLabel: '20 سبتمبر · 11:40 ص',
          detail:
            'تمت ترقية الخطة 3 إلى النسخة الحاكمة بعد وصول تأكيد الموافقة، وبقيت الخطة 2 محفوظة كسجل تاريخي.',
        },
      ],
    };
  }

  if (scenario.flags?.careStageReopened && caseId === 'case-001') {
    return {
      ...careCase,
      stages: careCase.stages.map((stage) =>
        stage.id === 'stage-assessment'
          ? {
              ...stage,
              status: 'current',
              statusLabel: 'أُعيد فتحها للتصحيح',
              dateLabel: 'أعيد فتحها في 20 سبتمبر',
              note: 'تمت إعادة فتح المرحلة لتصحيح توثيق التشخيص قبل متابعة الخطة. الحدث السابق بقي محفوظاً في السجل.',
              correction: {
                previousStatusLabel: 'كانت مكتملة',
                reason:
                  'وردت ملاحظة سريرية موثقة تتطلب تصحيح تفاصيل التشخيص، لذلك أعيد فتح المرحلة بدلاً من تعديل السجل السابق بصمت.',
                correctedAtLabel: '20 سبتمبر 2026 · 9:10 ص',
              },
            }
          : stage,
      ),
    };
  }

  if (
    (scenario.flags?.followUpDue ||
      scenario.flags?.followUpOverdue ||
      scenario.flags?.followUpCompleted) &&
    caseId === 'case-001'
  ) {
    return {
      ...careCase,
      followUps: careCase.followUps.map((followUp, index) => {
        if (index !== 0) {
          return followUp;
        }

        if (scenario.flags?.followUpCompleted) {
          return {
            ...followUp,
            state: 'completed',
            statusLabel: 'مكتملة',
            actionLabel: 'عرض السجل',
            note: 'تم تسجيل تنفيذ المتابعة في 20 سبتمبر ولم يعد هناك إجراء مطلوب للمريض.',
          };
        }

        if (scenario.flags?.followUpOverdue) {
          return {
            ...followUp,
            bookingId: undefined,
            state: 'overdue',
            statusLabel: 'متأخرة',
            dateLabel: 'كان موعدها 18 سبتمبر',
            actionLabel: 'احجز المتابعة',
            note: 'موعد المتابعة المستحق مرّ بدون تسجيل إكمال. المتابعة ما زالت مطلوبة حتى يتم حجزها أو إغلاقها بمعلومة authoritative.',
          };
        }

        return {
          ...followUp,
          bookingId: undefined,
          state: 'due',
          statusLabel: 'مستحقة الآن',
          dateLabel: 'مستحقة اليوم',
          actionLabel: 'احجز المتابعة',
          note: 'المتابعة أصبحت مستحقة حسب الخطة، وتظل ظاهرة هنا حتى لو لم يصل أي إشعار خارجي.',
        };
      }),
    };
  }

  return careCase;
}
