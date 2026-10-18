import { useState } from 'react';
import { Pressable, View } from 'react-native';

import {
  ProfileReferenceBadge,
  ProfileReferenceCard,
  ProfileReferenceFact,
  ProfileReferenceNotice,
  ProfileReferenceSectionTitle,
} from '@/features/profile/components/profile-reference-ui';
import { ProfileScreenShell } from '@/features/profile/components/profile-screen-shell';
import { useProfilePrivacy } from '@/features/profile/state/profile-privacy-provider';
import { AppText, Button, ConfirmationDialog, ReadStateBoundary, StatusIndicator } from '@/shared/components/ui';
import { useMockScenario } from '@/shared/mock';

type PendingAction =
  { type: 'session'; sessionId: string } | { type: 'all' } | { type: 'method' } | null;

export function AccountSecurityScreen() {
  const { getSurfaceState } = useMockScenario();
  const { securityMethod, setSecurityMethod, sessions, endSession, endOtherSessions } =
    useProfilePrivacy();
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const confirmAction = () => {
    if (!pendingAction || submitting) return;
    setSubmitting(true);
    setSuccessMessage('');
    setTimeout(() => {
      if (pendingAction.type === 'session') endSession(pendingAction.sessionId);
      if (pendingAction.type === 'all') endOtherSessions();
      if (pendingAction.type === 'method') setSecurityMethod('إعادة التحقق مطلوبة قبل التغيير');
      setSuccessMessage(
        pendingAction.type === 'session'
          ? 'تم تحديث قائمة الجلسات التجريبية.'
          : pendingAction.type === 'all'
            ? 'تم تحديث الجلسات الأخرى في العرض التجريبي.'
            : 'طلب تغيير طريقة الأمان ينتظر إعادة التحقق.',
      );
      setPendingAction(null);
      setSubmitting(false);
    }, 550);
  };

  return (
    <ProfileScreenShell eyebrow="الحساب والأمان" title="الحساب والأمان" layout="reference">
      <ReadStateBoundary
        emptyTitle="لا توجد بيانات أمان متاحة"
        permissionDescription="لا يمكن عرض إعدادات الأمان بهذه الصلاحية."
        permissionTitle="لا توجد صلاحية لإدارة الأمان"
        state={getSurfaceState('profile')}
      >
        <ProfileReferenceSectionTitle>الحساب والأمان</ProfileReferenceSectionTitle>
        <View className="gap-[7px]">
          <ProfileReferenceFact
            icon={{ ios: 'phone.circle', android: 'phone', web: 'phone' }}
            label="الهاتف الموثّق"
            value="+963 9••• 421 · موثّق"
          />
          <ProfileReferenceFact
            icon={{ ios: 'key', android: 'vpn_key', web: 'vpn_key' }}
            label="طريقة الأمان"
            value={securityMethod}
          />
        </View>

        <ProfileReferenceSectionTitle>الجلسات النشطة</ProfileReferenceSectionTitle>
        <View className="gap-[7px]">
          {sessions.map((session) => (
            <ProfileReferenceCard
              className={session.current ? 'border-action-primary/35 bg-action-subtle' : undefined}
              key={session.id}
            >
              <View className="flex-row items-center justify-between gap-2">
                {session.trusted ? <ProfileReferenceBadge label="موثوق" tone="success" /> : <View />}
                <AppText align="right" className="min-w-0 flex-1 font-ui-bold" numberOfLines={2} variant="label">
                  {session.label}
                </AppText>
              </View>
              <AppText align="right" className="mt-1 text-content-secondary" style={{ fontSize: 10.5, lineHeight: 17 }} variant="caption">
                {session.locationLabel} · {session.activityLabel}
              </AppText>
              {session.current ? (
                <AppText align="right" className="mt-1 text-content-secondary" style={{ fontSize: 9.5, lineHeight: 16 }} variant="caption">
                  لا يمكن إنهاء الجلسة الحالية من هنا.
                </AppText>
              ) : (
                <Pressable
                  accessibilityLabel="إنهاء هذه الجلسة"
                  accessibilityRole="button"
                  className="mt-2 min-h-[43px] items-center justify-center rounded-[10px] bg-tone-danger-fill px-3"
                  onPress={() => setPendingAction({ type: 'session', sessionId: session.id })}
                >
                  <AppText align="center" className="font-ui-semibold text-tone-danger-text" variant="label">
                    إنهاء هذه الجلسة
                  </AppText>
                </Pressable>
              )}
            </ProfileReferenceCard>
          ))}
        </View>

        <View className="mt-[9px] flex-row gap-[7px]">
          <Button
            className="h-11 min-w-0 flex-1"
            label="تغيير طريقة الأمان"
            onPress={() => setPendingAction({ type: 'method' })}
            size="sm"
            variant="outline"
          />
          <Button
            className="h-11 min-w-0 flex-1"
            disabled={sessions.every((session) => session.current)}
            label="إنهاء الجلسات الأخرى"
            onPress={() => setPendingAction({ type: 'all' })}
            size="sm"
            variant="destructive"
          />
        </View>

        {successMessage ? (
          <View className="mt-2">
            <StatusIndicator label={successMessage} tone="info" />
          </View>
        ) : null}

        <View className="mt-[9px]">
          <ProfileReferenceNotice
            title="إعادة التحقق مطلوبة"
            description="يلزم التحقق من الهوية قبل تغيير الأمان أو إنهاء كل الجلسات على الحساب الفعلي."
            tone="warning"
          />
        </View>
      </ReadStateBoundary>
      <ConfirmationDialog
        visible={pendingAction !== null}
        title={
          pendingAction?.type === 'session'
            ? 'إنهاء هذه الجلسة؟'
            : pendingAction?.type === 'all'
              ? 'إنهاء الجلسات الأخرى؟'
              : 'تغيير طريقة الأمان؟'
        }
        description="هذا إجراء تجريبي فقط. يحتاج التنفيذ الحقيقي إلى إعادة التحقق من الهوية، ولا تُعتبر العملية معتمدة من السيرفر."
        confirmLabel="متابعة المعاينة"
        cancelLabel="إلغاء"
        destructive={pendingAction?.type !== 'method'}
        loading={submitting}
        onCancel={() => { if (!submitting) setPendingAction(null); }}
        onConfirm={confirmAction}
      />
    </ProfileScreenShell>
  );
}
