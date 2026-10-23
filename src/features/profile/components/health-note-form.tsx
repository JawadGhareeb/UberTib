import { useState } from 'react';
import { BottomSheet } from 'heroui-native';
import { Pressable, ScrollView, View, useWindowDimensions } from 'react-native';

import { AppIcon, AppText, Button, TextField } from '@/shared/components/ui';
import { healthNoteTypes, type HealthNoteType } from '@/features/profile/state/health-notes-provider';

export function HealthNoteForm({
  type, description, onTypeChange, onDescriptionChange, onSave, onCancel, isEditing = false,
}: {
  type: HealthNoteType | null;
  description: string;
  onTypeChange: (value: HealthNoteType) => void;
  onDescriptionChange: (value: string) => void;
  onSave: () => void;
  onCancel?: () => void;
  isEditing?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const { height } = useWindowDimensions();
  return (
    <View className="gap-3">
      <View className="gap-2">
        <AppText align="right" variant="label" className="font-ui-semibold">نوع المعلومة الصحية</AppText>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="اختر نوع المعلومة الصحية"
          onPress={() => setOpen(true)}
          className="h-14 w-full flex-row-reverse items-center justify-between rounded-form-field border border-border-default bg-surface-default px-4"
        >
          <AppText align="right" className="flex-1 font-ui-medium">
            {healthNoteTypes.find((item) => item.value === type)?.label ?? 'اختر النوع (مثل: حساسية)'}
          </AppText>
          <AppIcon name={{ ios: 'chevron.down', android: 'keyboard_arrow_down', web: 'keyboard_arrow_down' }} size={19} tone="secondary" />
        </Pressable>
      </View>
      <BottomSheet isOpen={open} onOpenChange={setOpen}>
        <BottomSheet.Portal>
          <BottomSheet.Overlay />
          <BottomSheet.Content contentContainerClassName="gap-3 bg-surface-default px-4 pb-8 pt-3">
            <View className="min-h-[44px] flex-row-reverse items-center justify-between">
              <BottomSheet.Title className="font-ui-semibold text-content-primary">اختر نوع المعلومة الصحية</BottomSheet.Title>
              <BottomSheet.Close />
            </View>
            <ScrollView nestedScrollEnabled keyboardShouldPersistTaps="always" style={{ maxHeight: height * 0.54 }}>
              <View className="gap-1">
                {healthNoteTypes.map((option) => (
                  <Pressable
                    key={option.value}
                    accessibilityRole="radio"
                    accessibilityState={{ selected: type === option.value }}
                    onPress={() => { onTypeChange(option.value); setOpen(false); }}
                    className="min-h-[50px] flex-row-reverse items-center justify-between border-b border-border-subtle px-3 py-2"
                  >
                    <AppText align="right" className="flex-1 font-ui-medium">{option.label}</AppText>
                    {type === option.value ? <AppIcon name={{ ios: 'checkmark.circle.fill', android: 'check_circle', web: 'check_circle' }} size={19} tone="action" /> : null}
                  </Pressable>
                ))}
              </View>
            </ScrollView>
          </BottomSheet.Content>
        </BottomSheet.Portal>
      </BottomSheet>
      <TextField
        label="شرح المعلومة الصحية" multiline maxLength={500}
        value={description} onChangeText={onDescriptionChange}
        placeholder="مثال: عند تناول البروفين تظهر لدي أعراض حساسية"
        helperText="اكتب المعلومة بشكل واضح ليسهل عليك مراجعتها لاحقاً."
      />
      <AppText align="right" variant="caption" className="text-content-secondary">
        تُحفظ هذه الملاحظات مؤقتاً خلال جلسة التطبيق، ولا تُرسل إلى الطبيب تلقائياً.
      </AppText>
      <Button label={isEditing ? 'حفظ التعديل' : 'إضافة المعلومة'} disabled={!type || !description.trim()} onPress={onSave} />
      {onCancel ? <Button label="إلغاء" variant="outline" onPress={onCancel} /> : null}
    </View>
  );
}
