import { useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, ScrollView, View } from 'react-native';
import { useCareDrafts } from '@/features/my-care/state/care-draft-provider';

import { AppHeader } from '@/shared/components/navigation';
import { PATIENT_TAB_BAR_HEIGHT } from '@/shared/components/navigation/patient-tab-metrics';
import { AppText, Screen } from '@/shared/components/ui';

import { CareAdvancedFilterSheet } from '../components/care-advanced-filter-sheet';
import { CareBookingsContent, CareCasesContent } from '../components/care-tab-content';
import { CareMainTabs } from '../components/care-main-tabs';
import { CareOverviewIntro } from '../components/care-overview-intro';
import { CareAppliedFilterChips } from '../components/care-applied-filter-chips';
import { useCareOverviewRecords } from '../hooks/use-care-overview-records';
import { partitionCareRecords } from '../model/care-overview-view';
import {
  bookingAdvancedLabels,
  caseAdvancedLabels,
  defaultBookingAdvanced,
  defaultCaseAdvanced,
  filterBookingRecords,
  filterCaseRecords,
  type BookingAdvancedFilters,
  type CaseAdvancedFilters,
  type CareBookingQuickFilter,
  type CareCaseQuickFilter,
  type CareMainTab,
} from '../model/care-tab-filters';

const unique = (items: string[]) => [...new Set(items)].sort((a, b) => a.localeCompare(b, 'ar'));

export function MyCasesOverviewScreen() {
  const { tab: requestedTab } = useLocalSearchParams<{ tab?: string }>();
  const router = useRouter();
  const { drafts, removeDraft, hydrated, persistError } = useCareDrafts();
  const { records, bookingState, careState } = useCareOverviewRecords();
  const { cases, bookings } = partitionCareRecords(records);

  const [manualTab, setManualTab] = useState<CareMainTab>(() =>
    cases.some((item) => item.progress < 100) ? 'cases' : 'bookings',
  );
  // Explicit navigation params win over previous local selections. Manual
  // switches clear that one-shot intent so both tabs remain interactive.
  const tab: CareMainTab =
    requestedTab === 'cases' || requestedTab === 'bookings' ? requestedTab : manualTab;
  const changeTab = (next: CareMainTab) => {
    setManualTab(next);
    if (requestedTab) router.setParams({ tab: undefined });
  };

  const [caseQuick, setCaseQuick] = useState<CareCaseQuickFilter>('الكل');
  const [bookingQuick, setBookingQuick] = useState<CareBookingQuickFilter>('الكل');
  const [caseAdvanced, setCaseAdvanced] = useState<CaseAdvancedFilters>(defaultCaseAdvanced);
  const [bookingAdvanced, setBookingAdvanced] =
    useState<BookingAdvancedFilters>(defaultBookingAdvanced);
  const [caseDraft, setCaseDraft] = useState<CaseAdvancedFilters>(defaultCaseAdvanced);
  const [bookingDraft, setBookingDraft] = useState<BookingAdvancedFilters>(defaultBookingAdvanced);
  const [caseQuickDraft, setCaseQuickDraft] = useState<CareCaseQuickFilter>('الكل');
  const [bookingQuickDraft, setBookingQuickDraft] = useState<CareBookingQuickFilter>('الكل');
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filteredCases =
    caseQuick === 'مسودة' ? [] : filterCaseRecords(cases, caseQuick, caseAdvanced);
  const filteredBookings = filterBookingRecords(bookings, bookingQuick, bookingAdvanced);
  const casesActive = caseQuick !== 'الكل' || caseAdvancedLabels(caseAdvanced).length > 0;
  const bookingsActive =
    bookingQuick !== 'الكل' || bookingAdvancedLabels(bookingAdvanced).length > 0;
  const showCases = tab === 'cases';
  const options = showCases
    ? {
        providers: unique(cases.map((item) => item.provider)),
        clinics: unique(cases.map((item) => item.branch)),
        patients: [] as string[],
      }
    : {
        providers: unique(bookings.map((item) => item.providerName)),
        clinics: unique(bookings.map((item) => item.branch)),
        patients: unique(bookings.map((item) => item.patientName)),
      };

  const openFilters = () => {
    setCaseQuickDraft(caseQuick);
    setBookingQuickDraft(bookingQuick);
    setCaseDraft({ ...caseAdvanced });
    setBookingDraft({ ...bookingAdvanced });
    setFiltersOpen(true);
  };
  const applyFilters = () => {
    if (showCases) {
      setCaseQuick(caseQuickDraft);
      setCaseAdvanced(caseDraft);
    } else {
      setBookingQuick(bookingQuickDraft);
      setBookingAdvanced(bookingDraft);
    }
    setFiltersOpen(false);
  };

  return (
    <Screen contentClassName="px-0 py-0" header={<AppHeader variant="primary" title="علاجي" />}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerClassName="mx-auto w-full max-w-[430px] gap-4 pt-4"
        contentContainerStyle={{ paddingBottom: PATIENT_TAB_BAR_HEIGHT + 44 }}
        showsVerticalScrollIndicator={false}
      >
        <CareOverviewIntro />
        <CareMainTabs
          selected={tab}
          onChange={changeTab}
          onOpenFilters={openFilters}
          filtersActive={showCases ? casesActive : bookingsActive}
        />
        <CareAppliedFilterChips
          inset
          tab={tab}
          caseQuick={caseQuick}
          bookingQuick={bookingQuick}
          caseFilters={caseAdvanced}
          bookingFilters={bookingAdvanced}
          onCaseQuickChange={setCaseQuick}
          onBookingQuickChange={setBookingQuick}
          onCaseChange={setCaseAdvanced}
          onBookingChange={setBookingAdvanced}
          onClearAll={() => {
            if (showCases) {
              setCaseQuick('الكل');
              setCaseAdvanced(defaultCaseAdvanced);
            } else {
              setBookingQuick('الكل');
              setBookingAdvanced(defaultBookingAdvanced);
            }
          }}
        />
        {showCases && !hydrated ? (
          <AppText align="right" variant="caption" className="px-4 text-content-secondary">
            عم نسترجع مسوداتك المحفوظة...
          </AppText>
        ) : null}
        {showCases && persistError ? (
          <AppText align="right" variant="caption" className="px-4 text-tone-danger-text">
            تعذّر مزامنة المسودات مع تخزين الجهاز. تأكد من مساحة التخزين وحاول مرة ثانية.
          </AppText>
        ) : null}
        {showCases && caseQuick === 'مسودة' && hydrated && drafts.length === 0 ? (
          <AppText align="right" variant="label" className="px-4 text-content-secondary">
            ما عندك خطوات محفوظة لإكمالها لاحقاً.
          </AppText>
        ) : null}
        {showCases && (caseQuick === 'الكل' || caseQuick === 'مسودة') && drafts.length > 0 ? (
          <View className="gap-2 px-4">
            <AppText variant="heading-4" className="font-ui-bold">
              مسوداتك ({drafts.length})
            </AppText>
            {[...drafts]
              .sort((a, b) => b.updatedAt - a.updatedAt)
              .map((draft) => (
                <View
                  key={draft.id}
                  className="gap-2 rounded-[14px] border border-border-subtle bg-surface-default p-3"
                >
                  <AppText variant="label" className="font-ui-bold">
                    {draft.title}
                  </AppText>
                  <AppText variant="caption" className="text-content-secondary">
                    {draft.detail} · مسودة
                  </AppText>
                  <View className="flex-row-reverse gap-2">
                    <Pressable
                      accessibilityRole="button"
                      className="flex-1 items-center rounded-[10px] bg-action-primary p-3"
                      onPress={() =>
                        router.push({
                          pathname:
                            draft.kind === 'assessment' && !draft.assessment
                              ? '/assessment/start'
                              : draft.route,
                          params: {
                            ...(draft.params ?? {}),
                            ...(draft.kind === 'assessment' && draft.assessment
                              ? { resumeDraftId: draft.id }
                              : {}),
                          },
                        })
                      }
                    >
                      <AppText variant="label" className="text-content-on-action">
                        متابعة من حيث توقفت
                      </AppText>
                    </Pressable>
                    <Pressable
                      accessibilityRole="button"
                      className="items-center rounded-[10px] border border-border-subtle p-3"
                      onPress={() => removeDraft(draft.id)}
                    >
                      <AppText variant="label">حذف</AppText>
                    </Pressable>
                  </View>
                </View>
              ))}
          </View>
        ) : null}
        {showCases && caseQuick === 'مسودة' ? null : showCases ? (
          <CareCasesContent cases={filteredCases} state={careState} filterActive={casesActive} />
        ) : (
          <CareBookingsContent
            bookings={filteredBookings}
            state={bookingState}
            filterActive={bookingsActive}
          />
        )}
      </ScrollView>
      <CareAdvancedFilterSheet
        open={filtersOpen}
        tab={tab}
        options={options}
        caseDraft={caseDraft}
        bookingDraft={bookingDraft}
        caseQuickDraft={caseQuickDraft}
        bookingQuickDraft={bookingQuickDraft}
        onCaseQuickDraft={setCaseQuickDraft}
        onBookingQuickDraft={setBookingQuickDraft}
        onCaseDraft={setCaseDraft}
        onBookingDraft={setBookingDraft}
        onOpenChange={setFiltersOpen}
        onApply={applyFilters}
      />
    </Screen>
  );
}
