import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { AppIcon, AppText } from '@/shared/components/ui';
import { useAppTheme } from '@/shared/theme/theme-provider';
import { ProfileAppearanceModal } from './profile-appearance-modal';

export function ProfileAppearanceSettings() {
  const { scheme } = useAppTheme();
  const [appearanceOpen, setAppearanceOpen] = useState(false);
  return (
    <>
      <Pressable
        accessibilityRole="button"
        className="mt-[7px] min-h-[48px] flex-row-reverse items-center gap-2 rounded-[11px] border border-border-subtle bg-surface-default px-[10px]"
        onPress={() => setAppearanceOpen(true)}
        accessibilityLabel={`المظهر الحالي ${scheme === 'dark' ? 'داكن' : 'فاتح'}، تغيير المظهر`}
      >
        <AppIcon
          name={{ ios: 'paintbrush', android: 'palette', web: 'palette' }}
          size={18}
          tone="action"
        />
        <AppText
          align="right"
          className="min-w-0 flex-1 font-ui-semibold"
          style={{ fontSize: 11, lineHeight: 17 }}
          variant="caption"
        >
          المظهر · {scheme === 'dark' ? 'داكن' : 'فاتح'}
        </AppText>
        <AppText className="text-content-secondary" style={{ fontSize: 9.5 }} variant="caption">
          تغيير
        </AppText>
      </Pressable>

      <View className="mt-[7px] rounded-[10px] bg-tone-warning-fill px-3 py-[9px]">
        <AppText
          align="right"
          className="text-tone-warning-text"
          style={{ fontSize: 10, lineHeight: 17 }}
          variant="caption"
        >
          الإجراءات الحساسة تتطلب إعادة التحقق من الهوية.
        </AppText>
      </View>
      <ProfileAppearanceModal visible={appearanceOpen} onClose={() => setAppearanceOpen(false)} />
    </>
  );
}
