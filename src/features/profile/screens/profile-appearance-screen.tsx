import { useState } from 'react';
import { Radio, RadioGroup } from 'heroui-native';
import { View } from 'react-native';

import { ProfileScreenShell } from '@/features/profile/components/profile-screen-shell';
import { AppIcon, AppText, Button, type AppIconName } from '@/shared/components/ui';
import { darkTheme, lightTheme, type ThemeScheme } from '@/shared/theme';
import { useAppTheme } from '@/shared/theme/use-app-theme';

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

/** Keep the full theme-preview card separate from the HeroUI radio indicator. */
function AppearanceChoice({
  selected,
  active,
  item,
}: {
  selected: boolean;
  active: boolean;
  item: (typeof options)[number];
}) {
  return (
    <RadioGroup.Item
      value={item.scheme}
      accessibilityLabel={'اختيار المظهر ' + item.name}
      className={
        'min-h-[216px] min-w-0 flex-1 flex-col items-stretch gap-2 rounded-[17px] border p-3 ' +
        (selected
          ? 'border-action-primary bg-action-subtle'
          : 'border-border-subtle bg-surface-default')
      }
    >
      <View className="flex-row-reverse items-center gap-2">
        <View className="h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-surface-subtle">
          <AppIcon name={item.icon} size={22} tone={selected ? 'action' : 'secondary'} />
        </View>
        <AppText align="right" variant="label" className="min-w-0 flex-1 font-ui-semibold">
          {item.name}
        </AppText>
      </View>

      <View
        className="h-[94px] w-full justify-between overflow-hidden rounded-[11px] border border-border-subtle p-2"
        style={{ backgroundColor: item.canvas }}
      >
        <View
          className="h-[11px] w-14 self-end rounded-[4px]"
          style={{ backgroundColor: item.ink, opacity: 0.65 }}
        />
        <View className="gap-2 rounded-[8px] p-2" style={{ backgroundColor: item.panel }}>
          <View
            className="h-[7px] w-14 self-end rounded"
            style={{ backgroundColor: item.ink, opacity: 0.55 }}
          />
          <View
            className="h-[7px] w-20 self-end rounded"
            style={{ backgroundColor: item.ink, opacity: 0.22 }}
          />
        </View>
        <View
          className="h-[12px] w-16 self-end rounded-[5px]"
          style={{ backgroundColor: item.label }}
        />
      </View>

      <View className="min-h-[27px] flex-row-reverse items-center justify-center gap-2">
        <Radio />
        <AppText
          align="right"
          variant="caption"
          className={selected ? 'font-ui-semibold text-content-link' : 'text-content-secondary'}
        >
          {active ? 'المظهر الحالي' : selected ? 'مختار للتطبيق' : 'اختار المظهر'}
        </AppText>
      </View>
    </RadioGroup.Item>
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
        <RadioGroup
          value={selected}
          onValueChange={(next) => setDraft(next as ThemeScheme)}
          className="flex-row-reverse items-stretch gap-3"
          style={{ direction: 'rtl' }}
        >
          {options.map((item) => (
            <AppearanceChoice
              key={item.scheme}
              item={item}
              selected={selected === item.scheme}
              active={scheme === item.scheme}
            />
          ))}
        </RadioGroup>

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
