import type { ComponentProps } from 'react';
import { Platform, ScrollView } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

type Props = ComponentProps<typeof KeyboardAwareScrollView>;

/**
 * One keyboard-space owner per platform:
 * - Android: Expo adjustResize already shrinks the visible viewport. A native
 *   ScrollView gives ordinary bounded scrolling without keyboard-height insets.
 * - iOS: KeyboardAwareScrollView alone manages the inset and focused field.
 *   Do not place this component inside an enabled KeyboardAvoidingView.
 */
export function KeyboardResponsiveScrollView({
  bottomOffset = 16,
  disableScrollOnKeyboardHide,
  enabled,
  extraKeyboardSpace,
  mode,
  ScrollViewComponent,
  ...scrollProps
}: Props) {
  if (Platform.OS === 'ios') {
    return (
      <KeyboardAwareScrollView
        {...scrollProps}
        bottomOffset={bottomOffset}
        disableScrollOnKeyboardHide={disableScrollOnKeyboardHide}
        enabled={enabled}
        extraKeyboardSpace={extraKeyboardSpace}
        mode={mode}
        ScrollViewComponent={ScrollViewComponent}
      />
    );
  }

  return <ScrollView {...scrollProps} />;
}
