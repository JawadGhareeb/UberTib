import { useRouter } from 'expo-router';
import { Pressable, View } from 'react-native';

import { ProfileScreenShell } from '@/features/profile/components/profile-screen-shell';
import { useFamilyMembers } from '@/features/profile/state/family-members-provider';
import { getMockGrantsForScenario } from '@/features/profile/mocks/representation.mock';
import { AppIcon, AppText, Button, ReadStateBoundary } from '@/shared/components/ui';
import { useMockScenario } from '@/shared/mock';

export function FamilyRepresentationScreen() {
  const router = useRouter();
  const { members } = useFamilyMembers();
  const { getSurfaceState, scenario } = useMockScenario();
  const readState = getSurfaceState('representation');
  const grants = getMockGrantsForScenario(scenario);
  const family = members.filter((person) => !person.active);
  return (
    <ProfileScreenShell
      eyebrow="أفراد الأسرة"
      title="أفراد أسرتي"
      description="أضف فرد من الأسرة، ووقت الحجز اختار لمين الموعد."
    >
      <ReadStateBoundary
        state={readState}
        emptyTitle="بيانات أفراد الأسرة غير متاحة"
        permissionTitle="ما في صلاحية لعرض أفراد الأسرة"
      >
        <View className="gap-3">
          <View className="flex-row-reverse items-center justify-between gap-3">
            <AppText variant="heading-4">أفراد الأسرة</AppText>
            <AppText variant="caption" className="text-content-secondary">
              {family.length} أفراد
            </AppText>
          </View>
          {family.length ? (
            family.map((person) => {
              const allowed = grants.some(
                (grant) =>
                  grant.subjectPatientId === person.id &&
                  grant.statusLabel === 'فعال' &&
                  grant.directionLabel.startsWith('أدير نيابة') &&
                  grant.actions.some((action) => action === 'إدارة الحجوزات'),
              );
              return (
                <View
                  key={person.id}
                  className="min-h-[78px] flex-row-reverse items-center gap-3 rounded-[14px] border border-border-subtle bg-surface-default p-3"
                >
                  <View className="h-11 w-11 shrink-0 items-center justify-center rounded-full bg-action-subtle">
                    <AppText variant="label" className="font-ui-semibold text-content-link">
                      {person.initials}
                    </AppText>
                  </View>
                  <View className="min-w-0 flex-1 items-end gap-1">
                    <AppText variant="label" align="right" className="font-ui-semibold">
                      {person.name}
                    </AppText>
                    <AppText variant="caption" align="right" className="text-content-secondary">
                      {person.relation}
                      {person.age !== null ? ' · ' + person.age + ' سنة' : ''}
                    </AppText>
                    <AppText
                      variant="caption"
                      align="right"
                      className={allowed ? 'text-content-link' : 'text-content-secondary'}
                    >
                      {allowed ? 'يمكن الحجز نيابةً عنه' : 'الحجز نيابةً عنه يحتاج صلاحية'}
                    </AppText>
                  </View>
                </View>
              );
            })
          ) : (
            <View className="items-center gap-2 rounded-[15px] bg-surface-subtle px-4 py-8">
              <AppIcon
                name={{ ios: 'person.2', android: 'group', web: 'group' }}
                size={28}
                tone="secondary"
              />
              <AppText align="center" variant="label">
                ما أضفت أفراد من الأسرة بعد
              </AppText>
            </View>
          )}
          <Button
            label="إضافة فرد من الأسرة"
            onPress={() => router.push('/profile/dependents/new')}
            className="min-h-[48px] rounded-[12px]"
          />
          <AppText align="right" variant="caption" className="text-content-secondary">
            إضافة فرد ما بتمنح صلاحية تلقائية للوصول لسجلاته الصحية أو الحجز نيابةً عنه.
          </AppText>
        </View>
        <View className="mt-6 gap-3">
          <View className="flex-row-reverse items-center justify-between gap-2">
            <AppText variant="heading-4">التفويضات</AppText>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="إنشاء تفويض"
              className="min-h-[40px] justify-center px-2"
              onPress={() => router.push('/profile/grants/new')}
            >
              <AppText variant="label" className="font-ui-semibold text-content-link">
                إنشاء تفويض
              </AppText>
            </Pressable>
          </View>
          <View className="overflow-hidden rounded-[14px] border border-border-subtle bg-surface-default">
            {grants.map((grant, i) => (
              <Pressable
                key={grant.id}
                accessibilityRole="button"
                accessibilityLabel={'تفاصيل تفويض ' + grant.subjectName}
                onPress={() =>
                  router.push({
                    pathname: '/profile/grants/[grantId]',
                    params: { grantId: grant.id },
                  })
                }
                className={
                  'min-h-[69px] flex-row-reverse items-center gap-3 px-3 py-2.5 ' +
                  (i ? 'border-t border-border-subtle' : '')
                }
              >
                <View className="h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-action-subtle">
                  <AppIcon
                    name={{ ios: 'shield.lefthalf.filled', android: 'security', web: 'security' }}
                    size={18}
                    tone="action"
                  />
                </View>
                <View className="min-w-0 flex-1 items-end gap-1">
                  <AppText
                    align="right"
                    variant="label"
                    className="font-ui-semibold"
                    numberOfLines={1}
                  >
                    {grant.subjectName} · {grant.statusLabel}
                  </AppText>
                  <AppText
                    align="right"
                    variant="caption"
                    className="text-content-secondary"
                    numberOfLines={1}
                  >
                    {grant.directionLabel} · {grant.purpose}
                  </AppText>
                </View>
                <AppIcon
                  name={{ ios: 'chevron.left', android: 'chevron_left', web: 'chevron_left' }}
                  size={16}
                  tone="secondary"
                />
              </Pressable>
            ))}
          </View>
        </View>
      </ReadStateBoundary>
    </ProfileScreenShell>
  );
}
