import { useRouter } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { AssessmentScaffold } from '@/features/assessment/components/assessment-scaffold';
import { useAssessmentSession } from '@/features/assessment/state/assessment-session-provider';
import { useAuthSession } from '@/features/auth/state/auth-session-store';
import { useAppDirection } from '@/shared/utils/app-direction';
import { AppIcon, AppText, Button, ConfirmationDialog } from '@/shared/components/ui';
import { cn } from '@/shared/utils/cn';

export function AssessmentManualReviewScreen() {
  const router = useRouter();
  const { rowClassName } = useAppDirection();
  const { patient, manualReviewDrafted, setManualReviewDrafted } = useAssessmentSession();
  const { isAuthenticated } = useAuthSession();
  const [confirming, setConfirming] = useState(false);
  const bookDentalCheckup = () =>
    router.push({
      pathname: '/discover/providers/results',
      params: {
        serviceCode: 'dental-checkup',
        ...(isAuthenticated ? { patientId: patient === 'adam' ? 'patient-002' : 'patient-001' } : {}),
      },
    });

  return (
    <AssessmentScaffold
      backIcon={{ ios: 'arrow.right', android: 'arrow_forward', web: 'arrow_forward' }}
      phase="مراجعة يدوية"
      title="تحتاج حالتك إلى تقييم أسرع"
      topContent={
        <View className="pt-1">
          <View
            className={cn(
              'min-h-[35px] items-center gap-2 rounded-[10px] bg-surface-subtle px-3 py-2',
              rowClassName,
            )}
          >
            <AppIcon
              name={{ ios: 'flask', android: 'science', web: 'science' }}
              size={15}
              tone="secondary"
            />
            <AppText
              align="right"
              className="min-w-0 flex-1 text-content-secondary"
              variant="caption"
            >
              توجيه أولي للمساعدة في اختيار الخدمة، وليس تشخيصاً طبياً نهائياً
            </AppText>
          </View>
        </View>
      }
    >
      <View className="mt-2 min-h-[190px] items-center justify-center rounded-[21px] bg-tone-warning-fill px-3 pb-3 pt-2">
        <View
          className={cn(
            'h-[112px] w-[160px] items-center justify-center gap-3 rounded-[30px] bg-surface-default',
            rowClassName,
          )}
        >
          <View className="h-[55px] w-[55px] items-center justify-center rounded-[17px] bg-action-subtle">
            <AppIcon
              name={{ ios: 'slider.horizontal.3', android: 'tune', web: 'tune' }}
              size={30}
              tone="action"
            />
          </View>
          <View className="h-[64px] w-[55px] items-center justify-center">
            <AppIcon
              name={{
                ios: 'person.crop.circle.badge.checkmark',
                android: 'how_to_reg',
                web: 'how_to_reg',
              }}
              size={43}
              tone="action"
            />
          </View>
        </View>
        <AppText
          align="center"
          className="mt-3 font-ui-bold text-content-primary"
          variant="heading-4"
        >
          مراجعة بشرية بخطوة واضحة
        </AppText>
        <AppText align="center" className="mt-1 text-content-secondary" variant="caption">
          تنبيه هادئ لا يعني تشخيصاً نهائياً
        </AppText>
      </View>

      <View className="mt-2 rounded-[15px] border border-border-subtle bg-surface-default px-3 py-3">
        <AppText align="right" className="font-ui-bold text-content-primary" variant="label">
          ليش توقّف المسار العادي؟
        </AppText>
        <AppText align="right" className="mt-1 text-content-secondary" variant="caption">
          ظهرت معلومة تحتاج مراجعة بشرية وفق السياسة المعتمدة، قبل إظهار الأطباء. هذا لا يعني
          تشخيصاً نهائياً.
        </AppText>
      </View>

      <View
        className={cn(
          'mt-2 min-h-[84px] items-center gap-3 rounded-[15px] bg-tone-warning-fill px-3 py-2',
          rowClassName,
        )}
      >
        <View className="h-[44px] w-[44px] items-center justify-center rounded-[13px] bg-surface-default">
          <AppIcon
            name={{
              ios: 'person.crop.circle.badge.checkmark',
              android: 'how_to_reg',
              web: 'how_to_reg',
            }}
            size={23}
            tone="action"
          />
        </View>
        <View className="min-w-0 flex-1 items-end">
          <AppText align="right" className="text-tone-warning-text" variant="caption">
            الإجراء المعتمد الآن
          </AppText>
          <AppText
            align="right"
            className="mt-0.5 font-ui-bold text-content-primary"
            variant="label"
          >
            طلب مراجعة سريرية يدوية
          </AppText>
          <AppText align="right" className="mt-0.5 text-content-secondary" variant="caption">
            قبل اختيار الطبيب أو عرض المقارنة
          </AppText>
        </View>
      </View>

      <Button
        className="mt-2 h-[50px] rounded-[12px]"
        disabled={manualReviewDrafted}
        endIcon={{ ios: 'arrow.left', android: 'arrow_back', web: 'arrow_back' }}
        label={manualReviewDrafted ? 'المراجعة محفوظة كمسودة' : 'طلب مراجعة'}
        onPress={() => setConfirming(true)}
      />

      {manualReviewDrafted ? (
        <View className="mt-2 rounded-[10px] bg-tone-info-fill px-3 py-2">
          <AppText align="right" className="text-tone-info-text" variant="caption">
            تم حفظ طلبك في هذه الجلسة فقط، ولم يُرسل إلى طبيب. يمكنك اختيار فحص عام كبديل.
          </AppText>
        </View>
      ) : null}

      <Button
        className="mt-2 h-[46px] rounded-[11px]"
        endIcon={{ ios: 'calendar.badge.plus', android: 'event_available', web: 'event_available' }}
        label="حجز فحص أسنان"
        onPress={bookDentalCheckup}
        size="sm"
        variant="outline"
      />

      <View className={cn('mt-2 items-center gap-1.5 px-2', rowClassName)}>
        <AppIcon
          name={{ ios: 'shield', android: 'shield', web: 'shield' }}
          size={14}
          tone="secondary"
        />
        <AppText align="right" className="min-w-0 flex-1 text-content-secondary" variant="caption">
          لا ترتيب أطباء ولا تشخيص نهائي في هذه الحالة
        </AppText>
      </View>

      <ConfirmationDialog
        visible={confirming && !manualReviewDrafted}
        title="تجهيز طلب مراجعة سريرية"
        description="سيُحفظ الطلب داخل هذه الجلسة فقط دون إرساله إلى طبيب أو عيادة. يمكنك حجز فحص أسنان دون انتظار."
        confirmLabel="حفظ المسودة"
        onCancel={() => setConfirming(false)}
        onConfirm={() => {
          if (manualReviewDrafted) return;
          setManualReviewDrafted(true);
          setConfirming(false);
        }}
      />
    </AssessmentScaffold>
  );
}
