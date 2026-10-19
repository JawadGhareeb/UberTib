import Svg, { Path } from 'react-native-svg';

import { useAppTheme } from '@/shared/theme/use-app-theme';

interface RatingStarIconProps {
  filled: boolean;
  size?: number;
  outlineSelected?: boolean;
}

/** Identical filled/outlined star shapes on Android, iOS and web. */
export function RatingStarIcon({ filled, size = 28, outlineSelected = false }: RatingStarIconProps) {
  const { colors } = useAppTheme();
  const gold = colors.tone.warning.text;
  const outline = colors.text.placeholder;

  return (
    <Svg accessible={false} height={size} viewBox="0 0 24 24" width={size}>
      <Path
        d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27Z"
        fill={filled && !outlineSelected ? gold : 'none'}
        stroke={filled ? gold : outline}
        strokeLinejoin="round"
        strokeWidth={filled && !outlineSelected ? 0.9 : 1.7}
      />
    </Svg>
  );
}
