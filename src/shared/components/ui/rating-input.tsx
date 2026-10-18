import { Pressable, View } from 'react-native';

import { useAppDirection } from '@/providers/app-direction-provider';
import { cn } from '@/shared/utils/cn';
import { RatingStarIcon } from '@/shared/components/ui/rating-star-icon';

interface RatingInputProps {
  value: number;
  onChange: (rating: number) => void;
  disabled?: boolean;
}

/**
 * RTL: rating 1 starts at the right, and selecting N fills stars 1..N.
 * Individual 44pt hit areas let patients tap without accidental adjacent taps.
 */
export function RatingInput({ value, onChange, disabled = false }: RatingInputProps) {
  const { isRTL } = useAppDirection();
  const selected = Math.max(0, Math.min(5, Math.round(value)));

  return (
    <View
      accessibilityLabel={`التقييم ${selected} من 5`}
      className={cn('items-center justify-center', isRTL ? 'flex-row-reverse' : 'flex-row')}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <Pressable
          accessibilityLabel={`${star} من 5 نجوم`}
          accessibilityRole="radio"
          accessibilityState={{ checked: selected === star, disabled }}
          className="h-11 w-11 items-center justify-center"
          disabled={disabled}
          key={star}
          onPress={() => onChange(star)}
        >
          <RatingStarIcon filled={star <= selected} outlineSelected size={30} />
        </Pressable>
      ))}
    </View>
  );
}
