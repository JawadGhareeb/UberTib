import type { PropsWithChildren } from 'react';
import { Modal, Pressable, View } from 'react-native';

import { cn } from '@/shared/utils/cn';

interface BottomSheetSurfaceProps extends PropsWithChildren {
  visible: boolean;
  onClose: () => void;
  className?: string;
}

export function BottomSheetSurface({
  visible,
  onClose,
  className,
  children,
}: BottomSheetSurfaceProps) {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end">
        <Pressable
          className="absolute inset-0 bg-surface-scrim/50"
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="إغلاق"
        />
        <View
          className={cn(
            'rounded-t-[20px] border border-border-subtle bg-surface-default px-4 pb-6 pt-3',
            className,
          )}
        >
          <View className="mb-4 h-1 w-10 self-center rounded-full bg-border-strong" />
          {children}
        </View>
      </View>
    </Modal>
  );
}
