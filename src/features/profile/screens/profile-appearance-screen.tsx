import { useState } from 'react';
import { View } from 'react-native';
import { Radio } from 'heroui-native';

import { ProfileScreenShell } from '@/features/profile/components/profile-screen-shell';
import { AppIcon, AppText, Button, type AppIconName } from '@/shared/components/ui';
import { useAppTheme } from '@/shared/theme/use-app-theme';
import { darkTheme, lightTheme, type ThemeScheme } from '@/shared/theme';

const options: {
  scheme: ThemeScheme;
  name: string;
  icon: AppIconName;
  canvas: string;
  panel: string;
  label: string;
  ink: string;
}[] = [
  {
    scheme: 'light',
    name: 'الفاتح',
    icon: { ios: 'sun.max.fill', android: 'light_mode', web: 'light_mode' },
    canvas: lightTheme.surface.canvas,
    panel: lightTheme.surface.default,
    label: lightTheme.action.primary,
    ink: lightTheme.text.primary,
  },
  {
    scheme: 'dark',
    name: 'الداكن',
    icon: { ios: 'moon.stars.fill', android: 'dark_mode', web: 'dark_mode' },
    canvas: darkTheme.surface.canvas,
    panel: darkTheme.surface.default,
    label: darkTheme.action.primary,
    ink: darkTheme.text.primary,
  },
];

function AppearanceChoice({
  selected,
  active,
  item,
  onPress,
}: {
  selected: boolean;
  active: boolean;
  item: (typeof options)[number];
  onPress: () => void;
}) {
  return (
    <Radio
      isSelected={selected}
      onSelectedChange={onPress}
      accessibilityLabel={'اختيار المظهر ' + item.name}
      className={
        'min-h-[222px] min-w-0 flex-1 items-center gap-3 rounded-[17px] border p-3 ' +
        (selected
          ? 'border-action-primary bg-action-subtle'
          : 'border-border-subtle bg-surface-default')
      }
    >
      <View className="h-12 w-12 items-center justify-center rounded-full bg-surface-subtle">
        <AppIcon name={item.icon} size={26} tone={selected ? 'action' : 'secondary'} />
      </View>
      <AppText align="center" variant="label" className="font-ui-semibold">
        {item.name}
      </AppText>
      <View className="w-full gap-2 rounded-[12px] p-2" style={{ backgroundColor: item.canvas }}>
        <View
          className="h-4 w-11 self-end rounded"
          style={{ backgroundColor: item.ink, opacity: 0.7 }}
        />
        <View className="h-8 w-full rounded-[7px] p-1.5" style={{ backgroundColor: item.panel }}>
          <View
            className="h-2 w-9 self-end rounded"
            style={{ backgroundColor: item.ink, opacity: 0.55 }}
          />
        </View>
        <View className="h-4 w-16 self-end rounded-[6px]" style={{ backgroundColor: item.label }} />
      </View>
      <View className="min-h-[23px] flex-row-reverse items-center justify-center gap-1">
        <Radio.Indicator />
        {selected ? (
          <AppIcon
            name={{ ios: 'checkmark.circle.fill', android: 'check_circle', web: 'check_circle' }}
            size={17}
            tone="action"
          />
        ) : null}
        {active ? (
          <AppText variant="caption" className="font-ui-semibold text-content-link">
            المظهر الحالي
          </AppText>
        ) : selected ? (
          <AppText variant="caption" className="text-content-link">
            مختار للتطبيق
          </AppText>
        ) : (
          <AppText variant="caption" className="text-content-secondary">
            اختار المظهر
          </AppText>
        )}
      </View>
    </Radio>
  );
}

export function ProfileAppearanceScreen() {
  const { scheme, setScheme } = useAppTheme();
  const [draft, setDraft] = useState<ThemeScheme | null>(null);
  const selected = draft ?? scheme;
  return (
    <ProfileScreenShell
      eyebrow="المظهر"
      title="المظهر"
      description="اختار المظهر اللي بناسبك، وبعدها اضغط تطبيق الثيم."
    >
      <View className="gap-5">
        <View accessibilityRole="radiogroup" className="flex-row-reverse gap-3">
          {options.map((item) => (
            <AppearanceChoice
              key={item.scheme}
              item={item}
              selected={selected === item.scheme}
              active={scheme === item.scheme}
              onPress={() => setDraft(item.scheme)}
            />
          ))}
        </View>
        <Button
          label="تطبيق الثيم"
          disabled={selected === scheme}
          onPress={() => {
            if (selected === scheme) return;
            setScheme(selected);
            setDraft(null);
          }}
        />
        <AppText variant="caption" align="center" className="text-content-secondary">
          {selected === scheme
            ? 'المظهر الحالي مفعّل.'
            : 'المظهر المختار رح يتطبّق بعد الضغط على الزر.'}
        </AppText>
      </View>
    </ProfileScreenShell>
  );
}
