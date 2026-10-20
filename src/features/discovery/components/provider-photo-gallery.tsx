import { useState } from 'react';
import { Image, Modal, Pressable, View } from 'react-native';

import { AppIcon, AppText } from '@/shared/components/ui';
import { ProviderAvatar } from '@/features/discovery/components/provider-avatar';

/** Demo imagery only. Never present these as pictures of this doctor's actual branch. */
const CLINIC_TOUR = [
  {
    label: 'التجهيزات',
    uri: 'https://images.unsplash.com/photo-1704455306251-b4634215d98f?auto=format&fit=crop&w=720&q=78',
  },
  {
    label: 'غرفة العلاج',
    uri: 'https://images.unsplash.com/photo-1642844771937-23accb161a3d?auto=format&fit=crop&w=720&q=78',
  },
  {
    label: 'الاستقبال',
    uri: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=720&q=78',
  },
] as const;

export const DEMO_CLINIC_PHOTOS = CLINIC_TOUR.map((photo) => photo.uri);
export const DEMO_PROVIDER_PORTRAIT = 'https://i.pravatar.cc/240?img=47';

function Photo({
  uri,
  className,
  fallbackLabel = 'صورة العيادة',
}: {
  uri: string;
  className: string;
  fallbackLabel?: string;
}) {
  const [failed, setFailed] = useState(false);
  return (
    <View className={`overflow-hidden rounded-[13px] bg-action-subtle ${className}`}>
      {failed ? (
        <View className="flex-1 items-center justify-center gap-1">
          <AppIcon
            name={{ ios: 'photo', android: 'image', web: 'image' }}
            size={25}
            tone="action"
          />
          <AppText align="center" className="text-content-secondary" variant="caption">
            {fallbackLabel}
          </AppText>
        </View>
      ) : (
        <Image
          accessibilityLabel={fallbackLabel + '، صورة توضيحية'}
          className="h-full w-full"
          onError={() => setFailed(true)}
          resizeMode="cover"
          source={{ uri }}
        />
      )}
    </View>
  );
}

export function ProviderPortrait({
  size = 68,
  uri = DEMO_PROVIDER_PORTRAIT,
}: {
  size?: number;
  uri?: string;
}) {
  return <ProviderAvatar imageUrl={uri} size={size} />;
}

export function ProviderPhotoGallery({ compact = false }: { compact?: boolean }) {
  const [active, setActive] = useState(compact ? 0 : 2);
  const [previewOpen, setPreviewOpen] = useState(false);

  const openPreview = (index: number) => {
    setActive(index);
    setPreviewOpen(true);
  };

  return (
    <View>
      {compact ? (
        <View className="flex-row-reverse gap-2">
          {CLINIC_TOUR.map((photo, index) => (
            <Pressable
              accessibilityLabel={`عرض ${photo.label} بحجم أكبر، صورة توضيحية`}
              accessibilityRole="button"
              className="min-w-0 flex-1 items-center"
              key={photo.label}
              onPress={() => openPreview(index)}
            >
              <Photo className="h-[82px] w-full" fallbackLabel={photo.label} uri={photo.uri} />
              <AppText align="center" className="mt-1 text-content-secondary" variant="caption">
                {photo.label}
              </AppText>
            </Pressable>
          ))}
        </View>
      ) : (
        <View className="h-[144px] flex-row gap-2">
          <Pressable
            accessibilityLabel="عرض صورة العيادة بحجم أكبر"
            accessibilityRole="button"
            className="min-w-0 flex-1"
            onPress={() => openPreview(active)}
          >
            <Photo
              className="h-full w-full"
              key={DEMO_CLINIC_PHOTOS[active]}
              uri={DEMO_CLINIC_PHOTOS[active]!}
            />
          </Pressable>
          <View className="w-[95px] gap-2">
            {CLINIC_TOUR.map((photo, index) => ({ ...photo, index }))
              .filter((photo) => photo.index !== active)
              .map((photo) => (
                <Pressable
                  accessibilityLabel={`عرض ${photo.label} بحجم أكبر`}
                  accessibilityRole="button"
                  className="min-h-0 flex-1"
                  key={photo.label}
                  onPress={() => openPreview(photo.index)}
                >
                  <Photo className="h-full w-full" fallbackLabel={photo.label} uri={photo.uri} />
                </Pressable>
              ))}
          </View>
        </View>
      )}
      <AppText
        align="right"
        className="mt-1 text-content-secondary"
        style={{ fontSize: 10, lineHeight: 16 }}
        variant="caption"
      >
        صور توضيحية للتصميم، وليست صور هذا الفرع
      </AppText>

      <Modal
        animationType="fade"
        onRequestClose={() => setPreviewOpen(false)}
        transparent
        visible={previewOpen}
      >
        <View className="flex-1 items-center justify-center bg-surface-scrim/95 px-4">
          <View className="w-full max-w-[430px]">
            <Pressable
              accessibilityLabel="إغلاق الصورة"
              accessibilityRole="button"
              className="mb-3 h-11 w-11 self-end items-center justify-center rounded-full bg-surface-default"
              onPress={() => setPreviewOpen(false)}
            >
              <AppIcon name={{ ios: 'xmark', android: 'close', web: 'close' }} tone="secondary" />
            </Pressable>
            <Photo
              className="h-[270px] w-full"
              fallbackLabel={CLINIC_TOUR[active]!.label}
              uri={DEMO_CLINIC_PHOTOS[active]!}
            />
            <AppText align="center" className="mt-3 text-content-on-action" variant="label">
              {CLINIC_TOUR[active]!.label} · صورة توضيحية
            </AppText>
            <View className="mt-3 flex-row items-center justify-between">
              <Pressable
                accessibilityLabel="الصورة السابقة"
                accessibilityRole="button"
                className="h-11 w-11 items-center justify-center rounded-full bg-surface-default"
                onPress={() =>
                  setActive((index) => (index - 1 + CLINIC_TOUR.length) % CLINIC_TOUR.length)
                }
              >
                <AppIcon
                  name={{ ios: 'chevron.left', android: 'chevron_left', web: 'chevron_left' }}
                  tone="secondary"
                />
              </Pressable>
              <AppText className="text-content-on-action" variant="caption">
                {active + 1} / {CLINIC_TOUR.length}
              </AppText>
              <Pressable
                accessibilityLabel="الصورة التالية"
                accessibilityRole="button"
                className="h-11 w-11 items-center justify-center rounded-full bg-surface-default"
                onPress={() => setActive((index) => (index + 1) % CLINIC_TOUR.length)}
              >
                <AppIcon
                  name={{ ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' }}
                  tone="secondary"
                />
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
