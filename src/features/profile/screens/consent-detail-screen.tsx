import { useRouter } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import {
  ProfileReferenceCard,
  ProfileReferenceFact,
  ProfileReferenceNotice,
  ProfileReferenceSectionTitle,
} from '@/features/profile/components/profile-reference-ui';
import { ProfileScreenShell } from '@/features/profile/components/profile-screen-shell';
import { useProfilePrivacy } from '@/features/profile/state/profile-privacy-store';
import { AppText, Button, ConfirmationDialog, StateView, StatusIndicator } from '@/shared/components/ui';

export function ConsentDetailScreen({ consentId }: { consentId: string }) {
  const router = useRouter();
  const { getConsent, withdrawConsent } = useProfilePrivacy();
  const [confirming, setConfirming] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showNewVersion, setShowNewVersion] = useState(false);
  const consent = getConsent(consentId);

  if (!consent) {
    return (
      <ProfileScreenShell eyebrow="تفاصيل الموافقة" title="تفاصيل الموافقة" layout="reference">
        <View className="min-h-[400px]">
          <StateView
            actionLabel="العودة للموافقات"
            onAction={() => router.replace('/profile/privacy')}
            title="الموافقة غير موجودة"
          />
        </View>
      </ProfileScreenShell>
    );
  }

  const performWithdrawal = () => {
    if (submitting || !consent.withdrawalAllowed || consent.status !== 'active') return;
    setSubmitting(true);
    setTimeout(() => {
      withdrawConsent(consent.id);
      setSubmitting(false);
      setConfirming(false);
    }, 500);
  };

  return (
    <ProfileScreenShell eyebrow="تفاصيل الموافقة" title="تفاصيل الموافقة" layout="reference">
      <ProfileReferenceNotice
        title={consent.title}
        description={`الغرض: ${consent.purpose}`}
      />

      <ProfileReferenceSectionTitle>النسخة المقبولة الحالية</ProfileReferenceSectionTitle>
      <View className="gap-[7px]">
        <ProfileReferenceFact
          icon={{ ios: 'checkmark.seal', android: 'fact_check', web: 'fact_check' }}
          label="الإصدار المقبول"
          value={consent.version}
        />
        <ProfileReferenceFact
          icon={{ ios: 'clock', android: 'schedule', web: 'schedule' }}
          label="وقت القبول"
          value={consent.acceptedAtLabel}
        />
        <ProfileReferenceCard className="flex-row items-center justify-between gap-2 px-[10px] py-[9px]">
          <StatusIndicator
            label={consent.status === 'active' ? 'مفعّل' : consent.status === 'withdrawn' ? 'مسحوب' : 'غير مفعّل'}
            tone={consent.status === 'active' ? 'success' : 'warning'}
            emphasis="subtle"
          />
          <View className="min-w-0 flex-1 items-end">
            <AppText className="text-content-secondary" variant="caption">الحالة الحالية</AppText>
          </View>
        </ProfileReferenceCard>
      </View>

      {consent.newVersion ? (
        <View className="mt-[8px] rounded-[12px] border border-tone-warning-border bg-tone-warning-fill p-[11px]">
          <AppText align="right" className="font-ui-bold text-tone-warning-text" variant="label">
            نسخة جديدة تتطلب إجراء
          </AppText>
          <AppText align="right" className="mt-1 font-ui-semibold" variant="label">
            الإصدار {consent.newVersion.version}
          </AppText>
          <AppText align="right" className="mt-1 text-tone-warning-text" style={{ fontSize: 10.5, lineHeight: 18 }} variant="caption">
            {consent.newVersion.summary}
          </AppText>
          {showNewVersion ? (
            <AppText align="right" className="mt-1 text-content-secondary" variant="caption">
              هذه النسخة للمعاينة فقط. تبقى النسخة {consent.version} هي المقبولة حتى تُسجّل موافقة جديدة صريحة.
            </AppText>
          ) : null}
          <Button
            className="mt-2 h-11"
            label={showNewVersion ? 'إغلاق المعاينة' : `مراجعة الإصدار ${consent.newVersion.version}`}
            onPress={() => setShowNewVersion((value) => !value)}
            size="sm"
            variant="outline"
          />
        </View>
      ) : null}

      <ProfileReferenceSectionTitle>سجل لا يُعاد تحريره</ProfileReferenceSectionTitle>
      <ProfileReferenceCard className="gap-[7px]">
        {consent.history.length ? (
          consent.history.map((entry) => (
            <View className="gap-0.5" key={entry.id}>
              <AppText align="right" className="font-ui-semibold" variant="label">
                الإصدار {entry.version} · {entry.action === 'accepted' ? 'قبول' : 'سحب'}
              </AppText>
              <AppText align="right" className="text-content-secondary" style={{ fontSize: 10, lineHeight: 16 }} variant="caption">
                {entry.atLabel}
              </AppText>
            </View>
          ))
        ) : (
          <AppText align="right" className="text-content-secondary" variant="caption">
            لا يوجد سجل قبول سابق لهذه الموافقة.
          </AppText>
        )}
      </ProfileReferenceCard>

      {consent.withdrawalAllowed && consent.status === 'active' ? (
        <Button
          className="mt-[9px]"
          label="سحب الموافقة"
          onPress={() => setConfirming(true)}
          variant="outline"
        />
      ) : null}
      <ConfirmationDialog
        visible={confirming}
        title="تأكيد سحب الموافقة"
        description="سيُحفظ السحب كحدث جديد بالسجل ولن تُعدّل النسخ التاريخية. هذه معاينة محلية وليست استجابة من السيرفر."
        confirmLabel="تأكيد السحب"
        destructive
        loading={submitting}
        onConfirm={performWithdrawal}
        onCancel={() => { if (!submitting) setConfirming(false); }}
      />

    </ProfileScreenShell>
  );
}
