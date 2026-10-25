export interface MockProviderAvailability {
  dateKey: string;
  dateLabel: string;
  slots: string[];
}

/** Only non-past mock day choices can be used to enter an appointment request.
 * This is NOT a live-availability confirmation. The backend rechecks exact slots.
 */
export function getNonPastMockAvailability(
  availability: readonly MockProviderAvailability[],
  now: Date = new Date(),
): MockProviderAvailability[] {
  const dayKey = [
    String(now.getFullYear()),
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getDate()).padStart(2, '0'),
  ].join('-');
  return availability
    .filter(
      (day) =>
        /^\\d{4}-\\d{2}-\\d{2}$/.test(day.dateKey) && day.dateKey >= dayKey && day.slots.length > 0,
    )
    .sort((a, b) => a.dateKey.localeCompare(b.dateKey));
}

export type MockProviderPriceMode = 'fixed' | 'range' | 'free' | 'requires-plan';

export interface MockProviderPriceFact {
  mode: MockProviderPriceMode;
  amount?: number;
  amount_min?: number;
  amount_max?: number;
  currency: 'SYP';
  displayLabel: string;
  includesSummary?: string;
  extraCostSummary?: string;
}

export interface MockProvider {
  id: string;
  name: string;
  initials: string;
  imageUrl: string;
  specialty: string;
  branch: string;
  area: string;
  rating: number;
  reviews: number;
  experienceYears: number;
  nextAvailable: string;
  assessmentFreshnessLabel: string;
  protectionLabel: string;
  protectionActive: boolean;
  serviceCodes: string[];
  prices: Record<string, MockProviderPriceFact>;
  availability: MockProviderAvailability[];
}

const fixedPrice = (
  amount: number,
  displayLabel: string,
  includesSummary?: string,
  extraCostSummary?: string,
): MockProviderPriceFact => ({
  mode: 'fixed',
  amount,
  currency: 'SYP',
  displayLabel,
  includesSummary,
  extraCostSummary,
});

const rangePrice = (
  amountMin: number,
  amountMax: number,
  displayLabel: string,
  includesSummary?: string,
  extraCostSummary?: string,
): MockProviderPriceFact => ({
  mode: 'range',
  amount_min: amountMin,
  amount_max: amountMax,
  currency: 'SYP',
  displayLabel,
  includesSummary,
  extraCostSummary,
});

const freePrice = (includesSummary?: string): MockProviderPriceFact => ({
  mode: 'free',
  amount: 0,
  currency: 'SYP',
  displayLabel: 'مجاني',
  includesSummary,
});

export const mockAreas = [
  'كل المناطق',
  'الجميلية',
  'الفرقان',
  'الشهباء',
  'الأعظمية',
  'الحمدانية',
] as const;

export const mockProviders: MockProvider[] = [
  {
    id: 'provider-layan',
    name: 'د. ليان يوسف',
    initials: 'لي',
    imageUrl: 'https://i.pravatar.cc/240?img=47',
    specialty: 'اختصاص علاج الجذور والترميم',
    branch: 'مركز نور الأسنان',
    area: 'الجميلية',
    rating: 4.8,
    reviews: 124,
    experienceYears: 9,
    nextAvailable: 'السبت 24 تشرين الأول · 10:00 ص',
    assessmentFreshnessLabel: 'تم التحقق من الأهلية في 18 تشرين الأول 2026',
    protectionLabel: 'مستوى حماية تجريبي مشروط بالخدمة',
    protectionActive: true,
    serviceCodes: ['dental-checkup', 'dental-cleaning', 'dental-filling', 'root-canal'],
    prices: {
      'dental-checkup': fixedPrice(
        1250,
        '1,250 ل.س',
        'يشمل الفحص السريري الأولي لهذه الزيارة.',
        'أي تصوير أو إجراء علاجي لاحق يسعّر كبند منفصل إذا لزم.',
      ),
      'dental-cleaning': fixedPrice(1900, '1,900 ل.س', 'يشمل جلسة تنظيف الأسنان القياسية.'),
      'dental-filling': rangePrice(
        2250,
        2600,
        '2,250–2,600 ل.س',
        'النطاق يعتمد على نوع وموقع الحشوة.',
        'أي علاج إضافي بعد الفحص غير داخل هذا النطاق.',
      ),
      'root-canal': rangePrice(
        600,
        900,
        '600–900 ل.س',
        'النطاق التقريبي المعروض لعلاج الجذور في النموذج.',
        'السعر النهائي والتصوير والترميم يحددها الطبيب بعد التقييم.',
      ),
    },
    availability: [
      {
        dateKey: '2026-10-24',
        dateLabel: 'السبت 24 تشرين الأول',
        slots: ['10:00 ص', '10:30 ص', '11:30 ص', '5:30 م'],
      },
      {
        dateKey: '2026-10-25',
        dateLabel: 'الأحد 25 تشرين الأول',
        slots: ['9:30 ص', '12:00 م', '4:00 م'],
      },
      {
        dateKey: '2026-10-26',
        dateLabel: 'الاثنين 26 تشرين الأول',
        slots: ['10:30 ص', '2:00 م', '6:00 م'],
      },
    ],
  },
  {
    id: 'provider-omar',
    name: 'د. عمر الأحمد',
    initials: 'عا',
    imageUrl: 'https://i.pravatar.cc/240?img=12',
    specialty: 'علاج جذور الأسنان',
    branch: 'مركز الفرقان التخصصي',
    area: 'الفرقان',
    rating: 4.8,
    reviews: 94,
    experienceYears: 11,
    nextAvailable: 'السبت 24 تشرين الأول · 11:00 ص',
    assessmentFreshnessLabel: 'تم التحقق من الأهلية في 18 تشرين الأول 2026',
    protectionLabel: 'الحماية الممولة غير مفعلة لهذه الخدمة',
    protectionActive: false,
    serviceCodes: ['dental-checkup', 'dental-filling'],
    prices: {
      'dental-checkup': fixedPrice(1400, '1,400 ل.س', 'يشمل الفحص والتقييم الأولي.'),
      'dental-filling': fixedPrice(2500, '2,500 ل.س', 'يشمل حشوة قياسية واحدة.'),
    },
    availability: [
      {
        dateKey: '2026-10-24',
        dateLabel: 'السبت 24 تشرين الأول',
        slots: ['11:00 ص', '1:30 م', '6:30 م'],
      },
      {
        dateKey: '2026-10-26',
        dateLabel: 'الاثنين 26 تشرين الأول',
        slots: ['9:00 ص', '11:00 ص', '3:30 م'],
      },
    ],
  },
  {
    id: 'provider-karim',
    name: 'د. كريم حمدان',
    initials: 'كح',
    imageUrl: 'https://i.pravatar.cc/240?img=20',
    specialty: 'علاج الجذور',
    branch: 'عيادات الشفاء',
    area: 'الجميلية',
    rating: 4.7,
    reviews: 89,
    experienceYears: 10,
    nextAvailable: 'الخميس 10:30',
    assessmentFreshnessLabel: 'معلومات مهنية للتجربة · تتطلب تأكيداً',
    protectionLabel: 'مستوى حماية تجريبي مشروط بالخدمة',
    protectionActive: true,
    serviceCodes: ['root-canal'],
    prices: {
      'root-canal': fixedPrice(
        750,
        '750 ل.س',
        'السعر التوضيحي لعلاج الجذور في النموذج.',
        'قد تتغير البنود والتكلفة بعد الفحص.',
      ),
    },
    availability: [
      {
        dateKey: '2026-10-22',
        dateLabel: 'الخميس 22 تشرين الأول',
        slots: ['10:30 ص', '12:00 م'],
      },
    ],
  },
  {
    id: 'provider-rama',
    name: 'د. راما بركات',
    initials: 'رب',
    imageUrl: 'https://i.pravatar.cc/240?img=45',
    specialty: 'عناية وقائية وتجميلية',
    branch: 'عيادات الجميلية',
    area: 'الجميلية',
    rating: 4.7,
    reviews: 76,
    experienceYears: 6,
    nextAvailable: 'السبت 24 تشرين الأول · 9:00 ص',
    assessmentFreshnessLabel: 'تم التحقق من الأهلية في 17 تشرين الأول 2026',
    protectionLabel: 'مستوى حماية تجريبي مشروط بالخدمة',
    protectionActive: true,
    serviceCodes: ['dental-checkup', 'dental-cleaning', 'teeth-whitening'],
    prices: {
      'dental-checkup': freePrice('يشمل استشارة فحص أولية فقط.'),
      'dental-cleaning': fixedPrice(1750, '1,750 ل.س', 'يشمل جلسة تنظيف قياسية.'),
      'teeth-whitening': fixedPrice(
        4750,
        '4,750 ل.س',
        'يشمل جلسة التبييض المسجلة.',
        'أي علاج تمهيدي مطلوب قبل التبييض يسعّر منفصلاً.',
      ),
    },
    availability: [
      {
        dateKey: '2026-10-24',
        dateLabel: 'السبت 24 تشرين الأول',
        slots: ['9:00 ص', '12:30 م', '4:30 م'],
      },
      {
        dateKey: '2026-10-25',
        dateLabel: 'الأحد 25 تشرين الأول',
        slots: ['10:00 ص', '1:00 م', '5:00 م'],
      },
    ],
  },
  {
    id: 'provider-rana',
    name: 'د. رنا الخطيب',
    initials: 'رخ',
    imageUrl: 'https://i.pravatar.cc/240?img=45',
    specialty: 'علاج أمراض اللثة',
    branch: 'مركز الحمدانية لطب الأسنان',
    area: 'الحمدانية',
    rating: 4.8,
    reviews: 109,
    experienceYears: 12,
    nextAvailable: 'الخميس 29 تشرين الأول · 5:00 م',
    assessmentFreshnessLabel: 'تم تحديث المعلومات في 19 تشرين الأول 2026',
    protectionLabel: 'الحماية الممولة غير مفعلة لهذه الخدمة',
    protectionActive: false,
    serviceCodes: ['periodontics', 'dental-cleaning', 'dental-checkup'],
    prices: {
      periodontics: rangePrice(3000, 3500, '3,000–3,500 ل.س', 'يتحدد عدد الجلسات بعد تقييم اللثة.'),
      'dental-cleaning': fixedPrice(1900, '1,900 ل.س'),
      'dental-checkup': fixedPrice(1250, '1,250 ل.س'),
    },
    availability: [
      { dateKey: '2026-10-29', dateLabel: 'الخميس 29 تشرين الأول', slots: ['5:00 م', '6:00 م'] },
      { dateKey: '2026-10-31', dateLabel: 'السبت 31 تشرين الأول', slots: ['10:30 ص', '1:00 م'] },
    ],
  },
  {
    id: 'provider-nour-hassan',
    name: 'د. نور الحسن',
    initials: 'نح',
    imageUrl: 'https://i.pravatar.cc/240?img=42',
    specialty: 'التيجان والتركيبات السنية',
    branch: 'مركز نور الأسنان',
    area: 'الجميلية',
    rating: 4.8,
    reviews: 95,
    experienceYears: 10,
    nextAvailable: 'السبت 24 تشرين الأول · 12:00 م',
    assessmentFreshnessLabel: 'تم تحديث المعلومات في 19 تشرين الأول 2026',
    protectionLabel: 'مستوى حماية تجريبي مشروط بالخدمة',
    protectionActive: true,
    serviceCodes: ['crowns', 'bridges', 'dentures'],
    prices: {
      crowns: fixedPrice(9000, '9,000 ل.س', 'يشمل تاجاً واحداً بعد اعتماد قياسات السن.'),
      bridges: rangePrice(14000, 18000, '14,000–18,000 ل.س'),
      dentures: rangePrice(7000, 10000, '7,000–10,000 ل.س'),
    },
    availability: [
      { dateKey: '2026-10-24', dateLabel: 'السبت 24 تشرين الأول', slots: ['12:00 م', '3:00 م'] },
      { dateKey: '2026-10-27', dateLabel: 'الثلاثاء 27 تشرين الأول', slots: ['11:00 ص', '4:00 م'] },
    ],
  },
];

/**
 * Stable example distances for the UI mock, not the user's measured GPS distance.
 * Replace with backend-verified patient-to-branch distances during integration.
 * Area-based mock data is shared between lists, profile and comparison.
 */
const demoDistanceKmByArea: Record<string, number> = {
  الجميلية: 2.4,
  الفرقان: 3.8,
  الأعظمية: 5.1,
  الحمدانية: 6.2,
  الشهباء: 4.6,
  السليمانية: 3.1,
  الموكامبو: 2.8,
  'صلاح الدين': 4.9,
  الزهراء: 5.5,
};
export function getMockProviderDistanceKm(provider: MockProvider): number {
  return demoDistanceKmByArea[provider.area] ?? 3.6;
}

export function getMockProvider(providerId?: string): MockProvider | undefined {
  return mockProviders.find((provider) => provider.id === providerId);
}

export function getMockProviderPriceFact(
  provider: MockProvider,
  serviceCode?: string,
): MockProviderPriceFact | undefined {
  return serviceCode ? provider.prices[serviceCode] : undefined;
}

export function getMockProviderPriceLabel(provider: MockProvider, serviceCode?: string): string {
  return getMockProviderPriceFact(provider, serviceCode)?.displayLabel ?? 'السعر غير متاح';
}

export function getMockProviders(serviceCode?: string, area?: string): MockProvider[] {
  return mockProviders.filter((provider) => {
    const matchesService = !serviceCode || provider.serviceCodes.includes(serviceCode);
    const matchesArea = !area || area === 'كل المناطق' || provider.area === area;

    return matchesService && matchesArea;
  });
}