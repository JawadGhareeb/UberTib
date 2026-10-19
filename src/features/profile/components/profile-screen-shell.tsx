import type { PropsWithChildren } from 'react';
import { ScrollView } from 'react-native';
import { AppHeader } from '@/shared/components/navigation';
import { Screen } from '@/shared/components/ui';

interface ProfileScreenShellProps extends PropsWithChildren {
  eyebrow: string;
  title: string;
  description?: string;
  showBack?: boolean;
  layout?: 'default' | 'reference';
}

/** Inner screens have one true, centered full-width header; no repeated subtitle. */
export function ProfileScreenShell({ title, showBack = true, children }: ProfileScreenShellProps) {
  return (
    <Screen
      contentClassName="px-0 py-0"
      header={<AppHeader title={title} showBack={showBack} variant="detail" />}
    >
      <ScrollView
        className="flex-1 bg-surface-canvas"
        contentContainerClassName="mx-auto w-full max-w-[430px] px-4 pb-12 pt-4"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    </Screen>
  );
}
