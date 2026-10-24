import { useLocalSearchParams, useRouter } from 'expo-router';
import { Radio, RadioGroup } from 'heroui-native';
import { useEffect, useMemo, useState } from 'react';
import { ScrollView, View } from 'react-native';

import { useCareDrafts } from '@/features/my-care/state/care-draft-provider';
import { createBookingCareDraft } from '@/features/booking/utils/booking-care-draft';
import { BookingSaveLaterAction } from '@/features/booking/components/booking-save-later-action';
import { BookingJourneyProgress } from '@/features/booking/components/booking-journey-progress';
import { BookingHeader } from '@/features/booking/components/booking-v5-ui';
import { canBookForPatient } from '@/features/booking/utils/patient-booking-permissions';
import {
  getMockProvider,
  getNonPastMockAvailability,
} from '@/features/discovery/mocks/providers.mock';
import { useFamilyMembers } from '@/features/profile/state/family-members-provider';
import { AppIcon, AppText, Button, Screen, StateView } from '@/shared/components/ui';
import { useMockScenario } from '@/shared/mock';

export function BookingPatientSelectionScreen() {
  const router = useRouter();
  const { saveDraft, hydrated } = useCareDrafts();
  const { scenario } = useMockScenario();
  const { members } = useFamilyMembers();
  const {
    providerId,
    serviceCode,
    dateKey,
    dateLabel,
    timeLabel,
    patientId,
    origin,
    assessmentDraftId,
    branchId,
    priceAtSelection,
  } = useLocalSearchParams<{
    providerId?: string;
    serviceCode?: string;
    dateKey?: string;
    dateLabel?: string;
    timeLabel?: string;
    patientId?: string;
    origin?: string;
    assessmentDraftId?: string;
    branchId?: string;
    priceAtSelection?: string;
  }>();
  const provider = getMockProvider(providerId);
  const chosenDay = getNonPastMockAvailability(provider?.availability ?? []).find(
    (day) => day.dateKey === dateKey,
  );
  const validSlot = Boolean(
    provider?.serviceCodes.includes(serviceCode ?? '') &&
    chosenDay?.dateLabel === dateLabel &&
    chosenDay?.slots.includes(timeLabel ?? ''),
  );
  const [selectedId, setSelectedId] = useState(
    patientId && members.some((member) => member.id === patientId) ? patientId : 'patient-001',
  );
  const bookingFields = useMemo(
    () => ({
      providerId: providerId ?? '',
      serviceCode: serviceCode ?? '',
      ...(branchId ? { branchId } : {}),
      ...(priceAtSelection ? { priceAtSelection } : {}),
      dateKey,
      dateLabel,
      timeLabel,
      patientId: selectedId,
      ...(origin === 'assessment' ? { origin: 'assessment' as const, assessmentDraftId } : {}),
    }),
    [
      providerId,
      serviceCode,
      branchId,
      priceAtSelection,
      dateKey,
      dateLabel,
      timeLabel,
      selectedId,
      origin,
      assessmentDraftId,
    ],
  );
  useEffect(() => {
    if (hydrated && validSlot && providerId && serviceCode) {
      void saveDraft(createBookingCareDraft(bookingFields, 'patient'));
    }
  }, [hydrated, validSlot, providerId, serviceCode, bookingFields, saveDraft]);
  const canContinue =
    canBookForPatient(selectedId, scenario) && members.some((p) => p.id === selectedId);

  if (!validSlot) {
    return (
      <Screen>
        <StateView
          title="اختر الموعد أولاً"
          description="حدد اليوم والساعة قبل اختيار المريض."
          actionLabel="اختيار الموعد"
          onAction={() =>
            router.replace({
              pathname: '/booking/slots',
              params: {
                providerId: providerId ?? '',
                serviceCode: serviceCode ?? '',
                ...(branchId ? { branchId } : {}),
              },
            })
          }
        />
      </Screen>
    );
  }

  return (
    <Screen contentClassName="px-0 py-0">
      <BookingHeader title="لمن هذا الحجز؟" />
      <ScrollView
        contentContainerClassName="mx-auto w-full max-w-[430px] gap-3 px-4 pb-28 pt-3"
        showsVerticalScrollIndicator={false}
      >
        <BookingJourneyProgress step={2} />
        <View className="flex-row-reverse items-center gap-2 rounded-[12px] bg-surface-subtle p-3">
          <AppIcon
            name={{ ios: 'calendar', android: 'event', web: 'event' }}
            size={18}
            tone="action"
          />
          <View className="min-w-0 flex-1 items-end gap-0.5">
            <AppText align="right" variant="caption" className="text-content-secondary">
              موعدك المختار
            </AppText>
            <AppText align="right" variant="label" className="font-ui-semibold">
              {dateLabel} · {timeLabel}
            </AppText>
          </View>
        </View>
        <View className="gap-1">
          <AppText align="right" variant="heading-4" className="font-ui-bold">
            اختر المريض
          </AppText>
          <AppText align="right" variant="caption" className="text-content-secondary">
            نفس اختيار المريض بالتقييم، لكن بصلاحية حجز مستقلة لكل فرد.
          </AppText>
        </View>

        <RadioGroup
          value={selectedId}
          onValueChange={(id) => {
            if (canBookForPatient(id, scenario) && members.some((person) => person.id === id)) {
              setSelectedId(id);
            }
          }}
          className="gap-2"
        >
          {members.map((person) => {
            const allowed = canBookForPatient(person.id, scenario);
            const selected = person.id === selectedId;
            const subtitle = person.active
              ? 'أنا · الملف الشخصي الأساسي'
              : person.relation + (person.age === null ? '' : ' · ' + person.age + ' سنة');
            return (
              <RadioGroup.Item
                key={person.id}
                value={person.id}
                isDisabled={!allowed}
                accessibilityLabel={
                  person.name + (allowed ? '، مسموح بالحجز' : '، الحجز يحتاج تفويضاً')
                }
                className={
                  'min-h-[72px] flex-row-reverse items-center gap-3 rounded-[13px] border px-3 py-2.5 ' +
                  (selected
                    ? 'border-action-primary bg-action-subtle'
                    : !allowed
                      ? 'border-border-subtle bg-surface-subtle'
                      : 'border-border-subtle bg-surface-default')
                }
              >
                <View className="h-9 w-9 items-center justify-center rounded-full bg-surface-subtle">
                  <AppIcon
                    name={
                      !allowed
                        ? { ios: 'lock.fill', android: 'lock', web: 'lock' }
                        : { ios: 'person', android: 'person_outline', web: 'person_outline' }
                    }
                    tone={!allowed ? 'secondary' : 'action'}
                    size={19}
                  />
                </View>
                <View className="min-w-0 flex-1 items-end gap-0.5">
                  <AppText
                    align="right"
                    variant="label"
                    numberOfLines={1}
                    className="w-full font-ui-bold"
                  >
                    {person.name}
                  </AppText>
                  <AppText
                    align="right"
                    variant="caption"
                    numberOfLines={1}
                    className="w-full text-content-secondary"
                  >
                    {subtitle}
                  </AppText>
                  <AppText
                    align="right"
                    variant="caption"
                    numberOfLines={2}
                    className={
                      allowed ? 'w-full text-content-link' : 'w-full text-tone-danger-text'
                    }
                  >
                    {person.active
                      ? 'ملفي الشخصي'
                      : allowed
                        ? 'يمكنك الحجز نيابةً عنه'
                        : 'يلزم تفويض صالح لإدارة الحجوزات'}
                  </AppText>
                </View>
                <Radio />
              </RadioGroup.Item>
            );
          })}
        </RadioGroup>

        <Button
          label="إضافة فرد من الأسرة"
          endIcon={{ ios: 'person.badge.plus', android: 'person_add', web: 'person_add' }}
          onPress={() => router.push('/profile/dependents/new')}
          size="sm"
          variant="outline"
        />
        <View className="flex-row-reverse items-start gap-2 rounded-[11px] bg-tone-info-fill p-3">
          <AppIcon
            name={{ ios: 'lock.shield', android: 'lock', web: 'lock' }}
            size={18}
            tone="info"
          />
          <AppText align="right" variant="caption" className="min-w-0 flex-1 text-tone-info-text">
            إضافة فرد جديد لا تمنح صلاحية الحجز تلقائياً. ولا تُشارك معلوماته الطبية مع العيادة بدون
            صلاحية مناسبة.
          </AppText>
        </View>
      </ScrollView>
      <View className="border-t border-border-subtle bg-surface-canvas px-4 pb-3 pt-3">
        <View className="mx-auto w-full max-w-[430px] gap-2">
          <Button
            className="min-h-[52px] rounded-[12px]"
            disabled={!canContinue}
            endIcon={{ ios: 'arrow.left', android: 'arrow_back', web: 'arrow_back' }}
            label="متابعة لمراجعة الحجز"
            onPress={() => {
              if (!canContinue) return;
              router.push({
                pathname: '/booking/review',
                params: {
                  providerId: providerId ?? '',
                  serviceCode: serviceCode ?? '',
                  ...(branchId ? { branchId } : {}),
                  ...(priceAtSelection ? { priceAtSelection } : {}),
                  dateKey: dateKey ?? '',
                  dateLabel: dateLabel ?? '',
                  timeLabel: timeLabel ?? '',
                  patientId: selectedId,
                  ...(origin === 'assessment' ? { origin, assessmentDraftId } : {}),
                },
              });
            }}
          />
          <BookingSaveLaterAction data={bookingFields} step="patient" />
        </View>
      </View>
    </Screen>
  );
}
