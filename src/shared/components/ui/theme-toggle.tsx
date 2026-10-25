import { SymbolView } from 'expo-symbols';
import { Pressable } from 'react-native';

import { useAppDirection } from '@/shared/utils/app-direction';
import { useAppTheme } from '@/shared/theme/use-app-theme';
import { cn } from '@/shared/utils/cn';

interface ThemeToggleProps {
  alignToStart?: boolean;
  className?: string;
}

export function ThemeToggle({ alignToStart = true, className }: ThemeToggleProps) {
  const { scheme, toggleScheme, colors } = useAppTheme();
  const { startClassName } = useAppDirection();
  const isDark = scheme === 'dark';
  const accessibilityLabel = isDark ? 'التبديل إلى الوضع الفاتح' : 'التبديل إلى الوضع الداكن';

  return (
    <Pressable
      accessibilityHint="يغيّر مظهر التطبيق بين الفاتح والداكن"
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="switch"
      accessibilityState={{ checked: isDark }}
      className={cn(
        'h-11 w-11 items-center justify-center rounded-full border border-border-subtle bg-surface-default active:bg-state-selected',
        alignToStart && startClassName,
        className,
      )}
      hitSlop={4}
      onPress={toggleScheme}
    >
      <SymbolView
        name={
          isDark
            ? { ios: 'sun.max.fill', android: 'light_mode', web: 'light_mode' }
            : { ios: 'moon.fill', android: 'dark_mode', web: 'dark_mode' }
        }
        size={20}
        tintColor={colors.text.link}
      />
    </Pressable>
  );
}
