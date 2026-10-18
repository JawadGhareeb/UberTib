import type { PropsWithChildren } from 'react';
import { View, type ViewProps } from 'react-native';

import { cn } from '@/shared/utils/cn';

type CardTone = 'default' | 'subtle' | 'selected';

interface CardProps extends PropsWithChildren<ViewProps> {
  tone?: CardTone;
  className?: string;
}

const toneClasses: Record<CardTone, string> = {
  default: 'border-border-default bg-surface-default',
  subtle: 'border-border-subtle bg-surface-subtle',
  selected: 'border-state-selected-border bg-state-selected',
};

export function Card({ tone = 'default', className, children, ...props }: CardProps) {
  const hasRadius = className?.split(/\s+/).some((token) =>
    /^rounded-(?!t-|r-|b-|l-|tl-|tr-|bl-|br-)/.test(token),
  );
  return (
    <View
      className={cn(!hasRadius && 'rounded-surface', 'border p-4', toneClasses[tone], className)}
      {...props}
    >
      {children}
    </View>
  );
}
