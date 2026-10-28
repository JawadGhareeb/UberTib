import { Text } from 'react-native';
import { AppText } from '@/shared/components/ui';

/** One flowing RTL heading: the doctor stays alongside the treatment/booking name. */
export function CareRecordTitle({
  title,
  provider,
  prominent = false,
}: {
  title: string;
  provider: string;
  prominent?: boolean;
}) {
  return (
    <AppText
      align="right"
      direction="rtl"
      variant={prominent ? 'heading-4' : 'body-strong'}
      className="w-full font-ui-semibold"
      numberOfLines={2}
    >
      {title}
      <Text className="font-ui-regular text-content-secondary">{' · ' + provider}</Text>
    </AppText>
  );
}
