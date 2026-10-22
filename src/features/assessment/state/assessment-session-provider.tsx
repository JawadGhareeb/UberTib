import type { PropsWithChildren } from 'react';
import { createContext, useContext, useMemo, useState } from 'react';

export type AssessmentPatient = 'self' | 'adam' | 'nour';
export type DentitionMode = 'permanent' | 'primary' | 'mixed' | 'uncertain';

export interface AssessmentMediaAttachment {
  uri: string;
  fileName: string;
  category?: string;
  mimeType?: string;
  size?: number;
  width?: number;
  height?: number;
}

export interface AssessmentSnapshot {
  patient: AssessmentPatient;
  complaint: string;
  details: string;
  location: string;
  dentitionMode: DentitionMode;
  selectedTeeth: string[];
  answers: string[];
  healthConfirmed: boolean;
  manualReviewDrafted: boolean;
  // Temporary camera/picker file URIs aren't durable after app restart.
  attachmentNames: string[];
  selectedMediaType?: string | null;
  needsMoreInfoChoice?: string;
}

interface AssessmentSessionContextValue {
  snapshot: AssessmentSnapshot;
  restoreSnapshot: (snapshot: AssessmentSnapshot) => void;
  unavailableAttachmentNames: string[];
  selectedMediaType: string | null;
  setSelectedMediaType: (type: string | null) => void;
  needsMoreInfoChoice: string;
  setNeedsMoreInfoChoice: (choice: string) => void;
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

export function readableToothId(value: string): string {
  const match = /^mixed-(upper|lower)-(\d+)$/.exec(value);
  if (!match) {
    const number = Number(value);
    if (!Number.isInteger(number) || number < 11 || number > 85) return value;
    const quadrant = Math.floor(number / 10);
    const position = number % 10;
    const jaw = [1, 2, 5, 6].includes(quadrant) ? 'علوي' : 'سفلي';
    const side = [1, 4, 5, 8].includes(quadrant) ? 'أيمن' : 'أيسر';
    const permanentNames = [
      'الثنية المركزية',
      'الثنية الجانبية',
      'الناب',
      'الضاحك الأول',
      'الضاحك الثاني',
      'الطاحن الأول',
      'الطاحن الثاني',
      'ضرس العقل',
    ];
    const primaryNames = [
      'الثنية المركزية',
      'الثنية الجانبية',
      'الناب',
      'الطاحن اللبني الأول',
      'الطاحن اللبني الثاني',
    ];
    const toothName = (quadrant <= 4 ? permanentNames : primaryNames)[position - 1];
    return toothName ? `${toothName} ${jaw} ${side}` : value;
  }
  const position = Number(match[2]);
  const side = position <= 5 ? 'الأيسر' : 'الأيمن';
  return 'الموضع ' + position + (match[1] === 'upper' ? ' العلوي ' : ' السفلي ') + side;
}

function teethSummary(teeth: string[]): string {
  if (teeth.length === 0) return '';
  if (teeth.length === 1) {
    return readableToothId(teeth[0]!);
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
  const [unavailableAttachmentNames, setUnavailableAttachmentNames] = useState<string[]>([]);
  const [selectedMediaType, setSelectedMediaType] = useState<string | null>(null);
  const [needsMoreInfoChoice, setNeedsMoreInfoChoice] = useState('');
  const snapshot = useMemo<AssessmentSnapshot>(
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
      selectedMediaType,
      needsMoreInfoChoice,
      attachmentNames: Array.from(
        new Set([...unavailableAttachmentNames, ...mediaAttachments.map((file) => file.fileName)]),
      ),
    }),
    [
      patient,
      complaint,
      details,
      location,
      dentitionMode,
      selectedTeeth,
      answers,
      healthConfirmed,
      manualReviewDrafted,
      selectedMediaType,
      needsMoreInfoChoice,
      unavailableAttachmentNames,
      mediaAttachments,
    ],
  );

  const clearDentalSelection = () => {
    setSelectedTeeth([]);
    setLocationState('');
  };

  const value = useMemo<AssessmentSessionContextValue>(
    () => ({
      snapshot,
      unavailableAttachmentNames,
      selectedMediaType,
      setSelectedMediaType,
      needsMoreInfoChoice,
      setNeedsMoreInfoChoice,
      restoreSnapshot: (saved) => {
        setPatientState(saved.patient);
        setComplaint(saved.complaint);
        setDetails(saved.details);
        setLocationState(saved.location);
        setDentitionModeState(saved.dentitionMode);
        setSelectedTeeth([...saved.selectedTeeth]);
        setAnswers([...saved.answers]);
        setHealthConfirmed(saved.healthConfirmed);
        setManualReviewDrafted(saved.manualReviewDrafted);
        setUnavailableAttachmentNames([...saved.attachmentNames]);
        setSelectedMediaType(saved.selectedMediaType ?? null);
        setNeedsMoreInfoChoice(saved.needsMoreInfoChoice ?? '');
        setMediaAttachments([]);
      },
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
        setUnavailableAttachmentNames([]);
        setSelectedMediaType(null);
        setNeedsMoreInfoChoice('');
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
      setMediaAttachment: (file) => {
        setMediaAttachments(file ? [file] : []);
        if (file)
          setUnavailableAttachmentNames((names) => names.filter((name) => name !== file.fileName));
      },
      addMediaAttachments: (files) => {
        setUnavailableAttachmentNames((names) =>
          names.filter((name) => !files.some((file) => file.fileName === name)),
        );
        setMediaAttachments((current) => {
          const knownUris = new Set(current.map((file) => file.uri));
          const unique = files.filter((file) => {
            if (knownUris.has(file.uri)) return false;
            knownUris.add(file.uri);
            return true;
          });
          return [...current, ...unique].slice(0, 6);
        });
      },
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
        setUnavailableAttachmentNames([]);
        setSelectedMediaType(null);
        setNeedsMoreInfoChoice('');
      },
    }),
    [
      snapshot,
      unavailableAttachmentNames,
      selectedMediaType,
      needsMoreInfoChoice,
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
