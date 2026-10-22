import type { AssessmentMediaAttachment } from '@/features/assessment/state/assessment-session-provider';

const imageExtensions = [
  'jpg',
  'jpeg',
  'png',
  'webp',
  'heic',
  'heif',
  'bmp',
  'tif',
  'tiff',
] as const;
const radiographExtensions = [...imageExtensions, 'pdf', 'dcm', 'dicom'] as const;
const documentExtensions = [...imageExtensions, 'pdf', 'doc', 'docx'] as const;
const videoExtensions = ['mp4', 'mov', 'm4v', 'webm', '3gp'] as const;
const modelExtensions = ['stl', 'ply', 'obj', 'zip'] as const;

export const attachmentCategoryRules = {
  'صورة خارج الفم': { extensions: imageExtensions, pickerMimes: ['image/*'], source: 'photo' },
  'صورة داخل الفم': { extensions: imageExtensions, pickerMimes: ['image/*'], source: 'photo' },
  'أشعة بانورامية': {
    extensions: radiographExtensions,
    pickerMimes: ['image/*', 'application/pdf', '*/*'],
    source: 'photo',
  },
  'أشعة حول الذروة': {
    extensions: radiographExtensions,
    pickerMimes: ['image/*', 'application/pdf', '*/*'],
    source: 'photo',
  },
  'أشعة عضّية': {
    extensions: radiographExtensions,
    pickerMimes: ['image/*', 'application/pdf', '*/*'],
    source: 'photo',
  },
  'تصوير ثلاثي الأبعاد CBCT': {
    extensions: ['dcm', 'dicom', 'zip'],
    pickerMimes: ['*/*'],
    source: 'document',
  },
  'مسح أسنان ثلاثي الأبعاد': {
    extensions: modelExtensions,
    pickerMimes: ['*/*'],
    source: 'document',
  },
  'تقرير طبي': {
    extensions: documentExtensions,
    pickerMimes: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/*',
    ],
    source: 'document',
  },
  'إحالة طبية': {
    extensions: documentExtensions,
    pickerMimes: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/*',
    ],
    source: 'document',
  },
  'فيديو للحالة': { extensions: videoExtensions, pickerMimes: ['video/*'], source: 'video' },
  'ملف طبي آخر': {
    extensions: [
      ...new Set([
        ...imageExtensions,
        ...radiographExtensions,
        ...documentExtensions,
        ...videoExtensions,
        ...modelExtensions,
      ]),
    ],
    pickerMimes: ['*/*'],
    source: 'document',
  },
} as const;

export type AttachmentCategory = keyof typeof attachmentCategoryRules;

export function isAttachmentCategory(value: string): value is AttachmentCategory {
  return Object.prototype.hasOwnProperty.call(attachmentCategoryRules, value);
}

export function attachmentExtension(name: string): string {
  const last = name.split(/[?#]/)[0]?.split('/').pop() ?? '';
  const dot = last.lastIndexOf('.');
  return dot >= 0 ? last.slice(dot + 1).toLowerCase() : '';
}

const mimeExtensions: Record<string, readonly string[]> = {
  'image/jpeg': ['jpg', 'jpeg'],
  'image/png': ['png'],
  'image/webp': ['webp'],
  'image/heic': ['heic'],
  'image/heif': ['heif'],
  'image/bmp': ['bmp'],
  'image/tiff': ['tif', 'tiff'],
  'application/pdf': ['pdf'],
  'application/msword': ['doc'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['docx'],
  'application/dicom': ['dcm', 'dicom'],
  'application/zip': ['zip'],
  'application/x-zip-compressed': ['zip'],
  'video/mp4': ['mp4', 'm4v'],
  'video/quicktime': ['mov'],
  'video/webm': ['webm'],
  'video/3gpp': ['3gp'],
  'model/stl': ['stl'],
  'model/obj': ['obj'],
  'application/sla': ['stl'],
  'application/vnd.ms-pki.stl': ['stl'],
  'application/x-ply': ['ply'],
};

/** Check the selected clinical category AND actual format; a mismatched file is rejected. */
export function validateAttachmentCategory(
  file: Pick<AssessmentMediaAttachment, 'fileName' | 'mimeType'>,
  category: string,
): boolean {
  if (!isAttachmentCategory(category)) return false;
  const extension = attachmentExtension(file.fileName);
  const mime = file.mimeType?.trim().toLowerCase().split(';')[0] ?? '';
  const allowed = new Set<string>(attachmentCategoryRules[category].extensions);
  if (extension) {
    if (!allowed.has(extension)) return false;
    const known = mimeExtensions[mime];
    // Some providers label dental models and DICOM as generic binary. Accept by
    // recognized extension, but reject a contradictory known MIME (e.g. PNG named .mp4).
    if (known && !known.includes(extension)) return false;
    // A declared photo/video MIME must be one of our recognized formats. An
    // unknown MIME such as image/gif must not be accepted under a .jpg filename.
    if ((mime.startsWith('image/') || mime.startsWith('video/')) && !known) return false;
    // Vendor-specific dental DICOM/mesh MIME types may be unknown; the recognized
    // file extension remains the fallback for these specialist binary formats.
    return true;
  }
  // Picker assets on some devices have no filename: accept only known MIME
  // associated with an allowed extension, never an arbitrary unknown file.
  return Boolean(mimeExtensions[mime]?.some((ext) => allowed.has(ext)));
}

export function getCategoryExtensions(category: AttachmentCategory): string {
  return attachmentCategoryRules[category].extensions.map((ext) => ext.toUpperCase()).join('، ');
}

export function documentPickerMimes(category: AttachmentCategory): string[] {
  return [...attachmentCategoryRules[category].pickerMimes];
}

export function categoryMediaSource(category: AttachmentCategory): 'photo' | 'video' | 'document' {
  return attachmentCategoryRules[category].source;
}

export function isPreviewableImage(
  file: Pick<AssessmentMediaAttachment, 'fileName' | 'mimeType'>,
): boolean {
  const ext = attachmentExtension(file.fileName);
  return (
    imageExtensions.includes(ext as (typeof imageExtensions)[number]) &&
    !file.mimeType?.startsWith('video/')
  );
}
