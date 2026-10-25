import { useRouter } from 'expo-router';
import { ScrollView, View } from 'react-native';

import { getMockNeedsAttentionForScenario } from '@/features/platform/mocks/platform.mock';
import { AppHeader } from '@/shared/components/navigation';
import { AppText, AttentionItem, ReadStateBoundary, Screen } from '@/shared/components/ui';
import { useMockScenario } from '@/shared/mock';

export function NeedsAttentionScreen() {
  const router = useRouter();
  const getSurfaceState = useMockScenario((state) => state.getSurfaceState);
  const scenario = useMockScenario((state) => state.scenario);
  const readState = getSurfaceState('attention');
  const attentionItems = getMockNeedsAttentionForScenario(scenario);

  return (
    <Screen contentClassName="px-0 py-0">
      <AppHeader backLabel="الرئيسية" showBack title="يحتاج انتباهك" />
      <ScrollView
        contentContainerClassName="mx-auto w-full max-w-[430px] px-4 pb-8 pt-5"
        showsVerticalScrollIndicator={false}
      >
        <AppText className="text-content-secondary">
          الأمور التي فيها موعد قريب أو خطوة واضحة تظهر هون أولاً.
        </AppText>

        <ReadStateBoundary
          emptyDescription="ما في مواعيد قريبة أو خطوات مطلوبة منك حالياً."
          emptyTitle="ما في شي يحتاج انتباهك"
          state={readState}
          staleAtLabel="آخر تحديث محفوظ"
        >
          <View className="mt-5 overflow-hidden rounded-surface border border-border-subtle bg-surface-default">
            {attentionItems.map((item, index) => (
              <AttentionItem
                actionLabel={item.actionLabel}
                detail={item.detail}
                divider={index > 0}
                key={item.id}
                onPress={() => router.push(item.href)}
                title={item.title}
                tone={item.tone}
              />
            ))}
          </View>
        </ReadStateBoundary>
      </ScrollView>
    </Screen>
  );
}
