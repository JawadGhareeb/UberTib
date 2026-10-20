import { useEffect, useState } from 'react';
import { ScrollView, View, Pressable, useWindowDimensions } from 'react-native';
import { BottomSheet, Button as HeroButton } from 'heroui-native';

import {
  findPenFamily,
  findPenGroup,
  penServiceGroups,
} from '@/features/discovery/presentation/pen-discovery-data';
import { AppIcon, AppText } from '@/shared/components/ui';
import {
  priceLimitsForSelection,
  selectedDiscoveryAreas,
  withSelectedDiscoveryAreas,
  type DiscoveryFilterSelection,
  type PriceRange,
} from '../model/discover-filters';
import { DiscoverAppliedFilterChips } from './discover-applied-filter-chips';
import {
  FilterAreaChoices,
  FilterFamilyChoices,
  FilterGroupChoices,
  FilterNavigationRow,
} from './discover-filter-choices';
import { DiscoverInlinePriceRange } from './discover-inline-price-range';
import { ProviderAdvancedFilterOptions } from './provider-advanced-filter-options';
import { ProviderSortOptions } from './provider-sort-options';
import type { ProviderResultSort } from '../utils/provider-sort';
import { defaultProviderFilters, type ProviderFilterFlags } from '../utils/provider-filters';

type FilterStep = 'main' | 'area' | 'groups' | 'families';

/**
 * A single shared HeroUI Native sheet for Discover and provider results.
 * Only region and service selection navigate within the sheet; the range slider
 * is directly accessible in the main step and is scoped to a concrete service.
 */
export function DiscoverFilterSheet({
  open,
  onOpenChange,
  selection,
  onApply,
  limits: resultPriceLimits,
  serviceSelectionEnabled = false,
  providerFilters,
  providerSort,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selection: DiscoveryFilterSelection;
  onApply: (
    selection: DiscoveryFilterSelection,
    providerFilters?: ProviderFilterFlags,
    sort?: ProviderResultSort,
  ) => void;
  limits?: PriceRange | null;
  serviceSelectionEnabled?: boolean;
  /** Provider results only; ordinary Discover search keeps its existing sheet. */
  providerFilters?: ProviderFilterFlags;
  providerSort?: ProviderResultSort;
}) {
  const { height } = useWindowDimensions();
  const [step, setStep] = useState<FilterStep>('main');
  const [draft, setDraft] = useState<DiscoveryFilterSelection>(selection);
  const [draftProviderFilters, setDraftProviderFilters] = useState<ProviderFilterFlags>(
    providerFilters ?? defaultProviderFilters,
  );
  const [draftSort, setDraftSort] = useState<ProviderResultSort>(providerSort ?? 'default');

  // The sheet stays mounted even when closed so HeroUI's closed -> open animation
  // works. Synchronize draft with changes made to the applied chips while closed.
  useEffect(() => {
    if (!open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDraft(selection);
      setDraftProviderFilters(providerFilters ?? defaultProviderFilters);
      setDraftSort(providerSort ?? 'default');
    }
  }, [open, selection, providerFilters, providerSort]);

  const group = findPenGroup(draft.groupCode ?? undefined);
  const family = findPenFamily(draft.serviceCode ?? undefined);
  const scopedLimits = serviceSelectionEnabled ? priceLimitsForSelection(draft) : resultPriceLimits;
  // Keep the control visible even when a chosen service is only priced after
  // examination; use the catalog range as an explicitly labeled fallback.
  const limits =
    providerFilters && !serviceSelectionEnabled
      ? (resultPriceLimits ?? null)
      : (scopedLimits ??
        priceLimitsForSelection({
          area: 'كل المناطق',
          priceRange: null,
        }));
  const selectedAreas = selectedDiscoveryAreas(draft);
  const range = limits ? draft.priceRange : null;

  const changeDraft = (next: DiscoveryFilterSelection) => {
    setDraft(next);
    if (step === 'families' && !next.groupCode) setStep('groups');
  };
  const chooseGroup = (groupCode: string) => {
    setDraft((current) => ({ ...current, groupCode, serviceCode: null, priceRange: null }));
    setStep('families');
  };
  const chooseFamily = (serviceCode: string | null) => {
    setDraft((current) => ({ ...current, serviceCode, priceRange: null }));
    setStep('main');
  };
  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) setStep('main');
    onOpenChange(nextOpen);
  };
  const apply = () => {
    onApply(
      {
        ...draft,
        priceRange: range,
        ...(serviceSelectionEnabled
          ? {}
          : { groupCode: selection.groupCode, serviceCode: selection.serviceCode }),
      },
      providerFilters ? draftProviderFilters : undefined,
      providerFilters ? draftSort : undefined,
    );
    handleOpenChange(false);
  };
  const reset = () => {
    setDraft({
      area: 'كل المناطق',
      areas: [],
      priceRange: null,
      ...(serviceSelectionEnabled ? { groupCode: null, serviceCode: null } : {}),
    });
    setDraftProviderFilters({ ...defaultProviderFilters });
    setDraftSort('default');
    setStep('main');
  };

  return (
    <BottomSheet isOpen={open} onOpenChange={handleOpenChange}>
      <BottomSheet.Portal>
        <BottomSheet.Overlay />
        <BottomSheet.Content contentContainerClassName="gap-3 bg-surface-default px-4 pb-7 pt-3">
          <View className="gap-2.5">
            <View className="min-h-[44px] flex-row-reverse items-center justify-between gap-2">
              <View className="min-w-0 flex-1 flex-row-reverse items-center gap-2">
                {step !== 'main' ? (
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="رجوع داخل الفلاتر"
                    className="h-10 w-10 items-center justify-center rounded-full bg-action-subtle"
                    onPress={() => setStep(step === 'families' ? 'groups' : 'main')}
                  >
                    <AppIcon
                      name={{
                        ios: 'chevron.right',
                        android: 'chevron_right',
                        web: 'chevron_right',
                      }}
                      size={20}
                      tone="action"
                    />
                  </Pressable>
                ) : null}
                <BottomSheet.Title className="font-ui-semibold text-content-primary">
                  {providerFilters ? 'تصفية الأطباء' : 'تصفية البحث'}
                </BottomSheet.Title>
              </View>
              <BottomSheet.Close />
            </View>
            <DiscoverAppliedFilterChips selection={draft} onChange={changeDraft} />
          </View>

          <ScrollView
            nestedScrollEnabled
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            style={{ maxHeight: Math.max(220, height * 0.55) }}
            contentContainerStyle={{ gap: 12, paddingBottom: 6 }}
          >
            {step === 'main' ? (
              <View className="gap-3">
                {providerFilters ? (
                  <ProviderSortOptions value={draftSort} onChange={setDraftSort} />
                ) : null}
                <FilterNavigationRow
                  icon={{ ios: 'mappin.and.ellipse', android: 'place', web: 'place' }}
                  title="الموقع"
                  detail={
                    selectedAreas.length === 0
                      ? 'كل مناطق حلب'
                      : selectedAreas.length === 1
                        ? (selectedAreas[0] ?? 'كل مناطق حلب')
                        : selectedAreas.length + ' مناطق مختارة'
                  }
                  onPress={() => setStep('area')}
                />
                {serviceSelectionEnabled ? (
                  <FilterNavigationRow
                    icon={{
                      ios: 'stethoscope',
                      android: 'medical_services',
                      web: 'medical_services',
                    }}
                    title="الخدمات"
                    detail={family?.title ?? group?.title ?? 'كل الخدمات'}
                    onPress={() => setStep(draft.groupCode ? 'families' : 'groups')}
                  />
                ) : null}
                <View className="mt-1 border-t border-border-subtle pt-3">
                  {limits ? (
                    <DiscoverInlinePriceRange
                      limits={limits}
                      value={range}
                      usingCatalogLimits={scopedLimits === null || scopedLimits === undefined}
                      onChange={(priceRange) => setDraft((current) => ({ ...current, priceRange }))}
                    />
                  ) : (
                    <AppText align="right" variant="caption" className="text-content-secondary">
                      ما في نطاق سعر رقمي معلن لهالخدمة حالياً.
                    </AppText>
                  )}
                </View>
                {providerFilters ? (
                  <ProviderAdvancedFilterOptions
                    value={draftProviderFilters}
                    onChange={setDraftProviderFilters}
                  />
                ) : null}
              </View>
            ) : null}

            {step === 'area' ? (
              <View className="gap-3">
                <AppText align="right" variant="body-strong">
                  اختار المنطقة
                </AppText>
                <FilterAreaChoices
                  values={selectedAreas}
                  onChange={(areas) => {
                    setDraft((current) => withSelectedDiscoveryAreas(current, areas));
                  }}
                />
              </View>
            ) : null}

            {step === 'groups' ? (
              <View className="gap-3">
                <AppText align="right" variant="body-strong">
                  استكشف مجالات الأسنان
                </AppText>
                <FilterGroupChoices
                  groups={penServiceGroups}
                  selected={draft.groupCode ?? null}
                  onSelect={chooseGroup}
                  onAll={() => {
                    setDraft((current) => ({
                      ...current,
                      groupCode: null,
                      serviceCode: null,
                      priceRange: null,
                    }));
                    setStep('main');
                  }}
                />
              </View>
            ) : null}

            {step === 'families' && group ? (
              <View className="gap-3">
                <AppText align="right" variant="body-strong">
                  {group.title}
                </AppText>
                <FilterFamilyChoices
                  groupTitle={group.title}
                  families={group.families}
                  selected={draft.serviceCode ?? null}
                  onSelect={chooseFamily}
                />
              </View>
            ) : null}
          </ScrollView>

          <View className="flex-row-reverse gap-2 pt-2">
            <HeroButton
              variant="primary"
              className="min-h-[48px] flex-1 rounded-[12px] bg-action-primary"
              onPress={apply}
            >
              <HeroButton.Label className="font-ui-semibold text-content-on-action">
                عرض النتائج
              </HeroButton.Label>
            </HeroButton>
            <HeroButton
              variant="outline"
              className="min-h-[48px] flex-1 rounded-[12px]"
              onPress={reset}
            >
              <HeroButton.Label>إعادة تعيين</HeroButton.Label>
            </HeroButton>
          </View>
        </BottomSheet.Content>
      </BottomSheet.Portal>
    </BottomSheet>
  );
}
