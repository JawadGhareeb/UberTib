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
    id: 'booking-001',
    service: 'فحص الأسنان',
    provider: 'د. ليان منصور',
    providerImageUrl: 'https://i.pravatar.cc/240?img=47',
    branch: 'عيادة الشهباء لطب الأسنان',
    dateLabel: 'غداً',
    timeLabel: '10:30 ص',
    priceLabel: '250,000 ل.س',
    status: 'مؤكد',
  },
  activeCase: {
    id: 'case-001',
    title: 'علاج العصب — الضرس السفلي',
    provider: 'د. ليان منصور',
    stage: 'المرحلة 2 من 3',
    progress: 66,
    nextStep: 'جلسة استكمال العلاج',
    nextDateLabel: 'الأحد، 20 سبتمبر',
  },
  attention: [
    {
      id: 'attention-001',
      title: 'موعدك غداً',
      detail: 'فحص الأسنان · 10:30 ص',
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
      meta: 'اليوم · 11:20 ص',
    },
    {
      id: 'activity-002',
      kind: 'care-updated',
      title: 'تحديث المرحلة العلاجية',
      meta: 'أمس · 4:05 م',
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
  ],
} as const;

export type MockPatientWorld = typeof mockPatientWorld;
