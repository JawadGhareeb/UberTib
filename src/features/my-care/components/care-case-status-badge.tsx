import { View } from 'react-native';

import { AppText } from '@/shared/components/ui';
import type { MockCareCase } from '../mocks/care.mock';

/** Presentation-only status normalization: follow-up work is still active treatment. */
export function CareCaseStatusBadge({ careCase }: { careCase: MockCareCase }) {
  const completed = careCase.progress >= 100;
  return (
    <View
      accessible
      accessibilityLabel={completed ? 'العلاج مكتمل' : 'قيد العلاج'}
      className={
        'min-h-[29px] flex-row-reverse items-center self-start gap-1.5 rounded-full px-2.5 py-1 ' +
        (completed ? 'bg-tone-success-fill' : 'bg-action-subtle')
      }
      style={{ direction: 'ltr' }}
    >
      <View
        className={
          'h-[7px] w-[7px] rounded-full ' +
          (completed ? 'bg-tone-success-text' : 'bg-action-primary')
        }
      />
      <AppText
        direction="rtl"
        align="right"
        variant="badge"
        className={
          'font-ui-semibold ' + (completed ? 'text-tone-success-text' : 'text-content-link')
        }
        numberOfLines={1}
      >
        {completed ? 'مكتملة' : 'قيد العلاج'}
      </AppText>
    </View>
  );
}
