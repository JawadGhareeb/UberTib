import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Image, Pressable, View } from 'react-native';

import { IntroArtwork } from '@/features/app-entry/components/intro-artwork';
import { AssessmentScaffold } from '@/features/assessment/components/assessment-scaffold';
import { AssessmentImagePreview } from '@/features/assessment/components/assessment-image-preview';
import {
  MediaSourceDialog,
  type MediaSource,
} from '@/features/assessment/components/media-source-dialog';
import {
  useAssessmentSession,
  type AssessmentMediaAttachment,
} from '@/features/assessment/state/assessment-session-provider';
import { AppIcon, AppText, Button } from '@/shared/components/ui';
import type { AppIconName } from '@/shared/components/ui/app-icon';

const MAX_FILE_BYTES = 25 * 1024 * 1024;
const MAX_ATTACHMENTS = 6;
const acceptedExtensions = new Set([
  'jpg',
  'jpeg',
  'png',
  'webp',
  'heic',
  'heif',
  'bmp',
  'tif',
  'tiff',
  'pdf',
  'doc',
  'docx',
  'dcm',
  'dicom',
  'stl',
  'ply',
  'obj',
  'zip',
]);
const imageExtensions = new Set([
  'jpg',
  'jpeg',
  'png',
  'webp',
  'heic',
  'heif',
  'bmp',
  'tif',
  'tiff',
]);
const acceptedMimes = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/heic',
  'image/heif',
  'image/bmp',
  'image/tiff',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/dicom',
  'application/zip',
  'application/x-zip-compressed',
]);
const mediaTypes: { label: string; icon: AppIconName }[] = [
  { label: 'صورة المريض', icon: { ios: 'person.crop.square', android: 'person', web: 'person' } },
  { label: 'داخل الفم', icon: { ios: 'camera', android: 'photo_camera', web: 'photo_camera' } },
  { label: 'بانوراما', icon: { ios: 'viewfinder', android: 'panorama', web: 'panorama' } },
  {
    label: 'حول الذروة',
    icon: { ios: 'viewfinder', android: 'center_focus_strong', web: 'center_focus_strong' },
  },
  { label: 'عضّية', icon: { ios: 'rectangle.split.3x1', android: 'view_week', web: 'view_week' } },
  { label: 'CBCT / 3D', icon: { ios: 'cube.fill', android: 'view_in_ar', web: 'view_in_ar' } },
  { label: 'مسح', icon: { ios: 'viewfinder', android: 'scanner', web: 'scanner' } },
  { label: 'إحالة', icon: { ios: 'doc.text', android: 'description', web: 'description' } },
  { label: 'تقرير', icon: { ios: 'doc.text.fill', android: 'article', web: 'article' } },
  { label: 'PDF', icon: { ios: 'doc', android: 'picture_as_pdf', web: 'picture_as_pdf' } },
];

function extensionOf(name: string): string {
  return name.split('.').pop()?.toLowerCase() ?? '';
}

function isImage(file: AssessmentMediaAttachment): boolean {
  return Boolean(
    file.mimeType?.startsWith('image/') || imageExtensions.has(extensionOf(file.fileName)),
  );
}

function readableSize(size?: number): string {
  if (!size) return '';
  return size < 1048576
    ? Math.max(1, Math.round(size / 1024)) + ' KB'
    : (size / 1048576).toFixed(1) + ' MB';
}

export function AssessmentMediaScreen() {
  const router = useRouter();
  const { returnTo } = useLocalSearchParams<{ returnTo?: string }>();
  const { mediaAttachments, addMediaAttachments, removeMediaAttachment } = useAssessmentSession();
  const [picking, setPicking] = useState(false);
  const [pickerError, setPickerError] = useState('');
  const [sourceDialogOpen, setSourceDialogOpen] = useState(false);
  const [sourceLaunching, setSourceLaunching] = useState(false);
  const [previewUri, setPreviewUri] = useState<string | null>(null);
  const pickerTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (pickerTimerRef.current !== null) clearTimeout(pickerTimerRef.current);
    },
    [],
  );

  const validateAndAdd = (files: AssessmentMediaAttachment[]) => {
    const accepted: AssessmentMediaAttachment[] = [];
    for (const file of files) {
      const mimeType = file.mimeType?.toLowerCase();
      if (
        !acceptedExtensions.has(extensionOf(file.fileName)) &&
        !(mimeType && acceptedMimes.has(mimeType))
      ) {
        setPickerError('نوع الملف غير مدعوم. اختر صورة أو PDF أو ملف أشعة أو تقرير طبي.');
        continue;
      }
      if (file.size && file.size > MAX_FILE_BYTES) {
        setPickerError('حجم الملف كبير. الحد الأقصى لكل ملف 25 ميغابايت.');
        continue;
      }
      accepted.push(file);
    }
    const slotsLeft = MAX_ATTACHMENTS - mediaAttachments.length;
    if (accepted.length > slotsLeft) {
      setPickerError('يمكنك إضافة حتى 6 ملفات فقط في هذا التقييم.');
    }
    if (slotsLeft > 0) addMediaAttachments(accepted.slice(0, slotsLeft));
  };

  const pickImage = async (camera = false) => {
    if (picking) return;
    setPickerError('');
    if (mediaAttachments.length >= MAX_ATTACHMENTS) {
      setPickerError('وصلت إلى الحد الأقصى للمرفقات (6).');
      return;
    }
    setPicking(true);
    try {
      if (camera) {
        const permission = await ImagePicker.requestCameraPermissionsAsync();
        if (!permission.granted) {
          setPickerError('اسمح للتطبيق باستخدام الكاميرا لالتقاط صورة.');
          return;
        }
      }
      const result = camera
        ? await ImagePicker.launchCameraAsync({ mediaTypes: ['images'], quality: 0.85 })
        : await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsMultipleSelection: true,
            quality: 0.85,
          });
      if (result.canceled) return;
      validateAndAdd(
        result.assets.map((asset) => ({
          uri: asset.uri,
          fileName: asset.fileName ?? 'صورة الأسنان.jpg',
          mimeType: asset.mimeType ?? 'image/jpeg',
          size: asset.fileSize,
          width: asset.width,
          height: asset.height,
        })),
      );
    } catch {
      setPickerError(
        camera ? 'تعذر تشغيل الكاميرا. يمكنك الاختيار من المعرض.' : 'تعذر فتح الصور. حاول مجدداً.',
      );
    } finally {
      setPicking(false);
    }
  };

  const pickDocument = async () => {
    if (picking) return;
    setPickerError('');
    if (mediaAttachments.length >= MAX_ATTACHMENTS) {
      setPickerError('وصلت إلى الحد الأقصى للمرفقات (6).');
      return;
    }
    setPicking(true);
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
        multiple: true,
      });
      if (result.canceled) return;
      validateAndAdd(
        result.assets.map((asset) => ({
          uri: asset.uri,
          fileName: asset.name,
          mimeType: asset.mimeType,
          size: asset.size,
        })),
      );
    } catch {
      setPickerError('تعذر فتح ملفات الجهاز. حاول مجدداً.');
    } finally {
      setPicking(false);
    }
  };

  const openMediaSource = () => {
    if (picking || sourceLaunching) return;
    if (mediaAttachments.length >= MAX_ATTACHMENTS) {
      setPickerError('وصلت إلى الحد الأقصى للمرفقات (6).');
      return;
    }
    setPickerError('');
    setSourceDialogOpen(true);
  };

  const selectMediaSource = (source: MediaSource) => {
    if (sourceLaunching || picking) return;
    setSourceDialogOpen(false);
    setSourceLaunching(true);

    // The custom modal must fully dismiss before opening the native camera,
    // photo library or document picker, especially on Android.
    pickerTimerRef.current = setTimeout(() => {
      pickerTimerRef.current = null;
      setSourceLaunching(false);
      if (source === 'files') void pickDocument();
      else void pickImage(source === 'camera');
    }, 280);
  };

  const imageAttachments = mediaAttachments.filter(isImage);
  const firstImage = imageAttachments[0];

  return (
    <AssessmentScaffold
      title="أضف صوراً أو ملفات (اختياري)"
      phase="الصور والملفات"
      primaryLabel={mediaAttachments.length ? 'متابعة' : 'متابعة بدون مرفقات'}
      primaryDisabled={picking || sourceLaunching || sourceDialogOpen}
      onPrimary={() => {
        if (returnTo === 'review') {
          if (router.canGoBack()) router.back();
          else router.replace('/assessment/review');
        } else {
          router.push('/assessment/review');
        }
      }}
      topContent={
        <AppText
          align="right"
          className="pt-1 text-content-secondary"
          style={{ fontSize: 11, lineHeight: 18 }}
          variant="caption"
        >
          الصور والملفات تساعد في توجيه البحث، ولا تغني عن فحص الطبيب.
        </AppText>
      }
    >
      <View className="gap-3 rounded-[17px] border border-border-subtle bg-surface-default p-3">
        <View className="flex-row-reverse items-center gap-2">
          <Pressable
            accessibilityLabel="إضافة صورة أو ملف"
            accessibilityRole="button"
            className="h-9 w-9 items-center justify-center"
            disabled={picking || sourceLaunching}
            onPress={openMediaSource}
          >
            <AppIcon
              name={{ ios: 'camera', android: 'photo_camera', web: 'photo_camera' }}
              size={21}
              tone="action"
            />
          </Pressable>
          <AppText className="min-w-0 flex-1 font-ui-bold" variant="label">
            أرفق صورة للأسنان أو الأشعة
          </AppText>
          <View className="rounded-full bg-surface-default px-2.5 py-1">
            <AppText style={{ fontSize: 10 }} variant="caption">
              اختياري
            </AppText>
          </View>
        </View>

        <Pressable
          accessibilityLabel="اختيار مصدر الصورة أو الملف"
          accessibilityRole="button"
          className="min-h-[166px] items-center justify-center overflow-hidden rounded-[14px] border-2 border-dashed border-action-primary/40 bg-action-subtle px-3 py-3"
          disabled={picking || sourceLaunching}
          onPress={openMediaSource}
        >
          {firstImage ? (
            <Image
              accessibilityLabel="معاينة الصورة المضافة"
              className="h-[115px] w-full"
              resizeMode="contain"
              source={{ uri: firstImage.uri }}
            />
          ) : (
            <View className="w-full items-center gap-1">
              <IntroArtwork step={0} height={115} />
              <AppText variant="label" className="font-ui-semibold text-content-link">
                اضغط لإضافة صورة أو ملف
              </AppText>
              <AppText align="center" variant="caption" className="text-content-secondary">
                من الكاميرا أو المعرض أو ملفات الجهاز
              </AppText>
            </View>
          )}
        </Pressable>
        <AppText
          align="right"
          className="text-content-secondary"
          style={{ fontSize: 10.5, lineHeight: 17 }}
          variant="caption"
        >
          قرّب الكاميرا · استخدم ضوءاً واضحاً · أظهر المنطقة كاملة
        </AppText>
        <Button
          className="min-h-[48px] rounded-[12px]"
          endIcon={{ ios: 'plus', android: 'add', web: 'add' }}
          label="إضافة صورة أو ملف"
          loading={picking || sourceLaunching}
          onPress={openMediaSource}
          variant="outline"
        />
      </View>

      <View className="flex-row-reverse items-start gap-2 rounded-[11px] bg-tone-info-fill px-3 py-3">
        <AppIcon
          name={{ ios: 'info.circle', android: 'info_outline', web: 'info_outline' }}
          tone="info"
          size={17}
        />
        <AppText align="right" variant="caption" className="min-w-0 flex-1 text-tone-info-text">
          إضافة الملفات اختيارية. تأكد إن الصورة واضحة، وتستطيع حذفها قبل متابعة التقييم.
        </AppText>
      </View>

      {mediaAttachments.length ? (
        <View className="mt-3 rounded-[13px] border border-border-subtle bg-surface-default p-2.5">
          <AppText align="right" className="mb-1.5 font-ui-bold" variant="label">
            المرفقات المختارة ({mediaAttachments.length}/{MAX_ATTACHMENTS})
          </AppText>
          {mediaAttachments.map((file) => (
            <View className="min-h-[49px] flex-row-reverse items-center gap-2 py-1" key={file.uri}>
              {isImage(file) ? (
                <Image
                  className="h-10 w-10 rounded-[8px] bg-surface-subtle"
                  source={{ uri: file.uri }}
                />
              ) : (
                <View className="h-10 w-10 items-center justify-center rounded-[8px] bg-action-subtle">
                  <AppIcon
                    name={{ ios: 'doc', android: 'description', web: 'description' }}
                    size={18}
                    tone="action"
                  />
                </View>
              )}
              <View className="min-w-0 flex-1 items-end">
                <AppText
                  align="right"
                  className="font-ui-semibold"
                  numberOfLines={1}
                  style={{ fontSize: 11 }}
                  variant="label"
                >
                  {file.fileName}
                </AppText>
                <AppText style={{ fontSize: 10 }} variant="caption">
                  على هذا الجهاز فقط{file.size ? ' · ' + readableSize(file.size) : ''}
                </AppText>
              </View>
              {isImage(file) ? (
                <Pressable
                  accessibilityLabel={'عرض صورة ' + file.fileName}
                  accessibilityRole="button"
                  className="h-10 w-10 items-center justify-center rounded-[9px] bg-action-subtle"
                  onPress={() => setPreviewUri(file.uri)}
                >
                  <AppIcon
                    name={{ ios: 'eye', android: 'visibility', web: 'visibility' }}
                    size={18}
                    tone="action"
                  />
                </Pressable>
              ) : null}
              <Pressable
                accessibilityLabel={'إزالة ' + file.fileName}
                accessibilityRole="button"
                className="h-10 w-10 items-center justify-center rounded-[9px] bg-surface-subtle"
                onPress={() => removeMediaAttachment(file.uri)}
              >
                <AppIcon
                  name={{ ios: 'trash', android: 'delete_outline', web: 'delete_outline' }}
                  size={16}
                  tone="danger"
                />
              </Pressable>
            </View>
          ))}
          <AppText
            align="right"
            className="mt-1 text-content-secondary"
            style={{ fontSize: 10, lineHeight: 16 }}
            variant="caption"
          >
            المرفقات ضمن جلسة التقييم فقط ولم تُرفع إلى الخادم.
          </AppText>
        </View>
      ) : null}

      {pickerError ? (
        <View className="mt-2 flex-row-reverse items-center gap-2 rounded-[10px] border border-tone-danger-border bg-tone-danger-fill px-3 py-2.5">
          <AppIcon
            name={{ ios: 'exclamationmark.circle', android: 'error', web: 'error' }}
            size={16}
            tone="danger"
          />
          <AppText
            accessibilityLiveRegion="polite"
            className="min-w-0 flex-1 text-tone-danger-text"
            variant="caption"
          >
            {pickerError}
          </AppText>
        </View>
      ) : null}

      <View className="gap-2">
        <View className="flex-row-reverse items-center justify-between gap-2">
          <AppText className="font-ui-bold" variant="label">
            أنواع ملفات نتعرّف عليها
          </AppText>
          <AppText className="text-content-secondary" variant="caption">
            صورة، تقرير، أشعة أو مسح
          </AppText>
        </View>
        <View className="flex-row-reverse flex-wrap justify-between gap-y-2">
          {mediaTypes.map((type) => (
            <View
              className="min-h-[70px] w-[31.8%] items-center justify-center gap-1.5 rounded-[12px] border border-border-subtle bg-surface-default px-2 py-2"
              key={type.label}
            >
              <AppIcon name={type.icon} size={20} tone="action" />
              <AppText
                align="center"
                className="font-ui-semibold"
                numberOfLines={1}
                style={{ fontSize: 11, lineHeight: 17 }}
                variant="caption"
              >
                {type.label}
              </AppText>
            </View>
          ))}
        </View>
        <AppText
          align="right"
          className="mt-1 text-content-secondary"
          style={{ fontSize: 9.5, lineHeight: 15 }}
          variant="caption"
        >
          JPG، PNG، PDF، Word، DICOM، 3D · حتى 25 ميغابايت للملف
        </AppText>
      </View>
      <View className="mt-2 flex-row-reverse items-center gap-2 rounded-[11px] bg-tone-warning-fill px-3 py-2.5">
        <AppIcon
          name={{ ios: 'checkmark.shield', android: 'verified_user', web: 'verified_user' }}
          size={16}
          tone="warning"
        />
        <AppText
          className="min-w-0 flex-1 text-tone-warning-text"
          style={{ fontSize: 10.5, lineHeight: 17 }}
          variant="caption"
        >
          لا نطلب منك إجراء أشعة جديدة بنفسك.
        </AppText>
      </View>
      <AssessmentImagePreview
        images={imageAttachments}
        activeUri={previewUri}
        onChange={setPreviewUri}
        onClose={() => setPreviewUri(null)}
      />
      <MediaSourceDialog
        visible={sourceDialogOpen}
        onClose={() => setSourceDialogOpen(false)}
        onSelect={selectMediaSource}
      />
    </AssessmentScaffold>
  );
}
