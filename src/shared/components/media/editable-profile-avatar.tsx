import { Avatar, Button, FieldError } from 'heroui-native';
import { useEffect, useRef, useState } from 'react';
import { Pressable, View } from 'react-native';

import { MediaSourceDialog, type MediaSource } from '@/shared/components/media/media-source-dialog';
import {
  pickMediaFromDevice,
  type SelectedMediaFile,
} from '@/shared/components/media/media-picker';
import { OutlineIcon } from '@/shared/components/media/outline-icon';
import { useAppTheme } from '@/shared/theme/use-app-theme';

export interface EditableProfileAvatarProps {
  value: SelectedMediaFile | null;
  onChange: (value: SelectedMediaFile | null) => void;
  disabled?: boolean;
}

/** Controlled avatar editor that reuses the same source dialog as medical attachments. */
export function EditableProfileAvatar({
  value,
  onChange,
  disabled = false,
}: EditableProfileAvatarProps) {
  const { colors } = useAppTheme();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current !== null) clearTimeout(timer.current);
    },
    [],
  );

  const selectSource = (source: MediaSource) => {
    if (busy) return;
    setOpen(false);
    setError(undefined);
    setBusy(true);
    // Dismiss the HeroUI portal before presenting an OS camera/gallery picker.
    timer.current = setTimeout(() => {
      timer.current = null;
      void (async () => {
        try {
          const files = await pickMediaFromDevice(source, { squareCrop: true });
          if (files?.[0]) onChange(files[0]);
        } catch (cause) {
          setError(cause instanceof Error ? cause.message : 'تعذّر اختيار الصورة. حاول مرة ثانية.');
        } finally {
          setBusy(false);
        }
      })();
    }, 400);
  };

  return (
    <View className="items-center gap-1">
      <Pressable
        accessible
        accessibilityRole="button"
        accessibilityLabel={value ? 'تغيير الصورة الشخصية' : 'إضافة صورة شخصية'}
        accessibilityHint="اختيار صورة من المعرض أو الكاميرا"
        accessibilityState={{ disabled: busy || disabled }}
        disabled={busy || disabled}
        onPress={() => setOpen(true)}
        className="relative items-center justify-center"
      >
        <Avatar size="lg" color="accent" variant="soft">
          {value ? <Avatar.Image source={{ uri: value.uri }} /> : null}
          <Avatar.Fallback />
        </Avatar>
        <View
          pointerEvents="none"
          className="absolute -bottom-1 -right-2 h-8 w-8 items-center justify-center rounded-full border-2 border-surface-default bg-action-primary"
        >
          <OutlineIcon name="camera" size={17} color={colors.surface.inverse} />
        </View>
      </Pressable>
      {busy ? (
        <Button variant="ghost" size="sm" isDisabled>
          <Button.Label>جاري الاختيار...</Button.Label>
        </Button>
      ) : null}
      {value && !busy ? (
        <Button
          variant="ghost"
          size="sm"
          className="rounded-form-field"
          onPress={() => {
            onChange(null);
            setError(undefined);
          }}
        >
          <Button.Label className="text-text-secondary">إزالة الصورة</Button.Label>
        </Button>
      ) : null}
      <FieldError isInvalid={Boolean(error)}>{error}</FieldError>
      <MediaSourceDialog
        visible={open}
        onClose={() => setOpen(false)}
        onSelect={selectSource}
        allowFiles={false}
        busy={busy}
        title="الصورة الشخصية"
        description="التقط صورة جديدة أو اختر صورة من المعرض"
      />
    </View>
  );
}
