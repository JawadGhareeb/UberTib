import type { PropsWithChildren, ReactNode } from 'react';
import { KeyboardAvoidingView as NativeKeyboardAvoidingView, Platform, View } from 'react-native';
import {
  KeyboardAvoidingView as ControlledKeyboardAvoidingView,
  KeyboardAwareScrollView,
} from 'react-native-keyboard-controller';

import { AssessmentJourneyProgress } from '@/features/assessment/components/assessment-journey-progress';
import { AppHeader } from '@/shared/components/navigation/app-header';
import { AppText, Button, Screen } from '@/shared/components/ui';
import type { AppIconName } from '@/shared/components/ui/app-icon';

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
  const KeyboardContainer =
    Platform.OS === 'android' ? ControlledKeyboardAvoidingView : NativeKeyboardAvoidingView;
  const body = (
    <View className="mx-auto w-full max-w-[430px] gap-3 px-4 pb-5 pt-3">
      <AssessmentJourneyProgress phase={phase} />
      <View className="gap-1">
        <AppText align="right" variant="heading-3" className="font-ui-bold">
          {title}
        </AppText>
      </View>
      {topContent}
      {children}
    </View>
  );
  return (
    <Screen contentClassName="px-0 py-0" keyboardAvoiding={false}>
      <AppHeader title="تحديد حالتي" showBack={!hideBack} />
      <KeyboardContainer behavior="padding" className="min-h-0 flex-1">
        {scroll ? (
          <KeyboardAwareScrollView
            bottomOffset={Platform.OS === 'android' ? 16 : 85}
            className="min-h-0 flex-1"
            contentContainerClassName="pb-3"
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {body}
          </KeyboardAwareScrollView>
        ) : (
          <View className="min-h-0 flex-1">{body}</View>
        )}
        {primaryLabel && onPrimary ? (
          <View className="border-t border-border-subtle bg-surface-default px-4 pb-3 pt-3">
            <View className="mx-auto w-full max-w-[398px]">
              <Button
                className="min-h-[50px] rounded-[12px]"
                disabled={primaryDisabled}
                endIcon={{ ios: 'arrow.left', android: 'arrow_back', web: 'arrow_back' }}
                label={primaryLabel}
                loading={primaryLoading}
                loadingLabel="جاري المتابعة"
                onPress={onPrimary}
              />
              {footerNote ? (
                <AppText align="center" className="mt-2 text-content-secondary" variant="caption">
                  {footerNote}
                </AppText>
              ) : null}
            </View>
          </View>
        ) : null}
      </KeyboardContainer>
    </Screen>
  );
}
