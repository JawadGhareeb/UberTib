import { useRouter } from 'expo-router';
import { Pressable, View } from 'react-native';

import { AssessmentScaffold } from '@/features/assessment/components/assessment-scaffold';
import { ASSESSMENT_PATIENT_FIXTURES } from '@/features/assessment/presentation/assessment-patient-copy';
import { useAssessmentSession } from '@/features/assessment/state/assessment-session-provider';
import { AppIcon, AppText } from '@/shared/components/ui';
import type { AppIconName } from '@/shared/components/ui/app-icon';

function SummaryRow({
  title,
  value,
  icon,
  onEdit,
}: {
  title: string;
  value: string;
  icon: AppIconName;
  onEdit: () => void;
}) {
  return (
    <View className="min-h-[69px] flex-row-reverse items-center gap-3 border-b border-border-subtle px-3 py-2.5">
      <View className="h-10 w-10 items-center justify-center rounded-[11px] bg-action-subtle">
        <AppIcon name={icon} size={20} tone="action" />
      </View>
      <View className="min-w-0 flex-1 items-end gap-1">
        <AppText align="right" variant="label" className="font-ui-bold">
          {title}
        </AppText>
        <AppText
          align="right"
          variant="caption"
          className="text-content-secondary"
          numberOfLines={2}
        >
          {value}
        </AppText>
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={'تعديل ' + title}
        className="min-h-[42px] min-w-[48px] items-center justify-center"
        onPress={onEdit}
      >
        <AppText variant="caption" className="font-ui-semibold text-content-link">
          تعديل
        </AppText>
      </Pressable>
    </View>
  );
}

export function AssessmentReviewScreen() {
  const router = useRouter();
  const {
    patient,
    complaint,
    details,
    location,
    selectedTeeth,
    answers,
    healthConfirmed,
    mediaAttachments,
  } = useAssessmentSession();
  const who = ASSESSMENT_PATIENT_FIXTURES[patient];
  const edit = (
    pathname:
      | '/assessment/patient'
      | '/assessment/complaint'
      | '/assessment/location'
      | '/assessment/questions'
      | '/assessment/health'
      | '/assessment/media',
  ) => router.push({ pathname, params: { returnTo: 'review' } });

  return (
    <AssessmentScaffold
      phase="المراجعة والموافقة"
      title="راجع إجاباتك"
      primaryLabel="إرسال للتوجيه الأولي"
      primaryDisabled={!complaint || !location || !healthConfirmed}
      onPrimary={() => router.push('/assessment/processing')}
      topContent={
        <AppText align="right" variant="label" className="text-content-secondary">
          تأكد من معلوماتك، ويمكنك تعديل أي خطوة قبل المتابعة.
        </AppText>
      }
    >
      <View className="overflow-hidden rounded-[15px] border border-border-subtle bg-surface-default">
        <SummaryRow
          title="المريض"
          value={`${who.name} · ${who.age} سنة`}
          icon={{ ios: 'person', android: 'person', web: 'person' }}
          onEdit={() => edit('/assessment/patient')}
        />
        <SummaryRow
          title="المشكلة الرئيسية"
          value={complaint || 'غير محددة'}
          icon={{ ios: 'cross.case', android: 'dentistry', web: 'dentistry' }}
          onEdit={() => edit('/assessment/complaint')}
        />
        <SummaryRow
          title="مكان المشكلة"
          value={
            selectedTeeth.length > 1
              ? `${location} · ${selectedTeeth.length} أسنان`
              : location || 'غير محدد'
          }
          icon={{ ios: 'mappin', android: 'place', web: 'place' }}
          onEdit={() => edit('/assessment/location')}
        />
        <SummaryRow
          title="الأعراض"
          value={answers.length ? answers.join(' · ') : 'لم تُحدّد الأعراض'}
          icon={{ ios: 'waveform.path.ecg', android: 'monitor_heart', web: 'monitor_heart' }}
          onEdit={() => edit('/assessment/questions')}
        />
        <SummaryRow
          title="المعلومات الصحية"
          value={healthConfirmed ? 'تمت مراجعة الخطوة' : 'بانتظار المراجعة'}
          icon={{
            ios: 'heart.text.square',
            android: 'health_and_safety',
            web: 'health_and_safety',
          }}
          onEdit={() => edit('/assessment/health')}
        />
        <SummaryRow
          title="الصور والملفات"
          value={
            mediaAttachments.length
              ? `${mediaAttachments.length} مرفق`
              : 'بدون مرفقات · خطوة اختيارية'
          }
          icon={{ ios: 'photo', android: 'image', web: 'image' }}
          onEdit={() => edit('/assessment/media')}
        />
      </View>
      {details ? (
        <View className="gap-1 rounded-[12px] bg-surface-subtle p-3">
          <AppText align="right" variant="label" className="font-ui-semibold">
            تفاصيل إضافية
          </AppText>
          <AppText align="right" variant="caption" className="text-content-secondary">
            {details}
          </AppText>
        </View>
      ) : null}
      <View className="flex-row-reverse items-start gap-2 rounded-[12px] bg-action-subtle px-3 py-3">
        <AppIcon
          name={{ ios: 'lock.shield', android: 'lock', web: 'lock' }}
          tone="action"
          size={19}
        />
        <View className="min-w-0 flex-1 items-end gap-1">
          <AppText variant="label" className="font-ui-semibold">
            مراجعة الخصوصية
          </AppText>
          <AppText align="right" variant="caption" className="text-content-secondary">
            النتيجة للتوجيه الأولي فقط. مشاركة الملفات والمعلومات مع الطبيب تحتاج موافقة مستقلة عند
            الحجز.
          </AppText>
        </View>
      </View>
    </AssessmentScaffold>
  );
}
