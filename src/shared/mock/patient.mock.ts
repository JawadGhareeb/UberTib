export const mockPatientWorld = {
  account: {
    id: 'acct-patient-001',
    name: 'أحمد خالد',
    initials: 'أخ',
    phone: '+963 944 123 456',
    city: 'حلب',
    activePatientName: 'أحمد خالد',
  },
  nextAppointment: {
    id: 'booking-006',
    service: 'علاج الجذور',
    provider: 'د. كريم حمدان',
    providerImageUrl: 'https://i.pravatar.cc/240?img=20',
    branch: 'عيادات الشفاء',
    dateLabel: 'الخميس 22 تشرين الأول 2026',
    timeLabel: '10:30 ص',
    priceLabel: '750 ل.س',
    status: 'مؤكد',
  },
  activeCase: {
    id: 'case-001',
    title: '46 علاج جذور الضرس',
    provider: 'د. ليان يوسف',
    stage: 'تنظيف وعلاج القنوات',
    progress: 66,
    nextStep: 'دليل مالي مطلوب قبل الإكمال',
    nextDateLabel: 'الأربعاء، 28 تشرين الأول',
  },
  attention: [
    {
      id: 'attention-001',
      title: 'موعدك القادم',
      detail: 'علاج الجذور · 22 تشرين الأول · 10:30 ص',
      tone: 'info' as const,
    },
    {
      id: 'attention-002',
      title: 'متابعة علاج مستحقة',
      detail: 'راجع تعليمات الجلسة القادمة قبل الموعد.',
      tone: 'warning' as const,
    },
  ],
  activity: [
    {
      id: 'activity-001',
      kind: 'booking-confirmed',
      title: 'تم تأكيد موعد فحص الأسنان',
      meta: '18 تشرين الأول · 11:20 ص',
    },
    {
      id: 'activity-002',
      kind: 'care-updated',
      title: 'تحديث المرحلة العلاجية',
      meta: '14 أيلول · 4:05 م',
    },
    {
      id: 'activity-003',
      kind: 'follow-up-added',
      title: 'تمت إضافة متابعة جديدة',
      meta: '16 سبتمبر',
    },
  ],
  family: [
    {
      id: 'patient-001',
      name: 'أحمد خالد',
      relation: 'حسابي',
      initials: 'أخ',
      active: true,
    },
    {
      id: 'patient-002',
      name: 'سارة خالد',
      relation: 'ابنتي',
      initials: 'سخ',
      active: false,
    },
    { id: 'patient-003', name: 'ليلى خالد', relation: 'زوجتي', initials: 'لخ', active: false },
    { id: 'patient-004', name: 'خالد خالد', relation: 'والدي', initials: 'خخ', active: false },
  ],
} as const;

export type MockPatientWorld = typeof mockPatientWorld;
