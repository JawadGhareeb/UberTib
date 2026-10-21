import { ScrollView, type ScrollViewProps } from 'react-native';

/**
 * Physical scroll extent is derived only from the content and visible viewport.
 * An ancestor KeyboardAvoidingView shrinks the viewport on iOS, while
 * softwareKeyboardLayoutMode=resize owns the viewport on Android.
 *
 * Do not add another keyboard-height spacer/contentInset here: that caused
 * a full keyboard/screen of phantom scrollable whitespace on both platforms.
 */
export function KeyboardResponsiveScrollView(props: ScrollViewProps) {
  return (
    <ScrollView keyboardShouldPersistTaps="handled" keyboardDismissMode="none" {...props} />
  );
}
