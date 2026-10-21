import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAssessmentEntry } from '@/features/assessment/hooks/use-assessment-entry';
import { ScrollView, View } from 'react-native';

import { DiscoveryHeader } from '@/features/discovery/components/pen-discovery-ui';
import { ServiceIcon } from '@/features/discovery/components/service-icon';
import { findPenFamily, findPenGroup } from '@/features/discovery/presentation/pen-discovery-data';
import { AppText, Button, Screen } from '@/shared/components/ui';

export function ServiceFamilyDetailScreen() {
  const router = useRouter();
  const startAssessment = useAssessmentEntry();
  const { familyCode } = useLocalSearchParams<{ familyCode?: string }>();
  const family = findPenFamily(familyCode);
  const group = findPenGroup(family?.groupCode);

  if (!family || !group) {
    return (
      <Screen>
        <AppText variant="heading-3">عائلة الخدمة غير موجودة</AppText>
      </Screen>
    );
  }

  const isImplantProsthetics = family.id === 'implant-prosthetics';

  return (
    <Screen contentClassName="px-0 py-0">
      <DiscoveryHeader subtitle={group.title} title="تفاصيل عائلة الخدمة" />
      <ScrollView contentContainerClassName="mx-auto w-full max-w-[430px] px-4 pb-8">
        <View className="rounded-[18px] bg-surface-default p-4">
          <View className="h-[72px] w-[72px] self-end items-center justify-center rounded-[20px] bg-action-subtle">
            <ServiceIcon serviceId={family.id} size={46} />
          </View>
          <AppText
            direction="ltr"
            className="mt-3 w-full text-type-label text-content-link"
            align="right"
            variant="caption"
          >
            {family.groupCode} · {group.title}
          </AppText>
          <AppText className="mt-1 w-full font-ui-bold text-type-heading-2" align="right">
            {family.title}
          </AppText>
          <AppText
            className="mt-1.5 w-full text-type-label text-content-secondary"
            align="right"
            variant="caption"
          >
            {isImplantProsthetics
              ? 'تساعد على تعويض سن أو أكثر بتركيبة ثابتة مدعومة بزرعات موجودة أو مخطط لها.'
              : family.description}
          </AppText>
        </View>

        <View className="mt-4">
          <AppText className="font-ui-bold text-type-label">ليش ممكن تبحث عنها؟</AppText>
          <AppText className="mt-2 text-type-label  text-content-secondary" variant="caption">
            {isImplantProsthetics
              ? 'إذا عندك زرعة جاهزة للتركيب، أو عم تستكشف تعويض أسنان مفقودة. الطبيب يفحص ثبات الزرعات واللثة والإطباق قبل اقتراح الخطة.'
              : 'إذا كانت هذه العائلة الأقرب لوصف حاجتك. الطبيب يراجع التفاصيل سريرياً قبل اقتراح الخطة المناسبة.'}
          </AppText>
        </View>

        <Button
          className="mt-4 h-12 rounded-[13px]"
          label="عرض تفاصيل الخدمة"
          onPress={() =>
            router.push({
              pathname: '/discover/service/[serviceCode]',
              params: { serviceCode: family.id },
            })
          }
          variant="outline"
        />
        <Button
          className="mt-2 h-12 rounded-[13px]"
          label="ابحث عن طبيب مؤهل"
          onPress={() =>
            router.push({
              pathname: '/discover/providers/results',
              params: {
                familyCode: family.id,
                serviceCode: family.id,
              },
            })
          }
        />
        <Button
          className="mt-2 h-11 rounded-[12px]"
          label="مو متأكد؟ خلينا نحدد حالتك"
          onPress={startAssessment}
          variant="secondary"
        />
      </ScrollView>
    </Screen>
  );
}
