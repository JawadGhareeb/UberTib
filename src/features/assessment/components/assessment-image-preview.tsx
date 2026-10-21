import { useState } from 'react';
import { Image, Modal, Pressable, View, useWindowDimensions } from 'react-native';

import { AppIcon, AppText } from '@/shared/components/ui';

export interface PreviewImage {
  uri: string;
  fileName: string;
}

/** Local images only. Non-image medical documents require a different viewer. */
export function AssessmentImagePreview({
  images,
  activeUri,
  onChange,
  onClose,
}: {
  images: readonly PreviewImage[];
  activeUri: string | null;
  onChange: (uri: string) => void;
  onClose: () => void;
}) {
  const { height } = useWindowDimensions();
  const [failedUri, setFailedUri] = useState<string | null>(null);
  const activeIndex = activeUri ? images.findIndex((item) => item.uri === activeUri) : -1;
  const active = activeIndex >= 0 ? images[activeIndex] : undefined;
  const canNavigate = images.length > 1;
  const closePreview = () => {
    setFailedUri(null);
    onClose();
  };

  const move = (step: -1 | 1) => {
    if (!active || !canNavigate) return;
    const nextIndex = (activeIndex + step + images.length) % images.length;
    const next = images[nextIndex];
    if (next) {
      setFailedUri(null);
      onChange(next.uri);
    }
  };

  return (
    <Modal
      animationType="fade"
      transparent
      statusBarTranslucent
      visible={Boolean(active)}
      onRequestClose={closePreview}
    >
      <View className="flex-1 items-center justify-center bg-surface-scrim/95 px-4">
        <View className="w-full max-w-[430px] gap-3">
          <View className="flex-row-reverse items-center justify-between gap-3">
            <AppText
              align="right"
              variant="label"
              numberOfLines={1}
              className="min-w-0 flex-1 font-ui-semibold text-content-on-action"
            >
              {active?.fileName ?? ''}
            </AppText>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="إغلاق معاينة الصورة"
              className="h-11 w-11 items-center justify-center rounded-full bg-surface-default"
              onPress={closePreview}
            >
              <AppIcon name={{ ios: 'xmark', android: 'close', web: 'close' }} tone="secondary" />
            </Pressable>
          </View>

          <View
            className="w-full items-center justify-center overflow-hidden rounded-[16px] bg-surface-default"
            style={{ height: Math.min(560, Math.max(250, height * 0.6)) }}
          >
            {active && failedUri !== active.uri ? (
              <Image
                key={active.uri}
                accessibilityLabel={'صورة المرفق ' + active.fileName}
                source={{ uri: active.uri }}
                resizeMode="contain"
                className="h-full w-full"
                onError={() => setFailedUri(active.uri)}
              />
            ) : (
              <View className="items-center gap-2 px-4">
                <AppIcon
                  name={{ ios: 'photo', android: 'broken_image', web: 'broken_image' }}
                  size={30}
                  tone="secondary"
                />
                <AppText align="center" variant="label" className="text-content-secondary">
                  تعذّر عرض الصورة على هذا الجهاز.
                </AppText>
              </View>
            )}
          </View>

          <View className="flex-row items-center justify-between">
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="الصورة السابقة"
              accessibilityState={{ disabled: !canNavigate }}
              disabled={!canNavigate}
              className="h-11 w-11 items-center justify-center rounded-full bg-surface-default"
              onPress={() => move(-1)}
            >
              <AppIcon
                name={{ ios: 'chevron.left', android: 'chevron_left', web: 'chevron_left' }}
                tone={canNavigate ? 'action' : 'secondary'}
              />
            </Pressable>
            <AppText
              align="center"
              variant="label"
              className="font-ui-semibold text-content-on-action"
            >
              {active ? `${activeIndex + 1} / ${images.length}` : ''}
            </AppText>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="الصورة التالية"
              accessibilityState={{ disabled: !canNavigate }}
              disabled={!canNavigate}
              className="h-11 w-11 items-center justify-center rounded-full bg-surface-default"
              onPress={() => move(1)}
            >
              <AppIcon
                name={{ ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' }}
                tone={canNavigate ? 'action' : 'secondary'}
              />
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
