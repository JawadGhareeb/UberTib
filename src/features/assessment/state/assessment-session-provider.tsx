import type { PropsWithChildren } from 'react';
import { createContext, useContext, useMemo, useState } from 'react';

export type AssessmentPatient = 'self' | 'adam' | 'nour';
export type DentitionMode = 'permanent' | 'primary' | 'mixed' | 'uncertain';

export interface AssessmentMediaAttachment {
  uri: string;
  fileName: string;
  mimeType?: string;
  size?: number;
  width?: number;
  height?: number;
}

interface AssessmentSessionContextValue {
  patient: AssessmentPatient;
  complaint: string;
  details: string;
  location: string;
  dentitionMode: DentitionMode;
  selectedTeeth: string[];
  answers: string[];
  healthConfirmed: boolean;
  manualReviewDrafted: boolean;
  mediaAttached: boolean;
  mediaAttachment: AssessmentMediaAttachment | null;
  mediaAttachments: AssessmentMediaAttachment[];
  setPatient: (value: AssessmentPatient) => void;
  setComplaint: (value: string) => void;
  setDetails: (value: string) => void;
  setLocation: (value: string) => void;
  setDentitionMode: (value: DentitionMode) => void;
  toggleTooth: (value: string) => void;
  setRegionLocation: (value: string) => void;
  clearDentalSelection: () => void;
  toggleAnswer: (value: string) => void;
  setHealthConfirmed: (value: boolean) => void;
  setManualReviewDrafted: (value: boolean) => void;
  setMediaAttachment: (value: AssessmentMediaAttachment | null) => void;
  addMediaAttachments: (files: AssessmentMediaAttachment[]) => void;
  removeMediaAttachment: (uri: string) => void;
  reset: () => void;
}

const AssessmentSessionContext = createContext<AssessmentSessionContextValue | null>(null);

function suggestedDentition(patient: AssessmentPatient): DentitionMode {
  if (patient === 'adam') return 'primary';
  // The selection UI offers only permanent and primary dentition.
  if (patient === 'nour') return 'permanent';
  return 'permanent';
}

function readableToothId(value: string): string {
  const match = /^mixed-(upper|lower)-(\d+)$/.exec(value);
  if (!match) return value;
  return 'الموضع ' + match[2] + (match[1] === 'upper' ? ' العلوي' : ' السفلي');
}

function teethSummary(teeth: string[]): string {
  if (teeth.length === 0) return '';
  if (teeth.length === 1) {
    return teeth[0]!.startsWith('mixed-') ? readableToothId(teeth[0]!) : `السن ${teeth[0]}`;
  }
  return `الأسنان ${teeth.map(readableToothId).join('، ')}`;
}

export function AssessmentSessionProvider({ children }: PropsWithChildren) {
  const [patient, setPatientState] = useState<AssessmentPatient>('self');
  const [complaint, setComplaint] = useState('');
  const [details, setDetails] = useState('');
  const [location, setLocationState] = useState('');
  const [dentitionMode, setDentitionModeState] = useState<DentitionMode>('permanent');
  const [selectedTeeth, setSelectedTeeth] = useState<string[]>([]);
  const [answers, setAnswers] = useState<string[]>([]);
  const [healthConfirmed, setHealthConfirmed] = useState(false);
  const [manualReviewDrafted, setManualReviewDrafted] = useState(false);
  const [mediaAttachments, setMediaAttachments] = useState<AssessmentMediaAttachment[]>([]);

  const clearDentalSelection = () => {
    setSelectedTeeth([]);
    setLocationState('');
  };

  const value = useMemo<AssessmentSessionContextValue>(
    () => ({
      patient,
      complaint,
      details,
      location,
      dentitionMode,
      selectedTeeth,
      answers,
      healthConfirmed,
      manualReviewDrafted,
      mediaAttached: mediaAttachments.length > 0,
      mediaAttachment: mediaAttachments[0] ?? null,
      mediaAttachments,
      setPatient: (nextPatient) => {
        if (nextPatient === patient) return;
        setPatientState(nextPatient);
        setComplaint('');
        setDetails('');
        setAnswers([]);
        setManualReviewDrafted(false);
        setDentitionModeState(suggestedDentition(nextPatient));
        setSelectedTeeth([]);
        setLocationState('');
        setMediaAttachments([]);
        setHealthConfirmed(false);
      },
      setComplaint: (value) => {
        setComplaint(value);
        setManualReviewDrafted(false);
      },
      setDetails: (value) => {
        setDetails(value);
        setManualReviewDrafted(false);
      },
      setLocation: (value) => {
        setManualReviewDrafted(false);
        setSelectedTeeth([]);
        setLocationState(value);
      },
      setDentitionMode: (mode) => {
        setManualReviewDrafted(false);
        setDentitionModeState(mode);
        setSelectedTeeth([]);
        setLocationState('');
      },
      toggleTooth: (tooth) => {
        setManualReviewDrafted(false);
        setSelectedTeeth((current) => {
          const next = current.includes(tooth)
            ? current.filter((item) => item !== tooth)
            : [...current, tooth];
          setLocationState(teethSummary(next));
          return next;
        });
      },
      setRegionLocation: (region) => {
        setManualReviewDrafted(false);
        setSelectedTeeth([]);
        setLocationState(region);
      },
      clearDentalSelection: () => {
        setManualReviewDrafted(false);
        clearDentalSelection();
      },
      toggleAnswer: (answer) => {
        setManualReviewDrafted(false);
        setAnswers((current) =>
          current.includes(answer)
            ? current.filter((item) => item !== answer)
            : [...current, answer],
        );
      },
      setHealthConfirmed,
      setManualReviewDrafted,
      setMediaAttachment: (file) => setMediaAttachments(file ? [file] : []),
      addMediaAttachments: (files) =>
        setMediaAttachments((current) => {
          const knownUris = new Set(current.map((file) => file.uri));
          const unique = files.filter((file) => {
            if (knownUris.has(file.uri)) return false;
            knownUris.add(file.uri);
            return true;
          });
          return [...current, ...unique].slice(0, 6);
        }),
      removeMediaAttachment: (uri) =>
        setMediaAttachments((current) => current.filter((file) => file.uri !== uri)),
      reset: () => {
        setPatientState('self');
        setComplaint('');
        setDetails('');
        setLocationState('');
        setDentitionModeState('permanent');
        setSelectedTeeth([]);
        setAnswers([]);
        setHealthConfirmed(false);
        setManualReviewDrafted(false);
        setMediaAttachments([]);
      },
    }),
    [
      answers,
      complaint,
      dentitionMode,
      details,
      healthConfirmed,
      manualReviewDrafted,
      location,
      mediaAttachments,
      patient,
      selectedTeeth,
    ],
  );

  return (
    <AssessmentSessionContext.Provider value={value}>{children}</AssessmentSessionContext.Provider>
  );
}

export function useAssessmentSession(): AssessmentSessionContextValue {
  const value = useContext(AssessmentSessionContext);

  if (!value) {
    throw new Error('useAssessmentSession must be used inside AssessmentSessionProvider');
  }

  return value;
}
