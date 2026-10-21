import { useRouter } from 'expo-router';
import { Pressable, View } from 'react-native';

import { AssessmentScaffold } from '@/features/assessment/components/assessment-scaffold';
import { useAssessmentSession } from '@/features/assessment/state/assessment-session-provider';
import { AppIcon, AppText } from '@/shared/components/ui';

export function AssessmentResultScreen() {
  const router = useRouter();
  const { patient, complaint, answers, location, mediaAttachments } = useAssessmentSession();

  return (
    <AssessmentScaffold
      phase="النتيجة"
      title="التوجيه الأولي جاهز"
      primaryLabel="عرض أطباء الفحص الأولي"
      onPrimary={() =>
        router.push({
          pathname: '/discover/providers/results',
          params: {
            serviceCode: 'dental-checkup',
            patientId: patient === 'adam' ? 'patient-002' : 'patient-001',
          },
        })
      }
      topContent={
        <AppText align="right" variant="label" className="text-content-secondary">
          هذه ملخصات إجاباتك لمساعدتك بالبحث، وليست تشخيصاً أو تحديداً مؤكداً لخدمة علاجية.
        </AppText>
      }
    >
      <View className="items-center gap-3 rounded-[19px] bg-action-subtle px-4 py-6">
        <View className="h-20 w-20 items-center justify-center rounded-full bg-surface-default">
          <AppIcon
            name={{ ios: 'checkmark.seal', android: 'verified', web: 'verified' }}
            tone="action"
            size={41}
          />
        </View>
        <AppText align="center" variant="heading-3" className="font-ui-bold">
          جاهز للخطوة التالية
        </AppText>
        <AppText align="center" variant="label" className="text-content-secondary">
          خلصت مراجعة المعلومات. الطبيب هو اللي بيأكد المشكلة والعلاج المناسب بعد الفحص.
        </AppText>
      </View>

      <View className="gap-3 rounded-[16px] border border-border-subtle bg-surface-default p-3.5">
        <View className="flex-row-reverse items-center gap-2.5">
          <View className="h-10 w-10 items-center justify-center rounded-[11px] bg-action-subtle">
            <AppIcon
              name={{ ios: 'doc.text.magnifyingglass', android: 'summarize', web: 'summarize' }}
              tone="action"
              size={21}
            />
          </View>
          <View className="min-w-0 flex-1 items-end gap-0.5">
            <AppText align="right" variant="heading-4" className="font-ui-bold">
              ملخص حالتك
            </AppText>
            <AppText align="right" variant="caption" className="text-content-secondary">
              حسب المعلومات اللي أدخلتها بالتقييم
            </AppText>
          </View>
        </View>

        <View className="gap-1.5 rounded-[12px] bg-action-subtle px-3 py-3">
          <AppText align="right" variant="caption" className="text-content-secondary">
            المشكلة الرئيسية
          </AppText>
          <AppText align="right" variant="label" className="font-ui-bold text-content-primary">
            {complaint || 'لم تُحدّد'}
          </AppText>
        </View>

        <View className="flex-row-reverse gap-2">
          <View className="min-w-0 flex-1 gap-1 rounded-[12px] bg-surface-subtle px-3 py-3">
            <AppIcon
              name={{ ios: 'mappin', android: 'place', web: 'place' }}
              tone="action"
              size={17}
            />
            <AppText align="right" variant="caption" className="text-content-secondary">
              مكان المشكلة
            </AppText>
            <AppText align="right" variant="label" className="font-ui-semibold" numberOfLines={3}>
              {location || 'لم يُحدّد'}
            </AppText>
          </View>
          <View className="min-w-0 flex-1 gap-1 rounded-[12px] bg-surface-subtle px-3 py-3">
            <AppIcon
              name={{ ios: 'photo', android: 'image', web: 'image' }}
              tone="action"
              size={17}
            />
            <AppText align="right" variant="caption" className="text-content-secondary">
              المرفقات
            </AppText>
            <AppText align="right" variant="label" className="font-ui-semibold" numberOfLines={3}>
              {mediaAttachments.length ? `${mediaAttachments.length} ملف` : 'بدون مرفقات'}
            </AppText>
          </View>
        </View>

        <View className="gap-1.5 border-t border-border-subtle pt-3">
          <View className="flex-row-reverse items-center gap-2">
            <AppIcon
              name={{ ios: 'waveform.path.ecg', android: 'monitor_heart', web: 'monitor_heart' }}
              tone="secondary"
              size={17}
            />
            <AppText align="right" variant="label" className="font-ui-semibold">
              الأعراض اللي ذكرتها
            </AppText>
          </View>
          <AppText align="right" variant="label" className="text-content-secondary">
            {answers.length ? answers.join('، ') : 'ما تم تحديد أعراض'}
          </AppText>
        </View>
      </View>

      <View className="gap-2 rounded-[14px] bg-surface-subtle p-3">
        <View className="flex-row-reverse items-center gap-2">
          <AppIcon
            name={{ ios: 'stethoscope', android: 'medical_services', web: 'medical_services' }}
            tone="action"
            size={20}
          />
          <AppText align="right" variant="label" className="min-w-0 flex-1 font-ui-bold">
            الخيار الآمن للمتابعة
          </AppText>
        </View>
        <AppText align="right" variant="label" className="text-content-secondary">
          تقدر تبدأ بفحص أسنان عام. بعد التقييم السريري الطبيب بيحدد إذا بتحتاج إجراء تاني.
        </AppText>
      </View>
      <Pressable
        accessibilityRole="button"
        className="min-h-[46px] items-center justify-center rounded-[12px] border border-border-subtle bg-surface-default"
        onPress={() => router.push('/(tabs)/discover')}
      >
        <AppText variant="label" className="font-ui-semibold text-content-link">
          تصفّح جميع الخدمات
        </AppText>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        className="min-h-[40px] flex-row-reverse items-center justify-center gap-2"
        onPress={() => router.push('/assessment/complaint')}
      >
        <AppText variant="label" className="text-content-secondary">
          تعديل الإجابات
        </AppText>
        <AppIcon
          name={{ ios: 'pencil', android: 'edit', web: 'edit' }}
          tone="secondary"
          size={16}
        />
      </Pressable>
    </AssessmentScaffold>
  );
}
