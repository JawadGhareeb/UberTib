import { SymbolView } from 'expo-symbols';
import { useRouter } from 'expo-router';
import { Pressable } from 'react-native';

import { useAppDirection } from '@/providers/app-direction-provider';
import { theme } from '@/shared/theme';
import { cn } from '@/shared/utils/cn';

interface BackActionProps {
  label?: string;
  alignToStart?: boolean;
  className?: string;
}

export function BackAction({ label = 'رجوع', alignToStart = true, className }: BackActionProps) {
  const router = useRouter();
  const { isRTL, startClassName } = useAppDirection();

  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="button"
      className={cn(
        'h-11 w-11 items-center justify-center rounded-full border border-border-subtle bg-surface-default active:bg-surface-subtle',
        alignToStart && startClassName,
        className,
      )}
      hitSlop={4}
      onPress={() => router.back()}
    >
      <SymbolView
        name={
          isRTL
            ? { ios: 'chevron.right', android: 'arrow_forward', web: 'arrow_forward' }
            : { ios: 'chevron.left', android: 'arrow_back', web: 'arrow_back' }
        }
        size={20}
        tintColor={theme.brand.mark}
      />
    </Pressable>
  );
}
