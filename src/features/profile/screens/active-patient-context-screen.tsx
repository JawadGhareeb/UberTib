import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { View } from 'react-native';
import Animated, { FadeInDown, ReduceMotion } from 'react-native-reanimated';

import { ProfileSelectionCard } from '@/features/profile/components/profile-v5-ui';
import { ProfileScreenShell } from '@/features/profile/components/profile-screen-shell';
import {
  getMockGrantsForScenario,
  mockDependents,
} from '@/features/profile/mocks/representation.mock';
import { useAppDirection } from '@/providers/app-direction-provider';
import { AppIcon, AppText, Button, ReadStateBoundary } from '@/shared/components/ui';
import { useMockScenario } from '@/shared/mock';
import { mockPatientWorld } from '@/shared/mock/patient.mock';
import { theme } from '@/shared/theme';
import { cn } from '@/shared/utils/cn';

export function ActivePatientContextScreen() {
  const router = useRouter();
  const { rowClassName } = useAppDirection();
  const { getSurfaceState, scenario } = useMockScenario();
  const readState = getSurfaceState('representation');
  const [activeId, setActiveId] = useState('patient-001');

  const selectablePatients = useMemo(() => {
    const self = mockDependents.find((person) => person.active);
    const activeHeldGrants = getMockGrantsForScenario(scenario).filter(
      (grant) => grant.directionLabel === 'أدير نيابة عنها' && grant.statusLabel === 'فعال',
    );
    const represented = activeHeldGrants
      .map((grant) => {
        const person = mockDependents.find((item) => item.id === grant.subjectPatientId);
        return person ? { person, grant } : undefined;
      })
      .filter(
        (
          item,
        ): item is {
          person: (typeof mockDependents)[number];
          grant: (typeof activeHeldGrants)[number];
        } => Boolean(item),
      );

    return {
      self,
      represented,
    };
  }, [scenario]);

  const selectedPatient =
    selectablePatients.self?.id === activeId
      ? selectablePatients.self
      : selectablePatients.represented.find((item) => item.person.id === activeId)?.person;

  return (
    <ProfileScreenShell
      description="اختيار المريض يغيّر السياق المعروض فقط. هويتك كمستخدم تبقى نفسها، وكل صلاحية يعاد التحقق منها عند الإجراء."
      eyebrow="المريض النشط"
      title="من تتابع رعايته الآن؟"
    >
      <ReadStateBoundary
        emptyDescription="بعد التحقق من تفويض فعال رح يظهر الشخص هون."
        emptyTitle="ما في أشخاص إضافيين"
        permissionDescription="صلاحيتك الحالية ما عاد تسمح بتغيير سياق المريض."
        permissionTitle="ما عاد في صلاحية لتغيير المريض"
        state={readState}
        staleAtLabel="آخر تحديث محفوظ"
      >
        <Animated.View
          className="mt-5 rounded-surface border border-border-default bg-surface-default p-4"
          entering={FadeInDown.duration(theme.motion.duration.overlay).reduceMotion(
            ReduceMotion.System,
          )}
        >
          <View className={cn('items-center gap-3', rowClassName)}>
            <View className="h-11 w-11 shrink-0 items-center justify-center rounded-surface bg-action-subtle">
              <AppIcon
                name={{ ios: 'person.badge.key.fill', android: 'badge', web: 'badge' }}
                size={20}
                tone="action"
              />
            </View>
            <View className="min-w-0 flex-1">
              <AppText className="text-content-secondary" variant="caption">
                المستخدم الذي سجّل الدخول
              </AppText>
              <AppText className="mt-0.5" variant="body-strong">
                {mockPatientWorld.account.name}
              </AppText>
            </View>
          </View>
        </Animated.View>

        <View accessibilityRole="radiogroup" className="mt-5 gap-3">
          {selectablePatients.self ? (
            <ProfileSelectionCard
              description="حسابك الشخصي"
              initials={selectablePatients.self.initials}
              onPress={() => setActiveId(selectablePatients.self!.id)}
              selected={activeId === selectablePatients.self.id}
              status="أنت"
              title={selectablePatients.self.name}
            />
          ) : null}

          {selectablePatients.represented.map(({ person, grant }, index) => (
            <Animated.View
              entering={FadeInDown.delay(Math.min(index * 45, 135))
                .duration(theme.motion.duration.overlay)
                .reduceMotion(ReduceMotion.System)}
              key={person.id}
            >
              <ProfileSelectionCard
                description={`تفويض فعال · ${grant.dataScope}`}
                initials={person.initials}
                onPress={() => setActiveId(person.id)}
                selected={activeId === person.id}
                status={grant.effectiveLabel}
                title={person.name}
              />
            </Animated.View>
          ))}
        </View>

        {selectablePatients.represented.length === 0 ? (
          <View className="mt-4 rounded-surface border border-border-subtle bg-surface-subtle p-4">
            <AppText className="text-content-secondary" variant="caption">
              لا يوجد حالياً أي شخص آخر بتفويض فعال. الطلبات قيد التحقق أو التفويضات المنتهية لا
              تظهر كخيار للمريض النشط.
            </AppText>
          </View>
        ) : null}


        <Button
          className="mt-6"
          disabled={!selectedPatient}
          label={selectedPatient ? `استخدام حساب ${selectedPatient.name}` : 'اختر المريض'}
          onPress={() => router.back()}
        />
      </ReadStateBoundary>
    </ProfileScreenShell>
  );
}
