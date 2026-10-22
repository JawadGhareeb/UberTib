import type { PropsWithChildren } from 'react';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { secureStorage } from '@/shared/storage/secure-storage';

export type BookingSavedFields = {
  providerId: string;
  serviceCode: string;
  dateKey?: string;
  dateLabel?: string;
  timeLabel?: string;
  patientId?: string;
  visitReason?: 'new' | 'followup' | 'other';
  note?: string;
  shareVisitSummary?: boolean;
  // File names are informational only; cached file URIs must be reselected after restarting.
  attachmentName?: string;
  origin?: 'assessment';
  assessmentDraftId?: string;
};
export type LocalCareDraft = {
  id: string;
  kind: 'booking' | 'assessment';
  title: string;
  detail: string;
  route:
    | '/booking/slots'
    | '/booking/patient'
    | '/booking/review'
    | '/discover/providers/results'
    | '/assessment/review';
  params?: Record<string, string>;
  booking?: BookingSavedFields;
  updatedAt: number;
};
type DraftInput = Omit<LocalCareDraft, 'updatedAt'>;
type ContextValue = {
  drafts: LocalCareDraft[];
  hydrated: boolean;
  persistError: boolean;
  getDraft: (id: string) => LocalCareDraft | undefined;
  saveDraft: (value: DraftInput) => Promise<boolean>;
  removeDraft: (id: string) => Promise<boolean>;
};
const DraftContext = createContext<ContextValue | null>(null);
function isValidDraft(value: unknown): value is LocalCareDraft {
  if (!value || typeof value !== 'object') return false;
  const draft = value as Partial<LocalCareDraft>;
  return (
    typeof draft.id === 'string' &&
    /^[a-zA-Z0-9_-]{1,100}$/.test(draft.id) &&
    (draft.kind === 'booking' || draft.kind === 'assessment') &&
    typeof draft.title === 'string' &&
    typeof draft.detail === 'string' &&
    [
      'booking/slots',
      'booking/patient',
      'booking/review',
      'discover/providers/results',
      'assessment/review',
    ].some((route) => draft.route === '/' + route) &&
    typeof draft.updatedAt === 'number' &&
    (!draft.params ||
      (typeof draft.params === 'object' &&
        Object.values(draft.params).every((value) => typeof value === 'string')))
  );
}
export function bookingCareDraftId(providerId: string, serviceCode: string) {
  return 'booking-' + providerId + '-' + serviceCode;
}
/** Patient-session-scoped local drafts; saved to secure device storage after every meaningful change. */
export function CareDraftProvider({ children }: PropsWithChildren) {
  const [drafts, setDrafts] = useState<LocalCareDraft[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [persistError, setPersistError] = useState(false);
  const draftsRef = useRef<LocalCareDraft[]>([]);
  const writing = useRef<Promise<void>>(Promise.resolve());
  const active = useRef(true);
  useEffect(() => {
    active.current = true;
    void secureStorage
      .getCareDrafts()
      .then((entries) => {
        if (!active.current) return;
        const loaded = entries.filter(isValidDraft).sort((a, b) => b.updatedAt - a.updatedAt);
        draftsRef.current = loaded;
        setDrafts(loaded);
      })
      .catch(() => {
        if (active.current) setPersistError(true);
      })
      .finally(() => {
        if (active.current) setHydrated(true);
      });
    return () => {
      active.current = false;
    };
  }, []);
  const write = useCallback((next: LocalCareDraft[]): Promise<boolean> => {
    draftsRef.current = next;
    setDrafts(next);
    const operation = writing.current
      .catch(() => undefined)
      .then(() => {
        if (!active.current) return;
        return secureStorage.setCareDrafts(next);
      });
    writing.current = operation;
    return operation
      .then(() => {
        if (active.current) setPersistError(false);
        return true;
      })
      .catch(() => {
        if (active.current) setPersistError(true);
        return false;
      });
  }, []);
  const saveDraft = useCallback(
    (entry: DraftInput): Promise<boolean> => {
      if (!hydrated) return Promise.resolve(false);
      const next: LocalCareDraft = { ...entry, updatedAt: Date.now() };
      return write(
        [next, ...draftsRef.current.filter((item) => item.id !== entry.id)].slice(0, 20),
      );
    },
    [hydrated, write],
  );
  const removeDraft = useCallback(
    (id: string) => {
      if (!hydrated) return Promise.resolve(false);
      return write(draftsRef.current.filter((item) => item.id !== id));
    },
    [hydrated, write],
  );
  const getDraft = useCallback(
    (id: string) => draftsRef.current.find((item) => item.id === id),
    [],
  );
  const value = useMemo(
    () => ({ drafts, hydrated, persistError, getDraft, saveDraft, removeDraft }),
    [drafts, hydrated, persistError, getDraft, saveDraft, removeDraft],
  );
  return <DraftContext.Provider value={value}>{children}</DraftContext.Provider>;
}
export function useCareDrafts() {
  const context = useContext(DraftContext);
  if (!context) throw new Error('CareDraftProvider is missing');
  return context;
}
