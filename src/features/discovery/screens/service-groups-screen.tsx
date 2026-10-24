import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView, View } from 'react-native';

import {
  DiscoveryBottomBar,
  DiscoveryHeader,
} from '@/features/discovery/components/pen-discovery-ui';
import { penServiceGroups } from '@/features/discovery/presentation/pen-discovery-data';
import { ServiceGroupCard } from '@/features/discovery/components/service-group-card';
import { AppHeader } from '@/shared/components/navigation';
import { AppText, EmptyState, Screen, SearchField } from '@/shared/components/ui';

interface ServiceGroupsScreenProps {
  showBack?: boolean;
}

export function ServiceGroupsScreen({ showBack = true }: ServiceGroupsScreenProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase('ar');
    if (!normalized) return penServiceGroups;

    return penServiceGroups.filter((group) =>
      [group.code, group.title, group.description, ...group.families.map((family) => family.title)]
        .join(' ')
        .toLocaleLowerCase('ar')
        .includes(normalized),
    );
  }, [query]);

  return (
    <Screen
      contentClassName="px-0 py-0"
      header={
        showBack ? (
          <DiscoveryHeader showBack showSearchAction title="الخدمات السنية" />
        ) : (
          <AppHeader variant="primary" title="اكتشف" />
        )
      }
    >
      <ScrollView
        style={{ flex: 1 }}
        contentContainerClassName={
          showBack
            ? 'mx-auto w-full max-w-[430px] px-4 pb-[84px]'
            : 'mx-auto w-full max-w-[430px] px-4 pb-32'
        }
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <AppText
          align="right"
          className="mt-2 font-ui-bold"
          style={{ fontSize: 21, lineHeight: 30 }}
          variant="heading-2"
        >
          شو نوع العناية اللي عم تدور عليها؟
        </AppText>
        <SearchField
          containerClassName="mt-2"
          onChangeText={setQuery}
          placeholder="ابحث عن خدمة مثل: تبييض أو زراعة"
          value={query}
        />

        <View className="mt-2 gap-2">
          {filtered.length ? (
            filtered.map((group) => (
              <ServiceGroupCard
                group={group}
                key={group.code}
                onPress={() =>
                  router.push({
                    pathname: '/discover/group/[groupCode]',
                    params: { groupCode: group.code },
                  })
                }
              />
            ))
          ) : (
            <EmptyState
              title="ما لقينا خدمة مطابقة"
              description="جرّب كلمة أبسط أو امسح البحث لعرض جميع المجموعات."
              actionLabel="عرض جميع الخدمات"
              onAction={() => setQuery('')}
              icon={{ ios: 'magnifyingglass', android: 'search', web: 'search' }}
            />
          )}
        </View>
      </ScrollView>

      {showBack ? <DiscoveryBottomBar /> : null}
    </Screen>
  );
}
