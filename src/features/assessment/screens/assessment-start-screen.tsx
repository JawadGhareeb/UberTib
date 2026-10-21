import { useRouter } from 'expo-router';
import { Pressable, View } from 'react-native';

import { AssessmentScaffold } from '@/features/assessment/components/assessment-scaffold';
import { AppIcon, AppText, Button } from '@/shared/components/ui';
import { IntroArtwork } from '@/features/app-entry/components/intro-artwork';

export function AssessmentStartScreen() {
  const router = useRouter();

  return (
    <AssessmentScaffold phase="البدء" title="ساعدني أحدد حالتي">
      <View className="items-center gap-3 rounded-[19px] bg-surface-subtle px-4 pb-5 pt-6">
        <View className="w-full max-w-[260px] items-center justify-center">
          <IntroArtwork step={0} height={165} />
        </View>
        <AppText align="center" variant="heading-3" className="font-ui-bold">
          خلّينا نعرف شو عم يزعجك
        </AppText>
        <AppText align="center" variant="body" className="text-content-secondary">
          جاوب على كم سؤال بسيط عن حالتك، ومنساعدك تختار الخدمة المناسبة.
        </AppText>
      </View>

      <View className="gap-3 rounded-[15px] bg-action-subtle p-4">
        {[
          'أسئلة بسيطة وواضحة عن المشكلة',
          'توجيه أولي يساعدك تختار الخدمة',
          'التشخيص النهائي دائماً عند الطبيب',
        ].map((item) => (
          <View key={item} className="flex-row-reverse items-center gap-2">
            <AppIcon
              name={{ ios: 'checkmark.circle', android: 'check_circle', web: 'check_circle' }}
              tone="action"
              size={17}
            />
            <AppText align="right" variant="label" className="min-w-0 flex-1">
              {item}
            </AppText>
          </View>
        ))}
      </View>

      <Button
        className="min-h-[51px] rounded-[12px]"
        label="ابدأ التقييم"
        endIcon={{ ios: 'arrow.left', android: 'arrow_back', web: 'arrow_back' }}
        onPress={() => router.push('/assessment/patient')}
      />
      <Button
        className="min-h-[49px] rounded-[12px]"
        label="تصفّح الخدمات"
        variant="outline"
        endIcon={{ ios: 'square.grid.2x2', android: 'grid_view', web: 'grid_view' }}
        onPress={() => router.push('/(tabs)/discover')}
      />
      <Pressable
        accessibilityRole="button"
        onPress={() => router.push('/discover/providers')}
        className="min-h-[43px] flex-row-reverse items-center justify-center gap-2"
      >
        <AppText variant="label" className="text-content-secondary">
          ابحث عن طبيب مباشرة
        </AppText>
        <AppIcon
          name={{ ios: 'arrow.left', android: 'arrow_back', web: 'arrow_back' }}
          tone="secondary"
          size={16}
        />
      </Pressable>
      <View className="flex-row-reverse items-center justify-center gap-2 rounded-[11px] bg-surface-subtle px-3 py-3">
        <AppIcon
          name={{ ios: 'lock.shield', android: 'verified_user', web: 'verified_user' }}
          tone="secondary"
          size={17}
        />
        <AppText align="right" variant="caption" className="min-w-0 flex-1 text-content-secondary">
          المعلومات ما بتنتقل للطبيب قبل مراجعة نطاق المشاركة والموافقة.
        </AppText>
      </View>
    </AssessmentScaffold>
  );
}
