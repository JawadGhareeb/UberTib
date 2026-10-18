import { mockMediaImages } from '@/shared/mock/media.mock';

export interface MockServiceMedia {
  imageUrl: string;
  accessibilityLabel: string;
}

const defaultServiceMedia: MockServiceMedia = {
  imageUrl: mockMediaImages.clinic,
  accessibilityLabel: 'صورة توضيحية لعيادة أسنان وتجهيزات الفحص',
};

const groupMedia: Record<string, MockServiceMedia> = {
  'preventive-care': defaultServiceMedia,
  'restorative-care': {
    imageUrl: mockMediaImages.procedure,
    accessibilityLabel: 'صورة توضيحية لعلاج أسنان داخل العيادة',
  },
  'cosmetic-care': {
    imageUrl: mockMediaImages.clinic,
    accessibilityLabel: 'صورة توضيحية لعيادة أسنان حديثة',
  },
};

const serviceMedia: Record<string, MockServiceMedia> = {
  'dental-checkup': {
    imageUrl: mockMediaImages.clinic,
    accessibilityLabel: 'صورة توضيحية لفحص الأسنان داخل العيادة',
  },
  'dental-cleaning': {
    imageUrl: mockMediaImages.clinic,
    accessibilityLabel: 'صورة توضيحية للعناية الوقائية وتنظيف الأسنان',
  },
  'dental-filling': {
    imageUrl: mockMediaImages.procedure,
    accessibilityLabel: 'صورة توضيحية لإجراء ترميم الأسنان',
  },
  'root-canal': {
    imageUrl: mockMediaImages.xray,
    accessibilityLabel: 'صورة توضيحية لصورة أشعة أسنان مرتبطة بعلاج العصب',
  },
  'teeth-whitening': {
    imageUrl: mockMediaImages.clinic,
    accessibilityLabel: 'صورة توضيحية لخدمة تجميلية للأسنان',
  },
};

export function getServiceGroupMedia(code: string): MockServiceMedia {
  return groupMedia[code] ?? defaultServiceMedia;
}

export function getServiceMedia(code: string): MockServiceMedia {
  return serviceMedia[code] ?? defaultServiceMedia;
}
