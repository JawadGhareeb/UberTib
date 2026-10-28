import { View } from 'react-native';

import { CompactBadgeLabel } from '@/shared/components/ui/compact-badge-label';
import type { MockCareCase } from '../mocks/care.mock';

/** Presentation-only status normalization: follow-up work is still active treatment. */
export function CareCaseStatusBadge({
  careCase,
  draft = false,
}: {
  careCase?: MockCareCase;
  draft?: boolean;
}) {
  const completed = !draft && (careCase?.progress ?? 0) >= 100;
  const label = draft ? 'مسودة' : completed ? 'مكتملة' : 'قيد العلاج';
  return (
    <View
      accessible
      accessibilityLabel={draft ? 'مسودة' : completed ? 'العلاج مكتمل' : 'قيد العلاج'}
      className={
        'min-h-[29px] max-w-full flex-row-reverse items-center self-start gap-1 rounded-full px-2 py-1 ' +
        (draft ? 'bg-surface-subtle' : completed ? 'bg-tone-success-fill' : 'bg-action-subtle')
      }
      style={{ direction: 'ltr', flexShrink: 1 }}
    >
      <View
        className={
          'h-[7px] w-[7px] shrink-0 rounded-full ' +
          (draft
            ? 'bg-content-secondary'
            : completed
              ? 'bg-tone-success-text'
              : 'bg-action-primary')
        }
      />
      <CompactBadgeLabel
        label={label}
        className={
          'font-ui-semibold ' +
          (draft
            ? 'text-content-secondary'
            : completed
              ? 'text-tone-success-text'
              : 'text-content-link')
        }
      />
    </View>
  );
}
