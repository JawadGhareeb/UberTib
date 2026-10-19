import { useRouter } from 'expo-router';
import type { PropsWithChildren, ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';

import { useAppDirection } from '@/providers/app-direction-provider';
import { AuthBackButton } from '@/shared/components/navigation/auth-back-button';
import { AppText, Button, Screen } from '@/shared/components/ui';
import type { AppIconName } from '@/shared/components/ui/app-icon';
import { cn } from '@/shared/utils/cn';

interface AssessmentScaffoldProps extends PropsWithChildren {
  title: string;
  phase: string;
  primaryLabel?: string;
  primaryDisabled?: boolean;
  primaryLoading?: boolean;
  onPrimary?: () => void;
  footerNote?: string;
  topContent?: ReactNode;
  scroll?: boolean;
  hideBack?: boolean;
  backIcon?: AppIconName;
}

export function AssessmentScaffold({
  title,
  phase,
  primaryLabel,
  primaryDisabled = false,
  primaryLoading = false,
  onPrimary,
  footerNote,
  topContent,
  scroll = true,
  hideBack = false,
  children,
}: AssessmentScaffoldProps) {
  const router = useRouter();
  const { rowReverseClassName } = useAppDirection();

  const body = (
    <View className="mx-auto w-full max-w-[430px] flex-1 px-4">
      {topContent}
      {children}
    </View>
  );

  return (
    <Screen contentClassName="px-0 pb-0 pt-0">
      <View
        className={cn(
          'mx-auto h-[58px] w-full max-w-[430px] items-center justify-between px-4',
          rowReverseClassName,
        )}
      >
        {hideBack ? (
          <View className="h-10 w-10" />
        ) : (
          <AuthBackButton
            onPress={() => {
              if (router.canGoBack()) router.back();
              else router.replace('/(tabs)/home');
            }}
          />
        )}

        <View className="min-w-0 flex-1 items-end gap-0.5">
          <AppText align="right" className="font-ui-bold" numberOfLines={2} variant="heading-4">
            {title}
          </AppText>
          <AppText align="right" className="font-ui-bold text-content-link" variant="caption">
            {phase}
          </AppText>
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1"
      >
        {scroll ? (
          <ScrollView
            contentContainerClassName={primaryLabel ? 'flex-grow pb-24' : 'flex-grow pb-4'}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {body}
          </ScrollView>
        ) : (
          <View className={primaryLabel ? 'flex-1 pb-24' : 'flex-1 pb-4'}>{body}</View>
        )}

        {primaryLabel && onPrimary ? (
          <View className="absolute bottom-0 left-0 right-0 bg-surface-canvas px-4 pb-4 pt-2">
            <View className="mx-auto w-full max-w-[398px]">
              <Button
                className="h-[52px] rounded-[12px]"
                disabled={primaryDisabled}
                endIcon={{ ios: 'arrow.left', android: 'arrow_back', web: 'arrow_back' }}
                label={primaryLabel}
                loading={primaryLoading}
                loadingLabel="جاري المتابعة"
                onPress={onPrimary}
              />
              {footerNote ? (
                <AppText
                  align="center"
                  className="mt-1.5 text-content-placeholder"
                  variant="caption"
                >
                  {footerNote}
                </AppText>
              ) : null}
            </View>
          </View>
        ) : null}
      </KeyboardAvoidingView>
    </Screen>
  );
}
