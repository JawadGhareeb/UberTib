import { useState } from 'react';
import { View } from 'react-native';

import {
  ProfileReferenceCard,
  ProfileReferenceNotice,
  ProfileReferenceSectionTitle,
} from '@/features/profile/components/profile-reference-ui';
import { ProfileScreenShell } from '@/features/profile/components/profile-screen-shell';
import { useProfilePrivacy } from '@/features/profile/state/profile-privacy-provider';
import { AppIcon, AppText, Button, ReadStateBoundary, StatusIndicator } from '@/shared/components/ui';
import { useMockScenario } from '@/shared/mock';

const steps = [
  { id: 'not-requested', label: 'لم يتم الطلب', icon: { ios: 'circle', android: 'radio_button_unchecked', web: 'radio_button_unchecked' } },
  { id: 'preparing', label: 'قيد التجهيز', icon: { ios: 'circle.dotted', android: 'autorenew', web: 'autorenew' } },
  { id: 'ready', label: 'جاهز · تنزيل لمدة محدودة', icon: { ios: 'checkmark.circle', android: 'check_circle_outline', web: 'check_circle_outline' } },
  { id: 'expired', label: 'منتهي الصلاحية · طلب نسخة جديدة', icon: { ios: 'clock.arrow.circlepath', android: 'update', web: 'update' } },
] as const;

export function DataExportRequestScreen() {
  const { getSurfaceState } = useMockScenario();
  const { dataExportStatus, requestDataExport } = useProfilePrivacy();
  const [showDetails, setShowDetails] = useState(false);
  const statusLabel =
    dataExportStatus === 'not-requested' ? 'لم يتم الطلب'
      : dataExportStatus === 'preparing' ? 'قيد التجهيز'
        : dataExportStatus === 'ready' ? 'جاهز'
          : dataExportStatus === 'expired' ? 'انتهت صلاحية النسخة' : 'تعذر تجهيز النسخة';

  return (
    <ProfileScreenShell eyebrow="بياناتي" title="بياناتي" layout="reference">
      <ReadStateBoundary
        emptyTitle="لا توجد بيانات قابلة للطلب"
        permissionDescription="لا يمكنك طلب نسخة من البيانات بهذه الصلاحية."
        permissionTitle="طلب البيانات غير متاح"
        state={getSurfaceState('profile')}
      >
        <ProfileReferenceNotice
          title="نسخة من بياناتي"
          description="سنجهّز ملفاً قابلاً للتنزيل. الملفات الكبيرة لا تصبح جاهزة فوراً."
        />

        <ProfileReferenceSectionTitle>حالة الطلب</ProfileReferenceSectionTitle>
        <ProfileReferenceCard className="gap-[7px]">
          {steps.map((step, index) => {
            const active = dataExportStatus === step.id;
            return (
              <View className="min-h-[50px] flex-row items-center gap-2 rounded-[11px] border border-border-subtle bg-surface-default px-[10px] py-[7px]" key={step.id}>
                <View className="h-7 w-7 items-center justify-center">
                  <AppIcon
                    name={step.icon}
                    size={17}
                    tone={active ? 'action' : 'secondary'}
                  />
                </View>
                <View className="min-w-0 flex-1 items-end">
                  <AppText align="right" className="text-content-secondary" style={{ fontSize: 9.5, lineHeight: 15 }} variant="caption">
                    {index + 1}
                  </AppText>
                  <AppText align="right" className={active ? 'font-ui-bold' : 'font-ui-semibold'} numberOfLines={2} style={{ fontSize: 11, lineHeight: 18 }} variant="label">
                    {step.label}
                  </AppText>
                </View>
              </View>
            );
          })}
        </ProfileReferenceCard>

        <View className="mt-[9px] gap-[7px]">
          {dataExportStatus === 'not-requested' || dataExportStatus === 'expired' || dataExportStatus === 'failure' ? (
            <Button
              label={dataExportStatus === 'not-requested' ? 'طلب نسخة من بياناتي' : dataExportStatus === 'expired' ? 'طلب نسخة جديدة' : 'إعادة المحاولة'}
              onPress={requestDataExport}
            />
          ) : dataExportStatus === 'preparing' ? (
            <View className="gap-2">
              <StatusIndicator label="طلب النسخة قيد التجهيز" tone="info" emphasis="subtle" />
              <Button disabled label="جاري تجهيز نسخة البيانات" onPress={() => {}} />
            </View>
          ) : (
            <ProfileReferenceNotice
              title="النسخة جاهزة"
              description="رابط التنزيل غير متاح حالياً."
              tone="success"
            />
          )}
          <Button
            label={showDetails ? 'إخفاء حالة الطلب' : 'عرض حالة الطلب'}
            onPress={() => setShowDetails((value) => !value)}
            variant="outline"
          />
          {showDetails ? (
            <ProfileReferenceCard>
              <AppText align="right" className="font-ui-semibold" variant="label">
                {statusLabel}
              </AppText>
              <AppText align="right" className="mt-1 text-content-secondary" variant="caption">
                {dataExportStatus === 'preparing'
                  ? 'الطلب قيد التجهيز؛ لن يُنشأ طلب مكرر أثناء المعالجة.'
                  : dataExportStatus === 'ready'
                    ? 'اكتمل التجهيز، بانتظار رابط تنزيل متاح من مصدر البيانات.'
                    : dataExportStatus === 'failure'
                      ? 'تعذر تجهيز الملف. يمكنك إعادة المحاولة.'
                      : dataExportStatus === 'expired'
                        ? 'انتهت صلاحية النسخة السابقة؛ يمكنك طلب نسخة جديدة.'
                        : 'لم يتم إرسال طلب الحصول على نسخة من بياناتك بعد.'}
              </AppText>
            </ProfileReferenceCard>
          ) : null}
        </View>

      </ReadStateBoundary>
    </ProfileScreenShell>
  );
}
