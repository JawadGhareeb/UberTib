import { View } from 'react-native';

import { ProfileScreenShell } from '@/features/profile/components/profile-screen-shell';
import { useProfilePrivacy } from '@/features/profile/state/profile-privacy-provider';
import { AppIcon, AppText, Button, ReadStateBoundary } from '@/shared/components/ui';
import { useMockScenario } from '@/shared/mock';

const statusTexts = {
  'not-requested': ['ما طلبت نسخة بعد', 'اطلب نسخة من بياناتك لحتى تبدأ عملية تجهيزها.'],
  preparing: ['عم نجهّز نسختك', 'طلبك قيد التجهيز. ما في داعي تعيد الطلب.'],
  ready: ['النسخة جاهزة', 'رابط التنزيل مش متوفر بالنسخة التجريبية الحالية.'],
  expired: ['انتهت صلاحية النسخة', 'بتقدر تطلب نسخة جديدة.'],
  failure: ['تعذّر تجهيز النسخة', 'جرّب تطلبها مرة ثانية.'],
} as const;

export function DataExportRequestScreen() {
  const { getSurfaceState } = useMockScenario();
  const { dataExportStatus, requestDataExport } = useProfilePrivacy();
  const [title, summary] = statusTexts[dataExportStatus];
  const canRequest = ['not-requested', 'expired', 'failure'].includes(dataExportStatus);
  return (
    <ProfileScreenShell eyebrow="بياناتي" title="بياناتي">
      <ReadStateBoundary
        state={getSurfaceState('profile')}
        emptyTitle="لا توجد بيانات قابلة للطلب"
        permissionTitle="طلب البيانات غير متاح"
      >
        <View className="mt-4 items-center gap-3 rounded-[17px] border border-border-subtle bg-surface-default px-5 py-6">
          <View className="h-16 w-16 items-center justify-center rounded-full bg-action-subtle">
            <AppIcon
              name={{ ios: 'square.and.arrow.down', android: 'download', web: 'download' }}
              size={30}
              tone="action"
            />
          </View>
          <AppText variant="heading-4" align="center" className="font-ui-bold">
            نسخة من بياناتي
          </AppText>
          <AppText variant="label" align="center" className="text-content-secondary">
            اطلب نسخة خاصة من البيانات المتاحة بحسابك، وتابع تجهيزها هون.
          </AppText>
        </View>
        <View className="mt-4 gap-2 rounded-[15px] border border-border-subtle bg-surface-default p-4">
          <View className="flex-row-reverse items-center justify-between">
            <AppText align="right" variant="heading-4">
              حالة الطلب
            </AppText>
            <View className="rounded-full bg-action-subtle px-3 py-1.5">
              <AppText variant="caption" className="font-ui-semibold text-content-link">
                {dataExportStatus === 'preparing'
                  ? 'قيد التجهيز'
                  : dataExportStatus === 'ready'
                    ? 'جاهز'
                    : 'متابعة'}
              </AppText>
            </View>
          </View>
          <AppText align="right" variant="body-strong">
            {title}
          </AppText>
          <AppText align="right" variant="label" className="text-content-secondary">
            {summary}
          </AppText>
        </View>
        <View className="mt-4 gap-3">
          {canRequest ? (
            <Button
              className="min-h-[50px]"
              label={
                dataExportStatus === 'not-requested' ? 'طلب نسخة من بياناتي' : 'طلب نسخة جديدة'
              }
              onPress={requestDataExport}
            />
          ) : null}
          <View className="rounded-[13px] bg-surface-subtle p-3">
            <AppText variant="caption" align="right" className="text-content-secondary">
              الملف مش قابل للتنزيل فوراً. لما يصبح جاهزاً لازم يتوفر رابط تنزيل آمن ومدة صلاحية
              واضحة من الخادم؛ ما رح نعرض تنزيل وهمي.
            </AppText>
          </View>
        </View>
      </ReadStateBoundary>
    </ProfileScreenShell>
  );
}
