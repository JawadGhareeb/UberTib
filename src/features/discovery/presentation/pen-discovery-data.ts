import {
  getMockProviderPriceFact,
  getMockProviderPriceLabel,
  getMockProviders,
} from '@/features/discovery/mocks/providers.mock';

export interface PenServiceFamily {
  id: string;
  groupCode: 'G01' | 'G02' | 'G03' | 'G04';
  title: string;
  description: string;
}

export interface PenServiceGroup {
  code: PenServiceFamily['groupCode'];
  title: string;
  description: string;
  countLabel: string;
  families: PenServiceFamily[];
}

export const penServiceGroups: PenServiceGroup[] = [
  {
    code: 'G01',
    title: 'جراحة، لثة وزراعة',
    description: 'للقلع، اللثة، الزراعة والإجراءات الجراحية المرتبطة بها.',
    countLabel: '8 عائلات متاحة حالياً',
    families: [
      {
        id: 'extraction',
        groupCode: 'G01',
        title: 'القلع',
        description: 'لإزالة سن عندما يقرر الطبيب أن الحفاظ عليه غير مناسب.',
      },
      {
        id: 'wisdom-teeth',
        groupCode: 'G01',
        title: 'أضراس العقل',
        description: 'لتقييم أضراس العقل عند الألم أو الانطمار أو صعوبة التنظيف.',
      },
      {
        id: 'minor-surgery',
        groupCode: 'G01',
        title: 'الجراحة الصغرى',
        description: 'لإجراءات فموية محدودة تحتاج تقييماً وتجهيزاً مناسبين.',
      },
      {
        id: 'periodontics',
        groupCode: 'G01',
        title: 'اللثة',
        description: 'للعناية باللثة والأنسجة الداعمة حول الأسنان.',
      },
      {
        id: 'implant',
        groupCode: 'G01',
        title: 'الزراعة',
        description: 'لتعويض سن مفقود بزرعة بعد تقييم العظم واللثة.',
      },
      {
        id: 'bone-graft',
        groupCode: 'G01',
        title: 'ترقيع العظم',
        description: 'لدعم كمية العظم في منطقة قد تحتاج زراعة أو ترميماً لاحقاً.',
      },
      {
        id: 'sinus-lift',
        groupCode: 'G01',
        title: 'رفع الجيب',
        description: 'لتهيئة عظم الفك العلوي قرب الجيب قبل الزراعة عند الحاجة.',
      },
      {
        id: 'surgery-complications',
        groupCode: 'G01',
        title: 'المضاعفات',
        description: 'لمراجعة مشكلة بعد جراحة أو زراعة مثل ألم مستمر أو تورم.',
      },
    ],
  },
  {
    code: 'G02',
    title: 'تركيبات وتجميل',
    description: 'للتيجان والجسور والفينير والتركيبات فوق الزرعات.',
    countLabel: '5 عائلات متاحة حالياً',
    families: [
      {
        id: 'crowns',
        groupCode: 'G02',
        title: 'التيجان',
        description: 'لتغطية سن ضعيف أو متضرر واستعادة شكله ووظيفته.',
      },
      {
        id: 'bridges',
        groupCode: 'G02',
        title: 'الجسور',
        description: 'لتعويض فراغ سن مفقود بتركيبة ثابتة بعد التقييم.',
      },
      {
        id: 'veneers',
        groupCode: 'G02',
        title: 'الفينير',
        description: 'قشرة رقيقة لتحسين شكل السطح الظاهر للسن بعد التقييم.',
      },
      {
        id: 'implant-prosthetics',
        groupCode: 'G02',
        title: 'التركيبات فوق الزرعات',
        description: 'لتركيب تاج أو جسر مدعوم بزرعات موجودة أو مخطط لها.',
      },
      {
        id: 'rehab-cosmetic',
        groupCode: 'G02',
        title: 'إعادة التأهيل والتجميل',
        description: 'لتنسيق عدة احتياجات وظيفية وجمالية ضمن خطة متكاملة.',
      },
    ],
  },
  {
    code: 'G03',
    title: 'علاج الجذور',
    description: 'لعلاج قنوات الجذر، إعادة العلاج والمضاعفات المرتبطة.',
    countLabel: '6 عائلات متاحة حالياً',
    families: [
      {
        id: 'root-canal',
        groupCode: 'G03',
        title: 'العلاج الأولي',
        description: 'لعلاج قنوات سن لم يسبق علاجه جذرياً بعد تقييم الطبيب.',
      },
      {
        id: 'root-retreatment',
        groupCode: 'G03',
        title: 'إعادة العلاج',
        description: 'لتقييم سن عولجت قنواته سابقاً وما زال يحتاج متابعة.',
      },
      {
        id: 'broken-instrument',
        groupCode: 'G03',
        title: 'الأدوات المكسورة',
        description: 'لمراجعة أداة عالقة أو مكسورة داخل قناة الجذر.',
      },
      {
        id: 'perforation',
        groupCode: 'G03',
        title: 'الثقوب',
        description: 'لتقييم فتحة غير مقصودة بين قناة الجذر والأنسجة المحيطة.',
      },
      {
        id: 'root-complications',
        groupCode: 'G03',
        title: 'المضاعفات',
        description: 'لمراجعة ألم أو تورم أو مشكلة مستمرة بعد علاج الجذور.',
      },
      {
        id: 'apical-surgery',
        groupCode: 'G03',
        title: 'الجراحة الذروية',
        description: 'لعلاج المنطقة حول نهاية الجذر جراحياً عندما يوصي الطبيب.',
      },
    ],
  },
  {
    code: 'G04',
    title: 'طب الأسنان العام',
    description: 'للفحص والوقاية والحشوات والأطفال والأطقم والإسعافات.',
    countLabel: '7 عائلات متاحة حالياً',
    families: [
      {
        id: 'dental-checkup',
        groupCode: 'G04',
        title: 'الفحص والوقاية',
        description: 'لفحص الأسنان واللثة ووضع خطوات وقائية مناسبة.',
      },
      {
        id: 'dental-filling',
        groupCode: 'G04',
        title: 'الحشوات',
        description: 'لترميم جزء متضرر من السن بعد إزالة الجزء غير السليم.',
      },
      {
        id: 'dental-cleaning',
        groupCode: 'G04',
        title: 'التنظيف',
        description: 'لإزالة الترسبات والعناية بصحة اللثة والأسنان.',
      },
      {
        id: 'teeth-whitening',
        groupCode: 'G04',
        title: 'التبييض',
        description: 'لتحسين لون الأسنان بخيارات يحدد الطبيب ملاءمتها.',
      },
      {
        id: 'pediatric-dentistry',
        groupCode: 'G04',
        title: 'الأطفال',
        description: 'لعناية سنية ملائمة للأطفال تشمل الفحص والوقاية والعلاج العام.',
      },
      {
        id: 'dentures',
        groupCode: 'G04',
        title: 'الأطقم',
        description: 'لتعويض عدة أسنان أو كامل الأسنان بتركيبة متحركة.',
      },
      {
        id: 'dental-emergency',
        groupCode: 'G04',
        title: 'الإسعافات',
        description: 'لألم أو كسر أو تورم يحتاج تقييماً سنياً قريباً.',
      },
    ],
  },
];

export const penSearchResults = [
  penServiceGroups[0]!.families.find((item) => item.id === 'implant')!,
  penServiceGroups[1]!.families.find((item) => item.id === 'implant-prosthetics')!,
  penServiceGroups[0]!.families.find((item) => item.id === 'bone-graft')!,
];

export function findPenGroup(code?: string): PenServiceGroup | undefined {
  return penServiceGroups.find((group) => group.code === code);
}

export function findPenFamily(id?: string): PenServiceFamily | undefined {
  return penServiceGroups.flatMap((group) => group.families).find((family) => family.id === id);
}

/**
 * Provider facts and booking availability must share one source of truth.
 * The old Pen-only doctor records reused canonical IDs for other people
 * and included a doctor with no booking record. Never use those records as
 * live navigation targets.
 */
function nextIllustrativeSlot(provider: ReturnType<typeof getMockProviders>[number]): string {
  // A fixture's old "today" label must not be shown after its calendar date has passed.
  // This remains sample availability, never a live booking confirmation.
  const now = new Date();
  const today = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getDate()).padStart(2, '0'),
  ].join('-');
  const firstFutureDay = provider.availability
    .filter((day) => day.dateKey >= today && day.slots.length > 0)
    .sort((a, b) => a.dateKey.localeCompare(b.dateKey))[0];
  return firstFutureDay
    ? firstFutureDay.dateLabel + ' · ' + firstFutureDay.slots[0]
    : 'يلزم تحديث المواعيد';
}

export function getPenDoctorsForService(serviceCode = 'root-canal', area?: string) {
  return getMockProviders(serviceCode, area).map((provider) => {
    const price = getMockProviderPriceFact(provider, serviceCode);
    const displayPrice = getMockProviderPriceLabel(provider, serviceCode);
    return {
      id: provider.id,
      name: provider.name,
      imageUrl: provider.imageUrl,
      specialty: provider.specialty,
      branch: provider.branch,
      area: provider.area,
      eligibility: provider.assessmentFreshnessLabel,
      price: displayPrice,
      priceShort: displayPrice.replace(/\s*ل\.س$/, ''),
      priceLong: displayPrice,
      priceMeaning: price?.includesSummary ?? 'تفاصيل السعر تُراجع عند الحجز',
      next: nextIllustrativeSlot(provider),
      // Mock reference screen displays an example branch distance (not a live ETA).
      distance: provider.id === 'provider-layan' ? '2.4 كم' : 'غير متاح',
      accessibility: 'راجع تفاصيل الفرع',
      terms: 'راجع شروط الحجز',
      availability: 'الموعد يحتاج تأكيد العيادة',
      rating: `${provider.rating} · ${provider.reviews}`,
      reviews: String(provider.reviews),
      reason: 'يدعم الطبيب الخدمة المطلوبة ضمن بيانات التوفر الحالية.',
      experience: `${provider.experienceYears} سنوات`,
    };
  });
}

// Kept for screens with a root-canal default; all service-aware routes use
// getPenDoctorsForService(serviceCode) instead.
export const penDoctors = getPenDoctorsForService();

export const penReviews = [
  {
    providerId: 'provider-layan',
    serviceCode: 'root-canal',
    dateKey: '2026-09-12',
    rating: 5,
    name: 'سارة م.',
    initials: 'س م',
    meta: '12 أيلول · علاج جذور',
    score: '5.0 ★',
    body: 'شرح الخيارات بوضوح والتزم بالموعد. التقييم مرتبط بخدمة علاج الجذور.',
    explanation: 98,
    punctuality: 96,
    communication: 95,
  },
  {
    providerId: 'provider-layan',
    serviceCode: 'dental-checkup',
    dateKey: '2026-08-20',
    rating: 4,
    name: 'نور ع.',
    initials: 'ن ع',
    meta: '20 آب · فحص جذور',
    score: '4.0 ★',
    body: 'تجربة جيدة، وأوضح لي خطوات المتابعة بعد الإجراء.',
    explanation: 90,
    punctuality: 86,
    communication: 92,
  },
  // Reviews for service-eligible clinicians, with varied ratings and dimensions.
  {
    providerId: 'provider-omar',
    serviceCode: 'dental-filling',
    dateKey: '2026-10-01',
    rating: 5,
    name: 'أحمد س.',
    initials: 'أح',
    meta: '1 تشرين الأول · dental-filling',
    score: '5.0 ★',
    body: 'الحشوة تمت بشكل مريح والشرح قبل الجلسة كان واضحاً.',
    explanation: 89,
    punctuality: 84,
    communication: 90,
  },
  {
    providerId: 'provider-karim',
    serviceCode: 'root-canal',
    dateKey: '2026-09-02',
    rating: 4,
    name: 'ميس ا.',
    initials: 'مي',
    meta: '2 أيلول · root-canal',
    score: '4.0 ★',
    body: 'توضيح جيد للخيارات والخطوات المطلوبة بعد العلاج.',
    explanation: 90,
    punctuality: 85,
    communication: 91,
  },
  {
    providerId: 'provider-rima',
    serviceCode: 'root-canal',
    dateKey: '2026-10-03',
    rating: 5,
    name: 'ليلى ح.',
    initials: 'لي',
    meta: '3 تشرين الأول · root-canal',
    score: '5.0 ★',
    body: 'الجلسة مريحة والمتابعة منظمة.',
    explanation: 91,
    punctuality: 86,
    communication: 92,
  },
  {
    providerId: 'provider-rama',
    serviceCode: 'teeth-whitening',
    dateKey: '2026-09-04',
    rating: 5,
    name: 'هبة ي.',
    initials: 'هب',
    meta: '4 أيلول · teeth-whitening',
    score: '5.0 ★',
    body: 'النتيجة قريبة من المتوقع بعد شرح الخيارات.',
    explanation: 92,
    punctuality: 87,
    communication: 93,
  },
  {
    providerId: 'provider-yazan',
    serviceCode: 'dental-checkup',
    dateKey: '2026-10-05',
    rating: 4,
    name: 'محمد ف.',
    initials: 'مح',
    meta: '5 تشرين الأول · dental-checkup',
    score: '4.0 ★',
    body: 'شرح واضح للفحص والخطوات اللاحقة.',
    explanation: 93,
    punctuality: 88,
    communication: 94,
  },
  {
    providerId: 'provider-nour',
    serviceCode: 'periodontics',
    dateKey: '2026-09-06',
    rating: 5,
    name: 'علي ن.',
    initials: 'عل',
    meta: '6 أيلول · periodontics',
    score: '5.0 ★',
    body: 'خطة تنظيف اللثة مفصلة والتعليمات مفيدة.',
    explanation: 94,
    punctuality: 89,
    communication: 95,
  },
  {
    providerId: 'provider-samer',
    serviceCode: 'wisdom-teeth',
    dateKey: '2026-10-07',
    rating: 4,
    name: 'زينب ر.',
    initials: 'زي',
    meta: '7 تشرين الأول · wisdom-teeth',
    score: '4.0 ★',
    body: 'شرح المخاطر والتعليمات بعد القلع جيد.',
    explanation: 95,
    punctuality: 90,
    communication: 96,
  },
  {
    providerId: 'provider-hala',
    serviceCode: 'crowns',
    dateKey: '2026-09-08',
    rating: 5,
    name: 'شادي ك.',
    initials: 'شا',
    meta: '8 أيلول · crowns',
    score: '5.0 ★',
    body: 'التاج ملائم بعد مراجعة القياسات.',
    explanation: 96,
    punctuality: 91,
    communication: 97,
  },
  {
    providerId: 'provider-majed',
    serviceCode: 'implant',
    dateKey: '2026-10-09',
    rating: 5,
    name: 'وسيم ط.',
    initials: 'وس',
    meta: '9 تشرين الأول · implant',
    score: '5.0 ★',
    body: 'شرح مراحل الزراعة والتكلفة قبل اعتماد الخطة.',
    explanation: 97,
    punctuality: 92,
    communication: 98,
  },
  {
    providerId: 'provider-dima',
    serviceCode: 'pediatric-dentistry',
    dateKey: '2026-09-10',
    rating: 5,
    name: 'أم سارة',
    initials: 'أم',
    meta: '10 أيلول · pediatric-dentistry',
    score: '5.0 ★',
    body: 'تعامل هادئ مع الطفل وتواصل واضح مع الأهل.',
    explanation: 98,
    punctuality: 93,
    communication: 90,
  },
  {
    providerId: 'provider-fadi',
    serviceCode: 'root-retreatment',
    dateKey: '2026-10-11',
    rating: 4,
    name: 'خالد ب.',
    initials: 'خا',
    meta: '11 تشرين الأول · root-retreatment',
    score: '4.0 ★',
    body: 'راجع الطبيب الأشعة وأوضح سبب إعادة المعالجة.',
    explanation: 89,
    punctuality: 94,
    communication: 91,
  },
  {
    providerId: 'provider-rasha',
    serviceCode: 'veneers',
    dateKey: '2026-09-12',
    rating: 4,
    name: 'حنان د.',
    initials: 'حن',
    meta: '12 أيلول · veneers',
    score: '4.0 ★',
    body: 'ناقشنا بدائل المواد قبل اختيار الفينير.',
    explanation: 90,
    punctuality: 95,
    communication: 92,
  },
  {
    providerId: 'provider-tarek',
    serviceCode: 'dentures',
    dateKey: '2026-10-13',
    rating: 5,
    name: 'سمير ج.',
    initials: 'سم',
    meta: '13 تشرين الأول · dentures',
    score: '5.0 ★',
    body: 'التعديلات بعد تجربة الطقم حسّنت الراحة.',
    explanation: 91,
    punctuality: 96,
    communication: 93,
  },
  {
    providerId: 'provider-lina',
    serviceCode: 'dental-filling',
    dateKey: '2026-09-14',
    rating: 5,
    name: 'نور ك.',
    initials: 'نو',
    meta: '14 أيلول · dental-filling',
    score: '5.0 ★',
    body: 'شرح جيد للحشوة وتوقيت الجلسة مناسب.',
    explanation: 92,
    punctuality: 97,
    communication: 94,
  },
  {
    providerId: 'provider-bassam',
    serviceCode: 'extraction',
    dateKey: '2026-10-15',
    rating: 4,
    name: 'فاطمة م.',
    initials: 'فا',
    meta: '15 تشرين الأول · extraction',
    score: '4.0 ★',
    body: 'تعليمات واضحة لما بعد القلع.',
    explanation: 93,
    punctuality: 84,
    communication: 95,
  },
  {
    providerId: 'provider-salwa',
    serviceCode: 'implant-prosthetics',
    dateKey: '2026-09-16',
    rating: 5,
    name: 'مازن ش.',
    initials: 'ما',
    meta: '16 أيلول · implant-prosthetics',
    score: '5.0 ★',
    body: 'متابعة دقيقة لملاءمة التعويض النهائي.',
    explanation: 94,
    punctuality: 85,
    communication: 96,
  },
  {
    providerId: 'provider-anas',
    serviceCode: 'root-canal',
    dateKey: '2026-10-17',
    rating: 5,
    name: 'هدى م.',
    initials: 'هد',
    meta: '17 تشرين الأول · root-canal',
    score: '5.0 ★',
    body: 'شرح الخطوات وتحديد موعد المتابعة بوضوح.',
    explanation: 95,
    punctuality: 86,
    communication: 97,
  },
  {
    providerId: 'provider-rana',
    serviceCode: 'periodontics',
    dateKey: '2026-09-18',
    rating: 5,
    name: 'إيمان ح.',
    initials: 'إي',
    meta: '18 أيلول · periodontics',
    score: '5.0 ★',
    body: 'تقسيم تنظيف اللثة إلى جلسات كان مناسباً.',
    explanation: 96,
    punctuality: 87,
    communication: 98,
  },
  {
    providerId: 'provider-nour-hassan',
    serviceCode: 'crowns',
    dateKey: '2026-10-19',
    rating: 5,
    name: 'باسل ي.',
    initials: 'با',
    meta: '19 تشرين الأول · crowns',
    score: '5.0 ★',
    body: 'التاج النهائي مطابق للتجربة المؤقتة.',
    explanation: 97,
    punctuality: 88,
    communication: 90,
  },
] as const;
