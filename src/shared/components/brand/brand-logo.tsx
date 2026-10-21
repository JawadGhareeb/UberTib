import { Image } from 'react-native';

import { useAppTheme } from '@/shared/theme/use-app-theme';

interface BrandLogoProps {
  size?: number;
  layout?: 'horizontal' | 'stacked';
  appearance?: 'auto' | 'light' | 'dark';
}

// Both supplied wordmarks are 1800x900 PNGs with transparent padding.
// Keep them static so Metro bundles both and React Native updates when the theme changes.
const lightLogo = require('../../assets/black-logo-with-light-mode.png');
const darkLogo = require('../../assets/white-logo-with-dark-mode.png');

export function BrandLogo({
  size = 36,
  layout = 'horizontal',
  appearance = 'auto',
}: BrandLogoProps) {
  const { scheme } = useAppTheme();
  const useDarkLogo = appearance === 'dark' || (appearance === 'auto' && scheme === 'dark');
  const width = size * (layout === 'stacked' ? 4 : 3.6);

  return (
    <Image
      accessibilityLabel="UberTib"
      accessibilityRole="image"
      resizeMode="contain"
      source={useDarkLogo ? darkLogo : lightLogo}
      style={{ width, height: width / 2 }}
    />
  );
}
