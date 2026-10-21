import type { MockScenarioDefinition } from '@/shared/mock';

export const mockDependents = [
  {
    id: 'patient-001',
    name: 'أحمد خالد',
    relation: 'حسابي',
    initials: 'أخ',
    statusLabel: 'المريض النشط',
    active: true,
  },
  {
    id: 'patient-002',
    name: 'سارة خالد',
    relation: 'ابنتي',
    initials: 'سخ',
    statusLabel: 'تم التحقق من العلاقة',
    active: false,
  },
  {
    id: 'patient-003',
    name: 'ليلى خالد',
    relation: 'زوجتي',
    initials: 'لخ',
    statusLabel: 'تم التحقق من العلاقة',
    active: false,
  },
  {
    id: 'patient-004',
    name: 'خالد خالد',
    relation: 'والدي',
    initials: 'خخ',
    statusLabel: 'تم التحقق من العلاقة',
    active: false,
  },
  // ريم ما زالت بطلب إضافة قيد التحقق، فلا تدخل قائمة المرضى القابلين للتفويض.
] as const;

export const mockGrants = [
  {
    id: 'grant-001',
    subjectPatientId: 'patient-002',
    subjectName: 'سارة خالد',
    granteeName: 'أحمد خالد',
    statusLabel: 'فعال',
    purpose: 'إدارة المواعيد ومتابعة الرعاية',
    actions: ['عرض المواعيد', 'إدارة الحجوزات', 'عرض ملخص الرعاية'],
    dataScope: 'بيانات المواعيد وملخص الرعاية',
    effectiveLabel: 'من 1 سبتمبر 2026 حتى 1 مارس 2027',
    basisLabel: 'تفويض موثّق بعد التحقق',
    directionLabel: 'أدير نيابة عنها',
  },
  {
    id: 'grant-002',
    subjectPatientId: 'patient-001',
    subjectName: 'أحمد خالد',
    granteeName: 'ليلى خالد',
    statusLabel: 'منتهي',
    purpose: 'متابعة موعد سابق',
    actions: ['عرض الموعد'],
    dataScope: 'الموعد المحدد فقط',
    effectiveLabel: 'من 1 أغسطس حتى 31 أغسطس 2026',
    basisLabel: 'تفويض مؤقت',
    directionLabel: 'منحتها تفويضاً',
  },
  {
    id: 'grant-003',
    subjectPatientId: 'patient-001',
    subjectName: 'أحمد خالد',
    granteeName: 'مها خالد',
    statusLabel: 'فعال',
    purpose: 'إدارة الحجوزات خلال فترة العلاج',
    actions: ['عرض المواعيد', 'إدارة الحجوزات'],
    dataScope: 'المواعيد والحجوزات فقط',
    effectiveLabel: 'من 20 سبتمبر 2026 حتى 20 ديسمبر 2026',
    basisLabel: 'تفويض مباشر من صاحب الحساب',
    directionLabel: 'منحتها تفويضاً',
  },
  {
    id: 'grant-004',
    subjectPatientId: 'patient-004',
    subjectName: 'خالد خالد',
    granteeName: 'أحمد خالد',
    statusLabel: 'فعال',
    purpose: 'تنسيق زيارات متابعة والدي',
    actions: ['عرض المواعيد', 'إدارة الحجوزات'],
    dataScope: 'المواعيد فقط',
    effectiveLabel: 'من 10 أكتوبر 2026 حتى 10 أبريل 2027',
    basisLabel: 'تفويض بعد التحقق من العلاقة',
    directionLabel: 'أدير نيابة عنه',
  },
  {
    id: 'grant-005',
    subjectPatientId: 'patient-003',
    subjectName: 'ليلى خالد',
    granteeName: 'أحمد خالد',
    statusLabel: 'قيد التحقق',
    purpose: 'متابعة حجوزات الأسرة',
    actions: ['عرض المواعيد', 'إدارة الحجوزات'],
    dataScope: 'تفاصيل المواعيد دون الملف الصحي',
    effectiveLabel: 'يبدأ بعد اكتمال التحقق',
    basisLabel: 'طلب تفويض غير معتمد',
    directionLabel: 'أدير نيابة عنها',
  },
] as const;

export const mockPendingSubmissions = [
  {
    id: 'pending-dependent-001',
    title: 'طلب إضافة سارة خالد',
    typeLabel: 'إضافة تابع',
    statusLabel: 'قيد التحقق',
    submittedAtLabel: '17 سبتمبر · 3:20 م',
    detail: 'تم استلام الطلب والأدلة، والنتيجة ستظهر هنا بعد المراجعة.',
  },
  {
    id: 'pending-grant-001',
    title: 'تحديث نطاق تفويض',
    typeLabel: 'تفويض',
    statusLabel: 'تمت المعالجة',
    submittedAtLabel: '16 سبتمبر · 11:15 ص',
    detail: 'تم تحديث النطاق بنجاح وأصبح التفويض الحالي هو المرجع.',
  },
  {
    id: 'pending-dependent-002',
    title: 'طلب إضافة ريم خالد',
    typeLabel: 'إضافة تابع',
    statusLabel: 'قيد التحقق',
    submittedAtLabel: '19 تشرين الأول · 1:10 م',
    detail: 'بانتظار التحقق من العلاقة قبل السماح بالوصول إلى معلوماتها الصحية.',
  },
  {
    id: 'pending-grant-002',
    title: 'تفويض متابعة ليلى خالد',
    typeLabel: 'تفويض',
    statusLabel: 'قيد التحقق',
    submittedAtLabel: '18 تشرين الأول · 4:30 م',
    detail: 'لم يُمنح الوصول بعد؛ لا يظهر الملف الصحي إلا بعد استكمال التفويض.',
  },
  {
    id: 'pending-grant-003',
    title: 'طلب إلغاء تفويض سابق',
    typeLabel: 'تفويض',
    statusLabel: 'تمت المعالجة',
    submittedAtLabel: '12 تشرين الأول · 10:00 ص',
    detail: 'أُغلق طلب الإلغاء، ولا يستمر الوصول بالتفويض المنتهي.',
  },
] as const;

export function getMockGrantsForScenario(scenario: MockScenarioDefinition) {
  if (!scenario.flags?.representationPending) {
    return mockGrants;
  }

  return mockGrants.map((grant, index) =>
    index === 0
      ? {
          ...grant,
          statusLabel: 'قيد التحقق',
          effectiveLabel: 'يبدأ بعد اكتمال التحقق',
          basisLabel: 'طلب تفويض قيد المراجعة',
        }
      : grant,
  );
}

export function getMockGrantForScenario(grantId: string, scenario: MockScenarioDefinition) {
  return getMockGrantsForScenario(scenario).find((grant) => grant.id === grantId);
}

export function getMockPendingSubmissionsForScenario(scenario: MockScenarioDefinition) {
  if (!scenario.flags?.representationPending) {
    return mockPendingSubmissions;
  }

  return mockPendingSubmissions.map((submission, index) =>
    index === 1
      ? {
          ...submission,
          statusLabel: 'قيد التحقق',
          detail: 'تم استلام تحديث نطاق التفويض، وما زالت المراجعة جارية قبل اعتماده.',
        }
      : submission,
  );
}

export function getMockGrant(grantId: string) {
  return mockGrants.find((grant) => grant.id === grantId);
}
