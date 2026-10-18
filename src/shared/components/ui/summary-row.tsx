import { View } from 'react-native';

import { useAppDirection } from '@/providers/app-direction-provider';
import { AppText } from '@/shared/components/ui/app-text';
import { cn } from '@/shared/utils/cn';

interface SummaryRowProps {
  label: string;
  value: string;
  valueDirection?: 'rtl' | 'ltr';
  divider?: boolean;
}

export function SummaryRow({
  label,
  value,
  valueDirection = 'rtl',
  divider = false,
}: SummaryRowProps) {
  const { rowClassName } = useAppDirection();

  return (
    <View
      className={cn(
        'items-center justify-between gap-4 py-3',
        rowClassName,
        divider && 'border-t border-border-subtle',
      )}
    >
      <AppText className="text-content-secondary" variant="caption">
        {label}
      </AppText>
      <AppText
        className="min-w-0 flex-1"
        direction={valueDirection}
        numberOfLines={2}
        variant="body-strong"
      >
        {value}
      </AppText>
    </View>
  );
}
