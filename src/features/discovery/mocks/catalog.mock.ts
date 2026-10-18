import type { ServiceGroupsResponse } from '@/features/discovery/api/catalog';
import { mockDelay } from '@/shared/mock/delay';

const approvedDefinition = {
  version: 1,
  audience: 'evaluation' as const,
  clinical_review_state: 'approved' as const,
  production_ready: true,
  protection: { funded: false as const },
};

const mockServiceGroups: ServiceGroupsResponse = {
  data: [
    {
      code: 'preventive-care',
      name: { ar: 'العناية الوقائية', en: 'Preventive care' },
      description_ar: 'فحوص وتنظيف ومتابعة دورية.',
      services: [
        {
          code: 'dental-checkup',
          slug: 'dental-checkup',
          name: { ar: 'فحص الأسنان', en: 'Dental checkup' },
          description_ar: 'فحص شامل وتحديد الخطوة المناسبة.',
          price_label: 'ابتداءً من 1,150 ل.س',
          provider_count: 12,
          duration_label: '30–45 دقيقة',
          next_available_label: 'متاح اليوم',
          definition: approvedDefinition,
        },
        {
          code: 'dental-cleaning',
          slug: 'dental-cleaning',
          name: { ar: 'تنظيف الأسنان', en: 'Dental cleaning' },
          description_ar: 'تنظيف احترافي وإزالة الترسبات.',
          price_label: 'ابتداءً من 1,750 ل.س',
          provider_count: 9,
          duration_label: '45–60 دقيقة',
          next_available_label: 'متاح غداً',
          definition: approvedDefinition,
        },
      ],
    },
    {
      code: 'restorative-care',
      name: { ar: 'العلاج والترميم', en: 'Restorative care' },
      description_ar: 'علاجات الترميم والعصب.',
      services: [
        {
          code: 'dental-filling',
          slug: 'dental-filling',
          name: { ar: 'حشوات الأسنان', en: 'Dental fillings' },
          description_ar: 'ترميم السن بعد التقييم السريري.',
          price_label: 'ابتداءً من 2,250 ل.س',
          provider_count: 14,
          duration_label: '45–75 دقيقة',
          next_available_label: 'متاح اليوم',
          definition: approvedDefinition,
        },
        {
          code: 'root-canal',
          slug: 'root-canal',
          name: { ar: 'علاج العصب', en: 'Root canal treatment' },
          description_ar: 'علاج متعدد المراحل بحسب حالة السن.',
          price_label: 'ابتداءً من 600 ل.س',
          provider_count: 7,
          duration_label: 'حسب الخطة',
          next_available_label: 'أقرب موعد السبت',
          definition: approvedDefinition,
        },
      ],
    },
    {
      code: 'cosmetic-care',
      name: { ar: 'العناية التجميلية', en: 'Cosmetic care' },
      description_ar: 'خيارات تجميلية بعد التقييم.',
      services: [
        {
          code: 'teeth-whitening',
          slug: 'teeth-whitening',
          name: { ar: 'تبييض الأسنان', en: 'Teeth whitening' },
          description_ar: 'جلسة تبييض احترافية بعد فحص ملاءمة الحالة.',
          price_label: 'ابتداءً من 4,750 ل.س',
          provider_count: 6,
          duration_label: '60–90 دقيقة',
          next_available_label: 'متاح الأحد',
          definition: approvedDefinition,
        },
      ],
    },
  ],
  meta: { mode: 'evaluation' },
};

export async function getMockServiceGroups(): Promise<ServiceGroupsResponse> {
  await mockDelay();
  return mockServiceGroups;
}
