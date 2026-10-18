import { useRouter } from 'expo-router';
import type { PropsWithChildren } from 'react';
import { View } from 'react-native';

import { CareV5Badge, CareV5Header } from '@/features/my-care/components/care-v5-ui';
import { AppIcon, AppText, Screen, StateView } from '@/shared/components/ui';
import type { AppIconName } from '@/shared/components/ui/app-icon';
import { cn } from '@/shared/utils/cn';

type FinancialPage = 'ledger' | 'payment' | 'refund';
type FinancialTone = 'primary' | 'info' | 'success' | 'warning' | 'danger';

const financialPageHeaders = {
  ledger: { title: 'السجل المالي', icon: 'file', tone: 'primary' },
  payment: { title: 'تأكيد الدفعة', icon: 'verified', tone: 'warning' },
  refund: { title: 'طلب الاسترداد', icon: 'history', tone: 'success' },
} as const;

/** One fixed app bar for all three financial routes (including unavailable states). */
export function CareFinancialPageHeader({ page }: { page: FinancialPage }) {
  const options = financialPageHeaders[page];
  return (
    <CareV5Header
      title={options.title}
      leftIcon={options.icon}
      leftTone={options.tone}
    />
  );
}

/** A small status on one edge, title on the other, and an optional semantic icon. */
export function CareFinancialCardHeading({
  title,
  status,
  tone = 'primary',
  icon,
  iconOnWhite = false,
}: {
  title: string;
  status?: string;
  tone?: FinancialTone;
  icon?: AppIconName;
  iconOnWhite?: boolean;
}) {
  const heading = (
    <AppText
      align="right"
      className="min-w-0 flex-1 font-ui-bold"
      numberOfLines={2}
      style={{ fontSize: 12, lineHeight: 20 }}
      variant="label"
    >
      {title}
    </AppText>
  );
  return (
    <View className="flex-row items-center gap-[7px]">
      {status ? <CareV5Badge label={status} tone={tone} /> : null}
      {heading}
      {icon ? (
        <View
          className={cn(
            'h-9 w-9 items-center justify-center rounded-[10px]',
            iconOnWhite ? 'bg-surface-default' : tone === 'warning'
              ? 'bg-tone-warning-fill'
              : tone === 'success'
                ? 'bg-tone-success-fill'
                : tone === 'info'
                  ? 'bg-tone-info-fill'
                  : tone === 'danger'
                    ? 'bg-tone-danger-fill'
                    : 'bg-action-subtle',
          )}
        >
          <AppIcon name={icon} size={18} tone={tone === 'primary' ? 'action' : tone} />
        </View>
      ) : null}
    </View>
  );
}

export function CareDetailRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <View className="min-h-[27px] flex-row items-center justify-between gap-2">
      <AppText
        align="left"
        className="min-w-0 flex-1 font-ui-semibold text-content-primary"
        direction={/^[A-Z0-9-]+$/.test(value) ? 'ltr' : undefined}
        numberOfLines={3}
        style={{ fontSize: 10.5, lineHeight: 17 }}
        variant="caption"
      >
        {value}
      </AppText>
      <AppText
        align="right"
        className="min-w-0 flex-1 text-content-secondary"
        numberOfLines={2}
        style={{ fontSize: 10, lineHeight: 17 }}
        variant="caption"
      >
        {label}
      </AppText>
    </View>
  );
}

/** Footer sits inside Screen safe area; never add a second safe-area inset. */
export function CareActionFooter({ children }: PropsWithChildren) {
  return (
    <View className="absolute bottom-0 left-0 right-0 border-t border-border-subtle bg-surface-default px-4 pb-2 pt-2">
      <View className="mx-auto w-full max-w-[430px] gap-2">{children}</View>
    </View>
  );
}

/** Never show the first demo case's financial history for another case. */
export function FinancialCaseUnavailable({
  title,
}: {
  title: string;
}) {
  const router = useRouter();
  const page: FinancialPage =
    title === 'تأكيد الدفعة' ? 'payment' : title === 'طلب الاسترداد' ? 'refund' : 'ledger';

  return (
    <Screen contentClassName="px-0 py-0">
      <CareFinancialPageHeader page={page} />
      <View className="flex-1 px-4 py-6">
        <StateView
          title="ما في سجل مالي لهالحالة"
          description="ما منعرض بيانات دفعة أو استرداد تخص حالة ثانية. بتظهر تفاصيل الحالة لما تتوفر."
          actionLabel="العودة إلى علاجي"
          onAction={() => router.replace('/(tabs)/care')}
        />
      </View>
    </Screen>
  );
}
