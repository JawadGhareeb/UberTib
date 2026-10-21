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
        bookingId: 'booking-016',
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
        detail: 'تمت الموافقة على الخطة 2 وشروطها المالية حسب سجل الحالة.',
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
        detail: 'تم تسجيل دفعة نقدية في العيادة بقيمة 750 ل.س في سجل الحالة.',
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
    statusLabel: 'قيد العلاج',
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
        bookingId: 'booking-008',
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
        bookingId: 'booking-009',
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
  // Additional complete care journeys, each with stages, plans, linked visits, and timeline.
  {
    id: 'case-005',
    title: 'متابعة تسوس ضرس لطفلة',
    service: 'طب أسنان الأطفال',
    provider: 'د. ديمة نعيم',
    branch: 'عيادات الريان للأسنان',
    statusLabel: 'قيد العلاج',
    progress: 50,
    startedAtLabel: 'بدأت في 10 تشرين الأول 2026',
    nextAction: 'جلسة تقييم الترميم',
    nextDateLabel: 'الأحد 25 تشرين الأول · 10:00 ص',
    acceptedTotalLabel: '3,500 ل.س',
    planVersionLabel: 'الخطة 1',
    planAcceptedAtLabel: 'تمت الموافقة في 12 تشرين الأول 2026',
    stages: [
      {
        id: 'case-005-stage-1',
        title: 'فحص الأطفال',
        status: 'completed',
        statusLabel: 'مكتملة',
        dateLabel: '10 تشرين الأول',
        note: 'تمت مراجعة التسوس وتحديد الأسنان التي تحتاج متابعة.',
      },
      {
        id: 'case-005-stage-2',
        title: 'تقييم الحشوة',
        status: 'current',
        statusLabel: 'الحالية',
        dateLabel: '25 تشرين الأول',
        note: 'فحص تحمل الطفل واختيار الترميم المناسب.',
      },
      {
        id: 'case-005-stage-3',
        title: 'الحشوة والمتابعة',
        status: 'upcoming',
        statusLabel: 'قادمة',
        dateLabel: 'بعد تقييم الجلسة',
        note: 'لا يبدأ أي إجراء جديد قبل موافقة ولي الأمر.',
      },
    ],
    treatmentPlan: [
      {
        id: 'case-005-plan-1',
        title: 'الفحص والتقييم',
        quantityLabel: '1',
        priceLabel: '1,500 ل.س',
        statusLabel: 'ضمن الخطة المقبولة',
      },
      {
        id: 'case-005-plan-2',
        title: 'ترميم ضرس لبني',
        quantityLabel: '1',
        priceLabel: '2,000 ل.س',
        statusLabel: 'ضمن الخطة المقبولة',
      },
    ],
    followUps: [
      {
        id: 'case-005-followup-1',
        bookingId: 'booking-012',
        title: 'جلسة تقييم الحشوة',
        dateLabel: 'الأحد 25 تشرين الأول · 10:00 ص',
        statusLabel: 'محجوزة',
        state: 'scheduled',
        actionLabel: 'عرض الموعد',
        note: 'الحضور برفقة ولي الأمر ومراجعة تعليمات الطفل.',
      },
    ],
    timeline: [
      {
        id: 'case-005-event-1',
        title: 'فتح ملف الطفل',
        dateLabel: '10 تشرين الأول',
        detail: 'تم تسجيل طلب الرعاية من ولي الأمر.',
      },
      {
        id: 'case-005-event-2',
        title: 'اعتماد الخطة',
        dateLabel: '12 تشرين الأول',
        detail: 'تم اعتماد تكلفة الجلسات بعد شرح الخيارات.',
      },
    ],
  },
  {
    id: 'case-006',
    title: 'زرعة سن في الفك السفلي',
    service: 'زراعة الأسنان',
    provider: 'د. ماجد الحسن',
    branch: 'مركز نور الأسنان',
    statusLabel: 'بانتظار قبول الخطة',
    progress: 10,
    startedAtLabel: 'بدأت في 15 تشرين الأول 2026',
    nextAction: 'مراجعة الخطة المقترحة',
    nextDateLabel: 'الأربعاء 28 تشرين الأول · 9:00 ص',
    acceptedTotalLabel: '—',
    planVersionLabel: 'الخطة 1',
    planAcceptedAtLabel: 'بانتظار موافقة المريض',
    stages: [
      {
        id: 'case-006-stage-1',
        title: 'الاستشارة والصور',
        status: 'completed',
        statusLabel: 'مكتملة',
        dateLabel: '15 تشرين الأول',
        note: 'تم تقييم العظم ومراجعة صور الحالة.',
      },
      {
        id: 'case-006-stage-2',
        title: 'اعتماد الخطة',
        status: 'current',
        statusLabel: 'الحالية',
        dateLabel: 'بانتظار المريض',
        note: 'الخطة المقترحة ليست معتمدة حتى موافقة المريض.',
      },
      {
        id: 'case-006-stage-3',
        title: 'الزرع والتعافي',
        status: 'upcoming',
        statusLabel: 'قادمة',
        dateLabel: 'بعد قبول الخطة',
        note: 'لا يبدأ الإجراء قبل اعتماد التكاليف وموعد الجراحة.',
      },
    ],
    treatmentPlan: [
      {
        id: 'case-006-plan-1',
        title: 'غرسة سن واحدة',
        quantityLabel: '1',
        priceLabel: '18,000 ل.س',
        statusLabel: 'مقترح غير معتمد',
      },
      {
        id: 'case-006-plan-2',
        title: 'تركيب التاج',
        quantityLabel: '1',
        priceLabel: '5,500 ل.س',
        statusLabel: 'مقترح غير معتمد',
      },
    ],
    followUps: [
      {
        id: 'case-006-followup-1',
        title: 'موعد تقييم الزرعة',
        dateLabel: 'الأربعاء 28 تشرين الأول · 9:00 ص',
        statusLabel: 'لاحقاً',
        state: 'later',
        actionLabel: 'لا إجراء الآن',
        note: 'الوقت غير مؤكد حتى رد العيادة واعتماد الخطة.',
      },
    ],
    timeline: [
      {
        id: 'case-006-event-1',
        title: 'الفحص الأولي',
        dateLabel: '15 تشرين الأول',
        detail: 'الطبيب شرح البدائل العلاجية.',
      },
      {
        id: 'case-006-event-2',
        title: 'اقتراح خطة الزراعة',
        dateLabel: '17 تشرين الأول',
        detail: 'أُرسلت خطة مقترحة بقيمة 23,500 ل.س وتنتظر الموافقة.',
      },
    ],
  },
  {
    id: 'case-007',
    title: 'إعادة علاج عصب ضرس',
    service: 'إعادة علاج الجذور',
    provider: 'د. فادي مراد',
    branch: 'مركز الأعظمية الطبي',
    statusLabel: 'قيد العلاج',
    progress: 35,
    startedAtLabel: 'بدأت في 8 تشرين الأول 2026',
    nextAction: 'جلسة إعادة تنظيف القنوات',
    nextDateLabel: 'الثلاثاء 27 تشرين الأول · 2:00 م',
    acceptedTotalLabel: '3,200 ل.س',
    planVersionLabel: 'الخطة 1',
    planAcceptedAtLabel: 'تمت الموافقة في 9 تشرين الأول 2026',
    stages: [
      {
        id: 'case-007-stage-1',
        title: 'التشخيص والصور',
        status: 'completed',
        statusLabel: 'مكتملة',
        dateLabel: '8 تشرين الأول',
        note: 'تم تحديد سبب الحاجة إلى إعادة المعالجة.',
      },
      {
        id: 'case-007-stage-2',
        title: 'إعادة تنظيف القنوات',
        status: 'current',
        statusLabel: 'الحالية',
        dateLabel: '27 تشرين الأول',
        note: 'جلسة ثانية حسب تقدم الحالة.',
      },
      {
        id: 'case-007-stage-3',
        title: 'إغلاق القنوات والترميم',
        status: 'upcoming',
        statusLabel: 'قادمة',
        dateLabel: 'بعد الجلسة',
        note: 'يحدد الطبيب الحاجة لترميم إضافي بعد المعالجة.',
      },
    ],
    treatmentPlan: [
      {
        id: 'case-007-plan-1',
        title: 'إعادة علاج العصب',
        quantityLabel: '1',
        priceLabel: '2,600 ل.س',
        statusLabel: 'ضمن الخطة المقبولة',
      },
      {
        id: 'case-007-plan-2',
        title: 'ترميم مؤقت',
        quantityLabel: '1',
        priceLabel: '600 ل.س',
        statusLabel: 'ضمن الخطة المقبولة',
      },
    ],
    followUps: [
      {
        id: 'case-007-followup-1',
        bookingId: 'booking-013',
        title: 'استكمال العلاج',
        dateLabel: 'الثلاثاء 27 تشرين الأول · 2:00 م',
        statusLabel: 'محجوزة',
        state: 'scheduled',
        actionLabel: 'عرض الموعد',
        note: 'يُرجى إحضار صورة الأشعة السابقة.',
      },
    ],
    timeline: [
      {
        id: 'case-007-event-1',
        title: 'التشخيص',
        dateLabel: '8 تشرين الأول',
        detail: 'تم توثيق إعادة العلاج كإجراء مستقل.',
      },
      {
        id: 'case-007-event-2',
        title: 'قبول الشروط المالية',
        dateLabel: '9 تشرين الأول',
        detail: 'تم قبول نسخة الخطة المعروضة.',
      },
      {
        id: 'case-007-event-3',
        title: 'بدء إعادة المعالجة',
        dateLabel: '12 تشرين الأول',
        detail: 'تم فتح الحشوة القديمة وفق الخطة.',
      },
    ],
  },
  {
    id: 'case-008',
    title: 'تبييض الأسنان الاحترافي',
    service: 'تبييض الأسنان',
    provider: 'د. رشا ناصر',
    branch: 'عيادات الجميلية',
    statusLabel: 'مكتملة',
    progress: 100,
    startedAtLabel: 'بدأت في 9 آب 2026',
    nextAction: 'لا يوجد إجراء مطلوب',
    nextDateLabel: 'متابعة اختيارية بعد 6 أشهر',
    acceptedTotalLabel: '4,750 ل.س',
    planVersionLabel: 'الخطة 1',
    planAcceptedAtLabel: 'تمت الموافقة في 9 آب 2026',
    stages: [
      {
        id: 'case-008-stage-1',
        title: 'فحص الملاءمة',
        status: 'completed',
        statusLabel: 'مكتملة',
        dateLabel: '9 آب',
        note: 'تم التأكد من ملاءمة الحالة للتبييض.',
      },
      {
        id: 'case-008-stage-2',
        title: 'جلسة التبييض',
        status: 'completed',
        statusLabel: 'مكتملة',
        dateLabel: '12 آب',
        note: 'اكتملت الجلسة وتوثقت تعليمات ما بعدها.',
      },
    ],
    treatmentPlan: [
      {
        id: 'case-008-plan-1',
        title: 'جلسة تبييض احترافية',
        quantityLabel: '1',
        priceLabel: '4,750 ل.س',
        statusLabel: 'ضمن الخطة المقبولة',
      },
    ],
    followUps: [
      {
        id: 'case-008-followup-1',
        title: 'متابعة اختيارية',
        dateLabel: 'شباط 2027',
        statusLabel: 'لاحقاً',
        state: 'later',
        actionLabel: 'لا إجراء الآن',
        note: 'المراجعة اختيارية عند تغير درجة اللون.',
      },
    ],
    timeline: [
      {
        id: 'case-008-event-1',
        title: 'فحص قبل التبييض',
        dateLabel: '9 آب',
        detail: 'تأكدت ملاءمة اللثة والأسنان.',
      },
      {
        id: 'case-008-event-2',
        title: 'إكمال الجلسة',
        dateLabel: '12 آب',
        detail: 'تمت الجلسة دون إضافة بنود مالية.',
      },
    ],
  },
  {
    id: 'case-009',
    title: 'طقم أسنان جزئي',
    service: 'الأطقم السنية',
    provider: 'د. طارق شلبي',
    branch: 'عيادة الأندلس السنية',
    statusLabel: 'قيد العلاج',
    progress: 70,
    startedAtLabel: 'بدأت في 15 سبتمبر 2026',
    nextAction: 'تجربة الطقم وضبط الإطباق',
    nextDateLabel: 'الاثنين 26 تشرين الأول · 10:00 ص',
    acceptedTotalLabel: '8,700 ل.س',
    planVersionLabel: 'الخطة 1',
    planAcceptedAtLabel: 'تمت الموافقة في 16 سبتمبر 2026',
    stages: [
      {
        id: 'case-009-stage-1',
        title: 'القياس الأولي',
        status: 'completed',
        statusLabel: 'مكتملة',
        dateLabel: '15 سبتمبر',
        note: 'أُخذت القياسات الأولية للفك.',
      },
      {
        id: 'case-009-stage-2',
        title: 'التجربة الأولى',
        status: 'completed',
        statusLabel: 'مكتملة',
        dateLabel: '5 تشرين الأول',
        note: 'تمت تجربة الإطباق والمظهر.',
      },
      {
        id: 'case-009-stage-3',
        title: 'تجربة الطقم النهائي',
        status: 'current',
        statusLabel: 'الحالية',
        dateLabel: '26 تشرين الأول',
        note: 'التأكد من الراحة قبل التسليم.',
      },
      {
        id: 'case-009-stage-4',
        title: 'التسليم والمتابعة',
        status: 'upcoming',
        statusLabel: 'قادمة',
        dateLabel: 'بعد التجربة',
        note: 'يتم تسليم الطقم بعد موافقة المريض على الملاءمة.',
      },
    ],
    treatmentPlan: [
      {
        id: 'case-009-plan-1',
        title: 'طقم جزئي',
        quantityLabel: '1',
        priceLabel: '7,200 ل.س',
        statusLabel: 'ضمن الخطة المقبولة',
      },
      {
        id: 'case-009-plan-2',
        title: 'جلسات تعديل ومتابعة',
        quantityLabel: '1',
        priceLabel: '1,500 ل.س',
        statusLabel: 'ضمن الخطة المقبولة',
      },
    ],
    followUps: [
      {
        id: 'case-009-followup-1',
        bookingId: 'booking-022',
        title: 'تجربة الطقم',
        dateLabel: 'الاثنين 26 تشرين الأول · 10:00 ص',
        statusLabel: 'محجوزة',
        state: 'scheduled',
        actionLabel: 'عرض الموعد',
        note: 'إبلاغ الطبيب بأي ألم أو نقطة ضغط.',
      },
    ],
    timeline: [
      {
        id: 'case-009-event-1',
        title: 'أخذ القياسات',
        dateLabel: '15 سبتمبر',
        detail: 'بدأ تصنيع الطقم بعد فحص الفم.',
      },
      {
        id: 'case-009-event-2',
        title: 'تأكيد الخطة',
        dateLabel: '16 سبتمبر',
        detail: 'تمت الموافقة على النسخة الأولى.',
      },
      {
        id: 'case-009-event-3',
        title: 'التجربة الأولى',
        dateLabel: '5 تشرين الأول',
        detail: 'تطلب تعديل محدود في الإطباق.',
      },
    ],
  },
  {
    id: 'case-010',
    title: 'تعويض ثابت على زرعة',
    service: 'تركيبات الزرعات',
    provider: 'د. سلوى حيدر',
    branch: 'مركز النور الحديث',
    statusLabel: 'قيد العلاج',
    progress: 85,
    startedAtLabel: 'بدأت في 1 سبتمبر 2026',
    nextAction: 'تثبيت التعويض النهائي',
    nextDateLabel: 'الخميس 29 تشرين الأول · 10:00 ص',
    acceptedTotalLabel: '11,000 ل.س',
    planVersionLabel: 'الخطة 1',
    planAcceptedAtLabel: 'تمت الموافقة في 3 سبتمبر 2026',
    stages: [
      {
        id: 'case-010-stage-1',
        title: 'فحص سلامة الزرعة',
        status: 'completed',
        statusLabel: 'مكتملة',
        dateLabel: '1 سبتمبر',
        note: 'تم التأكد من استقرار الزرعة.',
      },
      {
        id: 'case-010-stage-2',
        title: 'أخذ المقاسات',
        status: 'completed',
        statusLabel: 'مكتملة',
        dateLabel: '15 سبتمبر',
        note: 'تم إرسال المقاسات إلى المختبر.',
      },
      {
        id: 'case-010-stage-3',
        title: 'تثبيت التعويض',
        status: 'current',
        statusLabel: 'الحالية',
        dateLabel: '29 تشرين الأول',
        note: 'تجربة التعويض وتثبيته في حال الملاءمة.',
      },
      {
        id: 'case-010-stage-4',
        title: 'المتابعة',
        status: 'upcoming',
        statusLabel: 'قادمة',
        dateLabel: 'بعد أسبوع',
        note: 'مراقبة اللثة والإطباق بعد التثبيت.',
      },
    ],
    treatmentPlan: [
      {
        id: 'case-010-plan-1',
        title: 'دعامة التعويض',
        quantityLabel: '1',
        priceLabel: '4,000 ل.س',
        statusLabel: 'ضمن الخطة المقبولة',
      },
      {
        id: 'case-010-plan-2',
        title: 'تاج على زرعة',
        quantityLabel: '1',
        priceLabel: '7,000 ل.س',
        statusLabel: 'ضمن الخطة المقبولة',
      },
    ],
    followUps: [
      {
        id: 'case-010-followup-1',
        bookingId: 'booking-021',
        title: 'تثبيت التعويض',
        dateLabel: 'الخميس 29 تشرين الأول · 10:00 ص',
        statusLabel: 'محجوزة',
        state: 'scheduled',
        actionLabel: 'عرض الموعد',
        note: 'يرجى الحضور قبل الموعد بعشر دقائق.',
      },
    ],
    timeline: [
      {
        id: 'case-010-event-1',
        title: 'بدء خطة التعويض',
        dateLabel: '1 سبتمبر',
        detail: 'تم توثيق حالة الزرعة.',
      },
      {
        id: 'case-010-event-2',
        title: 'اعتماد الشروط',
        dateLabel: '3 سبتمبر',
        detail: 'تم قبول التكلفة وخطة المتابعة.',
      },
      {
        id: 'case-010-event-3',
        title: 'إرسال القياسات',
        dateLabel: '15 سبتمبر',
        detail: 'سُجل التسليم للمختبر.',
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
        'case-005': '3025',
        'case-006': '3048',
        'case-007': '3056',
        'case-008': '2894',
        'case-009': '2987',
        'case-010': '3012',
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
