import type { ComponentProps } from 'react';
import { TextInput, View } from 'react-native';

import { AppIcon } from '@/shared/components/ui/app-icon';
import { useAppTheme } from '@/shared/theme/use-app-theme';
import { cn } from '@/shared/utils/cn';

type InputProps = ComponentProps<typeof TextInput>;

interface SearchFieldProps extends Omit<InputProps, 'value' | 'onChangeText'> {
  value: string;
  onChangeText: (text: string) => void;
  containerClassName?: string;
}

export function SearchField({
  value,
  onChangeText,
  containerClassName,
  placeholder = 'ابحث عن خدمة',
  accessibilityLabel = 'البحث',
  style,
  ...props
}: SearchFieldProps) {
  const { colors } = useAppTheme();

  return (
    <View
      className={cn(
        'h-[46px] flex-row items-center gap-2.5 rounded-[13px] border border-action-primary bg-surface-default px-3',
        containerClassName,
      )}
    >
      <AppIcon
        name={{ ios: 'magnifyingglass', android: 'search', web: 'search' }}
        size={19}
        tone="action"
      />
      <TextInput
        {...props}
        accessibilityLabel={accessibilityLabel}
        autoCorrect={false}
        className="h-full min-w-0 flex-1 bg-transparent p-0 font-ui-regular"
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.text.placeholder}
        returnKeyType="search"
        style={[
          {
            color: colors.text.primary,
            fontSize: 12,
            textAlign: 'right',
            writingDirection: 'rtl',
          },
          style,
        ]}
        value={value}
      />
    </View>
  );
}
