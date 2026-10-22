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

export const mockAreas = [
  'كل المناطق',
  'الجميلية',
  'الفرقان',
  'الشهباء',
  'الأعظمية',
  'الحمدانية',
] as const;

// Additional connected fixtures cover every service group, multiple areas, and varied price modes.
const additionalMockProviders: MockProvider[] = [
  {
    id: 'provider-nour',
    name: 'د. نور الخطيب',
    initials: 'نا',
    imageUrl: 'https://i.pravatar.cc/240?img=49',
    specialty: 'أمراض اللثة والتنظيف العميق',
    branch: 'مركز الشهباء لطب الأسنان',
    area: 'الشهباء',
    rating: 4.9,
    reviews: 118,
    experienceYears: 12,
    nextAvailable: 'السبت 24 تشرين الأول · 9:00 ص',
    assessmentFreshnessLabel: 'تم تحديث المعلومات في 19 تشرين الأول 2026',
    protectionLabel: 'الحماية الممولة غير مفعلة لهذه الخدمة',
    protectionActive: false,
    serviceCodes: ['periodontics', 'dental-cleaning', 'dental-checkup'],
    prices: {
      periodontics: rangePrice(
        2800,
        4200,
        '2,800–4,200 ل.س',
        'التكلفة النهائية تعتمد على الفحص ونوع الإجراء الموثق بالخطة.',
      ),
      'dental-cleaning': fixedPrice(
        2000,
        '2,000 ل.س',
        'يشمل الخدمة الأساسية الموضحة، ويُسعر أي إجراء إضافي بشكل منفصل.',
      ),
      'dental-checkup': fixedPrice(
        1300,
        '1,300 ل.س',
        'يشمل الخدمة الأساسية الموضحة، ويُسعر أي إجراء إضافي بشكل منفصل.',
      ),
    },
    availability: [
      {
        dateKey: '2026-10-24',
        dateLabel: 'السبت 24 تشرين الأول',
        slots: ['9:00 ص', '11:30 ص', '4:00 م'],
      },
      {
        dateKey: '2026-10-26',
        dateLabel: 'الاثنين 26 تشرين الأول',
        slots: ['9:30 ص', '1:00 م', '6:00 م'],
      },
    ],
  },
  {
    id: 'provider-samer',
    name: 'د. سامر المصري',
    initials: 'سا',
    imageUrl: 'https://i.pravatar.cc/240?img=13',
    specialty: 'جراحة الفم وأضراس العقل',
    branch: 'مركز الفرقان التخصصي',
    area: 'الفرقان',
    rating: 4.7,
    reviews: 91,
    experienceYears: 13,
    nextAvailable: 'الأحد 25 تشرين الأول · 10:00 ص',
    assessmentFreshnessLabel: 'تم تحديث المعلومات في 19 تشرين الأول 2026',
    protectionLabel: 'مستوى حماية تجريبي مشروط بالخدمة',
    protectionActive: true,
    serviceCodes: ['extraction', 'wisdom-teeth', 'minor-surgery', 'dental-emergency'],
    prices: {
      extraction: fixedPrice(
        1750,
        '1,750 ل.س',
        'يشمل الخدمة الأساسية الموضحة، ويُسعر أي إجراء إضافي بشكل منفصل.',
      ),
      'wisdom-teeth': rangePrice(
        4500,
        6500,
        '4,500–6,500 ل.س',
        'التكلفة النهائية تعتمد على الفحص ونوع الإجراء الموثق بالخطة.',
      ),
      'minor-surgery': rangePrice(
        5000,
        8500,
        '5,000–8,500 ل.س',
        'التكلفة النهائية تعتمد على الفحص ونوع الإجراء الموثق بالخطة.',
      ),
      'dental-emergency': fixedPrice(
        1800,
        '1,800 ل.س',
        'يشمل الخدمة الأساسية الموضحة، ويُسعر أي إجراء إضافي بشكل منفصل.',
      ),
    },
    availability: [
      {
        dateKey: '2026-10-25',
        dateLabel: 'الأحد 25 تشرين الأول',
        slots: ['10:00 ص', '12:30 م', '5:30 م'],
      },
      {
        dateKey: '2026-10-27',
        dateLabel: 'الثلاثاء 27 تشرين الأول',
        slots: ['10:30 ص', '2:00 م', '4:30 م'],
      },
    ],
  },
  {
    id: 'provider-hala',
    name: 'د. هالة درويش',
    initials: 'هد',
    imageUrl: 'https://i.pravatar.cc/240?img=44',
    specialty: 'التركيبات الثابتة والتيجان',
    branch: 'عيادة هالة لطب الأسنان',
    area: 'الأعظمية',
    rating: 4.8,
    reviews: 87,
    experienceYears: 10,
    nextAvailable: 'الاثنين 26 تشرين الأول · 9:30 ص',
    assessmentFreshnessLabel: 'تم تحديث المعلومات في 19 تشرين الأول 2026',
    protectionLabel: 'مستوى حماية تجريبي مشروط بالخدمة',
    protectionActive: true,
    serviceCodes: ['crowns', 'bridges', 'veneers', 'dental-checkup'],
    prices: {
      crowns: rangePrice(
        8000,
        10500,
        '8,000–10,500 ل.س',
        'التكلفة النهائية تعتمد على الفحص ونوع الإجراء الموثق بالخطة.',
      ),
      bridges: rangePrice(
        14000,
        20000,
        '14,000–20,000 ل.س',
        'التكلفة النهائية تعتمد على الفحص ونوع الإجراء الموثق بالخطة.',
      ),
      veneers: rangePrice(
        10000,
        14500,
        '10,000–14,500 ل.س',
        'التكلفة النهائية تعتمد على الفحص ونوع الإجراء الموثق بالخطة.',
      ),
      'dental-checkup': fixedPrice(
        1400,
        '1,400 ل.س',
        'يشمل الخدمة الأساسية الموضحة، ويُسعر أي إجراء إضافي بشكل منفصل.',
      ),
    },
    availability: [
      {
        dateKey: '2026-10-26',
        dateLabel: 'الاثنين 26 تشرين الأول',
        slots: ['9:30 ص', '1:00 م', '6:00 م'],
      },
      {
        dateKey: '2026-10-28',
        dateLabel: 'الأربعاء 28 تشرين الأول',
        slots: ['9:00 ص', '12:00 م', '6:30 م'],
      },
    ],
  },
  {
    id: 'provider-majed',
    name: 'د. ماجد الحسن',
    initials: 'ما',
    imageUrl: 'https://i.pravatar.cc/240?img=15',
    specialty: 'زراعة الأسنان وتعويضاتها',
    branch: 'مركز نور الأسنان',
    area: 'الجميلية',
    rating: 4.9,
    reviews: 147,
    experienceYears: 16,
    nextAvailable: 'الثلاثاء 27 تشرين الأول · 10:30 ص',
    assessmentFreshnessLabel: 'تم تحديث المعلومات في 19 تشرين الأول 2026',
    protectionLabel: 'مستوى حماية تجريبي مشروط بالخدمة',
    protectionActive: true,
    serviceCodes: ['implant', 'implant-prosthetics', 'bone-graft', 'sinus-lift', 'dental-checkup'],
    prices: {
      implant: rangePrice(
        18000,
        24000,
        '18,000–24,000 ل.س',
        'التكلفة النهائية تعتمد على الفحص ونوع الإجراء الموثق بالخطة.',
      ),
      'implant-prosthetics': rangePrice(
        9000,
        14000,
        '9,000–14,000 ل.س',
        'التكلفة النهائية تعتمد على الفحص ونوع الإجراء الموثق بالخطة.',
      ),
      'bone-graft': rangePrice(
        7000,
        11000,
        '7,000–11,000 ل.س',
        'التكلفة النهائية تعتمد على الفحص ونوع الإجراء الموثق بالخطة.',
      ),
      'sinus-lift': rangePrice(
        11500,
        15500,
        '11,500–15,500 ل.س',
        'التكلفة النهائية تعتمد على الفحص ونوع الإجراء الموثق بالخطة.',
      ),
      'dental-checkup': fixedPrice(
        1500,
        '1,500 ل.س',
        'يشمل الخدمة الأساسية الموضحة، ويُسعر أي إجراء إضافي بشكل منفصل.',
      ),
    },
    availability: [
      {
        dateKey: '2026-10-27',
        dateLabel: 'الثلاثاء 27 تشرين الأول',
        slots: ['10:30 ص', '2:00 م', '4:30 م'],
      },
      {
        dateKey: '2026-10-29',
        dateLabel: 'الخميس 29 تشرين الأول',
        slots: ['10:00 ص', '1:30 م', '5:00 م'],
      },
    ],
  },
  {
    id: 'provider-dima',
    name: 'د. ديمة نعيم',
    initials: 'دن',
    imageUrl: 'https://i.pravatar.cc/240?img=48',
    specialty: 'طب أسنان الأطفال',
    branch: 'عيادات الريان للأسنان',
    area: 'الشهباء',
    rating: 4.8,
    reviews: 132,
    experienceYears: 8,
    nextAvailable: 'السبت 24 تشرين الأول · 9:00 ص',
    assessmentFreshnessLabel: 'تم تحديث المعلومات في 19 تشرين الأول 2026',
    protectionLabel: 'مستوى حماية تجريبي مشروط بالخدمة',
    protectionActive: true,
    serviceCodes: ['pediatric-dentistry', 'dental-checkup', 'dental-filling', 'dental-cleaning'],
    prices: {
      'pediatric-dentistry': rangePrice(
        1450,
        2100,
        '1,450–2,100 ل.س',
        'التكلفة النهائية تعتمد على الفحص ونوع الإجراء الموثق بالخطة.',
      ),
      'dental-checkup': fixedPrice(
        1150,
        '1,150 ل.س',
        'يشمل الخدمة الأساسية الموضحة، ويُسعر أي إجراء إضافي بشكل منفصل.',
      ),
      'dental-filling': rangePrice(
        1800,
        2500,
        '1,800–2,500 ل.س',
        'التكلفة النهائية تعتمد على الفحص ونوع الإجراء الموثق بالخطة.',
      ),
      'dental-cleaning': fixedPrice(
        1600,
        '1,600 ل.س',
        'يشمل الخدمة الأساسية الموضحة، ويُسعر أي إجراء إضافي بشكل منفصل.',
      ),
    },
    availability: [
      {
        dateKey: '2026-10-24',
        dateLabel: 'السبت 24 تشرين الأول',
        slots: ['9:00 ص', '11:30 ص', '4:00 م'],
      },
      {
        dateKey: '2026-10-28',
        dateLabel: 'الأربعاء 28 تشرين الأول',
        slots: ['9:00 ص', '12:00 م', '6:30 م'],
      },
    ],
  },
  {
    id: 'provider-fadi',
    name: 'د. فادي مراد',
    initials: 'فم',
    imageUrl: 'https://i.pravatar.cc/240?img=22',
    specialty: 'علاج الجذور وإعادة المعالجة',
    branch: 'مركز الأعظمية الطبي',
    area: 'الأعظمية',
    rating: 4.7,
    reviews: 104,
    experienceYears: 14,
    nextAvailable: 'الأحد 25 تشرين الأول · 10:00 ص',
    assessmentFreshnessLabel: 'تم تحديث المعلومات في 19 تشرين الأول 2026',
    protectionLabel: 'مستوى حماية تجريبي مشروط بالخدمة',
    protectionActive: true,
    serviceCodes: [
      'root-canal',
      'root-retreatment',
      'broken-instrument',
      'perforation',
      'apical-surgery',
    ],
    prices: {
      'root-canal': rangePrice(
        850,
        1250,
        '850–1,250 ل.س',
        'التكلفة النهائية تعتمد على الفحص ونوع الإجراء الموثق بالخطة.',
      ),
      'root-retreatment': rangePrice(
        2200,
        3400,
        '2,200–3,400 ل.س',
        'التكلفة النهائية تعتمد على الفحص ونوع الإجراء الموثق بالخطة.',
      ),
      'broken-instrument': rangePrice(
        3500,
        5200,
        '3,500–5,200 ل.س',
        'التكلفة النهائية تعتمد على الفحص ونوع الإجراء الموثق بالخطة.',
      ),
      perforation: rangePrice(
        2600,
        4300,
        '2,600–4,300 ل.س',
        'التكلفة النهائية تعتمد على الفحص ونوع الإجراء الموثق بالخطة.',
      ),
      'apical-surgery': rangePrice(
        5000,
        7800,
        '5,000–7,800 ل.س',
        'التكلفة النهائية تعتمد على الفحص ونوع الإجراء الموثق بالخطة.',
      ),
    },
    availability: [
      {
        dateKey: '2026-10-25',
        dateLabel: 'الأحد 25 تشرين الأول',
        slots: ['10:00 ص', '12:30 م', '5:30 م'],
      },
      {
        dateKey: '2026-10-29',
        dateLabel: 'الخميس 29 تشرين الأول',
        slots: ['10:00 ص', '1:30 م', '5:00 م'],
      },
    ],
  },
  {
    id: 'provider-rasha',
    name: 'د. رشا ناصر',
    initials: 'رن',
    imageUrl: 'https://i.pravatar.cc/240?img=32',
    specialty: 'التجميل وتبييض الأسنان',
    branch: 'عيادات الجميلية',
    area: 'الجميلية',
    rating: 4.6,
    reviews: 76,
    experienceYears: 7,
    nextAvailable: 'السبت 24 تشرين الأول · 9:00 ص',
    assessmentFreshnessLabel: 'تم تحديث المعلومات في 19 تشرين الأول 2026',
    protectionLabel: 'الحماية الممولة غير مفعلة لهذه الخدمة',
    protectionActive: false,
    serviceCodes: ['teeth-whitening', 'veneers', 'rehab-cosmetic', 'dental-cleaning'],
    prices: {
      'teeth-whitening': rangePrice(
        4500,
        5400,
        '4,500–5,400 ل.س',
        'التكلفة النهائية تعتمد على الفحص ونوع الإجراء الموثق بالخطة.',
      ),
      veneers: rangePrice(
        9000,
        13500,
        '9,000–13,500 ل.س',
        'التكلفة النهائية تعتمد على الفحص ونوع الإجراء الموثق بالخطة.',
      ),
      'rehab-cosmetic': rangePrice(
        12000,
        21000,
        '12,000–21,000 ل.س',
        'التكلفة النهائية تعتمد على الفحص ونوع الإجراء الموثق بالخطة.',
      ),
      'dental-cleaning': fixedPrice(
        1800,
        '1,800 ل.س',
        'يشمل الخدمة الأساسية الموضحة، ويُسعر أي إجراء إضافي بشكل منفصل.',
      ),
    },
    availability: [
      {
        dateKey: '2026-10-24',
        dateLabel: 'السبت 24 تشرين الأول',
        slots: ['9:00 ص', '11:30 ص', '4:00 م'],
      },
      {
        dateKey: '2026-10-26',
        dateLabel: 'الاثنين 26 تشرين الأول',
        slots: ['9:30 ص', '1:00 م', '6:00 م'],
      },
    ],
  },
  {
    id: 'provider-tarek',
    name: 'د. طارق شلبي',
    initials: 'طش',
    imageUrl: 'https://i.pravatar.cc/240?img=17',
    specialty: 'التعويضات السنية والأطقم',
    branch: 'عيادة الأندلس السنية',
    area: 'الفرقان',
    rating: 4.5,
    reviews: 64,
    experienceYears: 11,
    nextAvailable: 'الأحد 25 تشرين الأول · 10:00 ص',
    assessmentFreshnessLabel: 'تم تحديث المعلومات في 19 تشرين الأول 2026',
    protectionLabel: 'مستوى حماية تجريبي مشروط بالخدمة',
    protectionActive: true,
    serviceCodes: ['dentures', 'bridges', 'crowns', 'dental-checkup'],
    prices: {
      dentures: rangePrice(
        6500,
        10500,
        '6,500–10,500 ل.س',
        'التكلفة النهائية تعتمد على الفحص ونوع الإجراء الموثق بالخطة.',
      ),
      bridges: rangePrice(
        13000,
        17500,
        '13,000–17,500 ل.س',
        'التكلفة النهائية تعتمد على الفحص ونوع الإجراء الموثق بالخطة.',
      ),
      crowns: rangePrice(
        7600,
        9500,
        '7,600–9,500 ل.س',
        'التكلفة النهائية تعتمد على الفحص ونوع الإجراء الموثق بالخطة.',
      ),
      'dental-checkup': fixedPrice(
        1250,
        '1,250 ل.س',
        'يشمل الخدمة الأساسية الموضحة، ويُسعر أي إجراء إضافي بشكل منفصل.',
      ),
    },
    availability: [
      {
        dateKey: '2026-10-25',
        dateLabel: 'الأحد 25 تشرين الأول',
        slots: ['10:00 ص', '12:30 م', '5:30 م'],
      },
      {
        dateKey: '2026-10-27',
        dateLabel: 'الثلاثاء 27 تشرين الأول',
        slots: ['10:30 ص', '2:00 م', '4:30 م'],
      },
    ],
  },
  {
    id: 'provider-lina',
    name: 'د. لينا حداد',
    initials: 'لح',
    imageUrl: 'https://i.pravatar.cc/240?img=41',
    specialty: 'طب الأسنان العام والترميم',
    branch: 'عيادات الريان للأسنان',
    area: 'الشهباء',
    rating: 4.8,
    reviews: 103,
    experienceYears: 9,
    nextAvailable: 'الاثنين 26 تشرين الأول · 9:30 ص',
    assessmentFreshnessLabel: 'تم تحديث المعلومات في 19 تشرين الأول 2026',
    protectionLabel: 'مستوى حماية تجريبي مشروط بالخدمة',
    protectionActive: true,
    serviceCodes: ['dental-checkup', 'dental-cleaning', 'dental-filling', 'dental-emergency'],
    prices: {
      'dental-checkup': fixedPrice(
        1100,
        '1,100 ل.س',
        'يشمل الخدمة الأساسية الموضحة، ويُسعر أي إجراء إضافي بشكل منفصل.',
      ),
      'dental-cleaning': fixedPrice(
        1700,
        '1,700 ل.س',
        'يشمل الخدمة الأساسية الموضحة، ويُسعر أي إجراء إضافي بشكل منفصل.',
      ),
      'dental-filling': rangePrice(
        2100,
        2700,
        '2,100–2,700 ل.س',
        'التكلفة النهائية تعتمد على الفحص ونوع الإجراء الموثق بالخطة.',
      ),
      'dental-emergency': rangePrice(
        1700,
        2300,
        '1,700–2,300 ل.س',
        'التكلفة النهائية تعتمد على الفحص ونوع الإجراء الموثق بالخطة.',
      ),
    },
    availability: [
      {
        dateKey: '2026-10-26',
        dateLabel: 'الاثنين 26 تشرين الأول',
        slots: ['9:30 ص', '1:00 م', '6:00 م'],
      },
      {
        dateKey: '2026-10-28',
        dateLabel: 'الأربعاء 28 تشرين الأول',
        slots: ['9:00 ص', '12:00 م', '6:30 م'],
      },
    ],
  },
  {
    id: 'provider-bassam',
    name: 'د. بسام العبد',
    initials: 'با',
    imageUrl: 'https://i.pravatar.cc/240?img=25',
    specialty: 'الجراحة الفموية والمضاعفات',
    branch: 'مركز الساحل الطبي',
    area: 'الأعظمية',
    rating: 4.7,
    reviews: 59,
    experienceYears: 18,
    nextAvailable: 'الثلاثاء 27 تشرين الأول · 10:30 ص',
    assessmentFreshnessLabel: 'تم تحديث المعلومات في 19 تشرين الأول 2026',
    protectionLabel: 'الحماية الممولة غير مفعلة لهذه الخدمة',
    protectionActive: false,
    serviceCodes: ['surgery-complications', 'minor-surgery', 'extraction', 'bone-graft'],
    prices: {
      'surgery-complications': rangePrice(
        4400,
        8200,
        '4,400–8,200 ل.س',
        'التكلفة النهائية تعتمد على الفحص ونوع الإجراء الموثق بالخطة.',
      ),
      'minor-surgery': rangePrice(
        4700,
        7000,
        '4,700–7,000 ل.س',
        'التكلفة النهائية تعتمد على الفحص ونوع الإجراء الموثق بالخطة.',
      ),
      extraction: rangePrice(
        1600,
        2400,
        '1,600–2,400 ل.س',
        'التكلفة النهائية تعتمد على الفحص ونوع الإجراء الموثق بالخطة.',
      ),
      'bone-graft': rangePrice(
        7200,
        11200,
        '7,200–11,200 ل.س',
        'التكلفة النهائية تعتمد على الفحص ونوع الإجراء الموثق بالخطة.',
      ),
    },
    availability: [
      {
        dateKey: '2026-10-27',
        dateLabel: 'الثلاثاء 27 تشرين الأول',
        slots: ['10:30 ص', '2:00 م', '4:30 م'],
      },
      {
        dateKey: '2026-10-29',
        dateLabel: 'الخميس 29 تشرين الأول',
        slots: ['10:00 ص', '1:30 م', '5:00 م'],
      },
    ],
  },
  {
    id: 'provider-salwa',
    name: 'د. سلوى حيدر',
    initials: 'سح',
    imageUrl: 'https://i.pravatar.cc/240?img=46',
    specialty: 'اختصاص لثة وزراعة',
    branch: 'مركز النور الحديث',
    area: 'الجميلية',
    rating: 4.9,
    reviews: 151,
    experienceYears: 15,
    nextAvailable: 'السبت 24 تشرين الأول · 9:00 ص',
    assessmentFreshnessLabel: 'تم تحديث المعلومات في 19 تشرين الأول 2026',
    protectionLabel: 'مستوى حماية تجريبي مشروط بالخدمة',
    protectionActive: true,
    serviceCodes: ['periodontics', 'implant', 'sinus-lift', 'implant-prosthetics'],
    prices: {
      periodontics: rangePrice(
        2600,
        4200,
        '2,600–4,200 ل.س',
        'التكلفة النهائية تعتمد على الفحص ونوع الإجراء الموثق بالخطة.',
      ),
      implant: rangePrice(
        17000,
        23500,
        '17,000–23,500 ل.س',
        'التكلفة النهائية تعتمد على الفحص ونوع الإجراء الموثق بالخطة.',
      ),
      'sinus-lift': rangePrice(
        12000,
        15000,
        '12,000–15,000 ل.س',
        'التكلفة النهائية تعتمد على الفحص ونوع الإجراء الموثق بالخطة.',
      ),
      'implant-prosthetics': rangePrice(
        8900,
        12000,
        '8,900–12,000 ل.س',
        'التكلفة النهائية تعتمد على الفحص ونوع الإجراء الموثق بالخطة.',
      ),
    },
    availability: [
      {
        dateKey: '2026-10-24',
        dateLabel: 'السبت 24 تشرين الأول',
        slots: ['9:00 ص', '11:30 ص', '4:00 م'],
      },
      {
        dateKey: '2026-10-28',
        dateLabel: 'الأربعاء 28 تشرين الأول',
        slots: ['9:00 ص', '12:00 م', '6:30 م'],
      },
    ],
  },
  {
    id: 'provider-anas',
    name: 'د. أنس قاسم',
    initials: 'أق',
    imageUrl: 'https://i.pravatar.cc/240?img=16',
    specialty: 'علاج جذور والحالات المعقدة',
    branch: 'مركز الفرقان التخصصي',
    area: 'الفرقان',
    rating: 4.8,
    reviews: 82,
    experienceYears: 12,
    nextAvailable: 'الأحد 25 تشرين الأول · 10:00 ص',
    assessmentFreshnessLabel: 'تم تحديث المعلومات في 19 تشرين الأول 2026',
    protectionLabel: 'الحماية الممولة غير مفعلة لهذه الخدمة',
    protectionActive: false,
    serviceCodes: [
      'root-canal',
      'root-retreatment',
      'root-complications',
      'apical-surgery',
      'dental-checkup',
    ],
    prices: {
      'root-canal': rangePrice(
        800,
        1100,
        '800–1,100 ل.س',
        'التكلفة النهائية تعتمد على الفحص ونوع الإجراء الموثق بالخطة.',
      ),
      'root-retreatment': rangePrice(
        2000,
        3300,
        '2,000–3,300 ل.س',
        'التكلفة النهائية تعتمد على الفحص ونوع الإجراء الموثق بالخطة.',
      ),
      'root-complications': rangePrice(
        3000,
        5200,
        '3,000–5,200 ل.س',
        'التكلفة النهائية تعتمد على الفحص ونوع الإجراء الموثق بالخطة.',
      ),
      'apical-surgery': rangePrice(
        5200,
        7400,
        '5,200–7,400 ل.س',
        'التكلفة النهائية تعتمد على الفحص ونوع الإجراء الموثق بالخطة.',
      ),
      'dental-checkup': fixedPrice(
        1200,
        '1,200 ل.س',
        'يشمل الخدمة الأساسية الموضحة، ويُسعر أي إجراء إضافي بشكل منفصل.',
      ),
    },
    availability: [
      {
        dateKey: '2026-10-25',
        dateLabel: 'الأحد 25 تشرين الأول',
        slots: ['10:00 ص', '12:30 م', '5:30 م'],
      },
      {
        dateKey: '2026-10-29',
        dateLabel: 'الخميس 29 تشرين الأول',
        slots: ['10:00 ص', '1:30 م', '5:00 م'],
      },
    ],
  },
];

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
    nextAvailable: 'السبت 24 تشرين الأول · 9:00 ص',
    assessmentFreshnessLabel: 'معلومات مهنية للتجربة · تتطلب تأكيداً',
    protectionLabel: 'مستوى حماية تجريبي مشروط بالخدمة',
    protectionActive: true,
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
        dateKey: '2026-10-24',
        dateLabel: 'السبت 24 تشرين الأول',
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
    nextAvailable: 'الأحد 25 تشرين الأول · 10:00 ص',
    assessmentFreshnessLabel: 'تم التحقق من الأهلية في 17 تشرين الأول 2026',
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
        dateKey: '2026-10-25',
        dateLabel: 'الأحد 25 تشرين الأول',
        slots: ['10:00 ص', '2:30 م', '6:00 م'],
      },
      {
        dateKey: '2026-10-27',
        dateLabel: 'الثلاثاء 27 تشرين الأول',
        slots: ['9:30 ص', '12:00 م', '4:00 م'],
      },
    ],
  },
  ...additionalMockProviders,
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
