import { Pressable, View } from 'react-native';
import { AppText } from '@/shared/components/ui';
import {
  healthNoteTypeLabel,
  type HealthNote,
} from '@/features/profile/state/health-notes-provider';

export function HealthNoteList({
  notes,
  onEdit,
  onDelete,
}: {
  notes: HealthNote[];
  onEdit: (note: HealthNote) => void;
  onDelete: (id: string) => void;
}) {
  if (!notes.length) return null;
  return (
    <View className="gap-2">
      <AppText align="right" variant="label" className="font-ui-bold">
        معلومات أضفتها ({notes.length})
      </AppText>
      {notes.map((note) => (
        <View
          key={note.id}
          className="gap-2 rounded-[12px] border border-border-subtle bg-surface-default p-3"
        >
          <AppText align="right" variant="label" className="font-ui-bold text-content-link">
            {healthNoteTypeLabel(note.type)}
          </AppText>
          <AppText align="right" variant="label">
            {note.description}
          </AppText>
          <View className="flex-row-reverse items-center gap-2">
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={'تعديل ' + healthNoteTypeLabel(note.type)}
              className="min-h-[39px] items-center justify-center rounded-[9px] bg-action-subtle px-4"
              onPress={() => onEdit(note)}
            >
              <AppText variant="caption" className="font-ui-semibold text-content-link">
                تعديل
              </AppText>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={'حذف ' + healthNoteTypeLabel(note.type)}
              className="min-h-[39px] items-center justify-center rounded-[9px] bg-surface-subtle px-4"
              onPress={() => onDelete(note.id)}
            >
              <AppText variant="caption">حذف</AppText>
            </Pressable>
          </View>
        </View>
      ))}
    </View>
  );
}
