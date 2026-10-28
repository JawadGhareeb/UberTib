import { View } from 'react-native';

import { AppText } from '@/shared/components/ui';
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
  return (
    <View
      accessible
      accessibilityLabel={draft ? 'مسودة' : completed ? 'العلاج مكتمل' : 'قيد العلاج'}
      className={
        'min-h-[29px] flex-row-reverse items-center self-start gap-1.5 rounded-full px-2.5 py-1 ' +
        (draft ? 'bg-surface-subtle' : completed ? 'bg-tone-success-fill' : 'bg-action-subtle')
      }
      style={{ direction: 'ltr', minWidth: 92, flexShrink: 0 }}
    >
      <View
        className={
          'h-[7px] w-[7px] rounded-full ' +
          (draft
            ? 'bg-content-secondary'
            : completed
              ? 'bg-tone-success-text'
              : 'bg-action-primary')
        }
      />
      <AppText
        direction="rtl"
        align="right"
        variant="badge"
        className={
          'min-w-[67px] shrink-0 text-center font-ui-semibold ' +
          (draft
            ? 'text-content-secondary'
            : completed
              ? 'text-tone-success-text'
              : 'text-content-link')
        }
      >
        {draft ? 'مسودة' : completed ? 'مكتملة' : 'قيد العلاج'}
      </AppText>
    </View>
  );
}
