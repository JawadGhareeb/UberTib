import { useRouter } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { ProfileScreenShell } from '@/features/profile/components/profile-screen-shell';
import { getMockGrantForScenario } from '@/features/profile/mocks/representation.mock';
import { useAppDirection } from '@/providers/app-direction-provider';
import {
  AppIcon,
  AppText,
  Button,
  ReadStateBoundary,
  ConfirmationDialog,
  StateView,
  StatusIndicator,
} from '@/shared/components/ui';
import { useMockScenario } from '@/shared/mock';
import { cn } from '@/shared/utils/cn';

export function GrantDetailScreen({ grantId }: { grantId: string }) {
  const router = useRouter();
  const { rowClassName } = useAppDirection();
  const { getGrantMutation, getSurfaceState, scenario, submitGrantRevocation } = useMockScenario();
  const [confirming, setConfirming] = useState(false);
  const grant = getMockGrantForScenario(grantId, scenario);
  const readState = getSurfaceState('representation');
  const revocationPending = getGrantMutation(grantId)?.revocation?.status === 'pending';

  if (!grant) {
    return (
      <ProfileScreenShell eyebrow="تفاصيل التفويض" title="تفاصيل التفويض">
        <View className="min-h-[420px]">
          <StateView
            actionLabel="العودة للعائلة والتفويضات"
            onAction={() => router.replace('/profile/family')}
            title="التفويض غير موجود"
          />
        </View>
      </ProfileScreenShell>
    );
  }

  const active = grant.statusLabel === 'فعال';
  const actorIsGrantor = grant.directionLabel === 'منحتها تفويضاً';
  const canRevoke = readState === 'success' && actorIsGrantor && active && !revocationPending;

  const facts = [
    ['صاحب البيانات', grant.subjectName],
    ['الشخص المفوّض', grant.granteeName],
    ['الغرض', grant.purpose],
    ['نطاق البيانات', grant.dataScope],
    ['الفترة الفعالة', grant.effectiveLabel],
    ['الأساس', grant.basisLabel],
  ] as const;

  return (
    <ProfileScreenShell
      description="راجع من يستطيع التصرف، وعلى من، وضمن أي نطاق ومدة."
      eyebrow="تفاصيل التفويض"
      title={grant.directionLabel}
    >
      <ReadStateBoundary
        emptyTitle="التفويض غير متاح"
        permissionDescription="صلاحيتك الحالية لا تسمح بعرض هذا التفويض."
        permissionTitle="لا توجد صلاحية لعرض التفويض"
        state={readState}
        staleAtLabel="آخر تحديث محفوظ"
      >
        <View className="mt-5 rounded-surface border border-border-default bg-surface-default p-4">
          <View className={cn('items-center gap-3', rowClassName)}>
            <View
              className={cn(
                'h-11 w-11 items-center justify-center rounded-surface',
                active ? 'bg-tone-success-fill' : 'bg-surface-subtle',
              )}
            >
              <AppIcon
                name={
                  active
                    ? { ios: 'checkmark.seal.fill', android: 'verified', web: 'verified' }
                    : { ios: 'clock.arrow.circlepath', android: 'history', web: 'history' }
                }
                size={20}
                tone={active ? 'success' : 'secondary'}
              />
            </View>
            <View className="min-w-0 flex-1">
              <AppText variant="body-strong">
                {grant.subjectName} ← {grant.granteeName}
              </AppText>
              <View className="mt-2">
                <StatusIndicator
                  label={revocationPending ? 'سحب التفويض قيد المعالجة' : grant.statusLabel}
                  tone={revocationPending ? 'warning' : active ? 'success' : 'neutral'}
                />
              </View>
            </View>
          </View>
        </View>

        <View className="mt-4 overflow-hidden rounded-surface border border-border-subtle bg-surface-default">
          {facts.map(([label, value], index) => (
            <View
              className={cn(
                'min-h-[62px] items-center justify-between gap-4 px-4 py-3',
                rowClassName,
                index > 0 && 'border-t border-border-subtle',
              )}
              key={label}
            >
              <AppText className="text-content-secondary" variant="caption">
                {label}
              </AppText>
              <AppText className="min-w-0 flex-1" variant="label">
                {value}
              </AppText>
            </View>
          ))}
        </View>

        <View className="mt-4 rounded-surface border border-border-subtle bg-surface-default p-4">
          <AppText variant="body-strong">الصلاحيات داخل هذا التفويض</AppText>
          <View className="mt-3 gap-2">
            {grant.actions.map((action) => (
              <View className={cn('items-center gap-2', rowClassName)} key={action}>
                <AppIcon
                  name={{
                    ios: 'checkmark.circle.fill',
                    android: 'check_circle',
                    web: 'check_circle',
                  }}
                  size={17}
                  tone="success"
                />
                <AppText className="min-w-0 flex-1" variant="label">
                  {action}
                </AppText>
              </View>
            ))}
          </View>
        </View>

        {revocationPending ? (
          <View className="mt-4 rounded-surface border border-tone-warning-border bg-tone-warning-fill p-4">
            <StatusIndicator label="طلب السحب قيد المعالجة" tone="warning" />
            <AppText className="mt-2 text-tone-warning-text" variant="caption">
              لم نعتبر التفويض ملغى نهائياً قبل وصول الحالة المعتمدة. عند التأكيد سيبقى السجل
              التاريخي محفوظاً.
            </AppText>
          </View>
        ) : null}

        {actorIsGrantor && active ? (
          <Button
            className="mt-5"
            disabled={!canRevoke}
            label="سحب هذا التفويض"
            onPress={() => setConfirming(true)}
            variant="destructive"
          />
        ) : (
          <View className="mt-4 rounded-surface border border-tone-info-border bg-tone-info-fill p-4">
            <AppText className="text-tone-info-text" variant="caption">
              {actorIsGrantor
                ? 'هذا التفويض منتهٍ أو غير فعال، لذلك لا يحتاج إلى سحب جديد.'
                : 'أنت تستخدم هذا التفويض كطرف مُفوَّض له. سحبه متاح لصاحب البيانات أو للمسار القانوني المخوّل فقط.'}
            </AppText>
          </View>
        )}

        <ConfirmationDialog
          visible={confirming}
          title="تأكيد سحب التفويض"
          description="تتوقف الصلاحيات المستقبلية فقط بعد اعتماد النتيجة، وتبقى السجلات التاريخية. العملية هنا محاكاة قيد المعالجة."
          confirmLabel="تأكيد سحب التفويض"
          destructive
          onConfirm={() => {
            if (!canRevoke) return;
            submitGrantRevocation(grant.id);
            setConfirming(false);
          }}
          onCancel={() => setConfirming(false)}
        />

        <Button
          className="mt-3"
          label="العودة للعائلة والتفويضات"
          onPress={() => router.replace('/profile/family')}
          variant="secondary"
        />
      </ReadStateBoundary>
    </ProfileScreenShell>
  );
}
