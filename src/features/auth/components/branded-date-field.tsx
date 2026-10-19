import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { Button, Dialog, FieldError, Input, Label, TextField, Typography } from 'heroui-native';
import { useState } from 'react';
import { Platform, Pressable, View } from 'react-native';

import { useAppTheme } from '@/shared/theme/use-app-theme';
import { OutlineIcon } from '@/shared/components/media/outline-icon';

const MIN_DATE = new Date(1900, 0, 1);

type BrandedDateFieldProps = {
  value: Date;
  displayValue?: string;
  error?: string;
  onChange: (date: Date) => void;
};

/**
 * The visible trigger is HeroUI Input (read-only) for consistency with the
 * profile name field. The native datepicker is the platform date selection UI.
 */
export function BrandedDateField({ value, displayValue, error, onChange }: BrandedDateFieldProps) {
  const [visible, setVisible] = useState(false);
  const [draft, setDraft] = useState(value);
  const { colors } = useAppTheme();
  const today = new Date();

  const open = () => {
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value,
        mode: 'date',
        minimumDate: MIN_DATE,
        maximumDate: today,
        onValueChange: (_event, selectedDate) => {
          onChange(selectedDate);
        },
      });
    } else {
      setDraft(value);
      setVisible(true);
    }
  };

  return (
    <TextField className="gap-2.5" isInvalid={Boolean(error)}>
      <Label className="self-end font-ui-semibold text-text-primary">تاريخ الميلاد</Label>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={displayValue ? 'تاريخ الميلاد ' + displayValue : 'اختر تاريخ الميلاد'}
        accessibilityHint="يفتح التقويم لاختيار اليوم والشهر والسنة"
        onPress={open}
        className="relative justify-center"
      >
        <Input
          editable={false}
          pointerEvents="none"
          variant="secondary"
          value={displayValue ?? ''}
          placeholder="اختر تاريخ الميلاد"
          className="h-14 rounded-form-field border border-border-default bg-surface-default pl-12 pr-4 font-ui-medium text-text-primary"
          placeholderColorClassName="text-text-placeholder"
          style={{ textAlign: 'right', writingDirection: displayValue ? 'ltr' : 'rtl' }}
        />
        <View pointerEvents="none" className="absolute left-4 h-8 w-8 items-center justify-center">
          <OutlineIcon
            name="calendar-days"
            size={21}
            color={colors.text.secondary}
            strokeWidth={1.9}
          />
        </View>
      </Pressable>
      <FieldError isInvalid={Boolean(error)}>{error}</FieldError>

      {Platform.OS === 'ios' ? (
        <Dialog isOpen={visible} onOpenChange={setVisible}>
          <Dialog.Portal>
            <Dialog.Overlay />
            <Dialog.Content className="mx-5 rounded-form-field p-5">
              <Dialog.Close variant="ghost" />
              <View className="mt-2 w-full items-end gap-1">
                <Dialog.Title
                  className="w-full font-ui-bold text-text-primary"
                  style={{ textAlign: 'right', writingDirection: 'rtl' }}
                >
                  تاريخ الميلاد
                </Dialog.Title>
                <Dialog.Description
                  className="w-full font-ui-regular text-text-secondary"
                  style={{ textAlign: 'right', writingDirection: 'rtl' }}
                >
                  اختر اليوم والشهر والسنة
                </Dialog.Description>
              </View>
              <DateTimePicker
                value={draft}
                mode="date"
                display="spinner"
                locale="ar_SY"
                minimumDate={MIN_DATE}
                maximumDate={today}
                onValueChange={(_event, selectedDate) => {
                  setDraft(selectedDate);
                }}
                style={{ height: 190, width: '100%' }}
              />
              <View className="mt-3 flex-row gap-3" style={{ direction: 'rtl' }}>
                <Button
                  variant="primary"
                  className="min-h-[48px] flex-1 rounded-form-field bg-action-primary"
                  onPress={() => {
                    onChange(draft);
                    setVisible(false);
                  }}
                >
                  <Button.Label className="font-ui-semibold text-text-on-action">
                    تأكيد
                  </Button.Label>
                </Button>
                <Button
                  variant="outline"
                  className="min-h-[48px] flex-1 rounded-form-field"
                  onPress={() => setVisible(false)}
                >
                  <Button.Label className="font-ui-semibold">إلغاء</Button.Label>
                </Button>
              </View>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog>
      ) : null}
      <Typography.Paragraph
        type="body-sm"
        className="font-ui-regular text-text-secondary"
        style={{ textAlign: 'right', writingDirection: 'rtl' }}
      >
        تاريخ الميلاد يساعدنا على تجهيز ملفك الطبي.
      </Typography.Paragraph>
    </TextField>
  );
}
