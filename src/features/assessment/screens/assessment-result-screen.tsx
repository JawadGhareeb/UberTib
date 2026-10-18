import { useRouter } from 'expo-router';
import { Pressable, View } from 'react-native';

import { AssessmentScaffold } from '@/features/assessment/components/assessment-scaffold';
import { useAssessmentSession } from '@/features/assessment/state/assessment-session-provider';
import { AppIcon, AppText } from '@/shared/components/ui';
import type { AppIconName } from '@/shared/components/ui/app-icon';

export function AssessmentResultScreen() {
  const router = useRouter();
  const { answers, complaint, location, mediaAttached } = useAssessmentSession();

  return (
    <AssessmentScaffold
      onPrimary={() => router.push({
        pathname: '/discover/providers/results',
        params: { serviceCode: 'dental-checkup' },
      })}
      primaryLabel="عرض أطباء الفحص الأولي"
      phase="النتيجة"
      title="التقييم الأولي لحالتك"
    >
      <View className="mt-2 h-[250px] items-center justify-center rounded-[22px] bg-surface-subtle">
        <View className="h-28 w-28 items-center justify-center rounded-full bg-action-subtle">
          <View className="h-20 w-20 items-center justify-center rounded-full bg-surface-default">
            <AppIcon
              name={{ ios: 'checkmark.seal.fill', android: 'verified', web: 'verified' }}
              size={34}
              tone="action"
            />
          </View>
        </View>
        <AppText className="mt-4 font-ui-bold text-type-heading-4">جاهز للبحث</AppText>
        <AppText
          className="mt-1 max-w-[260px] text-center text-type-label  text-content-secondary"
          variant="caption"
        >
          استخدمنا المعلومات كإشارة توجيه فقط، والطبيب يؤكد التشخيص النهائي.
        </AppText>
      </View>

      <View className="mt-3 flex-row items-center justify-end gap-2 rounded-[11px] bg-tone-success-fill px-3 py-2.5">
        <AppText className="flex-1 text-type-label text-tone-success-text" variant="label">
          المعلومات كافية للبحث عن أطباء مؤهلين
        </AppText>
        <AppIcon
          name={{ ios: 'checkmark.circle.fill', android: 'check_circle', web: 'check_circle' }}
          size={15}
          tone="success"
        />
      </View>

      <View className="mt-3">
        <AppText className="font-ui-bold text-type-caption">اعتمدنا على</AppText>
        <View className="mt-2 flex-row gap-2">
          {[
            ['3 أيام', { ios: 'clock.fill', android: 'schedule', web: 'schedule' }],
            [
              answers.length ? answers.join('، ') : 'بارد ومضغ',
              { ios: 'snowflake', android: 'ac_unit', web: 'ac_unit' },
            ],
            [
              location || 'يمين سفلي',
              { ios: 'mappin.circle.fill', android: 'location_on', web: 'location_on' },
            ],
          ].map(([label, icon]) => (
            <View
              className="min-h-[48px] flex-1 items-center justify-center rounded-[12px] bg-surface-default px-2"
              key={String(label)}
            >
              <AppIcon name={icon as AppIconName} size={15} tone="action" />
              <AppText
                align="center"
                className="mt-1 text-type-caption text-content-secondary"
                variant="caption"
              >
                {String(label)}
              </AppText>
            </View>
          ))}
        </View>
      </View>

      <View className="mt-3 rounded-[14px] border border-border-subtle bg-surface-default p-3">
        <View className="flex-row items-center justify-end gap-2">
          <AppText className="font-ui-bold text-type-label">ما زال الطبيب بحاجة لتأكيد</AppText>
          <AppIcon
            name={{ ios: 'stethoscope', android: 'stethoscope', web: 'stethoscope' }}
            size={17}
            tone="action"
          />
        </View>
        <AppText className="mt-1.5 text-type-label  text-content-secondary" variant="caption">
          التشخيص السريري النهائي • الحاجة للأشعة • الإجراء المناسب داخل الخدمة
        </AppText>
      </View>

      <View className="mt-3 h-[66px] flex-row items-center gap-2">
        <View className="min-w-0 flex-1 items-end">
          <AppText className="font-ui-bold text-type-label">الأدلة المرفقة</AppText>
          <AppText className="mt-0.5 text-type-caption text-content-secondary" variant="caption">
            {mediaAttached ? 'صورة + أشعة سابقة' : 'أشعة سابقة'}
          </AppText>
        </View>
        <View className="h-full w-[62px] items-center justify-center rounded-[11px] bg-surface-subtle">
          <AppIcon
            name={{ ios: 'photo.fill', android: 'image', web: 'image' }}
            size={19}
            tone="action"
          />
          <AppText className="mt-1 text-type-caption text-content-secondary" variant="caption">
            صورة
          </AppText>
        </View>
        <View className="h-full w-[62px] items-center justify-center rounded-[11px] bg-surface-subtle">
          <AppIcon
            name={{ ios: 'waveform.path.ecg.rectangle', android: 'radiology', web: 'radiology' }}
            size={19}
            tone="action"
          />
          <AppText className="mt-1 text-type-caption text-content-secondary" variant="caption">
            أشعة
          </AppText>
        </View>
      </View>

      <View className="mt-3 rounded-[11px] bg-surface-subtle px-3 py-2.5">
        <AppText className="text-type-caption text-content-secondary" variant="caption">
          الشكوى: {complaint || 'ألم في سن أو ضرس'}
        </AppText>
      </View>

      <Pressable
        accessibilityRole="button"
        className="mt-2 min-h-10 flex-row items-center justify-center gap-1.5"
        onPress={() => router.push('/assessment/complaint')}
      >
        <AppText className="text-type-label text-content-link" variant="label">
          تعديل الإجابات
        </AppText>
        <AppIcon name={{ ios: 'pencil', android: 'edit', web: 'edit' }} size={15} tone="action" />
      </Pressable>
    </AssessmentScaffold>
  );
}
