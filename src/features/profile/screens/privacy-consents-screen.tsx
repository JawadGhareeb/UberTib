import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, View } from 'react-native';

import { ProfileScreenShell } from '@/features/profile/components/profile-screen-shell';
import {
  ProfileReferenceBadge,
  ProfileReferenceCard,
  ProfileReferenceNotice,
} from '@/features/profile/components/profile-reference-ui';
import { useProfilePrivacy } from '@/features/profile/state/profile-privacy-provider';
import { AppText, ReadStateBoundary, ConfirmationDialog } from '@/shared/components/ui';
import { useMockScenario } from '@/shared/mock';

export function PrivacyConsentsScreen() {
  const router = useRouter();
  const { getSurfaceState } = useMockScenario();
  const { consents, withdrawConsent } = useProfilePrivacy();
  const [pendingWithdrawal, setPendingWithdrawal] = useState<string>();
  const [submitting, setSubmitting] = useState(false);

  const confirmWithdrawal = () => {
    if (!pendingWithdrawal || submitting) return;
    setSubmitting(true);
    setTimeout(() => {
      withdrawConsent(pendingWithdrawal);
      setPendingWithdrawal(undefined);
      setSubmitting(false);
    }, 500);
  };

  return (
    <ProfileScreenShell
      description="الخصوصية والموافقات · كل غرض مستقل"
      eyebrow="الخصوصية والموافقات"
      title="الخصوصية والموافقات"
      layout="reference"
    >
      <ReadStateBoundary
        emptyTitle="لا توجد موافقات مسجلة"
        permissionDescription="لا يمكن عرض سجل الموافقات بهذه الصلاحية."
        permissionTitle="سجل الموافقات غير متاح"
        state={getSurfaceState('profile')}
      >
        <View className="mt-[8px] gap-[7px]">
          {consents.map((consent) => {
            const allowed = consent.withdrawalAllowed && consent.status === 'active';
            const status =
              consent.status === 'active'
                ? 'مفعّل'
                : consent.status === 'withdrawn'
                  ? 'مسحوب'
                  : 'غير مفعّل';

            return (
              <ProfileReferenceCard className="gap-[5px] p-[10px]" key={consent.id}>
                <View className="flex-row items-center justify-between gap-2">
                  <ProfileReferenceBadge
                    label={status}
                    tone={
                      consent.status === 'active'
                        ? 'success'
                        : consent.status === 'withdrawn'
                          ? 'warning'
                          : 'neutral'
                    }
                  />
                  <AppText
                    align="right"
                    className="min-w-0 flex-1 font-ui-bold"
                    numberOfLines={2}
                    style={{ fontSize: 12, lineHeight: 19 }}
                    variant="label"
                  >
                    {consent.title}
                  </AppText>
                </View>
                <AppText
                  align="right"
                  className="text-content-secondary"
                  numberOfLines={2}
                  style={{ fontSize: 9.5, lineHeight: 16 }}
                  variant="caption"
                >
                  الإصدار {consent.version} · وافق عليه في {consent.acceptedAtLabel} · آخر تحديث{' '}
                  {consent.lastUpdatedLabel}
                </AppText>
                <View className="flex-row items-center justify-between gap-2">
                  <Pressable
                    accessibilityRole="button"
                    className="min-h-[36px] justify-center"
                    hitSlop={4}
                    onPress={() =>
                      router.push({
                        pathname: '/profile/privacy/consents/[consentId]',
                        params: { consentId: consent.id },
                      })
                    }
                  >
                    <AppText
                      className="font-ui-semibold text-content-link"
                      style={{ fontSize: 10.5, lineHeight: 17 }}
                      variant="caption"
                    >
                      عرض التفاصيل
                    </AppText>
                  </Pressable>
                  <Pressable
                    accessibilityRole="button"
                    className="min-h-[36px] justify-center"
                    disabled={!allowed}
                    hitSlop={4}
                    onPress={() => setPendingWithdrawal(consent.id)}
                  >
                    <AppText
                      align="right"
                      className={
                        allowed
                          ? 'font-ui-semibold text-tone-danger-text'
                          : 'text-content-placeholder'
                      }
                      style={{ fontSize: 10.5, lineHeight: 17 }}
                      variant="caption"
                    >
                      {allowed ? 'سحب الموافقة' : 'الانسحاب غير متاح'}
                    </AppText>
                  </Pressable>
                </View>
              </ProfileReferenceCard>
            );
          })}
        </View>

        <ConfirmationDialog
          visible={Boolean(pendingWithdrawal)}
          title="تأكيد سحب الموافقة"
          description="قد تبقى السجلات اللازمة للرعاية أو الالتزامات النظامية؛ السحب لا يمحوها بأثر رجعي. يُحفظ اختيارك ضمن إعدادات التطبيق، ويحتاج تطبيقه على السجلات المتصلة إلى تأكيد من الخدمة."
          confirmLabel="تأكيد السحب"
          destructive
          loading={submitting}
          onConfirm={confirmWithdrawal}
          onCancel={() => {
            if (!submitting) setPendingWithdrawal(undefined);
          }}
        />

        <View className="mt-[8px]">
          <ProfileReferenceNotice
            description="قد تبقى السجلات المطلوبة للرعاية أو الالتزامات النظامية، ولا تُمحى بأثر رجعي عند سحب الموافقة."
            title="قبل السحب"
            tone="warning"
          />
        </View>
      </ReadStateBoundary>
    </ProfileScreenShell>
  );
}
