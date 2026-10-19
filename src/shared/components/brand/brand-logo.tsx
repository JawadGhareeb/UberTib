import { Platform, Text, View } from 'react-native';

import { BrandMark } from '@/shared/components/brand/brand-mark';
import { theme } from '@/shared/theme';
import { useAppTheme } from '@/shared/theme/use-app-theme';

interface BrandLogoProps {
  size?: number;
  layout?: 'horizontal' | 'stacked';
  appearance?: 'auto' | 'light' | 'dark';
}

/**
 * Shared responsive brand lockup. Uses the existing transparent source mark.
 * Replace this text fallback with official light/dark wordmark files when
 * separately exported originals are available in the repository.
 */
export function BrandLogo({
  size = 36,
  layout = 'horizontal',
  appearance = 'auto',
}: BrandLogoProps) {
  const { colors } = useAppTheme();
  const isStacked = layout === 'stacked';
  const textColor =
    appearance === 'dark'
      ? theme.brand.white
      : appearance === 'light'
        ? theme.brand.ink
        : colors.text.primary;

  return (
    <View
      accessibilityLabel="UberTeb"
      accessible
      style={{
        alignItems: 'center',
        flexDirection: isStacked ? 'column' : 'row',
        gap: isStacked ? 12 : 8,
        justifyContent: 'center',
      }}
    >
      <BrandMark size={size} />
      <Text
        accessibilityElementsHidden
        importantForAccessibility="no"
        style={{
          color: textColor,
          fontFamily: Platform.select({ android: 'sans-serif-medium', ios: 'System' }),
          fontSize: isStacked ? 38 : Math.max(17, size * 0.57),
          fontWeight: '700',
          includeFontPadding: false,
          letterSpacing: -0.8,
          lineHeight: isStacked ? 48 : Math.max(24, size * 0.86),
          textAlign: 'left',
          writingDirection: 'ltr',
        }}
      >
        UberTeb
      </Text>
    </View>
  );
}
