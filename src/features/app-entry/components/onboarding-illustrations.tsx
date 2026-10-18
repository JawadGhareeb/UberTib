import { useEffect, useState, type ReactNode } from 'react';
import { Pressable, useWindowDimensions, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, ReduceMotion, ZoomIn, useReducedMotion } from 'react-native-reanimated';
import Svg, { Circle, Path } from 'react-native-svg';

import { AppIcon, type AppIconName, AppText } from '@/shared/components/ui';
import { ToothSvg } from '@/shared/components/ui/tooth-svg';
import { theme } from '@/shared/theme';
import { useAppTheme } from '@/shared/theme/theme-provider';
import { cn } from '@/shared/utils/cn';

export type OnboardingIllustrationKind = 'complaint' | 'steps' | 'doctor' | 'care';

const DESIGN_WIDTH = 350;
const DESIGN_HEIGHT = 340;

function DesignCanvas({ children }: { children: ReactNode }) {
  const { width } = useWindowDimensions();
  const availableWidth = Math.max(280, Math.min(width, 430) - 40);
  const scale = Math.min(1, availableWidth / DESIGN_WIDTH);

  return (
    <View className="h-full w-full items-center">
      <View
        style={{
          height: DESIGN_HEIGHT,
          transform: [{ scale }],
          transformOrigin: 'top center',
          width: DESIGN_WIDTH,
        }}
      >
        {children}
      </View>
    </View>
  );
}

function WarmSmileIcon() {
  const { scheme } = useAppTheme();
  const accent = theme.illustration.warm[scheme].accent;

  // One consistent outline across iOS, Android and web, matching the peach handoff.
  return (
    <Svg accessible={false} height={62} viewBox="0 0 80 80" width={62}>
      <Circle cx={40} cy={40} fill="none" r={31} stroke={accent} strokeWidth={5.5} />
      <Circle cx={29} cy={33} fill={accent} r={3.1} />
      <Circle cx={51} cy={33} fill={accent} r={3.1} />
      <Path
        d="M 24 47 Q 40 62 56 47"
        fill="none"
        stroke={accent}
        strokeLinecap="round"
        strokeWidth={5.5}
      />
    </Svg>
  );
}

function ComplaintIllustration() {
  const { scheme } = useAppTheme();
  const warm = theme.illustration.warm[scheme];

  const callouts: {
    label: string;
    x: number;
    y: number;
    icon: AppIconName;
  }[] = [
      {
        label: 'ألم',
        x: 30,
        y: 226,
        icon: { ios: 'heart.fill', android: 'monitor_heart', web: 'monitor_heart' },
      },
      {
        label: 'تورّم',
        x: 135,
        y: 266,
        icon: { ios: 'cross.case.fill', android: 'health_and_safety', web: 'health_and_safety' },
      },
      {
        label: 'كسر',
        x: 258,
        y: 224,
        icon: { ios: 'arrow.triangle.branch', android: 'call_split', web: 'call_split' },
      },
    ];

  return (
    <DesignCanvas>
      <View
        className="absolute h-[132px] w-[132px] rounded-full"
        style={{ backgroundColor: warm.surface, left: 18, top: 34 }}
      />
      <View className="absolute left-[160px] top-[60px] h-[176px] w-[176px] rounded-full bg-action-subtle" />
      <View className="absolute left-[164px] top-[92px] h-[116px] w-[170px] rounded-full bg-action-primary" />

      <View
        className="absolute left-[40px] top-[64px] h-[106px] w-[106px] items-center justify-center rounded-full bg-surface-default"
        style={{
          elevation: 3,
          shadowColor: warm.accent,
          shadowOffset: { width: 0, height: 7 },
          shadowOpacity: 0.13,
          shadowRadius: 18,
        }}
      >
        <WarmSmileIcon />
      </View>

      <View className="absolute left-[190px] top-[66px] h-[116px] w-[116px] items-center justify-center rounded-full border-2 border-state-selected-border bg-surface-default">
        <ToothSvg height={100} kind="molar" selected width={76} />
      </View>

      {callouts.map((item) => (
        <View
          className="absolute h-[38px] flex-row items-center gap-1.5 rounded-[19px] border border-border-subtle bg-surface-default px-[11px] py-[7px]"
          key={item.label}
          style={{ left: item.x, top: item.y }}
        >
          <AppIcon name={item.icon} size={17} tone="action" />
          <AppText className="text-type-caption " variant="label">
            {item.label}
          </AppText>
        </View>
      ))}
    </DesignCanvas>
  );
}

interface StepVisual {
  title: string;
  caption: string;
  icon: AppIconName;
}

const steps: StepVisual[] = [
  {
    title: 'وصف المشكلة',
    caption: 'خبرنا شو عم تحس أو شو اللي مضايقك.',
    icon: { ios: 'heart.fill', android: 'monitor_heart', web: 'monitor_heart' },
  },
  {
    title: 'تحديد المكان',
    caption: 'اختار السن أو المنطقة اللي فيها المشكلة.',
    icon: { ios: 'viewfinder', android: 'center_focus_strong', web: 'center_focus_strong' },
  },
  {
    title: 'تفاصيل الحالة',
    caption: 'كم سؤال سريع حتى نفهم حالتك بشكل أدق.',
    icon: { ios: 'checklist', android: 'checklist', web: 'checklist' },
  },
  {
    title: 'إضافة صور',
    caption: 'إذا عندك صور، فيك تضيفها لتوضيح الحالة.',
    icon: { ios: 'camera', android: 'photo_camera', web: 'photo_camera' },
  },
];

// Reanimated's mount-based delays were already ticking while the illustration
// container was fading in, making all cards look visible at once. Actually mount
// one item at a time so each step is visibly revealed after its predecessor.
const STEP_REVEAL_INITIAL_DELAY = 300;
const STEP_REVEAL_INTERVAL = 460;
const STEP_REVEAL_DURATION = 290;

function useSequentialReveal(total: number, initialDelay: number, interval: number) {
  const reduceMotion = useReducedMotion();
  const [visibleCount, setVisibleCount] = useState(() => (reduceMotion ? total : 0));

  useEffect(() => {
    // Every slide has its own illustration instance; changing slide resets
    // the counter through remount, without a synchronous state update in an effect.
    if (reduceMotion) return;

    const timers = Array.from({ length: total }, (_, index) =>
      setTimeout(() => setVisibleCount(index + 1), initialDelay + index * interval),
    );

    return () => timers.forEach(clearTimeout);
  }, [total, initialDelay, interval, reduceMotion]);

  return visibleCount;
}

function StepsIllustration() {
  const { scheme } = useAppTheme();
  const connectorColor = theme.illustration.warm[scheme].accent;
  const visibleCount = useSequentialReveal(
    steps.length,
    STEP_REVEAL_INITIAL_DELAY,
    STEP_REVEAL_INTERVAL,
  );
  // After the initial 1→2→3→4 animation, any step can be selected again.
  // Manual selection takes precedence over the remaining reveal timers.
  const [manualStep, setManualStep] = useState<number | null>(null);
  const activeStep = manualStep ?? Math.max(0, visibleCount - 1);

  return (
    // Preserve the Pen 62px cards, 16px gaps, and 24px side padding.
    <View className="h-full w-full px-6 pt-5">
      {steps.map((step, index) => {
        const active = index === activeStep;
        return (
          <View
            className={index === steps.length - 1 ? 'h-[62px] w-full' : 'h-[78px] w-full'}
            key={step.title}
          >
            {index < visibleCount ? (
              <Animated.View
                entering={FadeInDown.duration(STEP_REVEAL_DURATION).reduceMotion(ReduceMotion.System)}
              >
                <View className="h-[62px] w-full">
                  <Pressable
                    accessibilityLabel={`الخطوة ${index + 1} من 4: ${step.title}. ${step.caption}`}
                    accessibilityRole="button"
                    accessibilityState={{ selected: active }}
                    className={cn(
                      'h-full w-full flex-row items-center gap-2.5 rounded-[16px] border px-2.5 py-1.5',
                      active ? 'border-state-selected-border bg-state-selected' : 'border-border-subtle bg-surface-default',
                    )}
                    onPress={() => setManualStep(index)}
                  >
                    <Animated.View
                      className={cn(
                        'h-10 w-10 shrink-0 items-center justify-center rounded-full',
                        active ? 'bg-action-primary' : 'bg-action-subtle',
                      )}
                      entering={(active ? ZoomIn : FadeIn).duration(220).reduceMotion(ReduceMotion.System)}
                      key={`${index}-${active ? 'active' : 'idle'}`}
                    >
                      <AppText
                        align="center"
                        direction="ltr"
                        className={active ? 'text-content-on-action' : 'text-content-link'}
                        variant="onboarding-step-number"
                      >
                        {index + 1}
                      </AppText>
                    </Animated.View>

                    <View className="min-w-0 flex-1 items-end justify-center">
                      <AppText align="right" numberOfLines={1} variant="onboarding-step-title">
                        {step.title}
                      </AppText>
                      <AppText align="right" numberOfLines={2} variant="onboarding-step-caption">
                        {step.caption}
                      </AppText>
                    </View>

                    <View className="w-6 shrink-0 items-center justify-center">
                      <AppIcon name={step.icon} size={23} tone="action" />
                    </View>
                  </Pressable>
                </View>
              </Animated.View>
            ) : null}

            {index < steps.length - 1 && index + 1 < visibleCount ? (
              <Animated.View
                className="absolute h-4 w-4 items-center justify-center"
                entering={FadeIn.duration(180).reduceMotion(ReduceMotion.System)}
                pointerEvents="none"
                style={{ left: '50%', marginLeft: -8, top: 62 }}
              >
                <AppIcon
                  name={{ ios: 'arrow.down', android: 'arrow_downward', web: 'arrow_downward' }}
                  color={connectorColor}
                  size={18}
                />
              </Animated.View>
            ) : null}
          </View>
        );
      })}
    </View>
  );
}

function DoctorCard({
  x,
  name,
  branch,
  slot,
  warm = false,
}: {
  x: number;
  name: string;
  branch: string;
  slot: string;
  warm?: boolean;
}) {
  const { scheme } = useAppTheme();
  const warmPalette = theme.illustration.warm[scheme];

  return (
    <View
      className="absolute top-[18px] h-[304px] w-[151px] items-center gap-[7px] rounded-[18px] border border-border-subtle bg-surface-default p-3"
      style={{ left: x }}
    >
      <View
        className="h-[76px] w-[76px] items-center justify-center rounded-full border border-state-selected-border"
        style={
          warm
            ? { backgroundColor: warmPalette.surface, borderColor: warmPalette.border }
            : undefined
        }
      >
        {!warm ? <View className="absolute inset-0 rounded-full bg-action-subtle" /> : null}
        <AppIcon
          color={warm ? warmPalette.accent : undefined}
          name={{ ios: 'person', android: 'person_outline', web: 'person_outline' }}
          size={50}
          tone="action"
        />
      </View>

      <AppText align="center" className="text-type-label " variant="body-strong">
        {name}
      </AppText>
      <AppText align="center" className="text-type-label  text-content-link" variant="label">
        علاج الجذور
      </AppText>

      <View className="w-full items-end gap-[5px]">
        <AppText className="text-type-label  text-content-secondary" variant="caption">
          {branch}
        </AppText>
        <AppText className="text-type-label " variant="label">
          {slot}
        </AppText>
      </View>

      <View className="rounded-[10px] bg-surface-subtle px-[7px] py-1">
        <AppText
          align="center"
          className="text-type-caption  text-content-placeholder"
          variant="caption"
        >
          شخصية افتراضية
        </AppText>
      </View>
    </View>
  );
}

function DoctorIllustration() {
  return (
    <DesignCanvas>
      <DoctorCard branch="الجميلية" name="د. لينا خليل" slot="اليوم · ٥:٣٠" warm x={14} />
      <DoctorCard branch="الفرقان" name="د. سامر قدور" slot="غداً · ١٠:٠٠" x={185} />

      <View className="absolute left-[145px] top-[138px] h-[60px] w-[60px] items-center justify-center rounded-full border-4 border-surface-default bg-action-primary">
        <AppIcon
          name={{ ios: 'arrow.left.arrow.right', android: 'swap_horiz', web: 'swap_horiz' }}
          size={30}
          tone="onAction"
        />
      </View>
    </DesignCanvas>
  );
}

const careSteps: {
  label: string;
  y: number;
  icon: AppIconName;
}[] = [
    {
      label: 'التقييم',
      y: 18,
      icon: { ios: 'checklist', android: 'assignment_turned_in', web: 'assignment_turned_in' },
    },
    {
      label: 'الطبيب',
      y: 69,
      icon: { ios: 'stethoscope', android: 'stethoscope', web: 'stethoscope' },
    },
    {
      label: 'الحجز',
      y: 120,
      icon: { ios: 'calendar', android: 'calendar_month', web: 'calendar_month' },
    },
    {
      label: 'خطة العلاج',
      y: 171,
      icon: { ios: 'list.clipboard', android: 'assignment', web: 'assignment' },
    },
    {
      label: 'المراحل',
      y: 222,
      icon: {
        ios: 'point.topleft.down.to.point.bottomright.curvepath',
        android: 'route',
        web: 'route',
      },
    },
    {
      label: 'المتابعة',
      y: 273,
      icon: { ios: 'waveform.path.ecg', android: 'monitor_heart', web: 'monitor_heart' },
    },
  ];

// Reveal the final journey in reading order, one stage at a time.
// Short enough for the last slide to finish before the user can tap Next.
const CARE_REVEAL_INITIAL_DELAY = 300;
const CARE_REVEAL_INTERVAL = 320;
const CARE_REVEAL_DURATION = 260;

function CareIllustration() {
  const { colors } = useAppTheme();
  const visibleCount = useSequentialReveal(
    careSteps.length,
    CARE_REVEAL_INITIAL_DELAY,
    CARE_REVEAL_INTERVAL,
  );

  return (
    <DesignCanvas>
      {/* Draw only the gaps between badges so the rail never runs through a number. */}
      {careSteps.slice(0, -1).map((step, index) =>
        index + 1 < visibleCount ? (
          <Animated.View
            className="absolute left-[308px] h-[21px] w-[3px] rounded-full bg-action-primary"
            entering={FadeIn.duration(170).reduceMotion(ReduceMotion.System)}
            key={`connector-${step.label}`}
            pointerEvents="none"
            style={{ top: step.y + 37 }}
          />
        ) : null,
      )}

      {careSteps.map((step, index) => {
        if (index >= visibleCount) return null;
        const active = index === Math.max(0, visibleCount - 1);

        return (
          <Animated.View
            className="absolute left-[34px] h-[44px] w-[290px]"
            entering={FadeInDown.duration(CARE_REVEAL_DURATION).reduceMotion(ReduceMotion.System)}
            key={step.label}
            style={{ top: step.y }}
          >
            <View className="absolute bottom-0 left-0 right-[76px] top-0 items-end justify-center">
              <AppText
                align="right"
                className={active ? 'font-ui-bold' : 'font-ui-semibold'}
                numberOfLines={1}
                variant="label"
              >
                {step.label}
              </AppText>
            </View>

            <View className="absolute right-[40px] top-[10px] h-6 w-6 items-center justify-center">
              <AppIcon name={step.icon} size={21} tone={active ? 'action' : 'secondary'} />
            </View>

            <Animated.View
              className={cn(
                'absolute right-0 top-[7px] h-[30px] w-[30px] items-center justify-center rounded-full border',
                active
                  ? 'border-action-primary bg-action-primary'
                  : 'border-action-primary bg-surface-default',
              )}
              entering={(active ? ZoomIn : FadeIn).duration(200).reduceMotion(ReduceMotion.System)}
              key={`${step.label}-${active ? 'active' : 'idle'}`}
            >
              <AppText
                align="center"
                direction="ltr"
                includeFontPadding={false}
                maxFontSizeMultiplier={1.25}
                numberOfLines={1}
                style={{
                  color: active ? colors.text.onAction : colors.action.primary,
                  fontSize: 13,
                  lineHeight: 20,
                }}
                variant="onboarding-step-number"
              >
                {index + 1}
              </AppText>
            </Animated.View>
          </Animated.View>
        );
      })}
    </DesignCanvas>
  );
}

export function OnboardingIllustration({ kind }: { kind: OnboardingIllustrationKind }) {
  if (kind === 'complaint') return <ComplaintIllustration />;
  if (kind === 'steps') return <StepsIllustration />;
  if (kind === 'doctor') return <DoctorIllustration />;

  return <CareIllustration />;
}
