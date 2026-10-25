import { create } from 'zustand';
import { registerSessionStore } from '@/shared/state/session-stores';

export const healthNoteTypes = [
  { value: 'allergy', label: 'حساسية' },
  { value: 'medicine', label: 'دواء أستخدمه' },
  { value: 'condition', label: 'حالة صحية أو مرض مزمن' },
  { value: 'operation', label: 'عملية أو إجراء سابق' },
  { value: 'dental', label: 'علاج أسنان سابق' },
  { value: 'injury', label: 'إصابة أو رض أسنان' },
  { value: 'other', label: 'معلومة صحية أخرى' },
] as const;

export type HealthNoteType = (typeof healthNoteTypes)[number]['value'];
export type HealthNote = {
  id: string;
  type: HealthNoteType;
  description: string;
};
const EMPTY_NOTES: HealthNote[] = [];
type HealthNotesState = {
  byPatient: Record<string, HealthNote[]>;
  getNotes: (patientId: string) => HealthNote[];
  saveNote: (patientId: string, note: Omit<HealthNote, 'id'> & { id?: string }) => void;
  deleteNote: (patientId: string, noteId: string) => void;
};

let nextId = 0;

/** Notes remain patient-scoped and local; never transmitted to the clinic. */
export const useHealthNotes = create<HealthNotesState>()((set, get) => ({
  byPatient: {},
  getNotes: (patientId) => get().byPatient[patientId] ?? EMPTY_NOTES,
  saveNote: (patientId, note) => {
    const description = note.description.trim();
    if (!description) return;
    const id = note.id ?? 'health-note-' + Date.now() + '-' + ++nextId;
    set(({ byPatient }) => {
      const existing = byPatient[patientId] ?? [];
      const next = { id, type: note.type, description };
      return {
        byPatient: {
          ...byPatient,
          [patientId]:
            note.id && existing.some((item) => item.id === note.id)
              ? existing.map((item) => (item.id === note.id ? next : item))
              : [...existing, next],
        },
      };
    });
  },
  deleteNote: (patientId, noteId) =>
    set(({ byPatient }) => ({
      byPatient: {
        ...byPatient,
        [patientId]: (byPatient[patientId] ?? []).filter((note) => note.id !== noteId),
      },
    })),
}));

registerSessionStore(useHealthNotes);

export function healthNoteTypeLabel(type: HealthNoteType): string {
  return healthNoteTypes.find((option) => option.value === type)?.label ?? 'معلومة صحية';
}
