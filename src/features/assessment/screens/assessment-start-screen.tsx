import { useRouter } from 'expo-router';
import { Pressable, View } from 'react-native';

import { AssessmentScaffold } from '@/features/assessment/components/assessment-scaffold';
import { AppIcon, AppText, Button } from '@/shared/components/ui';
import { ToothSvg } from '@/shared/components/ui/tooth-svg';
import { useAppDirection } from '@/providers/app-direction-provider';
import { cn } from '@/shared/utils/cn';

const trustFacts = [
  {
    text: 'يمكنك تعديل إجاباتك',
    icon: { ios: 'pencil', android: 'edit', web: 'edit' },
  },
  {
    text: 'لا تُرسل بياناتك للطبيب قبل موافقتك',
    icon: { ios: 'lock.shield', android: 'verified_user', web: 'verified_user' },
  },
  {
    text: 'يمكنك الإيقاف والعودة لاحقاً',
    icon: { ios: 'clock.arrow.circlepath', android: 'history', web: 'history' },
  },
] as const;

export function AssessmentStartScreen() {
  const router = useRouter();
  const { rowClassName } = useAppDirection();

  return (
    <AssessmentScaffold
      phase="البدء"
      title="التقييم الذكي للأسنان"
      topContent={
        <View className="gap-3 pt-1">
          <View className="self-end flex-row items-center gap-1.5 rounded-full bg-action-subtle px-3 py-1.5">
            <AppText
              className="font-ui-semibold text-type-label text-content-link"
              variant="caption"
            >
              التقييم لـ: سارة الأحمد
            </AppText>
            <AppIcon
              name={{ ios: 'person.fill', android: 'person', web: 'person' }}
              size={14}
              tone="action"
            />
          </View>

          <View className="min-h-[68px] flex-row items-center justify-between gap-3 rounded-[12px] bg-tone-info-fill px-3 py-2">
            <Pressable
              accessibilityRole="button"
              className="min-h-target-comfortable min-w-[44px] items-center justify-center"
              onPress={() => router.push('/assessment/complaint')}
            >
              <AppText className="font-ui-bold text-content-link" variant="label">
                متابعة
              </AppText>
            </Pressable>
            <View className="items-end">
              <AppText className="font-ui-bold text-type-label" variant="label">
                لديك تقييم غير مكتمل
              </AppText>
              <AppText className="text-type-label text-content-secondary" variant="caption">
                حُفظت آخر إجابة تلقائياً
              </AppText>
            </View>
          </View>
        </View>
      }
    >
      <View className="mt-3 rounded-[24px] bg-surface-subtle p-4">
        <View className={cn('items-center gap-3', rowClassName)}>
          <View className="min-w-0 flex-1 items-end">
            <AppText className="font-ui-bold text-type-heading-2 ">خلّينا نفهم شو عم يزعجك</AppText>
            <AppText className="mt-2 text-type-label  text-content-secondary">
              مو ضروري تعرف اسم المشكلة أو الاختصاص. منمشي معك خطوة بخطوة.
            </AppText>
          </View>
          <View className="h-[122px] w-[110px] items-center justify-center">
            <View className="absolute left-0 top-1 h-[80px] w-[80px] rounded-full bg-brand-mark/10" />
            <View className="absolute bottom-0 right-0 h-[92px] w-[92px] rounded-full bg-action-subtle" />
            <View className="h-[84px] w-[84px] items-center justify-center rounded-full border border-state-selected-border bg-surface-default">
              <ToothSvg kind="molar" selected size={58} />
            </View>
          </View>
        </View>
        <View className={cn('mt-4 items-center gap-3', rowClassName)}>
          <View className="min-w-0 flex-1 items-end rounded-[12px] bg-surface-default px-3 py-2">
            <AppText className="text-type-caption  text-content-secondary" variant="caption">
              تقييم أولي للتوجيه — التشخيص النهائي للطبيب
            </AppText>
          </View>
          <View className="h-11 w-11 items-center justify-center rounded-full bg-surface-default">
            <AppIcon
              name={{ ios: 'sparkles', android: 'auto_awesome', web: 'auto_awesome' }}
              size={20}
              tone="warning"
            />
          </View>
        </View>
      </View>

      <Button
        className="mt-3 h-[52px] rounded-[12px]"
        endIcon={{ ios: 'arrow.left', android: 'arrow_back', web: 'arrow_back' }}
        label="ابدأ التقييم"
        onPress={() => router.push('/assessment/patient')}
      />

      <Pressable
        accessibilityRole="button"
        className="mt-3 h-[50px] flex-row items-center justify-center gap-2 rounded-[12px] border border-action-primary bg-surface-default"
        onPress={() => router.push('/discover')}
      >
        <AppText className="font-ui-bold text-content-link" variant="label">
          أعرف الخدمة التي أحتاجها
        </AppText>
        <AppIcon
          name={{ ios: 'square.grid.2x2', android: 'grid_view', web: 'grid_view' }}
          size={19}
          tone="action"
        />
      </Pressable>

      <Pressable
        accessibilityRole="button"
        className="mt-2 min-h-target-comfortable flex-row items-center justify-center gap-1.5"
        onPress={() => router.push('/discover/providers')}
      >
        <AppText className="text-content-secondary" variant="label">
          ابحث عن طبيب مباشرة
        </AppText>
        <AppIcon
          name={{ ios: 'arrow.left', android: 'arrow_back', web: 'arrow_back' }}
          size={15}
          tone="secondary"
        />
      </Pressable>

      <View className="mt-3 rounded-[14px] bg-surface-default px-3 py-1">
        {trustFacts.map((item, index) => (
          <View
            className={`flex-row items-center justify-end gap-2 py-2.5 ${
              index < trustFacts.length - 1 ? 'border-b border-border-subtle' : ''
            }`}
            key={item.text}
          >
            <AppText className="text-type-label text-content-secondary" variant="caption">
              {item.text}
            </AppText>
            <View className="h-7 w-7 items-center justify-center rounded-full bg-action-subtle">
              <AppIcon name={item.icon} size={14} tone="action" />
            </View>
          </View>
        ))}
      </View>
    </AssessmentScaffold>
  );
}
