import type { PropsWithChildren } from 'react';
import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';

export type BookingVisitReason = 'new' | 'followup' | 'other';
export interface BookingLocalAttachment {
  uri: string;
  fileName: string;
  mimeType?: string;
}

interface BookingDraftContextValue {
  reason: BookingVisitReason;
  setReason: (value: BookingVisitReason) => void;
  note: string;
  setNote: (value: string) => void;
  attachment: BookingLocalAttachment | null;
  setAttachment: (value: BookingLocalAttachment | null) => void;
  shareAttachment: boolean;
  setShareAttachment: (value: boolean) => void;
  prepareForService: (scope: string) => void;
  clearDraft: () => void;
}

const BookingDraftContext = createContext<BookingDraftContextValue | null>(null);

export function BookingDraftProvider({ children }: PropsWithChildren) {
  const [reason, setReason] = useState<BookingVisitReason>('new');
  const [note, setNote] = useState('');
  const [attachment, setAttachmentState] = useState<BookingLocalAttachment | null>(null);
  const [shareAttachment, setShareAttachment] = useState(false);
  const scopeRef = useRef('');

  const clearDraft = useCallback(() => {
    scopeRef.current = '';
    setReason('new');
    setNote('');
    setAttachmentState(null);
    setShareAttachment(false);
  }, []);

  const prepareForService = useCallback((scope: string) => {
    if (scopeRef.current === scope) return;
    scopeRef.current = scope;
    setReason('new');
    setNote('');
    setAttachmentState(null);
    setShareAttachment(false);
  }, []);

  const value = useMemo<BookingDraftContextValue>(() => ({
    reason,
    setReason,
    note,
    setNote,
    attachment,
    setAttachment: (next) => {
      setAttachmentState(next);
      if (!next) setShareAttachment(false);
    },
    shareAttachment,
    setShareAttachment,
    prepareForService,
    clearDraft,
  }), [reason, note, attachment, shareAttachment, prepareForService, clearDraft]);

  return <BookingDraftContext.Provider value={value}>{children}</BookingDraftContext.Provider>;
}

export function useBookingDraft() {
  const value = useContext(BookingDraftContext);
  if (!value) throw new Error('useBookingDraft must be used inside BookingDraftProvider');
  return value;
}
