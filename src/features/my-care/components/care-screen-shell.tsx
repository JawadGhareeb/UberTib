import type { PropsWithChildren } from 'react';
import { ScrollView, View } from 'react-native';

import { AppHeader } from '@/shared/components/navigation';
import { AppText, Screen } from '@/shared/components/ui';

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
        contentContainerClassName="mx-auto w-full max-w-[430px] px-4 pb-32 pt-5"
        showsVerticalScrollIndicator={false}
      >
        <View className="gap-1.5">
          <AppText align="right" variant="heading-3" className="font-ui-bold">
            {title}
          </AppText>
          {description ? (
            <AppText align="right" variant="label" className="text-content-secondary">
              {description}
            </AppText>
          ) : null}
        </View>

        {children}
      </ScrollView>
    </Screen>
  );
}
