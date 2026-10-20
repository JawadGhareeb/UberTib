import { Button } from 'heroui-native';

import { OutlineIcon } from '@/shared/components/media/outline-icon';
import { useAppTheme } from '@/shared/theme/use-app-theme';

export function AuthBackButton({
  onPress,
  label = 'رجوع',
}: {
  onPress: () => void;
  label?: string;
}) {
  const { colors } = useAppTheme();
  return (
    <Button
      variant="ghost"
      size="sm"
      className="h-11 w-11 items-center justify-center rounded-[13px] bg-action-subtle p-0"
      onPress={onPress}
      accessibilityLabel={label}
    >
      <OutlineIcon name="arrow-right" size={24} color={colors.action.primary} />
    </Button>
  );
}
