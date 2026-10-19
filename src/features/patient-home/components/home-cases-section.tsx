import { useRouter } from 'expo-router';
import { View } from 'react-native';
import type { MockCareCase } from '@/features/my-care/mocks/care.mock';
import { CarePreview } from './home-care-preview';
import { SectionTitle } from './home-section-title';

export function HomeCasesSection({ activeCases }: { activeCases: MockCareCase[] }) {
  const router = useRouter();
  return (
    <>
      {activeCases.length > 0 ? (
        <View className="gap-2.5">
          <SectionTitle
            title="الحالات التي تتابعها"
            action="عرض الكل"
            onAction={() => router.push('/(tabs)/care')}
          />
          {activeCases.slice(0, 3).map((item) => (
            <CarePreview
              key={item.id}
              item={item}
              onPress={() =>
                router.push({
                  pathname: '/care/[caseId]/timeline',
                  params: { caseId: item.id },
                })
              }
            />
          ))}
        </View>
      ) : null}
    </>
  );
}
