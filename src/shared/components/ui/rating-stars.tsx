import { View } from 'react-native';

import { useAppDirection } from '@/shared/utils/app-direction';
import { cn } from '@/shared/utils/cn';
import { RatingStarIcon } from '@/shared/components/ui/rating-star-icon';

interface RatingStarsProps {
  rating: number;
  size?: number;
}

/** Read-only rating display uses the same filled SVG as the rating picker. */
export function RatingStars({ rating, size = 18 }: RatingStarsProps) {
  const { isRTL } = useAppDirection();
  const roundedRating = Math.max(0, Math.min(5, Math.round(rating)));

  return (
    <View
      accessibilityLabel={`${roundedRating} من 5`}
      accessible
      className={cn('items-center gap-1', isRTL ? 'flex-row-reverse' : 'flex-row')}
    >
      {[1, 2, 3, 4, 5].map((value) => (
        <RatingStarIcon filled={value <= roundedRating} key={value} size={size} />
      ))}
    </View>
  );
}
