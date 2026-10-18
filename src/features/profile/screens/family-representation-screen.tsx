import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Modal, Pressable, ScrollView, View } from 'react-native';

import { ReferenceCard, ReferenceHeader, ReferenceIcon } from '@/features/profile/components/patient-reference-ui';
import { getMockGrantsForScenario, mockDependents } from '@/features/profile/mocks/representation.mock';
import { AppIcon, AppText, Button, ConfirmationDialog, ReadStateBoundary, Screen } from '@/shared/components/ui';
import type { AppIconName } from '@/shared/components/ui/app-icon';
import { useMockScenario } from '@/shared/mock';
import { mockPatientWorld } from '@/shared/mock/patient.mock';
import { cn } from '@/shared/utils/cn';

type Grant = ReturnType<typeof getMockGrantsForScenario>[number];

function GrantFact({ label, value, icon }: { label: string; value: string; icon: AppIconName }) {
  return (
    <View className="min-h-[41px] flex-row-reverse items-center gap-[8px] rounded-[10px] bg-surface-subtle px-[10px] py-[6px]">
      <AppIcon name={icon} size={16} tone="action" />
      <View className="min-w-0 flex-1 items-end">
        <AppText align="right" className="text-content-secondary" style={{ fontSize: 9, lineHeight: 14 }} variant="caption">
          {label}
        </AppText>
        <AppText align="right" className="font-ui-semibold" numberOfLines={2} style={{ fontSize: 10, lineHeight: 16 }} variant="caption">
          {value}
        </AppText>
      </View>
    </View>
  );
}

function GrantCard({
  grant,
  pending,
  canMutate,
  onOpen,
  onRevoke,
}: {
  grant: Grant;
  pending: boolean;
  canMutate: boolean;
  onOpen: () => void;
  onRevoke: () => void;
}) {
  const active = grant.statusLabel === 'فعال' && !pending;
  const display = pending ? 'سحب قيد المعالجة' : grant.statusLabel;
  const canRevoke = canMutate && active && grant.directionLabel === 'منحتها تفويضاً';

  return (
    <ReferenceCard className={cn('gap-[7px] p-[9px]', active && 'border-action-primary/40')}>
      <View className="flex-row-reverse items-center gap-[7px]">
        <ReferenceIcon
          icon={{ ios: 'questionmark.circle', android: 'help_outline', web: 'help_outline' }}
          size={34}
        />
        <View className="min-w-0 flex-1 items-end">
          <AppText align="right" className="font-ui-bold" numberOfLines={2} style={{ fontSize: 11.5, lineHeight: 18 }} variant="label">
            {grant.subjectName} · {grant.purpose}
          </AppText>
          <AppText align="right" className="text-content-secondary" style={{ fontSize: 9, lineHeight: 14 }} variant="caption">
            {grant.directionLabel}
          </AppText>
        </View>
        <View className={cn('rounded-[7px] px-[7px] py-[4px]', active ? 'bg-tone-success-fill' : 'bg-tone-warning-fill')}>
          <AppText className={active ? 'text-tone-success-text' : 'text-tone-warning-text'} style={{ fontSize: 9, lineHeight: 14 }} variant="caption">
            {display}
          </AppText>
        </View>
      </View>

      <View className="gap-[5px]">
        <GrantFact
          icon={{ ios: 'checkmark.seal', android: 'verified', web: 'verified' }}
          label="أساس التفويض"
          value={grant.basisLabel}
        />
        <GrantFact
          icon={{ ios: 'checklist', android: 'checklist', web: 'checklist' }}
          label="الإجراءات المسموحة"
          value={grant.actions.join('، ')}
        />
        <GrantFact
          icon={{ ios: 'shield.lefthalf.filled', android: 'security', web: 'security' }}
          label="نطاق البيانات"
          value={grant.dataScope}
        />
        <GrantFact
          icon={{ ios: 'calendar', android: 'calendar_month', web: 'calendar_month' }}
          label="المدة الفعّالة"
          value={grant.effectiveLabel}
        />
      </View>

      <View className="flex-row-reverse gap-[6px]">
        <Pressable
          accessibilityRole="button"
          className="min-h-[44px] flex-1 items-center justify-center rounded-[9px] bg-action-subtle px-2"
          onPress={onOpen}
        >
          <AppText align="center" className="font-ui-semibold text-content-link" numberOfLines={2} style={{ fontSize: 10, lineHeight: 16 }} variant="caption">
            عرض الدليل والنطاق
          </AppText>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ disabled: !canRevoke }}
          className={cn('min-h-[44px] flex-1 items-center justify-center rounded-[9px] px-2', canRevoke ? 'bg-tone-danger-fill' : 'bg-surface-subtle')}
          disabled={!canRevoke}
          onPress={onRevoke}
        >
          <AppText align="center" className={canRevoke ? 'text-tone-danger-text' : 'text-content-placeholder'} style={{ fontSize: 10, lineHeight: 16 }} variant="caption">
            إلغاء التفويض
          </AppText>
        </Pressable>
      </View>
    </ReferenceCard>
  );
}

export function FamilyRepresentationScreen() {
  const router = useRouter();
  const { getGrantMutation, getSurfaceState, representationSubmissions, scenario, submitGrantRevocation } = useMockScenario();
  const [addMenuOpen, setAddMenuOpen] = useState(false);
  const [grantToRevokeId, setGrantToRevokeId] = useState<string | null>(null);
  const readState = getSurfaceState('representation');
  const grants = getMockGrantsForScenario(scenario);
  const pending = representationSubmissions.some((item) => item.kind === 'grant');
  const active = grants.filter((grant) => grant.statusLabel !== 'منتهي' && grant.statusLabel !== 'ملغى');
  const previous = grants.filter((grant) => grant.statusLabel === 'منتهي' || grant.statusLabel === 'ملغى');
  const canMutate = readState === 'success';
  const revokeTarget = grants.find((grant) => grant.id === grantToRevokeId);
  const canConfirmRevoke =
    canMutate &&
    revokeTarget?.statusLabel === 'فعال' &&
    revokeTarget.directionLabel === 'منحتها تفويضاً' &&
    getGrantMutation(revokeTarget.id)?.revocation?.status !== 'pending';
  // Keep one expanded permission card, like the reference, while preserving
  // quick access to every additional grant and its authoritative detail state.
  const featuredGrant = active.find((grant) => grant.directionLabel === 'منحتها تفويضاً') ?? active[0];
  const additionalGrants = active.filter((grant) => grant.id !== featuredGrant?.id);
  const coveredPatients = new Set(active.map((grant) => grant.subjectPatientId));
  const standaloneDependents = mockDependents.filter(
    (person) => person.active || !coveredPatients.has(person.id),
  );

  return (
    <Screen contentClassName="px-0 py-0">
      <ReferenceHeader
        title="أفراد العائلة"
        icon={{ ios: 'person.badge.plus', android: 'person_add', web: 'person_add' }}
        actionLabel="إضافة شخص أو تفويض"
        onAction={canMutate ? () => setAddMenuOpen(true) : undefined}
      />
      <ScrollView
        contentContainerClassName="mx-auto w-full max-w-[430px] px-[8px] pb-24 pt-0"
        showsVerticalScrollIndicator={false}
      >
        <ReadStateBoundary
          state={readState}
          emptyTitle="لا توجد علاقات عائلية متاحة"
          permissionTitle="إدارة الأسرة غير متاحة"
        >
          <View className="min-h-[104px] flex-row-reverse items-center justify-around rounded-[14px] bg-action-subtle px-3 py-[11px]">
            <View className="items-center gap-[3px]">
              <ReferenceIcon icon={{ ios: 'heart.circle', android: 'favorite_border', web: 'favorite_border' }} warm round size={40} />
              <AppText align="center" className="font-ui-semibold" variant="caption">
                {mockDependents[1]?.name ?? 'المريض التابع'}
              </AppText>
              <AppText align="center" className="text-content-secondary" style={{ fontSize: 9, lineHeight: 15 }} variant="caption">
                التابع · {mockDependents[1]?.relation ?? 'علاقة عائلية'}
              </AppText>
            </View>
            <ReferenceIcon icon={{ ios: 'arrow.left.arrow.right', android: 'swap_horiz', web: 'swap_horiz' }} warm round size={37} />
            <View className="items-center gap-[3px]">
              <ReferenceIcon icon={{ ios: 'person.crop.circle', android: 'account_circle', web: 'account_circle' }} surface round size={40} />
              <AppText align="center" className="font-ui-semibold" variant="caption">
                {mockPatientWorld.account.name}
              </AppText>
              <AppText align="center" className="text-content-secondary" style={{ fontSize: 9, lineHeight: 15 }} variant="caption">
                صاحب الحساب
              </AppText>
            </View>
          </View>

          <View className="mt-[7px] min-h-[49px] flex-row-reverse items-center gap-2 rounded-[11px] bg-tone-warning-fill px-3 py-[9px]">
            <AppIcon name={{ ios: 'arrow.triangle.2.circlepath', android: 'sync', web: 'sync' }} size={17} tone="warning" />
            <AppText align="right" className="min-w-0 flex-1 text-tone-warning-text" style={{ fontSize: 10, lineHeight: 17 }} variant="caption">
              تبديل المريض يغيّر السياق الطبي والحجوزات ضمن تفويض سارٍ. تبقى هويتك أنت كما هي.
            </AppText>
          </View>

          {pending ? (
            <View className="mt-[6px] rounded-[10px] bg-tone-warning-fill p-[9px]">
              <AppText align="right" className="text-tone-warning-text" variant="caption">
                طلب التفويض قيد التحقق، ولا يصبح فعالاً قبل صدور النتيجة.
              </AppText>
            </View>
          ) : null}

          <View className="mt-[13px] flex-row-reverse items-center justify-between px-[1px]">
            <AppText align="right" className="font-ui-bold" variant="label">
              إدارة التمثيل والصلاحيات
            </AppText>
            <AppText className="text-content-secondary" style={{ fontSize: 10 }} variant="caption">
              {active.length} تفويضات حالية
            </AppText>
          </View>

          <View className="mt-[7px] gap-[7px]">
            {featuredGrant ? (
              <GrantCard
                canMutate={canMutate}
                grant={featuredGrant}
                onOpen={() => router.push({ pathname: '/profile/grants/[grantId]', params: { grantId: featuredGrant.id } })}
                onRevoke={() => setGrantToRevokeId(featuredGrant.id)}
                pending={getGrantMutation(featuredGrant.id)?.revocation?.status === 'pending'}
              />
            ) : null}
          </View>

          <View className="mt-[7px] gap-[7px]">
            {standaloneDependents.map((person) => (
              <ReferenceCard className="min-h-[56px] flex-row-reverse items-center gap-[7px] p-[9px]" key={person.id}>
                <ReferenceIcon icon={{ ios: 'person.crop.circle', android: 'person_outline', web: 'person_outline' }} size={33} />
                <View className="min-w-0 flex-1 items-end">
                  <AppText align="right" className="font-ui-semibold" style={{ fontSize: 11, lineHeight: 17 }} variant="caption">
                    {person.name} · {person.relation}
                  </AppText>
                  <AppText align="right" className="text-content-secondary" style={{ fontSize: 9.5, lineHeight: 15 }} variant="caption">
                    {person.statusLabel}
                  </AppText>
                </View>
                <View className="rounded-[7px] bg-action-subtle px-[7px] py-[4px]">
                  <AppText className="text-content-link" style={{ fontSize: 9 }} variant="caption">
                    {person.active ? 'أنا' : 'تابع'}
                  </AppText>
                </View>
              </ReferenceCard>
            ))}
            {additionalGrants.map((grant) => (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`تفاصيل تفويض ${grant.subjectName}`}
                key={grant.id}
                onPress={() => router.push({ pathname: '/profile/grants/[grantId]', params: { grantId: grant.id } })}
              >
                <ReferenceCard className="min-h-[56px] flex-row-reverse items-center gap-[7px] p-[9px]">
                  <ReferenceIcon icon={{ ios: 'person.crop.circle', android: 'person_outline', web: 'person_outline' }} size={33} />
                  <View className="min-w-0 flex-1 items-end">
                    <AppText align="right" className="font-ui-semibold" style={{ fontSize: 11, lineHeight: 17 }} variant="caption">
                      {grant.subjectName} · {grant.purpose}
                    </AppText>
                    <AppText align="right" className="text-content-secondary" style={{ fontSize: 9.5, lineHeight: 15 }} variant="caption">
                      {grant.directionLabel} · {grant.dataScope}
                    </AppText>
                  </View>
                  <View className="rounded-[7px] bg-tone-success-fill px-[7px] py-[4px]">
                    <AppText className="text-tone-success-text" style={{ fontSize: 9 }} variant="caption">
                      {getGrantMutation(grant.id)?.revocation?.status === 'pending' ? 'قيد المعالجة' : grant.statusLabel}
                    </AppText>
                  </View>
                </ReferenceCard>
              </Pressable>
            ))}
            {previous.map((grant) => (
              <Pressable
                accessibilityRole="button"
                key={grant.id}
                onPress={() => router.push({ pathname: '/profile/grants/[grantId]', params: { grantId: grant.id } })}
              >
                <ReferenceCard className="min-h-[56px] flex-row-reverse items-center gap-[7px] p-[9px]">
                  <ReferenceIcon icon={{ ios: 'person.crop.circle.badge.xmark', android: 'person_off', web: 'person_off' }} size={33} />
                  <View className="min-w-0 flex-1 items-end">
                    <AppText align="right" className="font-ui-semibold" style={{ fontSize: 11, lineHeight: 17 }} variant="caption">
                      {grant.granteeName} · تفويض سابق
                    </AppText>
                    <AppText align="right" className="text-content-secondary" style={{ fontSize: 9.5, lineHeight: 15 }} variant="caption">
                      {grant.effectiveLabel}
                    </AppText>
                  </View>
                  <AppText className="text-content-secondary" variant="caption">{grant.statusLabel}</AppText>
                </ReferenceCard>
              </Pressable>
            ))}
          </View>

          <Button
            className="mt-[9px] h-[48px]"
            disabled={!canMutate}
            endIcon={{ ios: 'person.badge.plus', android: 'person_add', web: 'person_add' }}
            label="إضافة شخص أو تفويض"
            onPress={() => setAddMenuOpen(true)}
          />
        </ReadStateBoundary>
      </ScrollView>

      <ConfirmationDialog
        visible={grantToRevokeId !== null}
        title="تأكيد إلغاء التفويض"
        description="سيُرسل طلب سحب هذا التفويض للمراجعة. تبقى حالة التفويض قيد المعالجة حتى يتم اعتماد النتيجة، ولن تُحذف السجلات السابقة."
        confirmLabel="تأكيد إلغاء التفويض"
        destructive
        onCancel={() => setGrantToRevokeId(null)}
        onConfirm={() => {
          if (canConfirmRevoke && revokeTarget) submitGrantRevocation(revokeTarget.id);
          setGrantToRevokeId(null);
        }}
      />
      <Modal animationType="fade" transparent visible={addMenuOpen} onRequestClose={() => setAddMenuOpen(false)}>
        <Pressable className="flex-1 justify-end bg-black/40" onPress={() => setAddMenuOpen(false)}>
          <Pressable
            className="rounded-t-[20px] bg-surface-default px-4 pb-6 pt-4"
            onPress={(event) => event.stopPropagation()}
          >
            <View className="mx-auto w-full max-w-[430px] gap-2">
              <AppText align="right" className="font-ui-bold" variant="label">
                إضافة شخص أو تفويض
              </AppText>
              <Button
                label="إضافة فرد من الأسرة"
                onPress={() => { setAddMenuOpen(false); router.push('/profile/dependents/new'); }}
                variant="outline"
              />
              <Button
                label="إنشاء تفويض"
                onPress={() => { setAddMenuOpen(false); router.push('/profile/grants/new'); }}
              />
              <Button label="إلغاء" onPress={() => setAddMenuOpen(false)} variant="outline" />
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </Screen>
  );
}
