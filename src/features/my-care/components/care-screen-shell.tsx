import type { PropsWithChildren } from 'react';
import { ScrollView } from 'react-native';
import Animated, { FadeInDown, ReduceMotion } from 'react-native-reanimated';

import { AppHeader } from '@/shared/components/navigation';
import { AppText, Screen } from '@/shared/components/ui';
import { theme } from '@/shared/theme';

interface CareScreenShellProps extends PropsWithChildren {
  eyebrow: string;
  title: string;
  description?: string;
  showBack?: boolean;
}

export function CareScreenShell({
  eyebrow,
  title,
  description,
  showBack = true,
  children,
}: CareScreenShellProps) {
  return (
    <Screen contentClassName="px-0 py-0">
      {showBack ? (
        <AppHeader backLabel="العودة" showBack title={eyebrow} />
      ) : (
        <AppHeader variant="primary" title={eyebrow} />
      )}

      <ScrollView
        contentContainerClassName="mx-auto w-full max-w-[640px] px-4 pb-32 pt-5"
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          className="gap-1.5"
          entering={FadeInDown.delay(30)
            .duration(theme.motion.duration.overlay)
            .reduceMotion(ReduceMotion.System)}
        >
          <AppText variant="heading-2">{title}</AppText>
          {description ? <AppText className="text-content-secondary">{description}</AppText> : null}
        </Animated.View>

        {children}
      </ScrollView>
    </Screen>
  );
}
