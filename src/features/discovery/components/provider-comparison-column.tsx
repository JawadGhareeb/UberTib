import { Card as HeroCard } from 'heroui-native';
import { ProviderAvatar } from '@/features/discovery/components/provider-avatar';
import { Pressable, View } from 'react-native';

import {
  comparisonHeaderHeight,
  comparisonRowDefinitions,
  getComparisonFacts,
  type ComparisonDoctor,
  type ComparisonRowKey,
} from '@/features/discovery/model/provider-comparison';
import { AppIcon, AppText } from '@/shared/components/ui';

function ComparisonValue({
  kind,
  facts,
}: {
  kind: ComparisonRowKey;
  facts: ReturnType<typeof getComparisonFacts>;
}) {
  if (kind === 'rating') {
    return (
      <View className="items-center gap-1">
        <View className="flex-row items-center gap-1">
          <AppIcon
            name={{ ios: 'star.fill', android: 'star', web: 'star' }}
            size={17}
            tone="action"
          />
          <AppText variant="body-strong" className="font-ui-bold">
            {facts.rating}
          </AppText>
        </View>
        <AppText align="center" variant="caption" className="text-content-secondary">
          {facts.reviews}
        </AppText>
      </View>
    );
  }

  const primary =
    kind === 'price'
      ? facts.price
      : kind === 'appointment'
        ? facts.appointment
        : kind === 'clinic'
          ? facts.clinic
          : kind === 'included'
            ? facts.included
            : facts.conditions;
  const secondary =
    kind === 'price'
      ? facts.priceType
      : kind === 'appointment'
        ? 'بحاجة لتأكيد العيادة'
        : kind === 'clinic'
          ? facts.area
          : undefined;

  return (
    <View className="w-full items-center gap-1">
      <AppText
        align="center"
        variant={kind === 'price' ? 'label' : 'caption'}
        className={kind === 'price' ? 'font-ui-bold' : 'font-ui-medium'}
        numberOfLines={kind === 'included' || kind === 'conditions' ? 4 : 3}
      >
        {primary}
      </AppText>
      {secondary ? (
        <AppText
          align="center"
          variant="caption"
          className="text-content-secondary"
          numberOfLines={2}
        >
          {secondary}
        </AppText>
      ) : null}
    </View>
  );
}

/** Sticky doctor heading. The remove control gets its own place beside the avatar. */
export function ProviderComparisonDoctorHeader({
  doctor,
  width,
  onRemove,
  onViewProfile,
  onChoose,
}: {
  doctor: ComparisonDoctor;
  width: number;
  onRemove: () => void;
  onViewProfile: () => void;
  onChoose: () => void;
}) {
  return (
    <HeroCard
      variant="default"
      style={{ width, height: comparisonHeaderHeight }}
      className="rounded-[15px] border border-border-subtle bg-surface-default px-2 py-2.5"
    >
      <View className="w-full items-center gap-1.5">
        <View className="w-full flex-row items-center justify-between">
          <View className="h-8 w-8" />
          <ProviderAvatar providerId={doctor.id} size={44} />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={'إزالة ' + doctor.name + ' من المقارنة'}
            hitSlop={5}
            className="h-8 w-8 items-center justify-center rounded-full border border-border-subtle bg-surface-subtle"
            onPress={onRemove}
          >
            <AppIcon
              name={{ ios: 'xmark', android: 'close', web: 'close' }}
              tone="secondary"
              size={15}
            />
          </Pressable>
        </View>
        <AppText align="center" variant="label" className="w-full font-ui-bold" numberOfLines={2}>
          {doctor.name}
        </AppText>
        <AppText
          align="center"
          variant="caption"
          className="w-full text-content-secondary"
          numberOfLines={2}
        >
          {doctor.specialty}
        </AppText>
        <View className="w-full gap-1.5 pt-1">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={'عرض ملف ' + doctor.name}
            className="min-h-[38px] flex-row-reverse items-center justify-center gap-1 rounded-[10px] border border-action-primary/55 bg-surface-default px-1.5"
            onPress={onViewProfile}
          >
            <AppIcon
              name={{ ios: 'person.crop.circle', android: 'account_circle', web: 'account_circle' }}
              size={16}
              tone="action"
            />
            <AppText
              align="center"
              variant="caption"
              className="font-ui-semibold text-content-link"
            >
              عرض الملف
            </AppText>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={'اختيار ' + doctor.name + ' للحجز'}
            className="min-h-[38px] items-center justify-center rounded-[10px] bg-action-primary px-1"
            onPress={onChoose}
          >
            <AppText
              align="center"
              variant="caption"
              className="font-ui-bold text-content-on-action"
            >
              اختيار الطبيب
            </AppText>
          </Pressable>
        </View>
      </View>
    </HeroCard>
  );
}

/** Values alone scroll vertically; the doctor heading always stays visible. */
export function ProviderComparisonDoctorRows({
  doctor,
  serviceCode,
  width,
}: {
  doctor: ComparisonDoctor;
  serviceCode: string;
  width: number;
}) {
  const facts = getComparisonFacts(doctor, serviceCode);
  return (
    <View style={{ width }} className="gap-2">
      {comparisonRowDefinitions.map((row) => (
        <View
          key={row.key}
          style={{ height: row.height }}
          className="items-center justify-center rounded-[11px] border border-border-subtle bg-surface-subtle px-1.5 py-2"
        >
          <ComparisonValue kind={row.key} facts={facts} />
        </View>
      ))}
    </View>
  );
}
