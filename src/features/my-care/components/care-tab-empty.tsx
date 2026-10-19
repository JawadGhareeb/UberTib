import { useRouter } from 'expo-router';
import { Button as HeroButton } from 'heroui-native';
import { View } from 'react-native';
import { AppIcon, AppText, ReadStateNotice } from '@/shared/components/ui';
import type { StructuralReadState } from '@/shared/types/structural-read-state';
import type { CareMainTab } from '../model/care-tab-filters';

export function CareTabEmpty({
  tab,
  filterActive,
  state,
}: {
  tab: CareMainTab;
  filterActive: boolean;
  state: StructuralReadState;
}) {
  const router = useRouter();
  if (state !== 'success' && state !== 'empty-filtered' && state !== 'empty-no-data') {
    return <ReadStateNotice state={state} />;
  }
  return (
    <View className="items-center gap-3 rounded-[16px] bg-surface-default px-4 py-10">
      <View className="h-14 w-14 items-center justify-center rounded-full bg-action-subtle">
        <AppIcon
          name={
            tab === 'cases'
              ? { ios: 'heart.text.square', android: 'medical_services', web: 'medical_services' }
              : { ios: 'calendar', android: 'calendar_month', web: 'calendar_month' }
          }
          size={27}
          tone="action"
        />
      </View>
      <AppText variant="body-strong" align="center">
        {filterActive
          ? 'ما لقينا نتائج ضمن الفلاتر'
          : tab === 'cases'
            ? 'ما عندك حالات علاجية حالياً'
            : 'ما عندك حجوزات حالياً'}
      </AppText>
      <AppText variant="caption" align="center" className="text-content-secondary">
        {filterActive
          ? 'جرّب تغيّر الفلاتر لحتى تظهر سجلات أكتر.'
          : tab === 'cases'
            ? 'الحالات الموثّقة من العيادة رح تظهر هون.'
            : 'لما تطلب موعد عند طبيب بتقدر تتابعه من هون.'}
      </AppText>
      {!filterActive ? (
        <HeroButton
          variant="outline"
          className="min-h-[44px] rounded-[12px]"
          onPress={() => router.push('/(tabs)/discover')}
        >
          <HeroButton.Label>استكشف الخدمات</HeroButton.Label>
        </HeroButton>
      ) : null}
    </View>
  );
}
