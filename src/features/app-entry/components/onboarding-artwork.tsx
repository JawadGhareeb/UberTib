import { Typography } from 'heroui-native';
import type { ReactNode } from 'react';
import { View } from 'react-native';

import { AppIcon } from '@/shared/components/ui';
import type { AppIconName } from '@/shared/components/ui/app-icon';

export type OnboardingStep = 0 | 1 | 2;

type IconName = AppIconName;
const caseIcon: IconName = {
  ios: 'stethoscope',
  android: 'medical_information',
  web: 'medical_information',
};
const searchIcon: IconName = { ios: 'magnifyingglass', android: 'search', web: 'search' };
const doctorIcon: IconName = {
  ios: 'person.crop.circle',
  android: 'account_circle',
  web: 'account_circle',
};
const scienceIcon: IconName = {
  ios: 'checkmark.seal',
  android: 'workspace_premium',
  web: 'workspace_premium',
};
const reviewsIcon: IconName = { ios: 'star.fill', android: 'star', web: 'star' };
const priceIcon: IconName = { ios: 'creditcard', android: 'payments', web: 'payments' };
const protectionIcon: IconName = {
  ios: 'checkmark.shield',
  android: 'verified_user',
  web: 'verified_user',
};

function Appear({ children, className }: { index: number; children: ReactNode; className?: string }) {
  return <View className={className}>{children}</View>;
}

function MiniText({
  children,
  muted = false,
  center = false,
}: {
  children: ReactNode;
  muted?: boolean;
  center?: boolean;
}) {
  return (
    <Typography.Paragraph
      type="body-sm"
      className={
        muted ? 'font-ui-regular text-text-secondary' : 'font-ui-semibold text-text-primary'
      }
      style={{
        textAlign: center ? 'center' : 'right',
        writingDirection: 'rtl',
        fontSize: muted ? 11 : 12,
        lineHeight: muted ? 17 : 19,
      }}
    >
      {children}
    </Typography.Paragraph>
  );
}

function MiniIcon({ name }: { name: IconName }) {
  return (
    <View className="h-11 w-11 items-center justify-center rounded-[12px] bg-action-subtle">
      <AppIcon name={name} size={23} tone="action" />
    </View>
  );
}

function StartChoices() {
  return (
    <View className="w-full flex-row gap-3" style={{ direction: 'rtl' }}>
      {[
        { title: 'ساعدني حدد حالتي', caption: 'أسئلة عن حاجتك', icon: caseIcon },
        { title: 'استكشف الأطباء', caption: 'بحث ومقارنة', icon: searchIcon },
      ].map((option, index) => (
        <Appear index={index} key={option.title} className="min-w-0 flex-1">
          <View className="min-h-[167px] items-center justify-between gap-2 rounded-[14px] border border-border-default bg-surface-default p-3">
            <MiniIcon name={option.icon} />
            <MiniText center>{option.title}</MiniText>
            <MiniText muted center>
              {option.caption}
            </MiniText>
            <View className="h-1.5 w-12 rounded-full bg-action-primary" />
          </View>
        </Appear>
      ))}
    </View>
  );
}

function TrustCard() {
  return (
    <View className="w-full gap-2.5">
      <Appear index={0}>
        <View
          className="flex-row items-center gap-3 rounded-[14px] border border-border-default bg-surface-default p-3"
          style={{ direction: 'rtl' }}
        >
          <MiniIcon name={doctorIcon} />
          <View className="min-w-0 flex-1 gap-0.5">
            <MiniText>ملف الطبيب</MiniText>
            <MiniText muted>المجال العلاجي والفرع</MiniText>
          </View>
          <AppIcon name={scienceIcon} size={20} tone="action" />
        </View>
      </Appear>
      <View className="flex-row gap-2" style={{ direction: 'rtl' }}>
        {[
          { label: 'التصنيف العلمي', icon: scienceIcon },
          { label: 'تقييمات المرضى', icon: reviewsIcon },
        ].map((item, index) => (
          <Appear index={index + 1} key={item.label} className="min-w-0 flex-1">
            <View
              className="min-h-[66px] flex-row items-center gap-2 rounded-[12px] border border-border-subtle bg-surface-default px-2.5 py-2"
              style={{ direction: 'rtl' }}
            >
              <AppIcon name={item.icon} size={19} tone="action" />
              <View className="min-w-0 flex-1">
                <MiniText>{item.label}</MiniText>
              </View>
            </View>
          </Appear>
        ))}
      </View>
      <Appear index={3}>
        <View
          className="flex-row items-center justify-between rounded-[12px] border border-border-subtle bg-surface-default px-3 py-3"
          style={{ direction: 'rtl' }}
        >
          <View className="flex-row items-center gap-2" style={{ direction: 'rtl' }}>
            <AppIcon name={priceIcon} size={18} tone="action" />
            <MiniText>الأسعار</MiniText>
          </View>
          <View className="h-5 w-px bg-border-default" />
          <View className="flex-row items-center gap-2" style={{ direction: 'rtl' }}>
            <AppIcon name={protectionIcon} size={18} tone="action" />
            <MiniText>الحماية المشروطة</MiniText>
          </View>
        </View>
      </Appear>
    </View>
  );
}

const bookingSteps: { title: string; caption: string; icon: IconName }[] = [
  {
    title: 'اطلب موعداً',
    caption: 'الموعد بانتظار تأكيد العيادة',
    icon: { ios: 'calendar', android: 'calendar_month', web: 'calendar_month' },
  },
  {
    title: 'تابع علاجك',
    caption: 'الخطّة والمراحل والمواعيد',
    icon: { ios: 'checklist', android: 'checklist', web: 'checklist' },
  },
  { title: 'اطّلع على شروط الحماية', caption: 'الحقوق والشروط المتاحة', icon: protectionIcon },
];

function BookingSteps() {
  return (
    <View className="w-full gap-2.5">
      {bookingSteps.map((item, index) => (
        <Appear index={index} key={item.title}>
          <View
            className="min-h-[63px] flex-row items-center gap-3 rounded-[13px] border border-border-subtle bg-surface-default px-3 py-2"
            style={{ direction: 'rtl' }}
          >
            <MiniIcon name={item.icon} />
            <View className="min-w-0 flex-1 gap-0.5">
              <MiniText>{item.title}</MiniText>
              <MiniText muted>{item.caption}</MiniText>
            </View>
            <View className="h-2 w-2 rounded-full bg-action-primary" />
          </View>
        </Appear>
      ))}
    </View>
  );
}

/** SVG icons and UI miniatures illustrate features, never real doctor or protection data. */
export function OnboardingArtwork({ step, height }: { step: OnboardingStep; height: number }) {
  const a11yLabels = [
    'خيارا تحديد الحالة واستكشاف الأطباء',
    'ملف الطبيب وتصنيفه العلمي وتقييم المرضى والسعر والحماية',
    'طلب موعد ومتابعة العلاج وشروط الحماية',
  ] as const;

  return (
    <View
      accessible
      accessibilityRole="image"
      accessibilityLabel={a11yLabels[step]}
      className="w-full items-center justify-center rounded-[18px] bg-action-subtle px-3.5 py-3"
      style={{ height }}
    >
      {step === 0 ? <StartChoices /> : step === 1 ? <TrustCard /> : <BookingSteps />}
    </View>
  );
}