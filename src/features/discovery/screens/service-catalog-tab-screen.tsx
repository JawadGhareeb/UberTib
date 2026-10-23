import { useMemo, useState } from 'react';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, View } from 'react-native';
import { AppHeader } from '@/shared/components/navigation';
import { PATIENT_TAB_BAR_HEIGHT } from '@/shared/components/navigation/patient-tab-metrics';
import { AppIcon, AppText, Screen, SearchField } from '@/shared/components/ui';
import { ServiceIcon } from '@/features/discovery/components/service-icon';
import { penServiceGroups } from '@/features/discovery/presentation/pen-discovery-data';

export function ServiceCatalogTabScreen() {
  const router = useRouter();
  const [groupCode, setGroupCode] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const families = useMemo(() => penServiceGroups
    .filter((group) => !groupCode || group.code === groupCode)
    .flatMap((group) => group.families.map((family) => ({ ...family, groupTitle: group.title })))
    .filter((family) => !query.trim() || [family.title, family.description, family.groupTitle].some((value) => value.includes(query.trim()))),
    [groupCode, query]);
  return (
    <Screen contentClassName="px-0 py-0" header={<AppHeader variant="primary" title="الخدمات" />}>
      <ScrollView
        contentContainerClassName="mx-auto w-full max-w-[430px] gap-4 px-4 pt-4"
        contentContainerStyle={{ paddingBottom: PATIENT_TAB_BAR_HEIGHT + 56 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="items-end gap-1">
          <AppText align="right" variant="heading-2">خدمات الأسنان</AppText>
          <AppText align="right" variant="label" className="text-content-secondary">
            تصفح جميع الخدمات حسب العائلة، ثم شاهد الأطباء المؤهلين لكل خدمة.
          </AppText>
        </View>
        <SearchField value={query} onChangeText={setQuery} placeholder="ابحث عن خدمة..." accessibilityLabel="البحث في الخدمات" />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexGrow: 0 }} contentContainerStyle={{ flexDirection: 'row-reverse', gap: 8, paddingVertical: 3 }}>
          {[{ code: null, title: 'كل الخدمات' }, ...penServiceGroups].map((group) => (
            <Pressable
              key={group.code ?? 'all'}
              accessibilityRole="button"
              accessibilityState={{ selected: groupCode === group.code }}
              onPress={() => setGroupCode(group.code)}
              className={'min-h-[42px] justify-center rounded-full border px-4 ' + (groupCode === group.code ? 'border-action-primary bg-action-primary' : 'border-border-subtle bg-surface-default')}
            >
              <AppText className={groupCode === group.code ? 'font-ui-semibold text-content-on-action' : 'font-ui-medium'}>{group.title}</AppText>
            </Pressable>
          ))}
        </ScrollView>
        <AppText align="right" variant="label" className="font-ui-semibold">الخدمات ({families.length})</AppText>
        <View className="gap-3">
          {families.map((family) => (
            <Pressable
              key={family.id}
              accessibilityRole="button"
              accessibilityLabel={'تفاصيل خدمة ' + family.title}
              onPress={() => router.push({ pathname: '/discover/service/[serviceCode]', params: { serviceCode: family.id } })}
              className="min-h-[96px] flex-row-reverse items-center gap-3 rounded-[15px] border border-border-subtle bg-surface-default p-3"
            >
              <View className="h-14 w-14 items-center justify-center rounded-[12px] bg-action-subtle">
                <ServiceIcon serviceId={family.id} size={31} />
              </View>
              <View className="min-w-0 flex-1 items-end gap-1">
                <AppText align="right" className="font-ui-semibold" variant="label">{family.title}</AppText>
                <AppText align="right" variant="caption" className="text-content-secondary">{family.groupTitle}</AppText>
                <AppText align="right" numberOfLines={2} variant="caption" className="text-content-secondary">{family.description}</AppText>
              </View>
              <AppIcon name={{ ios: 'chevron.left', android: 'chevron_left', web: 'chevron_left' }} size={17} tone="action" />
            </Pressable>
          ))}
          {!families.length ? <AppText align="center" variant="label" className="text-content-secondary">ما لقينا خدمات تطابق بحثك.</AppText> : null}
        </View>
      </ScrollView>
    </Screen>
  );
}
