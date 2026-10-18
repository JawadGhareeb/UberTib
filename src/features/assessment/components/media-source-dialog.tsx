import { Modal, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppIcon, AppText, Button } from '@/shared/components/ui';
import type { AppIconName } from '@/shared/components/ui/app-icon';
import { useAppTheme } from '@/shared/theme/theme-provider';

export type MediaSource = 'camera' | 'gallery' | 'files';

const sources: {
  id: MediaSource;
  title: string;
  description: string;
  icon: AppIconName;
}[] = [
  {
    id: 'camera',
    title: 'التقاط صورة',
    description: 'افتح الكاميرا لتصوير المنطقة المتأثرة',
    icon: { ios: 'camera', android: 'photo_camera', web: 'photo_camera' },
  },
  {
    id: 'gallery',
    title: 'اختيار من الصور',
    description: 'أضف صورة أو أكثر من معرض الجهاز',
    icon: { ios: 'photo.on.rectangle', android: 'photo_library', web: 'photo_library' },
  },
  {
    id: 'files',
    title: 'اختيار ملف',
    description: 'تقرير أو أشعة أو ملف طبي محفوظ',
    icon: { ios: 'doc', android: 'attach_file', web: 'attach_file' },
  },
];

interface MediaSourceDialogProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (source: MediaSource) => void;
}

/** Branded choice dialog. Native permission prompts and camera/media pickers remain OS-owned. */
export function MediaSourceDialog({ visible, onClose, onSelect }: MediaSourceDialogProps) {
  const { colors } = useAppTheme();
  const insets = useSafeAreaInsets();

  return (
    <Modal
      animationType="fade"
      hardwareAccelerated
      onRequestClose={onClose}
      presentationStyle="overFullScreen"
      statusBarTranslucent
      transparent
      visible={visible}
    >
      <View accessibilityViewIsModal className="flex-1 justify-end">
        <Pressable
          accessibilityLabel="إغلاق خيارات إضافة الصور والملفات"
          accessibilityRole="button"
          className="absolute inset-0"
          onPress={onClose}
          style={{ backgroundColor: colors.surface.scrim, opacity: 0.58 }}
        />

        <View
          className="w-full rounded-t-[22px] border border-border-subtle bg-surface-default px-4 pt-4"
          style={{
            backgroundColor: colors.surface.default,
            borderColor: colors.border.subtle,
            paddingBottom: Math.max(insets.bottom, 16),
          }}
        >
          <View className="mx-auto w-full max-w-[430px]">
            <View className="mb-3 flex-row-reverse items-center gap-3">
              <View
                className="h-11 w-11 items-center justify-center rounded-[12px]"
                style={{ backgroundColor: colors.action.subtle }}
              >
                <AppIcon
                  name={{ ios: 'camera.viewfinder', android: 'add_a_photo', web: 'add_a_photo' }}
                  size={21}
                  tone="action"
                />
              </View>
              <View className="min-w-0 flex-1 items-end">
                <AppText align="right" className="font-ui-bold" variant="heading-4">
                  إضافة صورة أو ملف
                </AppText>
                <AppText align="right" className="text-content-secondary" variant="caption">
                  اختر كيف تريد إضافة المرفق
                </AppText>
              </View>
              <Pressable
                accessibilityLabel="إغلاق"
                accessibilityRole="button"
                className="h-11 w-11 items-center justify-center rounded-full bg-surface-subtle"
                onPress={onClose}
              >
                <AppIcon
                  name={{ ios: 'xmark', android: 'close', web: 'close' }}
                  size={17}
                  tone="secondary"
                />
              </Pressable>
            </View>

            <View className="gap-2">
              {sources.map((source) => (
                <Pressable
                  accessibilityLabel={source.title}
                  accessibilityRole="button"
                  className="min-h-[70px] flex-row-reverse items-center gap-3 rounded-[12px] border border-border-subtle bg-surface-default px-3 py-2"
                  key={source.id}
                  onPress={() => onSelect(source.id)}
                  style={{
                    backgroundColor: colors.surface.default,
                    borderColor: colors.border.default,
                  }}
                >
                  <View
                    className="h-10 w-10 items-center justify-center rounded-[10px]"
                    style={{ backgroundColor: colors.action.subtle }}
                  >
                    <AppIcon name={source.icon} size={21} tone="action" />
                  </View>
                  <View className="min-w-0 flex-1 items-end">
                    <AppText align="right" className="font-ui-semibold" variant="label">
                      {source.title}
                    </AppText>
                    <AppText align="right" className="text-content-secondary" variant="caption">
                      {source.description}
                    </AppText>
                  </View>
                  <AppIcon
                    name={{ ios: 'chevron.left', android: 'chevron_left', web: 'chevron_left' }}
                    size={17}
                    tone="secondary"
                  />
                </Pressable>
              ))}
            </View>

            <AppText
              align="center"
              className="mt-3 text-content-secondary"
              variant="caption"
            >
              يمكنك متابعة التقييم بدون إضافة صور أو ملفات.
            </AppText>
            <Button className="mt-3 h-12" label="إلغاء" onPress={onClose} variant="outline" />
          </View>
        </View>
      </View>
    </Modal>
  );
}
