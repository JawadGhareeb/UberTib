import { useRouter } from 'expo-router';
import { View } from 'react-native';

import { useAppDirection } from '@/providers/app-direction-provider';
import { cn } from '@/shared/utils/cn';
import { AuthBackButton } from './auth-back-button';

interface BackActionProps {
  label?: string;
  alignToStart?: boolean;
  className?: string;
  onPress?: () => void;
}

/** App-wide back affordance shares the exact Auth/Intro button style and RTL arrow. */
export function BackAction({
  label = 'رجوع',
  alignToStart = true,
  className,
  onPress,
}: BackActionProps) {
  const router = useRouter();
  const { startClassName } = useAppDirection();
  return (
    <View className={cn(alignToStart && startClassName, className)}>
      <AuthBackButton
        label={label}
        onPress={() => {
          if (onPress) return onPress();
          if (router.canGoBack()) router.back();
          else router.replace('/(tabs)/home');
        }}
      />
    </View>
  );
}
