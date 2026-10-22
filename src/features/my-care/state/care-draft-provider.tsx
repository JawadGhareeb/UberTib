import type { PropsWithChildren } from 'react';
import { createContext, useCallback, useContext, useMemo, useState } from 'react';

export type LocalCareDraft = {
  id: string;
  kind: 'booking' | 'assessment';
  title: string;
  detail: string;
  route: '/booking/slots' | '/assessment/review';
  params?: Record<string, string>;
  updatedAt: number;
};
type ContextValue = {
  drafts: LocalCareDraft[];
  saveDraft: (value: Omit<LocalCareDraft, 'updatedAt'>) => void;
  removeDraft: (id: string) => void;
};
const DraftContext = createContext<ContextValue | null>(null);
export function CareDraftProvider({ children }: PropsWithChildren) {
  const [drafts, setDrafts] = useState<LocalCareDraft[]>([]);
  const saveDraft = useCallback((entry: Omit<LocalCareDraft, 'updatedAt'>) => {
    setDrafts(current => [{ ...entry, updatedAt: Date.now() }, ...current.filter(value => value.id !== entry.id)]);
  }, []);
  const removeDraft = useCallback((id: string) => setDrafts(current => current.filter(value => value.id !== id)), []);
  const value = useMemo(() => ({ drafts, saveDraft, removeDraft }), [drafts, saveDraft, removeDraft]);
  return <DraftContext.Provider value={value}>{children}</DraftContext.Provider>;
}
export function useCareDrafts() {
  const context = useContext(DraftContext);
  if (!context) throw new Error('CareDraftProvider is missing');
  return context;
}
