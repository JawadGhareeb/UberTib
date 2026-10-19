import { Redirect } from 'expo-router';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Button } from 'heroui-native/button';
import { Card } from 'heroui-native/card';
import { Input } from 'heroui-native/input';

import { AppText } from '@/shared/components/ui';
import { useAppTheme } from '@/shared/theme/use-app-theme';

/**
 * Development-only preview for validating HeroUI, Uniwind, Arabic/RTL and theme.
 * This route is not linked from patient navigation and is unavailable in release builds.
 */
export default function HeroUIFoundationPreview() {
  const [value, setValue] = useState('');
  const { scheme, toggleScheme } = useAppTheme();

  if (!__DEV__) return <Redirect href="/" />;

  return (
    <ScrollView className="flex-1 bg-surface-canvas">
      <View className="gap-4 px-4 py-8">
        <AppText align="right" variant="heading-2">
          معاينة المكوّنات — UberTib
        </AppText>
        <AppText align="right" variant="body">
          HeroUI Native + Uniwind · {scheme === 'light' ? 'فاتح' : 'داكن'}
        </AppText>
        <Card variant="default" className="gap-4 p-4">
          <AppText align="right" variant="label">
            اختبار الحقول والأزرار
          </AppText>
          <Input
            accessibilityLabel="حقل اختبار"
            placeholder="اكتب اسماً للتجربة"
            value={value}
            onChangeText={setValue}
          />
          <Button onPress={toggleScheme} variant="primary">
            <Button.Label>تبديل الوضع الفاتح والداكن</Button.Label>
          </Button>
          <Button variant="outline" onPress={() => setValue('')}>
            <Button.Label>مسح الحقل</Button.Label>
          </Button>
        </Card>
        <View className="rounded-surface border border-border-default bg-surface-default p-4">
          <AppText align="right" variant="body-strong">
            {value ? 'مرحباً ' + value : 'تم تحميل الثيم العربي بنجاح'}
          </AppText>
        </View>
      </View>
    </ScrollView>
  );
}
