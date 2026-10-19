import { Pressable, View } from 'react-native';
import { Typography } from 'heroui-native';

/** Switch login/register intent without duplicating the existing phone + OTP screens. */
export function AuthModeSwitch({
  isRegister,
  onSwitch,
}: {
  isRegister: boolean;
  onSwitch: () => void;
}) {
  const action = isRegister ? 'تسجيل الدخول' : 'إنشاء حساب';

  return (
    <View className="min-h-[44px] flex-row-reverse flex-wrap items-center justify-center gap-x-1.5">
      <Typography.Paragraph
        type="body-sm"
        className="font-ui-regular text-text-secondary"
        style={{ writingDirection: 'rtl', textAlign: 'center' }}
      >
        {isRegister ? 'لديك حساب؟' : 'ليس لديك حساب؟'}
      </Typography.Paragraph>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={action}
        className="min-h-[44px] justify-center rounded-[10px] px-1.5"
        onPress={onSwitch}
      >
        <Typography.Paragraph
          type="body-sm"
          className="font-ui-semibold text-content-link"
          style={{ writingDirection: 'rtl', textAlign: 'center' }}
        >
          {action}
        </Typography.Paragraph>
      </Pressable>
    </View>
  );
}
