import { View } from 'react-native';
import { ProfileScreenShell } from '@/features/profile/components/profile-screen-shell';
import { useProfilePrivacy } from '@/features/profile/state/profile-privacy-store';
import {
  AppIcon,
  AppText,
  Button,
  ConfirmationDialog,
  ReadStateBoundary,
} from '@/shared/components/ui';
import { useMockScenario } from '@/shared/mock';

export function AccountClosureRequestScreen() {
  const getSurfaceState = useMockScenario((state) => state.getSurfaceState);
  useMockScenario((state) => state.scenarioId);
  const { accountClosureStatus, setAccountClosureStatus } = useProfilePrivacy();
  const pending = ['requested', 'review', 'scheduled', 'closed'].includes(accountClosureStatus);
  const busy = accountClosureStatus === 'submitting';

  const confirm = () => {
    if (accountClosureStatus !== 'confirm' || busy) return;
    setAccountClosureStatus('submitting');
    // This records a review request in mock state; it never deletes the real account.
    setTimeout(() => setAccountClosureStatus('requested'), 600);
  };

  return (
    <ProfileScreenShell eyebrow="إغلاق الحساب" title="إغلاق الحساب">
      <ReadStateBoundary
        state={getSurfaceState('profile')}
        emptyTitle="طلب الإغلاق غير متاح"
        permissionTitle="لا توجد صلاحية لإغلاق الحساب"
      >
        <View className="gap-3 rounded-[16px] border border-tone-danger-border bg-tone-danger-fill p-4">
          <View className="flex-row-reverse items-center gap-2">
            <AppIcon
              name={{ ios: 'exclamationmark.triangle', android: 'warning', web: 'warning' }}
              size={23}
              tone="danger"
            />
            <AppText variant="heading-4" className="font-ui-bold text-tone-danger-text">
              قبل طلب الإغلاق
            </AppText>
          </View>
          <AppText variant="label" align="right" className="text-content-primary">
            إغلاق الحساب قد يوقف إمكانية الدخول بعد اعتماد الطلب. بعض السجلات المرتبطة بالعلاج أو
            المطالبات قد تبقى محفوظة للفترة المطلوبة قانونياً.
          </AppText>
        </View>
        <View className="mt-4 gap-3 rounded-[15px] border border-border-subtle bg-surface-default p-4">
          <AppText align="right" variant="heading-4">
            شو بيصير بعد الطلب؟
          </AppText>
          {[
            'بيُحفظ طلب إغلاق الحساب للمتابعة.',
            'قد يُطلب منك التحقق من الهوية قبل الإغلاق الفعلي.',
            'بإمكانك متابعة حالة الطلب من هون.',
          ].map((item) => (
            <View key={item} className="flex-row-reverse items-start gap-2">
              <AppIcon
                name={{
                  ios: 'checkmark.circle',
                  android: 'check_circle_outline',
                  web: 'check_circle_outline',
                }}
                size={19}
                tone="action"
              />
              <AppText variant="label" align="right" className="min-w-0 flex-1">
                {item}
              </AppText>
            </View>
          ))}
        </View>
        {pending ? (
          <View className="mt-4 items-center gap-2 rounded-[14px] bg-action-subtle px-4 py-5">
            <AppIcon
              name={{ ios: 'clock', android: 'schedule', web: 'schedule' }}
              size={25}
              tone="action"
            />
            <AppText variant="body-strong" align="center">
              {accountClosureStatus === 'requested'
                ? 'تم حفظ طلب الإغلاق'
                : accountClosureStatus === 'review'
                  ? 'تتم مراجعة الطلب'
                  : accountClosureStatus === 'scheduled'
                    ? 'الإغلاق مجدول'
                    : 'الحساب مغلق'}
            </AppText>
            <AppText variant="caption" align="center" className="text-content-secondary">
              تم حفظ طلبك في التطبيق، لكن الحساب لم يُغلق بعد.
            </AppText>
          </View>
        ) : (
          <View className="mt-5 items-center gap-2">
            <Button
              className="min-h-[50px] w-full max-w-[320px]"
              label={busy ? 'جاري تسجيل طلبك...' : 'متابعة للتحقق والتأكيد'}
              variant="destructive"
              loading={busy}
              disabled={busy}
              onPress={() => setAccountClosureStatus('confirm')}
            />
            <AppText variant="caption" align="center" className="text-content-secondary">
              تأكيدك بيسجل طلباً داخل التطبيق، وما بيحذف الحساب فوراً.
            </AppText>
          </View>
        )}
      </ReadStateBoundary>
      <ConfirmationDialog
        visible={accountClosureStatus === 'confirm'}
        title="تأكيد طلب إغلاق الحساب"
        description="هل تريد حفظ طلب إغلاق الحساب؟ ما رح ينحذف الحساب بمجرد هذا الإجراء، وقد يلزم تحقق مستقل من الهوية."
        confirmLabel="تأكيد طلب الإغلاق"
        cancelLabel="إلغاء"
        destructive
        onConfirm={confirm}
        onCancel={() => setAccountClosureStatus('idle')}
      />
    </ProfileScreenShell>
  );
}
