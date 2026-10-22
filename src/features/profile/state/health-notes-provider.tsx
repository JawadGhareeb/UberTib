import type { PropsWithChildren } from 'react';
import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';

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
type HealthNotesContextValue = {
  getNotes: (patientId: string) => HealthNote[];
  saveNote: (patientId: string, note: Omit<HealthNote, 'id'> & { id?: string }) => void;
  deleteNote: (patientId: string, noteId: string) => void;
};
const Context = createContext<HealthNotesContextValue | null>(null);

/** Session-only mock notes, isolated per selected patient; never transmitted to a clinic. */
export function HealthNotesProvider({ children }: PropsWithChildren) {
  const [byPatient, setByPatient] = useState<Record<string, HealthNote[]>>({});
  const nextId = useRef(0);
  const getNotes = useCallback(
    (patientId: string) => byPatient[patientId] ?? EMPTY_NOTES,
    [byPatient],
  );
  const saveNote = useCallback(
    (patientId: string, note: Omit<HealthNote, 'id'> & { id?: string }) => {
      const description = note.description.trim();
      if (!description) return;
      const id = note.id ?? 'health-note-' + Date.now() + '-' + ++nextId.current;
      setByPatient((current) => {
        const existing = current[patientId] ?? [];
        const next = { id, type: note.type, description };
        return {
          ...current,
          [patientId]:
            note.id && existing.some((item) => item.id === note.id)
              ? existing.map((item) => (item.id === note.id ? next : item))
              : [...existing, next],
        };
      });
    },
    [],
  );
  const deleteNote = useCallback((patientId: string, noteId: string) => {
    setByPatient((current) => ({
      ...current,
      [patientId]: (current[patientId] ?? []).filter((note) => note.id !== noteId),
    }));
  }, []);
  const value = useMemo(
    () => ({ getNotes, saveNote, deleteNote }),
    [getNotes, saveNote, deleteNote],
  );
  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useHealthNotes(): HealthNotesContextValue {
  const value = useContext(Context);
  if (!value) throw new Error('HealthNotesProvider is required');
  return value;
}

export function healthNoteTypeLabel(type: HealthNoteType): string {
  return healthNoteTypes.find((option) => option.value === type)?.label ?? 'معلومة صحية';
}
