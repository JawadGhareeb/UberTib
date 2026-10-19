import { View } from 'react-native';
import { AppText } from '@/shared/components/ui';

export function CareOverviewIntro() {
  return (
    <View className="gap-1 px-4">
      <AppText align="right" variant="heading-2">علاجك ومواعيدك</AppText>
      <AppText align="right" variant="label" className="text-content-secondary">
        تابع تقدم العلاج وحالة حجوزاتك بمكان واحد.
      </AppText>
    </View>
  );
}
