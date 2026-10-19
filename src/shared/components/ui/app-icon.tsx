import { SymbolView } from 'expo-symbols';
import type { ComponentProps } from 'react';

import { useAppTheme } from '@/shared/theme/use-app-theme';

export type AppIconTone =
  | 'primary'
  | 'secondary'
  | 'action'
  | 'onAction'
  | 'neutral'
  | 'info'
  | 'success'
  | 'warning'
  | 'danger'
  | 'restricted';

export type AppIconName = ComponentProps<typeof SymbolView>['name'];

interface AppIconProps {
  name: AppIconName;
  size?: number;
  tone?: AppIconTone;
  color?: string;
}

export function AppIcon({ name, size = 20, tone = 'primary', color }: AppIconProps) {
  const { colors, scheme } = useAppTheme();

  const tintColor = {
    primary: colors.action.primary,
    secondary: colors.text.secondary,
    action: colors.action.primary,
    onAction: colors.text.onAction,
    neutral: colors.tone.neutral.text,
    info: colors.tone.info.text,
    success: colors.tone.success.text,
    warning: colors.tone.warning.text,
    danger: colors.tone.danger.text,
    restricted: colors.tone.restricted.text,
  }[tone];

  return (
    <SymbolView
      key={`${scheme}-${tone}`}
      accessible={false}
      name={name}
      size={size}
      tintColor={color ?? tintColor}
    />
  );
}
