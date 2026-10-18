import { Image } from 'react-native';

interface BrandMarkProps {
  size?: number;
  accessibilityLabel?: string;
}

const brandMark = require('../../assets/icon.png');

export function BrandMark({ size = 96, accessibilityLabel = 'UperTib' }: BrandMarkProps) {
  return (
    <Image
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="image"
      resizeMode="contain"
      source={brandMark}
      style={{ width: size, height: size }}
    />
  );
}
