import { Accordion, Chip } from 'heroui-native';
import { Pressable, View } from 'react-native';

import { ServiceIcon } from '@/features/discovery/components/service-icon';
import {
  type PenServiceFamily,
  type PenServiceGroup,
} from '@/features/discovery/presentation/pen-discovery-data';
import { AppIcon, AppText, type AppIconName } from '@/shared/components/ui';
import { discoverAreas } from '../model/discover-filters';

const groupIcons = {
  G01: 'implant',
  G02: 'crowns',
  G03: 'root-canal',
  G04: 'dental-checkup',
} as const;

export function FilterNavigationRow({
  title,
  detail,
  icon,
  onPress,
}: {
  title: string;
  detail: string;
  icon: AppIconName;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title + '، ' + detail}
      className="min-h-[62px] flex-row-reverse items-center gap-3 rounded-[14px] bg-surface-subtle px-3 py-2.5"
      onPress={onPress}
    >
      <View className="h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-action-subtle">
        <AppIcon name={icon} size={20} tone="action" />
      </View>
      <View className="min-w-0 flex-1 items-end gap-1">
        <AppText align="right" variant="label" className="font-ui-semibold">
          {title}
        </AppText>
        <AppText
          align="right"
          variant="caption"
          className="text-content-secondary"
          numberOfLines={2}
        >
          {detail}
        </AppText>
      </View>
      <AppIcon
        name={{ ios: 'chevron.left', android: 'chevron_left', web: 'chevron_left' }}
        size={17}
        tone="secondary"
      />
    </Pressable>
  );
}

export function FilterAreaChoices({
  values,
  onChange,
}: {
  values: string[];
  onChange: (areas: string[]) => void;
}) {
  return (
    <View className="gap-3">
      <AppText align="right" variant="caption" className="text-content-secondary">
        فيك تختار أكتر من منطقة
      </AppText>
      <View className="flex-row-reverse flex-wrap gap-2">
        {discoverAreas.map((area) => {
          const isAll = area === 'كل المناطق';
          const selected = isAll ? values.length === 0 : values.includes(area);
          return (
            <Chip
              key={area}
              variant={selected ? 'primary' : 'soft'}
              color={selected ? 'accent' : 'default'}
              size="lg"
              accessibilityRole="checkbox"
              accessibilityState={{ checked: selected }}
              accessibilityLabel={isAll ? 'كل مناطق حلب' : area}
              className="min-h-[44px]"
              onPress={() =>
                onChange(
                  isAll
                    ? []
                    : selected
                      ? values.filter((item) => item !== area)
                      : [...values, area],
                )
              }
            >
              <Chip.Label>{isAll ? 'كل مناطق حلب' : area}</Chip.Label>
            </Chip>
          );
        })}
      </View>
    </View>
  );
}

/**
 * Groups expand in place; service selection is no longer a second modal screen.
 * The group icon sits directly beside its Arabic label in the accordion header.
 */
export function FilterGroupChoices({
  groups,
  selected,
  selectedFamily,
  onSelect,
  onAll,
}: {
  groups: readonly PenServiceGroup[];
  selected: string | null;
  selectedFamily: string | null;
  onSelect: (groupCode: string, serviceCode: string | null) => void;
  onAll: () => void;
}) {
  return (
    <View className="gap-3">
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ selected: selected === null }}
        onPress={onAll}
        className={
          'min-h-[48px] flex-row-reverse items-center justify-between rounded-[12px] border px-3 ' +
          (selected === null
            ? 'border-state-selected-border bg-action-subtle'
            : 'border-border-subtle bg-surface-subtle')
        }
      >
        <AppText variant="label" className="font-ui-medium">
          جميع الخدمات
        </AppText>
        {selected === null ? (
          <AppIcon
            name={{ ios: 'checkmark.circle.fill', android: 'check_circle', web: 'check_circle' }}
            size={19}
            tone="action"
          />
        ) : null}
      </Pressable>
      <Accordion
        selectionMode="single"
        isCollapsible
        defaultValue={selected ?? undefined}
        variant="default"
        className="overflow-hidden rounded-[14px] border border-border-subtle bg-surface-default"
      >
        {groups.map((group) => (
          <Accordion.Item key={group.code} value={group.code}>
            <Accordion.Trigger className="min-h-[67px] flex-row-reverse items-center gap-2.5 px-3 py-2.5">
              <View className="h-10 w-10 shrink-0 items-center justify-center rounded-[11px] bg-action-subtle">
                <ServiceIcon serviceId={groupIcons[group.code]} size={27} />
              </View>
              <View className="min-w-0 flex-1 items-end gap-0.5">
                <AppText
                  align="right"
                  variant="label"
                  className="w-full font-ui-semibold"
                  numberOfLines={2}
                >
                  {group.title}
                </AppText>
                <AppText align="right" variant="caption" className="text-content-secondary">
                  {group.families.length} خدمات
                </AppText>
              </View>
              {selected === group.code ? (
                <AppIcon
                  name={{
                    ios: 'checkmark.circle.fill',
                    android: 'check_circle',
                    web: 'check_circle',
                  }}
                  size={18}
                  tone="action"
                />
              ) : null}
              <Accordion.Indicator />
            </Accordion.Trigger>
            <Accordion.Content className="px-2 pb-3">
              <FilterFamilyChoices
                groupTitle={group.title}
                families={group.families}
                selected={selected === group.code ? selectedFamily : null}
                onSelect={(serviceCode) => onSelect(group.code, serviceCode)}
              />
            </Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion>
    </View>
  );
}

export function FilterFamilyChoices({
  families,
  selected,
  groupTitle,
  onSelect,
}: {
  families: readonly PenServiceFamily[];
  selected: string | null;
  groupTitle: string;
  onSelect: (code: string | null) => void;
}) {
  return (
    <View className="gap-0.5">
      <FamilyLine
        title={'جميع أقسام ' + groupTitle}
        selected={selected === null}
        onPress={() => onSelect(null)}
      />
      {families.map((family) => (
        <FamilyLine
          key={family.id}
          title={family.title}
          selected={family.id === selected}
          onPress={() => onSelect(family.id)}
        />
      ))}
    </View>
  );
}

function FamilyLine({
  title,
  selected,
  onPress,
}: {
  title: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      className={
        'min-h-[52px] flex-row-reverse items-center justify-between gap-3 rounded-[10px] px-3 py-2 ' +
        (selected ? 'bg-action-subtle' : '')
      }
    >
      <AppText align="right" variant="label" className="min-w-0 flex-1 font-ui-medium">
        {title}
      </AppText>
      <AppIcon
        name={
          selected
            ? {
                ios: 'largecircle.fill.circle',
                android: 'radio_button_checked',
                web: 'radio_button_checked',
              }
            : { ios: 'circle', android: 'radio_button_unchecked', web: 'radio_button_unchecked' }
        }
        tone={selected ? 'action' : 'secondary'}
        size={20}
      />
    </Pressable>
  );
}
