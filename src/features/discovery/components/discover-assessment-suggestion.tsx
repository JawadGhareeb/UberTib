import { useRouter } from 'expo-router';
import { Pressable } from 'react-native';
import { AppText } from '@/shared/components/ui';

export function DiscoverAssessmentSuggestion() {
  const router = useRouter();
  return (
    <Pressable
      accessibilityLabel="عرض أطباء علاج الجذور من التقييم الأولي"
      accessibilityRole="button"
      className="mt-3 min-h-[101px] items-end justify-center rounded-[15px] border border-action-primary/30 bg-action-subtle px-3 py-3"
      onPress={() =>
        router.push({ pathname: '/discover/providers', params: { serviceCode: 'root-canal' } })
      }
    >
      <AppText align="right" className="text-content-link" variant="caption">
        من التقييم الأولي
      </AppText>
      <AppText align="right" className="mt-2 font-ui-bold" variant="label">
        ألم في ضرس خلفي • علاج الجذور
      </AppText>
      <AppText align="right" className="mt-1 text-content-secondary" variant="caption">
        الخدمة محددة مسبقاً ويمكنك تعديل التقييم
      </AppText>
    </Pressable>
  );
}
