import { AppText } from '@/shared/components/ui/app-text';
import { cn } from '@/shared/utils/cn';

/**
 * Shared compact Arabic badge text.
 *
 * Let React Native measure the actual text instead of estimating width from
 * character counts or assigning a fixed minimum width. A little internal
 * breathing room protects Arabic glyph edges on Android.
 */
export function CompactBadgeLabel({ label, className }: { label: string; className?: string }) {
  return (
    <AppText
      align="center"
      direction="rtl"
      variant="badge"
      className={cn('min-w-0 shrink font-ui-medium', className)}
      style={{ paddingHorizontal: 3 }}
    >
      {label}
    </AppText>
  );
}
