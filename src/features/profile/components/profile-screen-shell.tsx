import { useRouter } from 'expo-router';
import type { PropsWithChildren } from 'react';
import { ScrollView, View } from 'react-native';

import { useAppDirection } from '@/providers/app-direction-provider';
import { AppHeader } from '@/shared/components/navigation';
import { AuthBackButton } from '@/shared/components/navigation/auth-back-button';
import { AppText, Screen } from '@/shared/components/ui';
import { cn } from '@/shared/utils/cn';

interface ProfileScreenShellProps extends PropsWithChildren {
  eyebrow: string;
  title: string;
  description?: string;
  showBack?: boolean;
  layout?: 'default' | 'reference';
}

function ProfileReferenceHeader({ title, showBack }: { title: string; showBack: boolean }) {
  const router = useRouter();
  const { rowClassName } = useAppDirection();
  return (
    <View className="w-full shrink-0 bg-surface-default">
      <View className={cn('mx-auto h-16 w-full max-w-[430px] items-center px-4', rowClassName)}>
        {showBack ? (
          <AuthBackButton
            onPress={() => {
              if (router.canGoBack()) router.back();
              else router.replace('/(tabs)/profile');
            }}
          />
        ) : (
          <View className="h-11 w-11" />
        )}
        <AppText
          align="center"
          className="min-w-0 flex-1 px-2 font-ui-bold"
          numberOfLines={1}
          variant="heading-4"
        >
          {title}
        </AppText>
        <View className="h-11 w-11" />
      </View>
    </View>
  );
}

export function ProfileScreenShell({
  eyebrow,
  title,
  description,
  showBack = true,
  layout = 'default',
  children,
}: ProfileScreenShellProps) {
  const isReference = layout === 'reference';

  return (
    <Screen contentClassName="px-0 py-0">
      {isReference ? (
        <ProfileReferenceHeader showBack={showBack} title={eyebrow} />
      ) : (
        <AppHeader backLabel="العودة" showBack={showBack} title={eyebrow} />
      )}
      <ScrollView
        className="flex-1 bg-surface-canvas"
        contentContainerClassName={cn(
          'mx-auto w-full max-w-[430px] px-4 pb-12',
          isReference ? 'pt-[11px]' : 'pt-5',
        )}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="w-full">
          {!isReference ? <AppText variant="heading-2">{title}</AppText> : null}
          {description ? (
            <AppText
              align="right"
              className={cn('text-content-secondary', isReference ? 'mt-0.5' : 'mt-1.5')}
              style={isReference ? { fontSize: 10.5, lineHeight: 17 } : undefined}
              variant="caption"
            >
              {description}
            </AppText>
          ) : null}
          {children}
        </View>
      </ScrollView>
    </Screen>
  );
}
