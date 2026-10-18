import { Button, Dialog, Typography } from 'heroui-native';
import { View } from 'react-native';

import { OutlineIcon, type OutlineIconName } from '@/shared/components/media/outline-icon';
import { useAppTheme } from '@/shared/theme/theme-provider';

export type MediaSource = 'camera' | 'gallery' | 'files';

type MediaSourceDialogProps = {
  visible: boolean;
  onClose: () => void;
  onSelect: (source: MediaSource) => void;
  allowFiles?: boolean;
  title?: string;
  description?: string;
  busy?: boolean;
};

const options: { key: MediaSource; label: string; details: string; icon: OutlineIconName }[] = [
  {
    key: 'camera',
    label: 'التقاط صورة',
    details: 'التقط صورة جديدة باستخدام الكاميرا',
    icon: 'camera',
  },
  { key: 'gallery', label: 'اختيار من المعرض', details: 'اختر صورة من صور الجهاز', icon: 'images' },
  {
    key: 'files',
    label: 'اختيار ملف',
    details: 'صور الأشعة، PDF أو ملف محفوظ على الجهاز',
    icon: 'file',
  },
];

/**
 * One presentational HeroUI dialog for account avatars and medical attachments.
 * Picker permissions, validation and upload are separate from this source-choice UI.
 */
export function MediaSourceDialog({
  visible,
  onClose,
  onSelect,
  allowFiles = true,
  title = 'إضافة صورة أو ملف',
  description = 'اختر المصدر الذي يناسبك',
  busy = false,
}: MediaSourceDialogProps) {
  const { colors } = useAppTheme();

  return (
    <Dialog
      isOpen={visible}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay />
        <Dialog.Content className="mx-5 rounded-form-field bg-surface-default p-5">
          <View
            className="w-full flex-row items-start justify-between gap-3"
            style={{ direction: 'ltr' }}
          >
            <Dialog.Close variant="ghost" />
            <View className="min-w-0 flex-1 items-end gap-1">
              <Dialog.Title
                className="w-full font-ui-bold text-text-primary"
                style={{
                  textAlign: 'right',
                  writingDirection: 'rtl',
                  lineHeight: 30,
                  paddingTop: 3,
                }}
              >
                {title}
              </Dialog.Title>
              <Dialog.Description
                className="w-full font-ui-regular text-text-secondary"
                style={{ textAlign: 'right', writingDirection: 'rtl', lineHeight: 24 }}
              >
                {description}
              </Dialog.Description>
            </View>
          </View>
          <View className="mt-5 gap-2">
            {options
              .filter((option) => allowFiles || option.key !== 'files')
              .map((option) => (
                <Button
                  key={option.key}
                  variant="outline"
                  size="lg"
                  isDisabled={busy}
                  className="min-h-[72px] rounded-form-field border-border-subtle bg-surface-default"
                  onPress={() => onSelect(option.key)}
                  accessibilityLabel={option.label}
                >
                  <View className="w-full flex-row items-center gap-3 px-1">
                    <View className="h-11 w-11 items-center justify-center rounded-form-field bg-action-subtle">
                      <OutlineIcon name={option.icon} size={23} color={colors.text.primary} />
                    </View>
                    <View className="min-w-0 flex-1 items-end gap-0.5">
                      <Typography.Paragraph
                        className="font-ui-semibold text-text-primary"
                        style={{ textAlign: 'right' }}
                      >
                        {option.label}
                      </Typography.Paragraph>
                      <Typography.Paragraph
                        type="body-sm"
                        className="font-ui-regular text-text-secondary"
                        style={{ textAlign: 'right' }}
                      >
                        {option.details}
                      </Typography.Paragraph>
                    </View>
                  </View>
                </Button>
              ))}
          </View>
          <Button
            variant="ghost"
            size="lg"
            className="mt-3 rounded-form-field"
            onPress={onClose}
            isDisabled={busy}
          >
            <Button.Label className="font-ui-semibold">إلغاء</Button.Label>
          </Button>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  );
}
