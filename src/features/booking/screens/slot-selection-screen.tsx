import { Radio } from 'heroui-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { FlatList, ScrollView, View } from 'react-native';

import { useCareDrafts } from '@/features/my-care/state/care-draft-provider';
import { BookingJourneyProgress } from '@/features/booking/components/booking-journey-progress';
import { canBookForPatient } from '@/features/booking/utils/patient-booking-permissions';
import { useFamilyMembers } from '@/features/profile/state/family-members-provider';
import { useMockScenario } from '@/shared/mock';
import { BookingHeader } from '@/features/booking/components/booking-v5-ui';
import { ProviderPortrait } from '@/features/discovery/components/provider-photo-gallery';
import { getMockProvider } from '@/features/discovery/mocks/providers.mock';
import { penServiceGroups } from '@/features/discovery/presentation/pen-discovery-data';
import { useAppDirection } from '@/providers/app-direction-provider';
import { AppIcon, AppText, Button, Screen, StateView } from '@/shared/components/ui';

function dayName(key: string) {
  const date = new Date(key + 'T12:00:00');
  return Number.isNaN(date.getTime())
    ? 'اليوم'
    : date.toLocaleDateString('ar-SY', { weekday: 'short' });
}
function monthName(key: string) {
  const date = new Date(key + 'T12:00:00');
  return Number.isNaN(date.getTime())
    ? ''
    : date.toLocaleDateString('ar-SY-u-nu-latn', { month: 'long', year: 'numeric' });
}

export function SlotSelectionScreen() {
  const router = useRouter();
  const { saveDraft } = useCareDrafts();
  const { isRTL } = useAppDirection();
  const { scenario } = useMockScenario();
  const { members } = useFamilyMembers();
  const { providerId, serviceCode, patientId } = useLocalSearchParams<{
    providerId?: string;
    serviceCode?: string;
    patientId?: string;
  }>();
  const provider = useMemo(() => getMockProvider(providerId), [providerId]);
  const [dateKey, setDateKey] = useState(provider?.availability[0]?.dateKey ?? '');
  const [slot, setSlot] = useState('');

  const selectedDay = useMemo(
    () => provider?.availability.find((day) => day.dateKey === dateKey),
    [dateKey, provider],
  );
  const serviceName =
    penServiceGroups.flatMap((group) => group.families).find((family) => family.id === serviceCode)
      ?.title ?? 'الخدمة المختارة';
  useEffect(() => {
    if (!provider || !serviceCode) return;
    saveDraft({
      id: 'booking-' + provider.id + '-' + serviceCode,
      kind: 'booking',
      title: serviceName,
      detail: provider.name + (slot ? ' · ' + dateKey + ' · ' + slot : ' · اختيار موعد'),
      route: '/booking/slots',
      params: { providerId: provider.id, serviceCode, ...(patientId ? { patientId } : {}) },
    });
  }, [provider, serviceCode, dateKey, slot, patientId, saveDraft, serviceName]);

  if (!provider || !provider.serviceCodes.includes(serviceCode ?? '')) {
    return (
      <Screen contentClassName="px-0 py-0">
        <BookingHeader title="اختيار الموعد" />
        <View className="px-4 pt-6">
          <StateView
            actionLabel="العودة للأطباء"
            onAction={() =>
              router.replace({
                pathname: '/discover/providers/results',
                params: { serviceCode: serviceCode ?? 'dental-checkup' },
              })
            }
            title="بيانات اختيار الموعد غير مكتملة"
            description="اختَر طبيباً وخدمة متاحة للبدء باختيار الموعد."
          />
        </View>
      </Screen>
    );
  }

  return (
    <Screen contentClassName="px-0 py-0">
      <BookingHeader title="اختيار الموعد" />
      <ScrollView
        contentContainerClassName="mx-auto w-full max-w-[430px] gap-3 px-4 pb-28 pt-3"
        showsVerticalScrollIndicator={false}
      >
        <BookingJourneyProgress step={1} />
        <View className="flex-row-reverse items-center justify-between gap-3">
          <View className="min-w-0 flex-1 items-end gap-1">
            <AppText align="right" variant="heading-3" className="font-ui-bold">
              اختَر اليوم والوقت
            </AppText>
            <AppText align="right" variant="caption" className="text-content-secondary">
              حدد الوقت الأنسب إلك. العيادة بتؤكد الموعد بعد إرسال الطلب.
            </AppText>
          </View>
          <View className="h-11 w-11 items-center justify-center rounded-[12px] bg-action-subtle">
            <AppIcon
              name={{ ios: 'calendar', android: 'calendar_month', web: 'calendar_month' }}
              tone="action"
              size={23}
            />
          </View>
        </View>
        <View className="gap-2 rounded-[14px] border border-border-subtle bg-surface-default p-3">
          <View className="flex-row-reverse items-center gap-3">
            <ProviderPortrait size={45} uri={provider.imageUrl} />
            <View className="min-w-0 flex-1 items-end gap-1">
              <AppText align="right" variant="label" className="font-ui-semibold">
                {provider.name}
              </AppText>
              <AppText align="right" variant="caption" className="text-content-secondary">
                {provider.branch} · {provider.area}
              </AppText>
            </View>
          </View>
          <View className="border-t border-border-subtle pt-2">
            <AppText align="right" variant="caption" className="text-content-secondary">
              {serviceName}
            </AppText>
          </View>
        </View>
        <View className="gap-2">
          <View className="flex-row-reverse items-center justify-between">
            <AppText align="right" variant="heading-4" className="font-ui-bold">
              1. اختر اليوم
            </AppText>
            <AppText variant="caption" className="text-content-link">
              {dateKey ? monthName(dateKey) : 'الأيام المتاحة'}
            </AppText>
          </View>
          {provider.availability.length ? (
            <FlatList
              horizontal
              inverted={isRTL}
              data={provider.availability}
              keyExtractor={(item) => item.dateKey}
              ItemSeparatorComponent={() => <View className="w-2" />}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingVertical: 2 }}
              renderItem={({ item }) => {
                const selected = item.dateKey === dateKey;
                return (
                  <Radio
                    isSelected={selected}
                    onSelectedChange={() => {
                      setDateKey(item.dateKey);
                      setSlot('');
                    }}
                    accessibilityLabel={item.dateLabel}
                    className={`min-h-[84px] min-w-[78px] items-center justify-center gap-1 rounded-[12px] border px-3 py-2 ${selected ? 'border-action-primary bg-action-primary' : 'border-border-subtle bg-surface-default'}`}
                  >
                    <AppText
                      align="center"
                      variant="caption"
                      className={selected ? 'text-content-on-action' : 'text-content-secondary'}
                    >
                      {dayName(item.dateKey)}
                    </AppText>
                    <AppText
                      direction="ltr"
                      align="center"
                      variant="heading-4"
                      className={selected ? 'font-ui-bold text-content-on-action' : 'font-ui-bold'}
                    >
                      {item.dateKey.split('-')[2]?.replace(/^0/, '')}
                    </AppText>
                  </Radio>
                );
              }}
            />
          ) : (
            <View className="rounded-[12px] bg-surface-subtle p-4">
              <AppText align="center" variant="label" className="text-content-secondary">
                ما في أيام متاحة ضمن البيانات الحالية للطبيب.
              </AppText>
            </View>
          )}
        </View>
        <View className="gap-2 rounded-[15px] border border-border-subtle bg-surface-default p-3">
          <View className="flex-row-reverse items-center justify-between gap-2">
            <AppText align="right" variant="heading-4" className="font-ui-bold">
              2. اختر الساعة
            </AppText>
            <AppText variant="caption" className="text-content-secondary">
              {selectedDay ? selectedDay.dateLabel : 'اختر يوماً أولاً'}
            </AppText>
          </View>
          {selectedDay?.slots.length ? (
            <View className="flex-row-reverse flex-wrap justify-between gap-y-2">
              {selectedDay.slots.map((time) => {
                const selected = slot === time;
                return (
                  <Radio
                    key={time}
                    isSelected={selected}
                    onSelectedChange={() => setSlot(time)}
                    accessibilityLabel={'الساعة ' + time}
                    className={`min-h-[47px] w-[48.5%] items-center justify-center rounded-[11px] border px-3 ${selected ? 'border-action-primary bg-action-primary' : 'border-border-subtle bg-surface-subtle'}`}
                  >
                    <AppText
                      direction="ltr"
                      align="center"
                      variant="label"
                      className={
                        selected
                          ? 'font-ui-bold text-content-on-action'
                          : 'font-ui-semibold text-content-primary'
                      }
                    >
                      {time}
                    </AppText>
                  </Radio>
                );
              })}
            </View>
          ) : (
            <View className="rounded-[11px] bg-surface-subtle p-3">
              <AppText align="right" variant="caption" className="text-content-secondary">
                {selectedDay
                  ? 'ما في ساعات متاحة بهاليوم، جرّب يوم تاني.'
                  : 'اختَر اليوم حتى تظهر الساعات المتاحة.'}
              </AppText>
            </View>
          )}
        </View>
        {selectedDay && slot ? (
          <View className="flex-row-reverse items-center gap-2 rounded-[12px] bg-action-subtle p-3">
            <AppIcon
              name={{ ios: 'checkmark.circle.fill', android: 'check_circle', web: 'check_circle' }}
              tone="action"
              size={20}
            />
            <AppText align="right" variant="label" className="min-w-0 flex-1 font-ui-semibold">
              اختيارك: {selectedDay.dateLabel} · {slot}
            </AppText>
          </View>
        ) : null}
        <View className="flex-row-reverse items-start gap-2 rounded-[11px] bg-tone-info-fill p-3">
          <AppIcon
            name={{ ios: 'info.circle', android: 'info_outline', web: 'info_outline' }}
            tone="info"
            size={18}
          />
          <AppText align="right" variant="caption" className="min-w-0 flex-1 text-tone-info-text">
            المواعيد المعروضة قابلة للاختيار، لكن الحجز ما بيصير مؤكداً إلا بعد موافقة العيادة.
          </AppText>
        </View>
      </ScrollView>
      <View className="border-t border-border-subtle bg-surface-default px-4 pb-3 pt-3">
        <View className="mx-auto w-full max-w-[430px]">
          <Button
            className="min-h-[52px] rounded-[12px]"
            disabled={!slot || !selectedDay}
            endIcon={{ ios: 'arrow.left', android: 'arrow_back', web: 'arrow_back' }}
            label={
              patientId &&
              canBookForPatient(patientId, scenario) &&
              members.some((member) => member.id === patientId)
                ? 'متابعة لمراجعة الحجز'
                : 'متابعة لتحديد المريض'
            }
            onPress={() => {
              if (!selectedDay || !slot) return;
              router.push({
                pathname:
                  patientId &&
                  canBookForPatient(patientId, scenario) &&
                  members.some((member) => member.id === patientId)
                    ? '/booking/review'
                    : '/booking/patient',
                params: {
                  dateKey: selectedDay.dateKey,
                  dateLabel: selectedDay.dateLabel,
                  providerId: provider.id,
                  serviceCode: serviceCode ?? '',
                  timeLabel: slot,
                  ...(patientId ? { patientId } : {}),
                },
              });
            }}
          />
        </View>
      </View>
    </Screen>
  );
}