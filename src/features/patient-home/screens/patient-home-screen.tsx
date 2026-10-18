import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import Animated, { FadeInDown, ReduceMotion } from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';

import { HomeCareToothIcon } from '@/features/patient-home/components/home-care-tooth-icon';
import { AppHeader } from '@/shared/components/navigation';
import { PATIENT_TAB_BAR_HEIGHT } from '@/shared/components/navigation/patient-tab-metrics';
import { AppIcon, AppText, Button, Screen } from '@/shared/components/ui';
import { ToothSvg, type ToothShape } from '@/shared/components/ui/tooth-svg';
import { theme } from '@/shared/theme';
import { useAppTheme } from '@/shared/theme/theme-provider';

const groups: {
  code: 'G01' | 'G02' | 'G03' | 'G04';
  label: string;
  tooth: ToothShape;
}[] = [
  { code: 'G01', label: 'جراحة ولثة', tooth: 'incisor' },
  { code: 'G02', label: 'ترميم وتركيبات', tooth: 'molar' },
  { code: 'G03', label: 'علاج الجذور', tooth: 'premolar' },
  { code: 'G04', label: 'فحص ووقاية', tooth: 'molar' },
];

function HomeHero() {
  const router = useRouter();
  const { colors, scheme } = useAppTheme();
  const warm = theme.illustration.warm[scheme];

  return (
    <Animated.View
      className="min-h-[178px] flex-row items-center gap-2 overflow-hidden rounded-[18px] bg-action-subtle px-3 py-[12px]"
      entering={FadeInDown.duration(theme.motion.duration.overlay).reduceMotion(
        ReduceMotion.System,
      )}
    >
      <View className="relative h-[148px] w-[138px] shrink-0">
        <View
          className="absolute left-0 top-[39px] h-[94px] w-[94px] rounded-full"
          style={{ backgroundColor: warm.surface }}
        />
        <View className="absolute left-[48px] top-[51px] h-[92px] w-[84px] rounded-full bg-state-selected" />
        <View className="absolute left-[54px] top-[57px] h-[79px] w-[79px] rounded-full bg-action-primary/10" />

        <View className="absolute left-[1px] top-[3px] h-[30px] min-w-[66px] flex-row items-center justify-center gap-1 rounded-full border border-action-secondary-border bg-surface-default px-2">
          <AppText className="font-ui-medium" style={{ fontSize: 11, lineHeight: 16 }} variant="label">
            ألم
          </AppText>
          <AppIcon name={{ ios: 'heart.text.square', android: 'monitor_heart', web: 'monitor_heart' }} size={13} tone="action" />
        </View>

        <View className="absolute right-[5px] top-[2px] h-[30px] min-w-[52px] flex-row items-center justify-center gap-1 rounded-full border border-action-secondary-border bg-surface-default px-2">
          <AppText className="font-ui-medium" style={{ fontSize: 11, lineHeight: 16 }} variant="label">
            كسر
          </AppText>
          <AppIcon name={{ ios: 'bandage', android: 'healing', web: 'healing' }} size={13} tone="action" />
        </View>

        <View className="absolute left-[58px] top-[45px] h-[75px] w-[75px] items-center justify-center rounded-full bg-surface-default">
          <ToothSvg height={52} kind="molar" selected width={38} />
        </View>

        <View className="absolute bottom-[4px] left-[4px] h-[43px] w-[43px] items-center justify-center rounded-full bg-surface-default">
          <AppIcon
            color={warm.accent}
            name={{ ios: 'face.smiling', android: 'sentiment_satisfied', web: 'sentiment_satisfied' }}
            size={25}
          />
        </View>

        <View className="absolute bottom-[4px] right-[1px] h-[27px] flex-row items-center justify-center gap-1 rounded-full border border-action-secondary-border bg-surface-default px-2">
          <AppText style={{ fontSize: 10, lineHeight: 15 }} variant="caption">
            تورّم
          </AppText>
          <AppIcon
            name={{ ios: 'cross.case', android: 'health_and_safety', web: 'health_and_safety' }}
            size={13}
            tone="action"
          />
        </View>
      </View>

      <View className="min-w-0 flex-1 items-end justify-center">
        <AppText
          align="right"
          className="w-full font-ui-bold"
          style={{ fontSize: 19, lineHeight: 27 }}
          variant="heading-3"
        >
          شو عم يزعجك بأسنانك؟
        </AppText>
        <AppText
          align="right"
          className="mt-1 w-full text-content-secondary"
          style={{ fontSize: 11, lineHeight: 18 }}
          variant="caption"
        >
          احكِ لنا بطريقتك، ونساعدك تحدد الخطوة المناسبة.
        </AppText>
        <Pressable
          accessibilityRole="button"
          className="mt-3 min-h-[42px] w-full flex-row items-center justify-center gap-2 rounded-[11px] bg-action-primary px-2"
          onPress={() => router.push('/assessment/start')}
        >
          <AppText
            align="center"
            className="font-ui-bold"
            style={{ color: colors.text.onAction, fontSize: 12, lineHeight: 18 }}
            variant="label"
          >
            ساعدني أحدد حالتي
          </AppText>
          <AppIcon
            name={{ ios: 'sparkles', android: 'auto_awesome', web: 'auto_awesome' }}
            size={16}
            tone="onAction"
          />
        </Pressable>
      </View>
    </Animated.View>
  );
}

function HomeCareGroup({
  group,
  index,
}: {
  group: (typeof groups)[number];
  index: number;
}) {
  const router = useRouter();
  return (
    <Animated.View
      className="w-[49%]"
      entering={FadeInDown.delay(60 + index * 25)
        .duration(theme.motion.duration.overlay)
        .reduceMotion(ReduceMotion.System)}
    >
      <Pressable
        accessibilityRole="button"
        className="min-h-[76px] flex-row items-center gap-1 rounded-[15px] border border-border-subtle bg-surface-default px-[5px] py-[6px]"
        onPress={() =>
          router.push({
            pathname: '/discover/group/[groupCode]',
            params: { groupCode: group.code },
          })
        }
      >
        <HomeCareToothIcon kind={group.tooth} />
        <View className="min-w-0 flex-1 items-end justify-center">
          <AppText
            align="right"
            className="font-ui-bold"
            direction="ltr"
            style={{ color: theme.brand.mark, fontSize: 10, lineHeight: 15 }}
            variant="badge"
          >
            {group.code}
          </AppText>
          <AppText
            align="right"
            className="mt-1 w-full font-ui-medium"
            numberOfLines={2}
            style={{ fontSize: 11.5, lineHeight: 17 }}
            variant="label"
          >
            {group.label}
          </AppText>
        </View>
      </Pressable>
    </Animated.View>
  );
}

function TreatmentProgress() {
  const { colors } = useAppTheme();

  return (
    <View className="h-[58px] w-[58px] items-center justify-center">
      <Svg accessible={false} height={58} viewBox="0 0 58 58" width={58}>
        <Circle cx={29} cy={29} fill="none" r={24} stroke={colors.action.subtle} strokeWidth={4} />
        <Circle
          cx={29}
          cy={29}
          fill="none"
          origin="29,29"
          r={24}
          rotation={-90}
          stroke={colors.action.primary}
          strokeDasharray={[75.4, 75.4]}
          strokeLinecap="round"
          strokeWidth={4}
        />
      </Svg>
      <View className="absolute inset-0 items-center justify-center">
        <AppText
          align="center"
          direction="ltr"
          className="font-ui-bold"
          style={{ color: colors.action.primary, fontSize: 11, lineHeight: 16 }}
          variant="label"
        >
          2/4
        </AppText>
      </View>
    </View>
  );
}

function HomeSummaryCards() {
  const router = useRouter();
  const { scheme } = useAppTheme();
  const warm = theme.illustration.warm[scheme];

  return (
    <View className="mt-2 flex-row gap-[6px]">
      <Pressable
        accessibilityRole="button"
        className="min-h-[116px] min-w-0 flex-1 rounded-[15px] border border-border-subtle bg-surface-default px-2 py-[7px]"
        onPress={() => router.push('/(tabs)/care')}
      >
        <View className="flex-row items-center justify-between gap-1">
          <View className="rounded-full bg-action-subtle px-[7px] py-[3px]">
            <AppText className="font-ui-medium" style={{ fontSize: 10, lineHeight: 15 }} variant="caption">
              2 من 4
            </AppText>
          </View>
          <AppText className="font-ui-bold" style={{ fontSize: 12, lineHeight: 18 }} variant="label">
            علاج نشط
          </AppText>
        </View>

        <View className="mt-[5px] flex-row items-center justify-between">
          <TreatmentProgress />
          <View
            className="h-10 w-12 items-center justify-center rounded-[11px]"
            style={{ backgroundColor: warm.surface }}
          >
            <AppIcon
              name={{ ios: 'viewfinder', android: 'center_focus_strong', web: 'center_focus_strong' }}
              size={21}
              tone="action"
            />
          </View>
        </View>

        <AppText align="right" className="mt-1" style={{ fontSize: 10, lineHeight: 15 }} variant="caption">
          تنظيف القنوات
        </AppText>
      </Pressable>

      <Pressable
        accessibilityRole="button"
        className="min-h-[116px] min-w-0 flex-1 rounded-[15px] border border-border-subtle bg-surface-default px-2 py-[7px]"
        onPress={() => router.push('/booking')}
      >
        <View className="flex-row items-center justify-between gap-1">
          <View className="rounded-full bg-tone-success-fill px-[7px] py-[3px]">
            <AppText className="text-tone-success-text" style={{ fontSize: 10, lineHeight: 15 }} variant="caption">
              مؤكد
            </AppText>
          </View>
          <AppText className="font-ui-bold" style={{ fontSize: 12, lineHeight: 18 }} variant="label">
            موعدك القادم
          </AppText>
        </View>

        <View className="mt-[5px] flex-row items-center justify-end gap-1.5">
          <View className="h-[34px] w-[34px] items-center justify-center rounded-[11px] bg-action-subtle">
            <AppIcon
              name={{ ios: 'building.2', android: 'business', web: 'business' }}
              size={18}
              tone="action"
            />
          </View>
          <View className="h-[34px] w-[34px] items-center justify-center rounded-full bg-action-subtle">
            <AppIcon
              name={{ ios: 'person.crop.circle', android: 'person_outline', web: 'person_outline' }}
              size={22}
              tone="action"
            />
          </View>
        </View>
        <AppText align="right" className="mt-1 font-ui-medium" style={{ fontSize: 10.5, lineHeight: 16 }} variant="label">
          د. لينا يوسف
        </AppText>
        <AppText align="right" className="font-ui-semibold" style={{ color: theme.brand.mark, fontSize: 10, lineHeight: 15 }} variant="caption">
          24 أيلول · 12:00
        </AppText>
      </Pressable>
    </View>
  );
}

export function PatientHomeScreen() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const [showCoachMark, setShowCoachMark] = useState(true);

  return (
    <Screen contentClassName="px-0 py-0">
      <AppHeader variant="primary" />

      <ScrollView
        contentContainerClassName="mx-auto w-full max-w-[430px] px-3 pt-3"
        contentContainerStyle={{ paddingBottom: PATIENT_TAB_BAR_HEIGHT + 10 }}
        showsVerticalScrollIndicator={false}
      >
        <HomeHero />

        {showCoachMark ? (
          <View className="mt-2 min-h-[58px] flex-row items-center gap-2 rounded-[17px] bg-action-primary px-3 py-[7px]">
            <View className="h-[36px] w-[36px] shrink-0 items-center justify-center rounded-full bg-surface-default/20">
              <AppIcon
                name={{ ios: 'lightbulb', android: 'lightbulb_outline', web: 'lightbulb_outline' }}
                size={21}
                tone="onAction"
              />
            </View>
            <Pressable
              accessibilityRole="button"
              className="min-w-0 flex-1 items-end justify-center"
              onPress={() => router.push('/assessment/start')}
            >
              <AppText
                className="font-ui-bold"
                style={{ color: colors.text.onAction, fontSize: 12, lineHeight: 18 }}
                variant="label"
              >
                ابدأ من هون
              </AppText>
              <AppText
                className="mt-[2px]"
                style={{ color: colors.text.onAction, fontSize: 11, lineHeight: 17 }}
                variant="caption"
              >
                إذا مو متأكد من الخدمة
              </AppText>
            </Pressable>
            <Pressable
              accessibilityLabel="إخفاء التلميح"
              accessibilityRole="button"
              className="h-11 w-8 shrink-0 items-center justify-center"
              onPress={() => setShowCoachMark(false)}
            >
              <AppIcon name={{ ios: 'xmark', android: 'close', web: 'close' }} size={18} tone="onAction" />
            </Pressable>
          </View>
        ) : null}

        <View className="mt-[7px] flex-row gap-[7px]">
          <Button
            className="min-w-0 flex-1"
            endIcon={{ ios: 'square.grid.2x2', android: 'grid_view', web: 'grid_view' }}
            label="أعرف الخدمة"
            onPress={() => router.push('/discover')}
            size="sm"
            variant="outline"
          />
          <Button
            className="min-w-0 flex-1"
            endIcon={{ ios: 'magnifyingglass', android: 'search', web: 'search' }}
            label="أبحث عن طبيب"
            onPress={() => router.push('/discover/search')}
            size="sm"
            variant="outline"
          />
        </View>

        <AppText align="right" className="mt-[8px] font-ui-bold" style={{ fontSize: 14, lineHeight: 21 }} variant="heading-4">
          اختار حسب نوع العناية
        </AppText>

        <View className="mt-[7px] flex-row flex-wrap justify-between gap-y-[6px]">
          {groups.map((group, index) => (
            <HomeCareGroup group={group} index={index} key={group.code} />
          ))}
        </View>

        <HomeSummaryCards />
      </ScrollView>
    </Screen>
  );
}
