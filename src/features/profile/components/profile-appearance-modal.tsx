import { Modal, Pressable, View } from 'react-native';
import { AppIcon, AppText } from '@/shared/components/ui';
import { useAppTheme } from '@/shared/theme/theme-provider';

export function ProfileAppearanceModal({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const { scheme, colors, setScheme } = useAppTheme();
  return (
    <Modal
      animationType="fade"
      onRequestClose={() => onClose()}
      statusBarTranslucent
      transparent
      visible={visible}
    >
      <Pressable
        accessibilityLabel="إغلاق اختيار المظهر"
        accessibilityRole="button"
        className="flex-1 justify-end"
        onPress={() => onClose()}
        style={{ backgroundColor: 'rgba(0,0,0,0.42)' }}
      >
        <Pressable
          className="rounded-t-[22px] px-4 pb-8 pt-4"
          onPress={(event) => event.stopPropagation()}
          style={{ backgroundColor: colors.surface.default }}
        >
          <View className="mx-auto w-full max-w-[430px] gap-3">
            <View className="flex-row-reverse items-center justify-between">
              <AppText
                align="right"
                className="font-ui-bold"
                style={{ color: colors.text.primary }}
                variant="label"
              >
                مظهر التطبيق
              </AppText>
              <Pressable
                accessibilityLabel="إغلاق"
                accessibilityRole="button"
                className="h-9 w-9 items-center justify-center rounded-full"
                onPress={() => onClose()}
                style={{ backgroundColor: colors.surface.subtle }}
              >
                <AppIcon
                  name={{ ios: 'xmark', android: 'close', web: 'close' }}
                  size={17}
                  tone="secondary"
                />
              </Pressable>
            </View>
            <AppText align="right" style={{ color: colors.text.secondary }} variant="caption">
              اختر المظهر المناسب، وسيتم حفظ اختيارك تلقائياً.
            </AppText>

            {(
              [
                {
                  value: 'light',
                  label: 'فاتح (Light)',
                  icon: { ios: 'sun.max.fill', android: 'light_mode', web: 'light_mode' },
                },
                {
                  value: 'dark',
                  label: 'داكن (Dark)',
                  icon: { ios: 'moon.fill', android: 'dark_mode', web: 'dark_mode' },
                },
              ] as const
            ).map((option) => {
              const selected = scheme === option.value;
              return (
                <Pressable
                  accessibilityLabel={option.label}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: selected }}
                  className="min-h-[52px] flex-row-reverse items-center gap-3 rounded-[12px] border px-3"
                  key={option.value}
                  onPress={() => {
                    setScheme(option.value);
                    onClose();
                  }}
                  style={{
                    backgroundColor: selected ? colors.action.subtle : colors.surface.default,
                    borderColor: selected ? colors.action.primary : colors.border.default,
                  }}
                >
                  <AppIcon name={option.icon} size={20} tone="action" />
                  <AppText
                    align="right"
                    className="min-w-0 flex-1 font-ui-semibold"
                    style={{ color: colors.text.primary }}
                    variant="label"
                  >
                    {option.label}
                  </AppText>
                  {selected ? (
                    <AppIcon
                      name={{
                        ios: 'checkmark.circle.fill',
                        android: 'check_circle',
                        web: 'check_circle',
                      }}
                      size={20}
                      tone="action"
                    />
                  ) : null}
                </Pressable>
              );
            })}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
