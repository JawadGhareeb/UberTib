import { Modal, Pressable, View } from 'react-native';
import Animated, { FadeInDown, ReduceMotion } from 'react-native-reanimated';

import { useAppDirection } from '@/providers/app-direction-provider';
import { AppIcon, type AppIconName } from '@/shared/components/ui/app-icon';
import { AppText } from '@/shared/components/ui/app-text';
import { Button } from '@/shared/components/ui/button';
import { theme } from '@/shared/theme';
import { useAppTheme } from '@/shared/theme/use-app-theme';
import { cn } from '@/shared/utils/cn';

interface ConfirmationDialogProps {
  visible: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel?: string;
  destructive?: boolean;
  loading?: boolean;
  icon?: AppIconName;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmationDialog({
  visible,
  title,
  description,
  confirmLabel,
  cancelLabel = 'إلغاء',
  destructive = false,
  loading = false,
  icon,
  onConfirm,
  onCancel,
}: ConfirmationDialogProps) {
  const { colors } = useAppTheme();
  const { rowClassName } = useAppDirection();

  const resolvedIcon =
    icon ??
    (destructive
      ? { ios: 'exclamationmark.triangle.fill', android: 'warning', web: 'warning' }
      : { ios: 'questionmark.circle.fill', android: 'help', web: 'help' });

  return (
    <Modal
      animationType="fade"
      hardwareAccelerated
      onRequestClose={() => { if (!loading) onCancel(); }}
      presentationStyle="overFullScreen"
      statusBarTranslucent
      transparent
      visible={visible}
    >
      <View accessibilityViewIsModal className="flex-1 items-center justify-center px-5">
        <Pressable
          accessibilityLabel="إغلاق نافذة التأكيد"
          accessibilityRole="button"
          className="absolute inset-0"
          onPress={() => { if (!loading) onCancel(); }}
        >
          <View
            className="flex-1"
            style={{ backgroundColor: colors.surface.scrim, opacity: 0.58 }}
          />
        </Pressable>

        <Animated.View
          className="w-full max-w-[350px] rounded-[18px] border border-border-subtle bg-surface-default px-4 pb-4 pt-4"
          entering={FadeInDown.duration(theme.motion.duration.overlay).reduceMotion(
            ReduceMotion.System,
          )}
          style={{
            elevation: 8,
            shadowColor: colors.surface.scrim,
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.12,
            shadowRadius: 16,
          }}
        >
          <View className="items-center">
            <View
              className={cn(
                'h-10 w-10 items-center justify-center rounded-full border',
                destructive
                  ? 'border-tone-danger-border bg-tone-danger-fill'
                  : 'border-state-selected-border bg-action-subtle',
              )}
            >
              <AppIcon name={resolvedIcon} size={19} tone={destructive ? 'danger' : 'action'} />
            </View>

            <AppText
              className="mt-2.5 w-full text-center font-ui-bold"
              style={{ textAlign: 'center' }}
              variant="heading-4"
            >
              {title}
            </AppText>
            <AppText
              className="mt-1.5 w-full text-center text-content-secondary"
              style={{ textAlign: 'center' }}
              variant="caption"
            >
              {description}
            </AppText>
          </View>

          <View className={cn('mt-4 gap-2', rowClassName)}>
            <Button
              className="h-11 min-w-0 flex-1"
              disabled={loading}
              label={confirmLabel}
              loading={loading}
              onPress={onConfirm}
              variant={destructive ? 'destructive' : 'primary'}
            />
            <Button className="h-11 min-w-0 flex-1" disabled={loading} label={cancelLabel} onPress={onCancel} variant="outline" />
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}
