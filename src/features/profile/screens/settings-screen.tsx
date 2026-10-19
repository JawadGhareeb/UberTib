import { useState } from 'react';
import { View } from 'react-native';

import { ProfileScreenShell } from '@/features/profile/components/profile-screen-shell';
import { SettingsToggleRow } from '@/features/profile/components/settings-toggle-row';
import { AppText } from '@/shared/components/ui';

export function SettingsScreen() {
  const [reminders, setReminders] = useState(true);
  const [careUpdates, setCareUpdates] = useState(true);
  const [accountUpdates, setAccountUpdates] = useState(false);

  return (
    <ProfileScreenShell
      eyebrow="حسابي"
      title="التفضيلات والإشعارات"
      description="اختار التنبيهات اللي بتهمك."
    >
      <View className="mt-5 gap-3">
        <AppText align="right" variant="heading-4">
          إشعاراتي
        </AppText>
        <View className="overflow-hidden rounded-[15px] border border-border-subtle bg-surface-default">
          <SettingsToggleRow
            title="تذكير المواعيد"
            description="تذكير قبل موعد الزيارة"
            value={reminders}
            onValueChange={setReminders}
          />
          <View className="h-px bg-border-subtle" />
          <SettingsToggleRow
            title="تحديثات العلاج"
            description="معلومات عن مراحل العلاج والمتابعة"
            value={careUpdates}
            onValueChange={setCareUpdates}
          />
          <View className="h-px bg-border-subtle" />
          <SettingsToggleRow
            title="تحديثات الحساب"
            description="تنبيهات الحساب والتفويضات"
            value={accountUpdates}
            onValueChange={setAccountUpdates}
          />
        </View>
        <AppText align="right" variant="caption" className="text-content-secondary">
          تفضيلات العرض الحالية تجريبية، والتنبيهات الفعلية بتعتمد على إعدادات النظام والموافقة على
          الإشعارات.
        </AppText>
      </View>
    </ProfileScreenShell>
  );
}