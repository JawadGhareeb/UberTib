import { useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, View } from 'react-native';

import { AppIcon, AppText, Button, SelectField } from '@/shared/components/ui';
import { cn } from '@/shared/utils/cn';

const MONTHS = [
  'كانون الثاني',
  'شباط',
  'آذار',
  'نيسان',
  'أيار',
  'حزيران',
  'تموز',
  'آب',
  'أيلول',
  'تشرين الأول',
  'تشرين الثاني',
  'كانون الأول',
] as const;

const WEEK_DAYS = ['أح', 'إث', 'ثل', 'أر', 'خم', 'جم', 'سب'] as const;
const MIN_YEAR = 1900;

interface BrandedDateFieldProps {
  value: Date;
  displayValue?: string;
  error?: string;
  onChange: (date: Date) => void;
}

function formatDate(date: Date): string {
  return `${String(date.getDate()).padStart(2, '0')} / ${String(date.getMonth() + 1).padStart(
    2,
    '0',
  )} / ${date.getFullYear()}`;
}

function isSameDay(left: Date, right: Date): boolean {
  return (
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate()
  );
}

export function BrandedDateField({ value, displayValue, error, onChange }: BrandedDateFieldProps) {
  const today = useMemo(() => new Date(), []);
  const [visible, setVisible] = useState(false);
  const [draftDate, setDraftDate] = useState(value);
  const [visibleYear, setVisibleYear] = useState(value.getFullYear());
  const [visibleMonth, setVisibleMonth] = useState(value.getMonth());
  const [showYears, setShowYears] = useState(false);

  const open = () => {
    setDraftDate(value);
    setVisibleYear(value.getFullYear());
    setVisibleMonth(value.getMonth());
    setShowYears(false);
    setVisible(true);
  };

  const daysInMonth = useMemo(
    () => new Date(visibleYear, visibleMonth + 1, 0).getDate(),
    [visibleMonth, visibleYear],
  );
  const firstDay = useMemo(
    () => new Date(visibleYear, visibleMonth, 1).getDay(),
    [visibleMonth, visibleYear],
  );

  const dayCells = useMemo(
    () => [
      ...Array.from({ length: firstDay }, () => null),
      ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
    ],
    [daysInMonth, firstDay],
  );

  const years = useMemo(
    () =>
      Array.from(
        { length: today.getFullYear() - MIN_YEAR + 1 },
        (_, index) => today.getFullYear() - index,
      ),
    [today],
  );

  const monthAtMaximum = visibleYear === today.getFullYear() && visibleMonth === today.getMonth();

  const goPreviousMonth = () => {
    if (visibleMonth === 0) {
      setVisibleMonth(11);
      setVisibleYear((year) => Math.max(MIN_YEAR, year - 1));
      return;
    }

    setVisibleMonth((month) => month - 1);
  };

  const goNextMonth = () => {
    if (monthAtMaximum) return;

    if (visibleMonth === 11) {
      setVisibleMonth(0);
      setVisibleYear((year) => Math.min(today.getFullYear(), year + 1));
      return;
    }

    setVisibleMonth((month) => month + 1);
  };

  const chooseDay = (day: number) => {
    const next = new Date(visibleYear, visibleMonth, day);
    if (next > today) return;
    setDraftDate(next);
  };

  return (
    <>
      <SelectField
        direction="ltr"
        error={error}
        icon={{ ios: 'calendar', android: 'calendar_month', web: 'calendar_month' }}
        label="تاريخ الميلاد"
        onPress={open}
        placeholder="اختر تاريخ الميلاد"
        value={displayValue}
      />

      <Modal
        animationType="slide"
        onRequestClose={() => setVisible(false)}
        transparent
        visible={visible}
      >
        <View className="flex-1 justify-end">
          <Pressable
            accessibilityLabel="إغلاق اختيار التاريخ"
            className="absolute inset-0 bg-surface-scrim/50"
            onPress={() => setVisible(false)}
          />

          <View className="rounded-t-[28px] border-t border-border-subtle bg-surface-canvas px-5 pb-7 pt-4">
            <View className="mx-auto w-full max-w-[430px]">
              <View className="mb-4 h-1 w-11 self-center rounded-full bg-border-default" />

              <View className="flex-row items-center justify-between">
                <Pressable
                  accessibilityLabel="إغلاق"
                  className="h-10 w-10 items-center justify-center rounded-full border border-border-subtle bg-surface-default"
                  onPress={() => setVisible(false)}
                >
                  <AppIcon
                    name={{ ios: 'xmark', android: 'close', web: 'close' }}
                    size={18}
                    tone="secondary"
                  />
                </Pressable>

                <View className="items-end">
                  <AppText className="font-ui-bold" variant="heading-3">
                    اختر تاريخ الميلاد
                  </AppText>
                  <AppText className="mt-0.5 text-content-secondary" variant="caption">
                    اختر اليوم والشهر والسنة
                  </AppText>
                </View>
              </View>

              <View className="mt-5 rounded-[18px] border border-border-subtle bg-surface-default p-3">
                <View className="flex-row items-center justify-between">
                  <Pressable
                    accessibilityLabel="الشهر السابق"
                    className="h-10 w-10 items-center justify-center rounded-[10px] bg-action-subtle"
                    onPress={goPreviousMonth}
                  >
                    <AppIcon
                      name={{ ios: 'chevron.left', android: 'chevron_left', web: 'chevron_left' }}
                      size={18}
                      tone="action"
                    />
                  </Pressable>

                  <Pressable
                    accessibilityRole="button"
                    className="min-h-10 flex-1 items-center justify-center"
                    onPress={() => setShowYears((current) => !current)}
                  >
                    <AppText
                      align="center"
                      className="font-ui-bold text-content-link"
                      variant="body-strong"
                    >
                      {MONTHS[visibleMonth]} {visibleYear}
                    </AppText>
                    <AppText align="center" className="text-content-secondary" variant="caption">
                      {showYears ? 'العودة إلى التقويم' : 'اضغط لتغيير السنة'}
                    </AppText>
                  </Pressable>

                  <Pressable
                    accessibilityLabel="الشهر التالي"
                    accessibilityState={{ disabled: monthAtMaximum }}
                    className={cn(
                      'h-10 w-10 items-center justify-center rounded-[10px]',
                      monthAtMaximum ? 'bg-surface-subtle' : 'bg-action-subtle',
                    )}
                    disabled={monthAtMaximum}
                    onPress={goNextMonth}
                  >
                    <AppIcon
                      name={{
                        ios: 'chevron.right',
                        android: 'chevron_right',
                        web: 'chevron_right',
                      }}
                      size={18}
                      tone={monthAtMaximum ? 'secondary' : 'action'}
                    />
                  </Pressable>
                </View>

                {showYears ? (
                  <ScrollView className="mt-4 max-h-[280px]" showsVerticalScrollIndicator={false}>
                    <View className="flex-row flex-wrap justify-between gap-y-2">
                      {years.map((year) => {
                        const selected = year === visibleYear;

                        return (
                          <Pressable
                            accessibilityRole="button"
                            accessibilityState={{ selected }}
                            className={cn(
                              'h-11 w-[31%] items-center justify-center rounded-[10px] border',
                              selected
                                ? 'border-action-primary bg-action-subtle'
                                : 'border-border-subtle bg-surface-canvas',
                            )}
                            key={year}
                            onPress={() => {
                              setVisibleYear(year);
                              if (year === today.getFullYear() && visibleMonth > today.getMonth()) {
                                setVisibleMonth(today.getMonth());
                              }
                              setShowYears(false);
                            }}
                          >
                            <AppText
                              align="center"
                              direction="ltr"
                              className={selected ? 'font-ui-bold text-content-link' : undefined}
                              variant="label"
                            >
                              {year}
                            </AppText>
                          </Pressable>
                        );
                      })}
                    </View>
                  </ScrollView>
                ) : (
                  <>
                    <View className="mt-5 flex-row" style={{ direction: 'ltr' }}>
                      {WEEK_DAYS.map((day) => (
                        <View className="w-[14.285%] items-center py-2" key={day}>
                          <AppText
                            align="center"
                            className="text-content-secondary"
                            variant="caption"
                          >
                            {day}
                          </AppText>
                        </View>
                      ))}
                    </View>

                    <View className="flex-row flex-wrap" style={{ direction: 'ltr' }}>
                      {dayCells.map((day, index) => {
                        if (!day) {
                          return <View className="h-11 w-[14.285%]" key={`empty-${index}`} />;
                        }

                        const date = new Date(visibleYear, visibleMonth, day);
                        const selected = isSameDay(date, draftDate);
                        const disabled = date > today;

                        return (
                          <View className="h-11 w-[14.285%] items-center justify-center" key={day}>
                            <Pressable
                              accessibilityLabel={`${day} ${MONTHS[visibleMonth]} ${visibleYear}`}
                              accessibilityRole="button"
                              accessibilityState={{ disabled, selected }}
                              className={cn(
                                'h-9 w-9 items-center justify-center rounded-full',
                                selected && 'bg-action-primary',
                                !selected && !disabled && 'active:bg-action-subtle',
                              )}
                              disabled={disabled}
                              onPress={() => chooseDay(day)}
                            >
                              <AppText
                                align="center"
                                direction="ltr"
                                className={cn(
                                  'text-type-label',
                                  selected && 'font-ui-bold text-content-on-action',
                                  disabled && 'text-content-disabled',
                                )}
                                variant="label"
                              >
                                {day}
                              </AppText>
                            </Pressable>
                          </View>
                        );
                      })}
                    </View>
                  </>
                )}
              </View>

              <View className="mt-4 rounded-[14px] bg-action-subtle px-4 py-3">
                <AppText className="text-content-secondary" variant="caption">
                  التاريخ المحدد
                </AppText>
                <AppText
                  direction="ltr"
                  className="mt-1 font-ui-bold text-content-link"
                  variant="body-strong"
                >
                  {formatDate(draftDate)}
                </AppText>
              </View>

              <View className="mt-4 gap-2">
                <Button
                  label="تأكيد التاريخ"
                  onPress={() => {
                    onChange(draftDate);
                    setVisible(false);
                  }}
                />
                <Button label="إلغاء" onPress={() => setVisible(false)} variant="secondary" />
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}
