export interface MockProviderAvailability {
  dateKey: string;
  dateLabel: string;
  slots: string[];
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

const requiresPlanPrice = (
  displayLabel: string,
  includesSummary?: string,
): MockProviderPriceFact => ({
  mode: 'requires-plan',
  currency: 'SYP',
  displayLabel,
  includesSummary,
});

export const mockAreas = ['كل المناطق', 'الجميلية', 'الفرقان', 'الشهباء', 'الأعظمية'] as const;

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
    nextAvailable: 'اليوم 12:00',
    assessmentFreshnessLabel: 'تم التحقق من الأهلية اليوم · 8:40 ص',
    protectionLabel: 'الحماية الممولة غير مفعلة لهذه الخدمة',
    protectionActive: false,
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
        dateKey: '2026-09-19',
        dateLabel: 'السبت 19 أيلول',
        slots: ['10:00 ص', '11:30 ص', '5:30 م'],
      },
      {
        dateKey: '2026-09-20',
        dateLabel: 'الأحد 20 أيلول',
        slots: ['9:30 ص', '12:00 م', '4:00 م'],
      },
      {
        dateKey: '2026-09-21',
        dateLabel: 'الاثنين 21 أيلول',
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
    nextAvailable: 'غداً · 11:00 ص',
    assessmentFreshnessLabel: 'تم التحقق من الأهلية اليوم · 8:10 ص',
    protectionLabel: 'الحماية الممولة غير مفعلة لهذه الخدمة',
    protectionActive: false,
    serviceCodes: ['dental-checkup', 'dental-filling'],
    prices: {
      'dental-checkup': fixedPrice(1400, '1,400 ل.س', 'يشمل الفحص والتقييم الأولي.'),
      'dental-filling': fixedPrice(2500, '2,500 ل.س', 'يشمل حشوة قياسية واحدة.'),
    },
    availability: [
      {
        dateKey: '2026-09-19',
        dateLabel: 'السبت 19 أيلول',
        slots: ['11:00 ص', '1:30 م', '6:30 م'],
      },
      {
        dateKey: '2026-09-21',
        dateLabel: 'الاثنين 21 أيلول',
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
    protectionLabel: 'الحماية الممولة غير مفعلة لهذه الخدمة',
    protectionActive: false,
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
    id: 'provider-rima',
    name: 'د. ريما الخطيب',
    initials: 'رخ',
    imageUrl: 'https://i.pravatar.cc/240?img=45',
    specialty: 'علاج الجذور',
    branch: 'فرع النيل',
    area: 'الجميلية',
    rating: 4.6,
    reviews: 57,
    experienceYears: 7,
    nextAvailable: 'السبت 09:00',
    assessmentFreshnessLabel: 'معلومات مهنية للتجربة · تتطلب تأكيداً',
    protectionLabel: 'الحماية الممولة غير مفعلة لهذه الخدمة',
    protectionActive: false,
    serviceCodes: ['root-canal'],
    prices: {
      'root-canal': fixedPrice(
        700,
        '700 ل.س',
        'السعر التوضيحي لعلاج الجذور في النموذج.',
        'قد تتغير البنود والتكلفة بعد الفحص.',
      ),
    },
    availability: [
      {
        dateKey: '2026-10-17',
        dateLabel: 'السبت 17 تشرين الأول',
        slots: ['09:00 ص', '11:00 ص'],
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
    nextAvailable: 'السبت · 9:00 ص',
    assessmentFreshnessLabel: 'تم التحقق من الأهلية أمس · 6:20 م',
    protectionLabel: 'الحماية الممولة غير مفعلة لهذه الخدمة',
    protectionActive: false,
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
        dateKey: '2026-09-19',
        dateLabel: 'السبت 19 أيلول',
        slots: ['9:00 ص', '12:30 م', '4:30 م'],
      },
      {
        dateKey: '2026-09-20',
        dateLabel: 'الأحد 20 أيلول',
        slots: ['10:00 ص', '1:00 م', '5:00 م'],
      },
    ],
  },
  {
    id: 'provider-yazan',
    name: 'د. يزن حلاق',
    initials: 'يح',
    imageUrl: 'https://i.pravatar.cc/240?img=11',
    specialty: 'طب أسنان عام',
    branch: 'مركز الأعظمية الطبي',
    area: 'الأعظمية',
    rating: 4.6,
    reviews: 51,
    experienceYears: 7,
    nextAvailable: 'الأحد · 10:00 ص',
    assessmentFreshnessLabel: 'تم التحقق من الأهلية أمس · 4:55 م',
    protectionLabel: 'الحماية الممولة غير مفعلة لهذه الخدمة',
    protectionActive: false,
    serviceCodes: ['dental-checkup', 'dental-cleaning', 'dental-filling'],
    prices: {
      'dental-checkup': fixedPrice(1150, '1,150 ل.س', 'يشمل الفحص الأولي.'),
      'dental-cleaning': fixedPrice(1800, '1,800 ل.س', 'يشمل جلسة تنظيف قياسية.'),
      'dental-filling': requiresPlanPrice(
        'السعر يحدد بعد الفحص',
        'نوع الترميم والسعر النهائي يحتاجان فحص السن أولاً.',
      ),
    },
    availability: [
      {
        dateKey: '2026-09-20',
        dateLabel: 'الأحد 20 أيلول',
        slots: ['10:00 ص', '2:30 م', '6:00 م'],
      },
      {
        dateKey: '2026-09-22',
        dateLabel: 'الثلاثاء 22 أيلول',
        slots: ['9:30 ص', '12:00 م', '4:00 م'],
      },
    ],
  },
];

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
