import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';

import { DiscoveryHeader, FamilyCard } from '@/features/discovery/components/pen-discovery-ui';
import { mockProviders } from '@/features/discovery/mocks/providers.mock';
import { penServiceGroups } from '@/features/discovery/presentation/pen-discovery-data';
import { AppIcon, AppText, Button, Screen, SearchField } from '@/shared/components/ui';

type SearchKind = 'all' | 'service' | 'doctor' | 'area';

export function ServiceSearchResultsScreen() {
  const router = useRouter();
  const { q = '', kind = 'all' } = useLocalSearchParams<{ q?: string; kind?: SearchKind }>();
  const [query, setQuery] = useState(q);
  const normalized = query.trim().toLocaleLowerCase('ar');

  const { families, providers } = useMemo(() => {
    const words = normalized.split(/\s+/).filter((word) => word !== 'في' && word !== 'عن' && word.length > 0);
    const matches = (text: string) =>
      words.every((word) => text.toLocaleLowerCase('ar').includes(word));
    const showServices = kind === 'all' || kind === 'service';
    const showProviders = kind === 'all' || kind === 'doctor' || kind === 'area';
    const matchingFamilies = showServices
      ? penServiceGroups.flatMap((group) => group.families).filter((family) =>
          !normalized ||
          matches([family.title, family.description, family.groupCode].join(' ')),
        )
      : [];
    const matchingProviders = showProviders
      ? mockProviders.filter((provider) => {
          if (!normalized) return true;
          const text = kind === 'area'
            ? provider.area
            : [provider.name, provider.specialty, provider.branch, provider.area].join(' ');
          return matches(text);
        })
      : [];
    return { families: matchingFamilies, providers: matchingProviders };
  }, [kind, normalized]);

  const total = families.length + providers.length;

  return (
    <Screen contentClassName="px-0 py-0">
      <DiscoveryHeader subtitle="البحث" title="نتائج البحث" />
      <ScrollView
        contentContainerClassName="mx-auto w-full max-w-[430px] px-4 pb-24 pt-2"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <SearchField
          onChangeText={setQuery}
          placeholder={kind === 'doctor' ? 'ابحث باسم الطبيب' : kind === 'area' ? 'ابحث عن المنطقة' : 'ابحث عن خدمة أو طبيب أو منطقة'}
          value={query}
        />

        <AppText align="right" className="mt-3 font-ui-bold" variant="label">
          {total} نتائج مطابقة
        </AppText>

        {families.length > 0 ? (
          <View className="mt-3 gap-2">
            <AppText align="right" className="font-ui-semibold" variant="label">الخدمات</AppText>
            {families.map((family) => (
              <FamilyCard
                family={family}
                key={family.id}
                onPress={() => router.push({
                  pathname: '/discover/service/[serviceCode]',
                  params: { serviceCode: family.id },
                })}
              />
            ))}
          </View>
        ) : null}

        {providers.length > 0 ? (
          <View className="mt-3 gap-2">
            <AppText align="right" className="font-ui-semibold" variant="label">الأطباء والمناطق</AppText>
            {providers.map((provider) => {
              const serviceCode = provider.serviceCodes.includes('root-canal')
                ? 'root-canal'
                : provider.serviceCodes[0] ?? 'dental-checkup';
              return (
                <Pressable
                  accessibilityLabel={`عرض الطبيب ${provider.name}`}
                  accessibilityRole="button"
                  className="min-h-[66px] flex-row-reverse items-center gap-3 rounded-[12px] border border-border-subtle bg-surface-default px-3"
                  key={provider.id}
                  onPress={() => router.push({
                    pathname: '/discover/provider/[providerId]',
                    params: { providerId: provider.id, serviceCode },
                  })}
                >
                  <View className="h-10 w-10 items-center justify-center rounded-full bg-action-subtle">
                    <AppIcon name={{ ios: 'person.crop.circle', android: 'person_outline', web: 'person_outline' }} size={22} tone="action" />
                  </View>
                  <View className="min-w-0 flex-1 items-end">
                    <AppText align="right" className="font-ui-semibold" variant="label">{provider.name}</AppText>
                    <AppText align="right" className="text-content-secondary" variant="caption">
                      {provider.specialty} · {provider.area}
                    </AppText>
                  </View>
                  <AppIcon name={{ ios: 'chevron.left', android: 'chevron_left', web: 'chevron_left' }} size={16} tone="secondary" />
                </Pressable>
              );
            })}
          </View>
        ) : null}

        {total === 0 ? (
          <View className="mt-4 items-center gap-2 rounded-[13px] border border-border-subtle bg-surface-default p-5">
            <AppIcon name={{ ios: 'magnifyingglass', android: 'search', web: 'search' }} size={24} tone="action" />
            <AppText align="center" className="font-ui-semibold" variant="label">ما لقينا نتائج مطابقة</AppText>
            <AppText align="center" className="text-content-secondary" variant="caption">
              جرّب كلمة أبسط أو غيّر نوع البحث
            </AppText>
            <Button label="العودة للبحث" onPress={() => router.push('/discover/search')} variant="outline" />
          </View>
        ) : null}

        <Button
          className="mt-4"
          label="مو متأكد؟ خلينا نحدد حالتك"
          onPress={() => router.push('/assessment/start')}
          variant="secondary"
        />
      </ScrollView>
    </Screen>
  );
}
