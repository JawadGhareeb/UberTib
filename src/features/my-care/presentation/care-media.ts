import { mockMediaImages } from '@/shared/mock/media.mock';

export interface MockCareMedia {
  imageUrl: string;
  accessibilityLabel: string;
}

const defaultCareMedia: MockCareMedia = {
  imageUrl: mockMediaImages.xray,
  accessibilityLabel: 'صورة توضيحية مرتبطة بحالة علاج العصب',
};

const careMedia: Record<string, MockCareMedia> = {
  'case-001': defaultCareMedia,
  'case-002': {
    imageUrl: mockMediaImages.procedure,
    accessibilityLabel: 'صورة توضيحية مرتبطة بحالة ترميم الأسنان',
  },
  'case-003': {
    imageUrl: mockMediaImages.clinic,
    accessibilityLabel: 'صورة توضيحية مرتبطة بمتابعة علاج اللثة',
  },
  'case-004': {
    imageUrl: mockMediaImages.procedure,
    accessibilityLabel: 'صورة توضيحية مرتبطة بحالة تركيب التاج',
  },
};

export function getCareCaseMedia(caseId: string): MockCareMedia {
  return careMedia[caseId] ?? defaultCareMedia;
}
