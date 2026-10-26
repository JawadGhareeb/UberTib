import { useMemo, useState, useCallback, useRef } from 'react';
import { useRouter } from 'expo-router';
import { FlatList, Pressable, ScrollView, View } from 'react-native';
import { FamilyCard } from '@/features/discovery/components/service-family-card';

import { AppHeader } from '@/shared/components/navigation';
import { PATIENT_TAB_BAR_HEIGHT } from '@/shared/components/navigation/patient-tab-metrics';
import { AppText, EmptyState, Screen, SearchField } from '@/shared/components/ui';
import { penServiceGroups } from '@/features/discovery/presentation/pen-discovery-data';

type ServiceListEntry = (typeof penServiceGroups)[number]['families'][number] & {
  groupTitle: string;
};

export function ServiceCatalogTabScreen() {
  const router = useRouter();
  const [groupCode, setGroupCode] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const groupScrollRef = useRef<ScrollView>(null);
  const initialGroupScrollDone = useRef(false);
  const families = useMemo(
    () =>
      penServiceGroups
        .filter((group) => !groupCode || group.code === groupCode)
        .flatMap((group) =>
          group.families.map((family) => ({ ...family, groupTitle: group.title })),
        )
        .filter(
          (family) =>
            !query.trim() ||
            [family.title, family.description, family.groupTitle].some((value) =>
              value.includes(query.trim()),
            ),
        ),
    [groupCode, query],
  );

  const renderService = useCallback(
    ({ item: family }: { item: ServiceListEntry }) => (
      <FamilyCard
        family={family}
        layout="grid"
        onPress={() =>
          router.push({
            pathname: '/discover/service/[serviceCode]',
            params: { serviceCode: family.id },
          })
        }
      />
    ),
    [router],
  );

  return (
    <Screen contentClassName="px-0 py-0" header={<AppHeader variant="primary" title="الخدمات" />}>
      <FlatList
        className="min-h-0 flex-1"
        data={families}
        numColumns={2}
        columnWrapperStyle={{ flexDirection: 'row-reverse', justifyContent: 'space-between' }}
        keyExtractor={(family) => family.id}
        initialNumToRender={6}
        maxToRenderPerBatch={6}
        windowSize={5}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
        contentContainerClassName="mx-auto w-full max-w-[430px] gap-3 px-4 pt-4"
        contentContainerStyle={{ paddingBottom: PATIENT_TAB_BAR_HEIGHT + 56 }}
        ListHeaderComponent={
          <View className="gap-4 pb-1">
            <View className="items-end gap-1">
              <AppText align="right" variant="heading-2">
                خدمات الأسنان
              </AppText>
              <AppText align="right" variant="label" className="text-content-secondary">
                تصفح جميع الخدمات حسب العائلة، ثم شاهد الأطباء المؤهلين لكل خدمة.
              </AppText>
            </View>
            <SearchField
              value={query}
              onChangeText={setQuery}
              placeholder="ابحث عن خدمة..."
              accessibilityLabel="البحث في الخدمات"
            />
            <ScrollView
              ref={groupScrollRef}
              onContentSizeChange={() => {
                if (initialGroupScrollDone.current) return;
                groupScrollRef.current?.scrollToEnd({ animated: false });
                initialGroupScrollDone.current = true;
              }}
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ flexGrow: 0 }}
              contentContainerStyle={{ flexDirection: 'row-reverse', gap: 8, paddingVertical: 3 }}
            >
              {[{ code: null, title: 'كل الخدمات' }, ...penServiceGroups].map((group) => (
                <Pressable
                  key={group.code ?? 'all'}
                  accessibilityRole="button"
                  accessibilityState={{ selected: groupCode === group.code }}
                  onPress={() => setGroupCode(group.code)}
                  className={
                    'min-h-[42px] justify-center rounded-full border px-4 ' +
                    (groupCode === group.code
                      ? 'border-action-primary bg-action-primary'
                      : 'border-border-subtle bg-surface-default')
                  }
                >
                  <AppText
                    className={
                      groupCode === group.code
                        ? 'font-ui-semibold text-content-on-action'
                        : 'font-ui-medium'
                    }
                  >
                    {group.title}
                  </AppText>
                </Pressable>
              ))}
            </ScrollView>
            <AppText align="right" variant="label" className="font-ui-semibold">
              الخدمات ({families.length})
            </AppText>
          </View>
        }
        ListEmptyComponent={
          <EmptyState
            title="ما لقينا خدمات مطابقة"
            description="جرّب كلمة بحث ثانية أو اختر كل مجموعات الخدمات."
            actionLabel="عرض كل الخدمات"
            onAction={() => {
              setQuery('');
              setGroupCode(null);
            }}
            icon={{ ios: 'magnifyingglass', android: 'search', web: 'search' }}
          />
        }
        renderItem={renderService}
      />
    </Screen>
  );
}
