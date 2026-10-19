import { View } from 'react-native';

import { ToothSvg, type ToothShape } from '@/shared/components/ui/tooth-svg';
import { theme } from '@/shared/theme';
import { useAppTheme } from '@/shared/theme/use-app-theme';

/**
 * Dental-service icon treatment from the Pen home cards.
 * The peach crescent and mint corner live INSIDE the clipped tile so both
 * remain visible behind the tooth, without tinting the Primary tooth outline.
 */
export function HomeCareToothIcon({ kind }: { kind: ToothShape }) {
  const { colors, scheme } = useAppTheme();
  const warm = theme.illustration.warm[scheme];

  return (
    <View className="h-[62px] w-[62px] shrink-0 overflow-hidden rounded-[20px] border border-border-subtle bg-surface-default">
      <View
        className="absolute -bottom-[3px] -right-[6px] h-[47px] w-[47px] rounded-full"
        pointerEvents="none"
        style={{ backgroundColor: colors.action.subtle }}
      />
      <View
        className="absolute left-[3px] top-[8px] h-[47px] w-[47px] rounded-full"
        pointerEvents="none"
        style={{ backgroundColor: warm.surface }}
      />
      <View
        className="absolute left-[15px] top-[6px] h-[46px] w-[46px] rounded-full"
        pointerEvents="none"
        style={{ backgroundColor: colors.surface.default }}
      />
      <View className="absolute inset-0 items-center justify-center" pointerEvents="none">
        <ToothSvg height={37} kind={kind} selected width={29} />
      </View>
    </View>
  );
}
