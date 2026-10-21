import { Image, View } from 'react-native';

import { useAppTheme } from '@/shared/theme/use-app-theme';

interface BrandLogoProps {
  size?: number;
  layout?: 'horizontal' | 'stacked';
  appearance?: 'auto' | 'light' | 'dark';
}

// Small bundled versions of the same artwork. Keep both image layers mounted
// across theme changes so Android does not restart image loading or fading.
const lightLogo = require('../../assets/black-logo-header.png');
const darkLogo = require('../../assets/white-logo-header.png');

export function BrandLogo({
  size = 36,
  layout = 'horizontal',
  appearance = 'auto',
}: BrandLogoProps) {
  const { scheme } = useAppTheme();
  const useDarkLogo = appearance === 'dark' || (appearance === 'auto' && scheme === 'dark');
  const width = size * (layout === 'stacked' ? 4 : 3.6);
  const dimensions = { width, height: width / 2 };

  return (
    <View accessibilityLabel="UberTib" accessibilityRole="image" style={dimensions}>
      <Image
        fadeDuration={0}
        resizeMode="contain"
        source={lightLogo}
        style={[dimensions, { position: 'absolute', opacity: useDarkLogo ? 0 : 1 }]}
      />
      <Image
        fadeDuration={0}
        resizeMode="contain"
        source={darkLogo}
        style={[dimensions, { position: 'absolute', opacity: useDarkLogo ? 1 : 0 }]}
      />
    </View>
  );
}
