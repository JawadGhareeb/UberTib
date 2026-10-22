import { Select } from 'heroui-native';
import { ScrollView, View } from 'react-native';

import { AppText, Button, TextField } from '@/shared/components/ui';
import {
  healthNoteTypes,
  type HealthNoteType,
} from '@/features/profile/state/health-notes-provider';

export function HealthNoteForm({
  type,
  description,
  onTypeChange,
  onDescriptionChange,
  onSave,
  onCancel,
  isEditing = false,
}: {
  type: HealthNoteType | null;
  description: string;
  onTypeChange: (value: HealthNoteType) => void;
  onDescriptionChange: (value: string) => void;
  onSave: () => void;
  onCancel?: () => void;
  isEditing?: boolean;
}) {
  return (
    <View className="gap-3">
      <View className="gap-2">
        <AppText align="right" variant="label" className="font-ui-semibold">
          نوع المعلومة الصحية
        </AppText>
        <Select
          value={
            type
              ? {
                  value: type,
                  label: healthNoteTypes.find((item) => item.value === type)?.label ?? '',
                }
              : undefined
          }
          onValueChange={(choice) => {
            if (!choice || Array.isArray(choice)) return;
            const found = healthNoteTypes.find((item) => item.value === choice.value);
            if (found) onTypeChange(found.value);
          }}
          presentation="dialog"
        >
          <Select.Trigger
            accessibilityLabel="اختر نوع المعلومة الصحية"
            className="h-14 w-full flex-row-reverse items-center justify-between rounded-form-field border border-border-default bg-surface-default px-4"
          >
            <Select.Value
              placeholder="اختر النوع (مثل: حساسية)"
              className="flex-1 text-right font-ui-medium text-text-primary"
            />
            <Select.TriggerIndicator iconProps={{ size: 17 }} />
          </Select.Trigger>
          <Select.Portal>
            <Select.Overlay />
            <Select.Content
              presentation="dialog"
              classNames={{ content: 'w-[90%] max-w-[420px] rounded-form-field p-5' }}
            >
              <View
                className="mb-3 flex-row items-center justify-between"
                style={{ direction: 'rtl' }}
              >
                <Select.ListLabel className="font-ui-semibold text-text-primary">
                  نوع المعلومة الصحية
                </Select.ListLabel>
                <Select.Close accessibilityLabel="إغلاق قائمة أنواع المعلومات الصحية" />
              </View>
              <ScrollView
                className="max-h-[360px]"
                nestedScrollEnabled
                keyboardShouldPersistTaps="always"
              >
                {healthNoteTypes.map((option) => (
                  <Select.Item key={option.value} value={option.value} label={option.label}>
                    <Select.ItemLabel className="flex-1 text-right font-ui-medium" />
                    <Select.ItemIndicator />
                  </Select.Item>
                ))}
              </ScrollView>
            </Select.Content>
          </Select.Portal>
        </Select>
      </View>
      <TextField
        label="شرح المعلومة الصحية"
        multiline
        maxLength={500}
        value={description}
        onChangeText={onDescriptionChange}
        placeholder="مثال: عند تناول البروفين تظهر لدي أعراض حساسية"
        helperText="اكتب المعلومة بشكل واضح ليسهل عليك مراجعتها لاحقاً."
      />
      <AppText align="right" variant="caption" className="text-content-secondary">
        تُحفظ هذه الملاحظات مؤقتاً خلال جلسة التطبيق، ولا تُرسل إلى الطبيب تلقائياً.
      </AppText>
      <Button
        label={isEditing ? 'حفظ التعديل' : 'إضافة المعلومة'}
        disabled={!type || !description.trim()}
        onPress={onSave}
      />
      {onCancel ? <Button label="إلغاء" variant="outline" onPress={onCancel} /> : null}
    </View>
  );
}
