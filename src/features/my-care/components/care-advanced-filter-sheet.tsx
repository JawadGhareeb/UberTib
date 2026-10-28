import { BottomSheet, Button as HeroButton, Chip } from 'heroui-native';
import { ScrollView, View, useWindowDimensions } from 'react-native';
import { AppText } from '@/shared/components/ui';
import { CareBookingDateFilter } from './care-booking-date-filter';
import { CareAppliedFilterChips } from './care-applied-filter-chips';
import {
  defaultBookingAdvanced,
  defaultCaseAdvanced,
  type BookingAdvancedFilters,
  type CaseAdvancedFilters,
  type CareMainTab,
  type CareBookingQuickFilter,
  type CareCaseQuickFilter,
  bookingQuickFilters,
  caseQuickFilters,
} from '../model/care-tab-filters';

type FilterOptions = { providers: string[]; clinics: string[]; patients: string[] };
const bookingStatus = [
  { key: 'all', label: 'كل الحالات' },
  { key: 'confirmed', label: 'مؤكد' },
  { key: 'pending', label: 'بانتظار التأكيد' },
  { key: 'completed', label: 'مكتمل' },
  { key: 'cancelled', label: 'ملغى' },
] as const;
const bookingPeriods = [
  { key: 'all', label: 'كل الفترات' },
  { key: 'future', label: 'القادمة' },
  { key: 'past', label: 'السابقة' },
] as const;

function FilterOptionsRow<T extends string>({
  title,
  choices,
  selected,
  onChange,
}: {
  title: string;
  choices: readonly { key: T; label: string }[];
  selected: T;
  onChange: (value: T) => void;
}) {
  return (
    <View className="gap-2">
      <AppText align="right" variant="label" className="font-ui-semibold">
        {title}
      </AppText>
      <View className="flex-row-reverse flex-wrap gap-2">
        {choices.map((choice) => (
          <Chip
            key={choice.key}
            color={choice.key === selected ? 'accent' : 'default'}
            variant={choice.key === selected ? 'primary' : 'soft'}
            size="lg"
            accessibilityRole="button"
            accessibilityState={{ selected: choice.key === selected }}
            onPress={() => onChange(choice.key)}
          >
            <Chip.Label>{choice.label}</Chip.Label>
          </Chip>
        ))}
      </View>
    </View>
  );
}
const optionalChoices = (items: readonly string[]) => [
  { key: '', label: 'الكل' },
  ...items.map((item) => ({ key: item, label: item })),
];

export function CareAdvancedFilterSheet({
  open,
  tab,
  options,
  caseDraft,
  bookingDraft,
  caseQuickDraft,
  bookingQuickDraft,
  onCaseQuickDraft,
  onBookingQuickDraft,
  onCaseDraft,
  onBookingDraft,
  onOpenChange,
  onApply,
}: {
  open: boolean;
  tab: CareMainTab;
  options: FilterOptions;
  caseDraft: CaseAdvancedFilters;
  bookingDraft: BookingAdvancedFilters;
  caseQuickDraft: CareCaseQuickFilter;
  bookingQuickDraft: CareBookingQuickFilter;
  onCaseQuickDraft: (value: CareCaseQuickFilter) => void;
  onBookingQuickDraft: (value: CareBookingQuickFilter) => void;
  onCaseDraft: (filters: CaseAdvancedFilters) => void;
  onBookingDraft: (filters: BookingAdvancedFilters) => void;
  onOpenChange: (open: boolean) => void;
  onApply: () => void;
}) {
  const { height } = useWindowDimensions();
  return (
    <BottomSheet isOpen={open} onOpenChange={onOpenChange}>
      <BottomSheet.Portal>
        <BottomSheet.Overlay />
        <BottomSheet.Content contentContainerClassName="gap-3 bg-surface-default px-4 pb-7 pt-3">
          <View className="min-h-[44px] flex-row-reverse items-center justify-between gap-2">
            <BottomSheet.Title className="font-ui-semibold text-content-primary">
              {tab === 'cases' ? 'تصفية الحالات العلاجية' : 'تصفية الحجوزات'}
            </BottomSheet.Title>
            <BottomSheet.Close />
          </View>
          <CareAppliedFilterChips
            tab={tab}
            caseQuick={caseQuickDraft}
            bookingQuick={bookingQuickDraft}
            caseFilters={caseDraft}
            bookingFilters={bookingDraft}
            onCaseQuickChange={onCaseQuickDraft}
            onBookingQuickChange={onBookingQuickDraft}
            onCaseChange={onCaseDraft}
            onBookingChange={onBookingDraft}
          />
          <ScrollView
            nestedScrollEnabled
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            style={{ maxHeight: Math.max(240, height * 0.54) }}
            contentContainerStyle={{ gap: 18, paddingBottom: 8 }}
          >
            {tab === 'cases' ? (
              <>
                <FilterOptionsRow
                  title="حالة العلاج"
                  choices={caseQuickFilters.map((key) => ({ key, label: key }))}
                  selected={caseQuickDraft}
                  onChange={onCaseQuickDraft}
                />
                <FilterOptionsRow
                  title="الطبيب"
                  choices={optionalChoices(options.providers)}
                  selected={caseDraft.provider}
                  onChange={(provider) => onCaseDraft({ ...caseDraft, provider })}
                />
                <FilterOptionsRow
                  title="العيادة أو المركز"
                  choices={optionalChoices(options.clinics)}
                  selected={caseDraft.clinic}
                  onChange={(clinic) => onCaseDraft({ ...caseDraft, clinic })}
                />
              </>
            ) : (
              <>
                <FilterOptionsRow
                  title="عرض الحجوزات"
                  choices={bookingQuickFilters.map((key) => ({ key, label: key }))}
                  selected={bookingQuickDraft}
                  onChange={(next) => {
                    onBookingQuickDraft(next);
                    if (next !== 'الكل') {
                      onBookingDraft({ ...bookingDraft, status: 'all', period: 'all' });
                    }
                  }}
                />
                <FilterOptionsRow
                  title="حالة الحجز"
                  choices={bookingStatus}
                  selected={bookingDraft.status}
                  onChange={(status) => {
                    onBookingQuickDraft('الكل');
                    onBookingDraft({ ...bookingDraft, status });
                  }}
                />
                <FilterOptionsRow
                  title="الفترة"
                  choices={bookingPeriods}
                  selected={bookingDraft.period}
                  onChange={(period) => {
                    onBookingQuickDraft('الكل');
                    onBookingDraft({ ...bookingDraft, period });
                  }}
                />
                <CareBookingDateFilter value={bookingDraft} onChange={onBookingDraft} />
                <FilterOptionsRow
                  title="الطبيب"
                  choices={optionalChoices(options.providers)}
                  selected={bookingDraft.provider}
                  onChange={(provider) => onBookingDraft({ ...bookingDraft, provider })}
                />
                <FilterOptionsRow
                  title="العيادة أو المركز"
                  choices={optionalChoices(options.clinics)}
                  selected={bookingDraft.clinic}
                  onChange={(clinic) => onBookingDraft({ ...bookingDraft, clinic })}
                />
                {options.patients.length > 1 ? (
                  <FilterOptionsRow
                    title="صاحب الحجز"
                    choices={optionalChoices(options.patients)}
                    selected={bookingDraft.patient}
                    onChange={(patient) => onBookingDraft({ ...bookingDraft, patient })}
                  />
                ) : null}
              </>
            )}
          </ScrollView>
          <View className="flex-row-reverse gap-2 pt-2">
            <HeroButton
              variant="primary"
              className="min-h-[48px] flex-1 rounded-[12px] bg-action-primary"
              onPress={onApply}
            >
              <HeroButton.Label
                className="w-full font-ui-semibold text-content-on-action"
                style={{ textAlign: 'center', writingDirection: 'rtl' }}
              >
                عرض النتائج
              </HeroButton.Label>
            </HeroButton>
            <HeroButton
              variant="outline"
              className="min-h-[48px] flex-1 rounded-[12px]"
              onPress={() => {
                if (tab === 'cases') {
                  onCaseQuickDraft('الكل');
                  onCaseDraft(defaultCaseAdvanced);
                } else {
                  onBookingQuickDraft('الكل');
                  onBookingDraft(defaultBookingAdvanced);
                }
              }}
            >
              <HeroButton.Label
                className="w-full"
                style={{ textAlign: 'center', writingDirection: 'rtl' }}
              >
                إعادة تعيين
              </HeroButton.Label>
            </HeroButton>
          </View>
        </BottomSheet.Content>
      </BottomSheet.Portal>
    </BottomSheet>
  );
}
