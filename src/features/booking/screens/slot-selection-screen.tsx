import { Radio } from 'heroui-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, Image, ScrollView, View } from 'react-native';

import { BookingHeader } from '@/features/booking/components/booking-v5-ui';
import {
  DEMO_CLINIC_PHOTOS,
  ProviderPortrait,
} from '@/features/discovery/components/provider-photo-gallery';
import { getMockProvider } from '@/features/discovery/mocks/providers.mock';
import { penServiceGroups } from '@/features/discovery/presentation/pen-discovery-data';
import { useAppDirection } from '@/providers/app-direction-provider';
import { AppIcon, AppText, Button, Screen, StateView } from '@/shared/components/ui';
import { cn } from '@/shared/utils/cn';

function getDayNumber(dateKey: string) {
  return dateKey.split('-')[2]?.replace(/^0/, '') ?? '';
}

function getDayName(dateKey: string) {
  const date = new Date(dateKey + 'T12:00:00');
  return Number.isNaN(date.getTime())
    ? 'اليوم'
    : date.toLocaleDateString('ar-SY', { weekday: 'long' });
}

function getMonthName(dateKey: string) {
  const date = new Date(dateKey + 'T12:00:00');
  return Number.isNaN(date.getTime())
    ? ''
    : date.toLocaleDateString('ar-SY-u-nu-latn', { month: 'long', year: 'numeric' });
}

export function SlotSelectionScreen() {
  const router = useRouter();
  const { rowClassName, isRTL } = useAppDirection();
  const { providerId, serviceCode } = useLocalSearchParams<{
    providerId?: string;
    serviceCode?: string;
  }>();
  const provider = getMockProvider(providerId);
  const [dateKey, setDateKey] = useState(provider?.availability[0]?.dateKey ?? '');
  const [slot, setSlot] = useState('');

  const selectedDay = useMemo(
    () => provider?.availability.find((day) => day.dateKey === dateKey),
    [dateKey, provider],
  );
  const serviceName =
    penServiceGroups.flatMap((group) => group.families).find((family) => family.id === serviceCode)
      ?.title ?? 'الخدمة المختارة';

  if (!provider || !provider.serviceCodes.includes(serviceCode ?? '')) {
    return (
      <Screen>
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
      </Screen>
    );
  }

  return (
    <Screen contentClassName="px-0 py-0">
      <BookingHeader leadingIcon="calendar" title="اختيار الموعد" />

      <ScrollView
        contentContainerClassName="mx-auto w-full max-w-[430px] px-4 pb-[106px] pt-2"
        showsVerticalScrollIndicator={false}
      >
        <View
          className={cn(
            'mt-3 min-h-[61px] items-center gap-2 rounded-[14px] border border-action-primary/25 bg-action-subtle p-3',
            rowClassName,
          )}
        >
          <View className="h-9 w-9 items-center justify-center rounded-full bg-surface-default">
            <AppIcon
              name={{ ios: 'checkmark.shield', android: 'verified_user', web: 'verified_user' }}
              size={19}
              tone="action"
            />
          </View>
          <View className="min-w-0 flex-1 items-end">
            <AppText align="right" className="font-ui-bold text-content-primary" variant="label">
              اختر الوقت المناسب
            </AppText>
            <AppText
              align="right"
              className="mt-0.5 text-content-secondary"
              numberOfLines={2}
              variant="caption"
            >
              {serviceName} · {provider.name} · {provider.branch}
            </AppText>
          </View>
          <View className="rounded-full bg-surface-default px-2 py-1">
            <AppText className="text-content-link" variant="badge">
              الخطوة 1 من 3
            </AppText>
          </View>
        </View>

        <View
          className={cn(
            'mt-2 min-h-[66px] items-center gap-2 rounded-[14px] border border-border-subtle bg-surface-default p-2',
            rowClassName,
          )}
        >
          <Image
            accessibilityLabel="صورة توضيحية لغرفة عيادة أسنان"
            className="h-[47px] w-[53px] rounded-[10px] bg-surface-subtle"
            resizeMode="cover"
            source={{ uri: DEMO_CLINIC_PHOTOS[1] }}
          />
          <ProviderPortrait size={48} uri={provider.imageUrl} />
          <View className="min-w-0 flex-1 items-end">
            <AppText
              align="right"
              className="font-ui-bold text-content-primary"
              numberOfLines={1}
              variant="label"
            >
              {provider.name} · {provider.area}
            </AppText>
            <AppText
              align="right"
              className="text-content-secondary"
              numberOfLines={2}
              variant="caption"
            >
              {provider.branch} · {provider.specialty}
            </AppText>
            <AppText align="right" className="text-content-placeholder" variant="badge">
              صور توضيحية
            </AppText>
          </View>
          <AppIcon
            name={{ ios: 'person', android: 'person_outline', web: 'person_outline' }}
            size={17}
            tone="action"
          />
        </View>

        <View className={cn('mt-3 items-center justify-between', rowClassName)}>
          <View className={cn('items-center gap-2', rowClassName)}>
            <AppIcon
              name={{ ios: 'calendar', android: 'calendar_month', web: 'calendar_month' }}
              size={17}
              tone="action"
            />
            <AppText className="font-ui-bold text-content-primary" variant="label">
              اختر اليوم
            </AppText>
          </View>
          <View className="rounded-full bg-tone-warning-fill px-2.5 py-1">
            <AppText className="text-tone-warning-text" variant="badge">
              {dateKey ? getMonthName(dateKey) : 'المواعيد'}
            </AppText>
          </View>
        </View>

        {provider.availability.length ? (
          <FlatList
            className="mt-2"
            data={provider.availability}
            horizontal
            inverted={isRTL}
            keyExtractor={(day) => day.dateKey}
            ItemSeparatorComponent={() => <View className="w-2" />}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item: day }) => {
              const selected = day.dateKey === dateKey;
              return (
                <Radio
                  isSelected={selected}
                  onSelectedChange={() => {
                    setDateKey(day.dateKey);
                    setSlot('');
                  }}
                  accessibilityLabel={day.dateLabel}
                  className={cn(
                    'h-[79px] min-w-[79px] items-center justify-center gap-0.5 rounded-[12px] border px-3',
                    selected
                      ? 'border-action-primary bg-action-subtle'
                      : 'border-border-subtle bg-surface-default',
                  )}
                >
                  <Radio.Indicator />
                  <AppText align="center" className="text-content-secondary" variant="caption">
                    {getDayName(day.dateKey)}
                  </AppText>
                  <AppText
                    align="center"
                    direction="ltr"
                    className={cn(
                      'font-ui-bold',
                      selected ? 'text-content-link' : 'text-content-primary',
                    )}
                    variant="heading-4"
                  >
                    {getDayNumber(day.dateKey)}
                  </AppText>
                </Radio>
              );
            }}
          />
        ) : (
          <View className="mt-2 rounded-[12px] bg-surface-subtle p-4">
            <AppText align="center" className="text-content-secondary" variant="caption">
              ما في مواعيد معروضة لهذا الطبيب حالياً.
            </AppText>
          </View>
        )}

        <AppText align="right" className="mt-3 font-ui-bold text-content-primary" variant="label">
          اختر الوقت
        </AppText>

        <View className={cn('mt-2 flex-wrap justify-between gap-y-2', rowClassName)}>
          {selectedDay?.slots.map((time) => {
            const selected = slot === time;
            return (
              <Radio
                key={time}
                isSelected={selected}
                onSelectedChange={() => setSlot(time)}
                accessibilityLabel={'الساعة ' + time}
                className={cn(
                  'min-h-[45px] w-[48.7%] flex-row-reverse items-center justify-center gap-2 rounded-[11px] border',
                  selected
                    ? 'border-action-primary bg-action-subtle'
                    : 'border-border-subtle bg-surface-default',
                )}
              >
                <Radio.Indicator />
                <AppText
                  direction="ltr"
                  align="center"
                  className={
                    selected
                      ? 'font-ui-bold text-content-link'
                      : 'font-ui-semibold text-content-primary'
                  }
                  variant="label"
                >
                  {time}
                </AppText>
              </Radio>
            );
          })}
        </View>
        {selectedDay && selectedDay.slots.length === 0 ? (
          <AppText align="right" className="mt-2 text-content-secondary" variant="caption">
            لا توجد أوقات لهذا اليوم، اختَر يوماً آخر.
          </AppText>
        ) : null}

        <View
          className={cn(
            'mt-3 items-center gap-2 rounded-[11px] bg-tone-info-fill px-3 py-2',
            rowClassName,
          )}
        >
          <AppIcon
            name={{ ios: 'arrow.clockwise', android: 'refresh', web: 'refresh' }}
            size={16}
            tone="info"
          />
          <AppText align="right" className="min-w-0 flex-1 text-tone-info-text" variant="caption">
            المواعيد المعروضة بيانات تجريبية وليست توفراً مباشراً. إذا تغيّر الموعد عند الإرسال،
            سنوضح السبب ونطلب اختياراً جديداً.
          </AppText>
        </View>
      </ScrollView>

      <View className="absolute bottom-0 left-0 right-0 border-t border-border-subtle bg-surface-canvas px-4 pb-3 pt-2">
        <View className="mx-auto w-full max-w-[430px]">
          <Button
            className="h-[52px] rounded-[12px]"
            disabled={!slot || !selectedDay}
            endIcon={{ ios: 'arrow.left', android: 'arrow_back', web: 'arrow_back' }}
            label="متابعة لتحديد المريض"
            onPress={() => {
              if (!selectedDay || !slot) return;
              router.push({
                pathname: '/booking/patient',
                params: {
                  dateKey: selectedDay.dateKey,
                  dateLabel: selectedDay.dateLabel,
                  providerId: provider.id,
                  serviceCode: serviceCode ?? '',
                  timeLabel: slot,
                },
              });
            }}
          />
        </View>
      </View>
    </Screen>
  );
}
