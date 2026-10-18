import { View } from 'react-native';

import {
  ProfileReferenceCard,
  ProfileReferenceNotice,
  ProfileReferenceSectionTitle,
} from '@/features/profile/components/profile-reference-ui';
import { ProfileScreenShell } from '@/features/profile/components/profile-screen-shell';
import { useProfilePrivacy } from '@/features/profile/state/profile-privacy-provider';
import { AppText, Button, ConfirmationDialog, ReadStateBoundary, StatusIndicator } from '@/shared/components/ui';
import { useMockScenario } from '@/shared/mock';

const lifecycle = ['طلب الإغلاق', 'قيد المراجعة', 'مجدول', 'مغلق'] as const;

export function AccountClosureRequestScreen() {
  const { getSurfaceState } = useMockScenario();
  const { accountClosureStatus, setAccountClosureStatus } = useProfilePrivacy();

  const submitClosure = () => {
    if (accountClosureStatus !== 'confirm') return;
    setAccountClosureStatus('submitting');
    setTimeout(() => setAccountClosureStatus('requested'), 650);
  };

  const isWaiting = ['requested', 'review', 'scheduled', 'closed'].includes(accountClosureStatus);

  return (
    <ProfileScreenShell eyebrow="إغلاق الحساب" title="إغلاق الحساب" layout="reference">
      <ReadStateBoundary
        emptyTitle="طلب الإغلاق غير متاح"
        permissionDescription="لا يمكنك إنشاء طلب إغلاق بهذه الصلاحية."
        permissionTitle="لا توجد صلاحية لإغلاق الحساب"
        state={getSurfaceState('profile')}
      >
        <View className="rounded-[12px] border border-tone-danger-border bg-tone-danger-fill p-[11px]">
          <AppText align="right" className="font-ui-bold text-tone-danger-text" variant="label">
            طلب إغلاق الحساب
          </AppText>
          <AppText align="right" className="mt-1 text-content-primary" style={{ fontSize: 10.5, lineHeight: 18 }} variant="caption">
            قد يلزم الاحتفاظ ببعض السجلات المرتبطة بالعلاج أو النزاعات أو الالتزامات النظامية، وفق السياسة المعمول بها. إغلاق الحساب لا يعني حذف كل سجل فوراً.
          </AppText>
        </View>

        <ProfileReferenceSectionTitle>قبل المتابعة</ProfileReferenceSectionTitle>
        <ProfileReferenceCard className="gap-[5px]">
          {[
            'يتوقف تسجيل الدخول بعد إغلاق الحساب.',
            'تبقى السجلات الخاضعة للاحتفاظ غير متاحة للاستخدام العادي.',
            'يمكنك متابعة الطلب حتى صدور القرار.',
          ].map((text) => (
            <AppText align="right" className="text-content-primary" style={{ fontSize: 10.5, lineHeight: 19 }} variant="caption" key={text}>
              • {text}
            </AppText>
          ))}
        </ProfileReferenceCard>

        <ProfileReferenceSectionTitle>دورة الطلب</ProfileReferenceSectionTitle>
        <ProfileReferenceCard className="py-[10px]">
          <View className="flex-row-reverse items-center justify-between gap-[3px]">
            {lifecycle.map((label, index) => {
              const selected = accountClosureStatus === 'requested' && index === 0
                || accountClosureStatus === 'review' && index === 1
                || accountClosureStatus === 'scheduled' && index === 2
                || accountClosureStatus === 'closed' && index === 3;
              return (
                <View className="min-h-[48px] flex-1 items-center justify-center gap-1" key={label}>
                  <AppText
                    align="center"
                    className={selected ? 'font-ui-bold text-content-link' : 'text-content-secondary'}
                    style={{ fontSize: 9, lineHeight: 15 }}
                    variant="caption"
                  >
                    {selected ? '●' : '○'}
                  </AppText>
                  <AppText align="center" className={selected ? 'font-ui-semibold text-content-link' : 'text-content-secondary'} numberOfLines={2} style={{ fontSize: 9.5, lineHeight: 16 }} variant="caption">
                    {label}
                  </AppText>
                </View>
              );
            })}
          </View>
        </ProfileReferenceCard>

        {!isWaiting ? (
          <View className="mt-[9px] gap-[8px]">
            <ProfileReferenceNotice
              title="يلزم إعادة التحقق من الهوية ثم تأكيد الطلب"
              description="سيبقى الطلب غير منفّذ حتى اكتمال التحقق والمراجعة المطلوبة."
              tone="warning"
            />
            {accountClosureStatus === 'idle' ? (
              <Button label="متابعة للتحقق والتأكيد" onPress={() => setAccountClosureStatus('reverify')} variant="destructive" />
            ) : null}
            {accountClosureStatus === 'reverify' ? (
              <View className="gap-2">
                <AppText align="right" className="text-content-secondary" variant="caption">
                  واجهة التحقق هنا تجريبية. لا تُعد الهوية مؤكدة من دون استجابة تحقق مستقلة.
                </AppText>
                <Button label="متابعة لمراجعة الطلب التجريبي" onPress={() => setAccountClosureStatus('confirm')} variant="destructive" />
              </View>
            ) : null}
            <ConfirmationDialog
              visible={accountClosureStatus === 'confirm'}
              title="تأكيد إنشاء طلب الإغلاق"
              description="إنشاء الطلب التجريبي لا يغلق الحساب فعلياً ولا يمحو السجلات. يتطلب التنفيذ الحقيقي إعادة تحقق مستقلة ومراجعة."
              confirmLabel="تأكيد إنشاء الطلب"
              destructive
              onConfirm={submitClosure}
              onCancel={() => setAccountClosureStatus('reverify')}
            />
            {accountClosureStatus === 'submitting' ? (
              <Button label="جاري إنشاء الطلب" loading onPress={() => {}} variant="destructive" />
            ) : null}
            {accountClosureStatus === 'failure' ? (
              <View className="gap-2">
                <StatusIndicator label="تعذر إنشاء الطلب" tone="danger" />
                <Button label="إعادة المحاولة" onPress={() => setAccountClosureStatus('confirm')} variant="outline" />
              </View>
            ) : null}
            <Button label="العودة دون إنشاء طلب" onPress={() => setAccountClosureStatus('idle')} variant="outline" />
          </View>
        ) : (
          <View className="mt-[9px]">
            <ProfileReferenceNotice
              title={accountClosureStatus === 'requested' ? 'تم تسجيل الطلب للمراجعة' : accountClosureStatus === 'review' ? 'الطلب قيد المراجعة' : accountClosureStatus === 'scheduled' ? 'الإغلاق مجدول' : 'الحساب مغلق'}
              description="يمكن متابعة حالة الطلب. السجلات الخاضعة للاحتفاظ لا تُحذف تلقائياً."
              tone="info"
            />
          </View>
        )}
      </ReadStateBoundary>
    </ProfileScreenShell>
  );
}
