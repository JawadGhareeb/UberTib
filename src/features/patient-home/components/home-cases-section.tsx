import { useRouter } from 'expo-router';
import { View } from 'react-native';
import type { MockCareCase } from '@/features/my-care/mocks/care.mock';
import { CaseRow } from '@/features/my-care/components/case-overview-card';
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
            onAction={() => router.push({ pathname: '/(tabs)/care', params: { tab: 'cases' } })}
          />
          {activeCases.slice(0, 3).map((item) => (
            <CaseRow key={item.id} item={item} />
          ))}
        </View>
      ) : null}
    </>
  );
}
