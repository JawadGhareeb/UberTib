import { useState } from 'react';
import { Share, View } from 'react-native';

import { ProfileScreenShell } from '@/features/profile/components/profile-screen-shell';
import { useAccountDetails } from '@/features/profile/state/account-details-store';
import { useProfilePrivacy } from '@/features/profile/state/profile-privacy-store';
import { useSupportTickets } from '@/features/profile/state/support-tickets-store';
import { AppIcon, AppText, Button, ReadStateBoundary } from '@/shared/components/ui';
import { useMockScenario } from '@/shared/mock';

export function DataExportRequestScreen() {
  const getSurfaceState = useMockScenario((state) => state.getSurfaceState);
  useMockScenario((state) => state.scenarioId);
  const { name, phone, city } = useAccountDetails();
  const { tickets } = useSupportTickets();
  const { consents, dataExportStatus, requestDataExport } = useProfilePrivacy();
  const [sharing, setSharing] = useState(false);
  const [shareError, setShareError] = useState('');
  const ready = dataExportStatus === 'ready';

  const shareSnapshot = async () => {
    if (sharing || !ready) return;
    setSharing(true);
    setShareError('');
    try {
      const data = {
        exportedAt: new Date().toISOString(),
        scope: 'بيانات الحساب المتاحة داخل التطبيق',
        account: { name, phone, city },
        consents: consents.map(({ id, title, status, version, history }) => ({
          id,
          title,
          status,
          version,
          history,
        })),
        supportRequests: tickets.map(({ id, subject, topic, description, createdAt, status }) => ({
          id,
          subject,
          topic,
          description,
          createdAt,
          status,
        })),
      };
      await Share.share({
        title: 'بياناتي في UberTib',
        message: JSON.stringify(data, null, 2),
      });
    } catch {
      setShareError('تعذّر فتح خيارات مشاركة البيانات. حاول مرة ثانية.');
    } finally {
      setSharing(false);
    }
  };

  return (
    <ProfileScreenShell eyebrow="بياناتي" title="بياناتي">
      <ReadStateBoundary
        state={getSurfaceState('profile')}
        emptyTitle="لا توجد بيانات قابلة للعرض"
        permissionTitle="ما عندك صلاحية لعرض بيانات الحساب"
      >
        <View className="items-center gap-3 rounded-[17px] border border-border-subtle bg-surface-default px-5 py-6">
          <View className="h-16 w-16 items-center justify-center rounded-full bg-action-subtle">
            <AppIcon
              name={{ ios: 'square.and.arrow.up', android: 'ios_share', web: 'share' }}
              size={30}
              tone="action"
            />
          </View>
          <AppText variant="heading-4" align="center" className="font-ui-bold">
            نسخة من بياناتي
          </AppText>
          <AppText variant="label" align="center" className="text-content-secondary">
            جهّز نسخة من بيانات الحساب والموافقات وطلبات الدعم المحفوظة داخل التطبيق.
          </AppText>
        </View>

        <View className="mt-4 gap-2 rounded-[15px] border border-border-subtle bg-surface-default p-4">
          <AppText align="right" variant="heading-4">
            حالة النسخة
          </AppText>
          <AppText align="right" variant="body-strong">
            {ready ? 'البيانات جاهزة للمشاركة' : 'ما جهّزت نسخة بعد'}
          </AppText>
          <AppText align="right" variant="label" className="text-content-secondary">
            {ready
              ? 'يمكنك حفظ البيانات أو إرسالها للتطبيق الذي تختاره باستخدام خيارات المشاركة.'
              : 'اضغط تجهيز البيانات لتحضير نسخة من المعلومات المتاحة داخل التطبيق.'}
          </AppText>
        </View>

        <View className="mt-4 gap-3">
          {ready ? (
            <>
              <Button
                className="min-h-[50px]"
                label={sharing ? 'جاري فتح خيارات المشاركة...' : 'مشاركة نسخة بياناتي'}
                loading={sharing}
                disabled={sharing}
                onPress={() => void shareSnapshot()}
              />
              <Button variant="outline" label="تجهيز نسخة محدثة" onPress={requestDataExport} />
            </>
          ) : (
            <Button
              className="min-h-[50px]"
              label="تجهيز نسخة من بياناتي"
              onPress={requestDataExport}
            />
          )}
          {shareError ? (
            <AppText align="right" variant="caption" className="text-tone-danger-text">
              {shareError}
            </AppText>
          ) : null}
          <AppText variant="caption" align="right" className="text-content-secondary">
            تشمل المشاركة البيانات المتاحة داخل التطبيق فقط، وليست بديلاً عن طلب نسخة كاملة من
            السجلات التي يحتفظ بها مزود الخدمة.
          </AppText>
        </View>
      </ReadStateBoundary>
    </ProfileScreenShell>
  );
}
