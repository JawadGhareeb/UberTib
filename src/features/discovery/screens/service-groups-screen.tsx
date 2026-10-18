import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView, View } from 'react-native';

import {
  DiscoveryBottomBar,
  DiscoveryHeader,
} from '@/features/discovery/components/pen-discovery-ui';
import { penServiceGroups } from '@/features/discovery/presentation/pen-discovery-data';
import { ServiceGroupCard } from '@/features/discovery/components/service-group-card';
import { AppIcon, AppText, Button, Screen, SearchField } from '@/shared/components/ui';

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
    <Screen contentClassName="px-0 py-0">
      <DiscoveryHeader showBack={showBack} showSearchAction title="الخدمات السنية" />

      <ScrollView
        contentContainerClassName={showBack
          ? "mx-auto w-full max-w-[430px] px-4 pb-[84px]"
          : "mx-auto w-full max-w-[430px] px-4 pb-4"}
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
            <View className="items-center gap-2 rounded-[18px] border border-border-subtle bg-surface-default px-4 py-8">
              <AppIcon
                name={{ ios: 'magnifyingglass', android: 'search', web: 'search' }}
                size={24}
                tone="action"
              />
              <AppText align="center" className="font-ui-semibold" variant="label">
                ما لقينا خدمة مطابقة
              </AppText>
              <AppText align="center" className="text-content-secondary" variant="caption">
                جرّب كلمة أبسط أو ابحث بكل الخدمات
              </AppText>
              <Button
                className="mt-1"
                label="البحث بكل الخدمات"
                onPress={() => router.push('/discover/search')}
                size="sm"
                variant="outline"
              />
            </View>
          )}
        </View>

      </ScrollView>

      {showBack ? <DiscoveryBottomBar /> : null}
    </Screen>
  );
}
