import { useGlobalSearchParams, usePathname } from 'expo-router';
import { useEffect, useRef, useState, type PropsWithChildren } from 'react';
import { useAssessmentSession } from '@/features/assessment/state/assessment-session-provider';
import {
  buildAssessmentDraft,
  isAssessmentDraftRoute,
} from '@/features/assessment/utils/assessment-draft';
import { useCareDrafts } from '@/features/my-care/state/care-draft-provider';
import { useHealthNotes } from '@/features/profile/state/health-notes-store';

/**
 * Restore the saved assessment before a deep-linked step is rendered.
 * Persist every selection and step change, so leaving the app doesn't depend on
 * pressing the save button. A read-in-progress never writes an empty snapshot.
 */
export function AssessmentDraftBridge({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const { resumeDraftId, returnTo } = useGlobalSearchParams<{
    resumeDraftId?: string;
    returnTo?: string;
  }>();
  const { snapshot, restoreSnapshot } = useAssessmentSession();
  const { hydrated, getDraft, saveDraft, removeDraft } = useCareDrafts();
  const { getNotes, saveNote } = useHealthNotes();
  const [ready, setReady] = useState(false);
  const [restoredKey, setRestoredKey] = useState<string | null>(null);
  const previousPatient = useRef(snapshot.patient);
  const notes = getNotes(snapshot.patient);
  const pendingResume = !!resumeDraftId && restoredKey !== resumeDraftId;

  useEffect(() => {
    if (!hydrated || (ready && !pendingResume)) return;
    let cancelled = false;
    void Promise.resolve().then(() => {
      if (cancelled) return;
      if (pendingResume && resumeDraftId) {
        const saved = getDraft(resumeDraftId);
        if (saved?.kind === 'assessment' && saved.assessment) {
          restoreSnapshot(saved.assessment);
          saved.assessment.healthNotes?.forEach((note) => {
            saveNote(saved.assessment!.patient, note);
          });
        }
        setRestoredKey(resumeDraftId);
      }
      setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, [hydrated, ready, pendingResume, resumeDraftId, getDraft, restoreSnapshot, saveNote]);

  useEffect(() => {
    if (!hydrated || !ready || pendingResume) return;
    if (previousPatient.current !== snapshot.patient) {
      const oldPatient = previousPatient.current;
      previousPatient.current = snapshot.patient;
      // The person step changes the owner of this same draft, not a new case.
      void removeDraft('assessment-' + oldPatient);
    }
    if (!isAssessmentDraftRoute(pathname)) return;
    // Opening the introduction must not destroy an unfinished existing attempt.
    if (pathname === '/assessment/start' && !resumeDraftId && !snapshot.complaint) {
      const existing = getDraft('assessment-' + snapshot.patient);
      if (existing?.assessment && existing.route !== '/assessment/start') return;
    }
    void saveDraft(buildAssessmentDraft(pathname, { ...snapshot, healthNotes: notes }, returnTo));
  }, [
    hydrated,
    ready,
    pendingResume,
    pathname,
    snapshot,
    notes,
    returnTo,
    resumeDraftId,
    getDraft,
    saveDraft,
    removeDraft,
  ]);

  if (!hydrated || !ready || pendingResume) return null;
  return children;
}
