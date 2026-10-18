import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';

import { BookingHeader } from '@/features/booking/components/booking-v5-ui';
import { getMockProvider } from '@/features/discovery/mocks/providers.mock';
import { canBookForPatient } from '@/features/booking/utils/patient-booking-permissions';
import { useAppDirection } from '@/providers/app-direction-provider';
import { AppIcon, AppText, Button, Screen, StateView } from '@/shared/components/ui';
import { useMockScenario } from '@/shared/mock';
import { mockPatientWorld } from '@/shared/mock/patient.mock';
import { cn } from '@/shared/utils/cn';

export function BookingPatientSelectionScreen() {
  const router = useRouter();
  const { rowClassName } = useAppDirection();
  const { scenario } = useMockScenario();
  const { providerId, serviceCode, dateKey, dateLabel, timeLabel } = useLocalSearchParams<{
    providerId?: string;
    serviceCode?: string;
    dateKey?: string;
    dateLabel?: string;
    timeLabel?: string;
  }>();
  const provider = getMockProvider(providerId);
  const selectedDate = provider?.availability.find((day) => day.dateKey === dateKey);
  const validSlot = Boolean(
    provider?.serviceCodes.includes(serviceCode ?? '') &&
    selectedDate?.dateLabel === dateLabel &&
    selectedDate?.slots.includes(timeLabel ?? ''),
  );
  const [selectedId, setSelectedId] = useState<(typeof mockPatientWorld.family)[number]['id']>(mockPatientWorld.family[0].id);
  const chosenPatient = mockPatientWorld.family.find((patient) => patient.id === selectedId);
  const canContinue = canBookForPatient(selectedId, scenario);

  if (!validSlot) {
    return (
      <Screen>
        <StateView
          title="اختر الموعد أولاً"
          description="حدد اليوم والساعة قبل اختيار المريض."
          actionLabel="اختيار الموعد"
          onAction={() => router.replace({
            pathname: '/booking/slots',
            params: { providerId: providerId ?? '', serviceCode: serviceCode ?? '' },
          })}
        />
      </Screen>
    );
  }

  return (
    <Screen contentClassName="px-0 py-0">
      <BookingHeader leadingIcon="patient" title="لمن هذا الحجز؟" />
      <ScrollView
        contentContainerClassName="mx-auto w-full max-w-[430px] px-4 pb-[106px] pt-2"
        showsVerticalScrollIndicator={false}
      >
        <View className={cn('mt-3 min-h-[86px] items-center gap-3 rounded-[15px] border border-action-primary/20 bg-action-subtle p-3', rowClassName)}>
          <View className="h-[48px] w-[48px] items-center justify-center rounded-full bg-surface-default">
            <AppIcon name={{ ios: 'person', android: 'person_outline', web: 'person_outline' }} size={25} tone="action" />
          </View>
          <View className="min-w-0 flex-1 items-end">
            <AppText align="right" className="text-content-link" variant="caption">
              مرتبط بالحجز
            </AppText>
            <AppText align="right" className="font-ui-bold text-content-primary" variant="label">
              {chosenPatient ? 'الحجز باسم ' + chosenPatient.name : 'اختر المريض'}
            </AppText>
            <AppText align="right" className="mt-0.5 text-content-secondary" variant="caption">
              {dateLabel} · {timeLabel} · معلومات التفويض تُراجع قبل إرسال الطلب
            </AppText>
          </View>
        </View>

        <AppText align="right" className="mb-2 mt-3 font-ui-bold text-content-primary" variant="label">
          اختيار المريض
        </AppText>

        <View accessibilityRole="radiogroup" className="gap-2">
          {mockPatientWorld.family.map((person) => {
            const allowed = canBookForPatient(person.id, scenario);
            const active = selectedId === person.id;
            return (
              <Pressable
                accessibilityLabel={person.name + (allowed ? '' : '، غير مسموح بالحجز')}
                accessibilityRole="radio"
                accessibilityState={{ checked: active, disabled: !allowed }}
                className={cn(
                  'min-h-[56px] items-center gap-2 rounded-[13px] border bg-surface-default px-3 py-2',
                  rowClassName,
                  active ? 'border-action-primary' : 'border-border-subtle',
                  !allowed && 'opacity-70',
                )}
                disabled={!allowed}
                key={person.id}
                onPress={() => setSelectedId(person.id)}
              >
                <View className="h-8 w-8 items-center justify-center rounded-full bg-action-subtle">
                  <AppIcon
                    name={{ ios: 'person', android: 'person_outline', web: 'person_outline' }}
                    size={16}
                    tone="action"
                  />
                </View>
                <View className="min-w-0 flex-1 items-end">
                  <AppText align="right" className="font-ui-semibold text-content-primary" variant="label">
                    {person.name}
                  </AppText>
                  <AppText align="right" className="text-content-secondary" variant="caption">
                    {person.active
                      ? 'أنا · الملف الشخصي الأساسي'
                      : allowed
                        ? person.relation + ' · تفويض صالح لإدارة الحجوزات'
                        : person.relation + ' · لا يوجد تفويض حجز صالح'}
                  </AppText>
                </View>
                <View className={cn(
                  'h-[23px] w-[23px] items-center justify-center rounded-full border',
                  active ? 'border-action-primary bg-action-primary' : 'border-border-default',
                )}>
                  {active ? <AppIcon name={{ ios: 'checkmark', android: 'check', web: 'check' }} size={14} tone="onAction" /> : null}
                </View>
              </Pressable>
            );
          })}
        </View>

        <View className={cn('mt-2 items-start gap-2 rounded-[12px] border border-tone-warning-border bg-tone-warning-fill p-3', rowClassName)}>
          <AppIcon
            name={{ ios: 'exclamationmark.triangle', android: 'warning_amber', web: 'warning_amber' }}
            size={18}
            tone="warning"
          />
          <View className="min-w-0 flex-1 items-end">
            <AppText align="right" className="font-ui-bold text-content-primary" variant="label">
              تغيير المريض يبدأ حجزاً باسمه
            </AppText>
            <AppText align="right" className="mt-1 text-content-secondary" variant="caption">
              اختر الشخص الصحيح. معلوماته الطبية لا تُشارك تلقائياً، ويجب أن يكون التفويض صالحاً للحجز نيابةً عنه.
            </AppText>
          </View>
        </View>

        <Pressable
          accessibilityRole="button"
          className={cn('mt-2 min-h-[42px] items-center justify-center gap-2 rounded-[11px] border border-border-subtle bg-surface-default px-3', rowClassName)}
          onPress={() => router.push('/profile/dependents/new')}
        >
          <AppIcon name={{ ios: 'person.badge.plus', android: 'person_add', web: 'person_add' }} size={17} tone="action" />
          <AppText className="font-ui-semibold text-content-link" variant="caption">
            إضافة فرد من الأسرة
          </AppText>
        </Pressable>
      </ScrollView>

      <View className="absolute bottom-0 left-0 right-0 border-t border-border-subtle bg-surface-canvas px-4 pb-3 pt-2">
        <View className="mx-auto w-full max-w-[430px]">
          <Button
            className="h-[52px] rounded-[12px]"
            disabled={!canContinue}
            endIcon={{ ios: 'arrow.left', android: 'arrow_back', web: 'arrow_back' }}
            label="متابعة لملخص الحالة والمرفقات"
            onPress={() => {
              if (!canBookForPatient(selectedId, scenario)) return;
              router.push({
                pathname: '/booking/reason',
                params: {
                  providerId: providerId ?? '',
                  serviceCode: serviceCode ?? '',
                  dateKey: dateKey ?? '',
                  dateLabel: dateLabel ?? '',
                  timeLabel: timeLabel ?? '',
                  patientId: selectedId,
                },
              });
            }}
          />
        </View>
      </View>
    </Screen>
  );
}
