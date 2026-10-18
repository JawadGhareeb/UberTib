import type { PropsWithChildren } from 'react';
import { createContext, useContext, useMemo, useState } from 'react';

import {
  defaultMockScenarioId,
  getMockScenario,
  getMockSurfaceState,
  type MockReadState,
  type MockScenarioId,
  type MockSurface,
} from '@/shared/mock/scenarios';

/** Mock-only booking request, never an authoritative confirmed appointment. */
export interface MockBookingRequest {
  id: string;
  serviceCode: string;
  serviceName: string;
  providerId: string;
  providerName: string;
  branch: string;
  patientName: string;
  dateLabel: string;
  timeLabel: string;
  priceLabel: string;
  // Explicit, mock-only consent flags. No medical records or files are transmitted.
  sharingConsent?: {
    visitSummary: boolean;
    photos: boolean;
    medicalHistory: boolean;
  };
  status: 'pending';
  statusLabel: 'قيد التأكيد';
  note: string;
  patientNote?: string;
}

export interface MockStageEvidenceDraft {
  caseId: string;
  stageId: string;
  fileName: string;
  localUri: string;
  status: 'local-draft';
}

export interface MockBookingMutation {
  cancellation?: {
    status: 'pending';
  };
  reschedule?: {
    status: 'pending';
    proposedDateLabel: string;
    proposedTimeLabel: string;
  };
  alternative?: {
    status: 'pending';
    decision: 'accept' | 'decline';
  };
}

export interface MockDependentRequestInput {
  name: string;
  relation: string;
  legalBasis: string;
  documentReference: string;
  purpose: string;
  requestedActions: string[];
  dataScope: string;
}

export interface MockGrantRequestInput {
  subjectId: string;
  subjectName: string;
  granteeName: string;
  actions: string[];
  dataScope: string;
  period: string;
  purpose: string;
  legalBasis: string;
}

export interface MockRepresentationSubmission {
  id: string;
  kind: 'dependent' | 'grant';
  title: string;
  typeLabel: string;
  statusLabel: 'قيد التحقق';
  submittedAtLabel: string;
  detail: string;
  request: MockDependentRequestInput | MockGrantRequestInput;
}

export interface MockGrantMutation {
  revocation?: {
    status: 'pending';
  };
}

export interface MockClaimSubmission {
  id: string;
  caseId: string;
  kind: 'refund' | 'protection' | 'issue';
  type: 'refund' | 'protection' | 'clinical' | 'appointment' | 'external-payment-dispute' | 'refund-execution';
  typeLabel: string;
  title: string;
  amountLabel: string;
  statusLabel: 'قيد المراجعة';
  deadlineLabel: string;
  evidenceProgressLabel: string;
  evidence: {
    id: string;
    title: string;
    status: 'complete' | 'pending';
  }[];
  history: {
    id: string;
    title: string;
    dateLabel: string;
  }[];
  appealEligible: false;
}

export interface MockReviewSubmission {
  id: string;
  caseId: string;
  title: string;
  provider: string;
  rating: number;
  comment: string;
  submittedAtLabel: string;
  statusLabel: 'التحقق من التجربة قيد المعالجة';
  appealEligible: false;
}

export interface MockFinancialSubmission {
  id: string;
  caseId: string;
  kind: 'external-payment' | 'refund-execution';
  title: string;
  amountLabel: string;
  dateLabel: string;
  statusLabel: string;
  detail: string;
}

export interface MockFinancialEventResponse {
  status: 'pending';
  decision: 'confirmed' | 'disputed';
  reason?: string;
}

interface MockScenarioContextValue {
  scenarioId: MockScenarioId;
  scenario: ReturnType<typeof getMockScenario>;
  setScenarioId: (scenarioId: MockScenarioId) => void;
  getSurfaceState: (surface: MockSurface) => MockReadState;

  bookingRequests: MockBookingRequest[];
  submitBookingRequest: (input: Omit<MockBookingRequest, 'id' | 'status' | 'statusLabel' | 'note'>) => void;
  getBookingMutation: (bookingId?: string) => MockBookingMutation | undefined;
  submitBookingCancellation: (bookingId: string) => void;
  submitBookingReschedule: (
    bookingId: string,
    proposal: { proposedDateLabel: string; proposedTimeLabel: string },
  ) => void;
  submitBookingAlternativeDecision: (bookingId: string, decision: 'accept' | 'decline') => void;

  representationSubmissions: MockRepresentationSubmission[];
  pendingGrantRevocationIds: string[];
  getGrantMutation: (grantId?: string) => MockGrantMutation | undefined;
  submitDependentRequest: (input: MockDependentRequestInput) => void;
  submitGrantRequest: (input: MockGrantRequestInput) => void;
  submitGrantRevocation: (grantId: string) => void;

  claimSubmissions: MockClaimSubmission[];
  claimAppealIds: string[];
  claimAppealDrafts: Record<string, { reason: string; evidenceName?: string }>;
  claimExplanationRequestIds: string[];
  requestClaimExplanation: (claimId: string) => void;
  submitRefundRequest: (input: { caseId: string; amountLabel: string; reason: string }) => void;
  submitProtectionClaim: (input: { caseId: string; reason: string }) => void;
  submitCaseIssue: (input: {
    caseId: string;
    type: 'clinical' | 'appointment' | 'external-payment-dispute' | 'refund-execution';
    reason: string;
    evidenceTitles?: string[];
  }) => void;
  submitClaimAppeal: (claimId: string, input: { reason: string; evidenceName?: string }) => void;

  reviewSubmissions: MockReviewSubmission[];
  reviewAppealIds: string[];
  submitReview: (input: {
    caseId: string;
    title: string;
    provider: string;
    rating: number;
    comment: string;
  }) => void;
  submitReviewAppeal: (reviewId: string) => void;

  financialSubmissions: MockFinancialSubmission[];
  financialEventResponses: Record<string, MockFinancialEventResponse>;
  submitExternalPayment: (input: {
    caseId: string;
    amountLabel: string;
    reference: string;
  }) => void;
  submitRefundExecution: (input: { caseId: string; reference: string }) => void;
  submitFinancialEventResponse: (
    eventId: string,
    decision: 'confirmed' | 'disputed',
    reason?: string,
  ) => void;

  stageEvidenceDrafts: Record<string, MockStageEvidenceDraft>;
  saveStageEvidenceDraft: (draft: MockStageEvidenceDraft) => void;

  planAcceptanceCaseIds: string[];
  planAmendmentDecisions: Record<string, 'accept' | 'reject'>;
  planAmendmentRejectionReasons: Record<string, string>;
  submitPlanAcceptance: (caseId: string, decision?: 'accept' | 'reject', reason?: string) => void;

  readNotificationIds: string[];
  markNotificationRead: (notificationId: string) => void;
}

const MockScenarioContext = createContext<MockScenarioContextValue | null>(null);

function upsertById<T extends { id: string }>(items: T[], next: T): T[] {
  return [next, ...items.filter((item) => item.id !== next.id)];
}

export function MockScenarioProvider({ children }: PropsWithChildren) {
  const [scenarioId, setScenarioIdState] = useState<MockScenarioId>(defaultMockScenarioId);
  const [bookingRequests, setBookingRequests] = useState<MockBookingRequest[]>([]);
  const [bookingMutations, setBookingMutations] = useState<Record<string, MockBookingMutation>>({});
  const [representationSubmissions, setRepresentationSubmissions] = useState<
    MockRepresentationSubmission[]
  >([]);
  const [grantMutations, setGrantMutations] = useState<Record<string, MockGrantMutation>>({});
  const [claimSubmissions, setClaimSubmissions] = useState<MockClaimSubmission[]>([]);
  const [claimAppealIds, setClaimAppealIds] = useState<string[]>([]);
  const [claimAppealDrafts, setClaimAppealDrafts] = useState<Record<string, { reason: string; evidenceName?: string }>>({});
  const [claimExplanationRequestIds, setClaimExplanationRequestIds] = useState<string[]>([]);
  const [reviewSubmissions, setReviewSubmissions] = useState<MockReviewSubmission[]>([]);
  const [reviewAppealIds, setReviewAppealIds] = useState<string[]>([]);
  const [financialSubmissions, setFinancialSubmissions] = useState<MockFinancialSubmission[]>([]);
  const [financialEventResponses, setFinancialEventResponses] = useState<
    Record<string, MockFinancialEventResponse>
  >({});
  const [stageEvidenceDrafts, setStageEvidenceDrafts] = useState<Record<string, MockStageEvidenceDraft>>({});
  const [planAcceptanceCaseIds, setPlanAcceptanceCaseIds] = useState<string[]>([]);
  const [planAmendmentDecisions, setPlanAmendmentDecisions] = useState<
    Record<string, 'accept' | 'reject'>
  >({});
  const [planAmendmentRejectionReasons, setPlanAmendmentRejectionReasons] = useState<Record<string, string>>({});
  const [readNotificationIds, setReadNotificationIds] = useState<string[]>([]);
  const scenario = useMemo(() => getMockScenario(scenarioId), [scenarioId]);

  const value = useMemo<MockScenarioContextValue>(
    () => ({
      scenarioId,
      scenario,
      setScenarioId: (nextScenarioId) => {
        setScenarioIdState(nextScenarioId);
        setBookingRequests([]);
        setBookingMutations({});
        setRepresentationSubmissions([]);
        setGrantMutations({});
        setClaimSubmissions([]);
        setClaimAppealIds([]);
        setClaimAppealDrafts({});
        setClaimExplanationRequestIds([]);
        setReviewSubmissions([]);
        setReviewAppealIds([]);
        setFinancialSubmissions([]);
        setFinancialEventResponses({});
        setStageEvidenceDrafts({});
        setPlanAcceptanceCaseIds([]);
        setPlanAmendmentDecisions({});
        setPlanAmendmentRejectionReasons({});
        setReadNotificationIds([]);
      },
      getSurfaceState: (surface) => getMockSurfaceState(scenario, surface),

      bookingRequests,
      submitBookingRequest: (input) => {
        setBookingRequests((current) => {
          // Repeated taps or a retry of the same mock request must not create a second appointment.
          if (current.some((request) =>
            request.patientName === input.patientName &&
            request.providerId === input.providerId &&
            request.serviceCode === input.serviceCode &&
            request.dateLabel === input.dateLabel &&
            request.timeLabel === input.timeLabel
          )) return current;
          return [{
            ...input,
            id: `session-booking-${current.length + 1}`,
            status: 'pending',
            statusLabel: 'قيد التأكيد',
            note: 'طلب تجريبي محفوظ في هذه الجلسة؛ لم يصل تأكيد من العيادة بعد.',
          }, ...current];
        });
      },
      getBookingMutation: (bookingId) => (bookingId ? bookingMutations[bookingId] : undefined),
      submitBookingCancellation: (bookingId) => {
        setBookingMutations((current) => ({
          ...current,
          [bookingId]: { cancellation: { status: 'pending' } },
        }));
      },
      submitBookingReschedule: (bookingId, proposal) => {
        setBookingMutations((current) => ({
          ...current,
          [bookingId]: {
            reschedule: {
              status: 'pending',
              proposedDateLabel: proposal.proposedDateLabel,
              proposedTimeLabel: proposal.proposedTimeLabel,
            },
          },
        }));
      },
      submitBookingAlternativeDecision: (bookingId, decision) => {
        setBookingMutations((current) => ({
          ...current,
          [bookingId]: {
            alternative: {
              status: 'pending',
              decision,
            },
          },
        }));
      },

      representationSubmissions,
      pendingGrantRevocationIds: Object.entries(grantMutations)
        .filter(([, mutation]) => mutation.revocation?.status === 'pending')
        .map(([grantId]) => grantId),
      getGrantMutation: (grantId) => (grantId ? grantMutations[grantId] : undefined),
      submitDependentRequest: (input) => {
        setRepresentationSubmissions((current) => [
          {
            id: `session-dependent-${current.length + 1}`,
            kind: 'dependent',
            title: `طلب إضافة ${input.name}`,
            typeLabel: 'إضافة تابع',
            statusLabel: 'قيد التحقق',
            submittedAtLabel: 'الآن',
            detail: `تم استلام طلب إثبات العلاقة (${input.relation}) على أساس ${input.legalBasis}، مع مرجع ${input.documentReference} وغرض: ${input.purpose}. النطاق المطلوب: ${input.dataScope}. ما تم منح أي صلاحية بعد.`,
            request: input,
          },
          ...current,
        ]);
      },
      submitGrantRequest: (input) => {
        setRepresentationSubmissions((current) => [
          {
            id: `session-grant-${current.length + 1}`,
            kind: 'grant',
            title: `طلب تفويض لـ${input.granteeName}`,
            typeLabel: 'تفويض',
            statusLabel: 'قيد التحقق',
            submittedAtLabel: 'الآن',
            detail: `تم استلام تفويض على ${input.subjectName} لغرض: ${input.purpose}. الصلاحيات: ${input.actions.join('، ')}. النطاق: ${input.dataScope}. المدة: ${input.period}. ما رح يصبح فعالاً قبل اكتمال التحقق.`,
            request: input,
          },
          ...current,
        ]);
      },
      submitGrantRevocation: (grantId) => {
        setGrantMutations((current) => ({
          ...current,
          [grantId]: { revocation: { status: 'pending' } },
        }));
      },

      claimSubmissions,
      claimAppealIds,
      claimAppealDrafts,
      claimExplanationRequestIds,
      requestClaimExplanation: (claimId) => {
        setClaimExplanationRequestIds((current) =>
          current.includes(claimId) ? current : [claimId, ...current],
        );
      },
      submitRefundRequest: ({ caseId, amountLabel, reason }) => {
        const id = `session-refund-${caseId}`;
        const submission: MockClaimSubmission = {
          id,
          caseId,
          kind: 'refund',
          type: 'refund',
          typeLabel: 'طلب استرداد',
          title: 'طلب مراجعة مبلغ جديد',
          amountLabel,
          statusLabel: 'قيد المراجعة',
          deadlineLabel: 'الرد المتوقع قبل 25 سبتمبر',
          evidenceProgressLabel: 'الطلب مستلم',
          evidence: [
            { id: `${id}-e1`, title: 'سبب الطلب', status: 'complete' },
            { id: `${id}-e2`, title: 'مرجع الشروط المقبولة', status: 'complete' },
          ],
          history: [
            {
              id: `${id}-h1`,
              title: `تم إرسال الطلب: ${reason}`,
              dateLabel: 'الآن',
            },
          ],
          appealEligible: false,
        };
        setClaimSubmissions((current) => upsertById(current, submission));
      },
      submitProtectionClaim: ({ caseId, reason }) => {
        const id = `session-protection-${caseId}`;
        const submission: MockClaimSubmission = {
          id,
          caseId,
          kind: 'protection',
          type: 'protection',
          typeLabel: 'مطالبة حماية',
          title: 'مطالبة حماية جديدة',
          amountLabel: '—',
          statusLabel: 'قيد المراجعة',
          deadlineLabel: 'موعد الرد يظهر بعد اكتمال فحص الأدلة',
          evidenceProgressLabel: '3 من 3 مكتملة',
          evidence: [
            { id: `${id}-e1`, title: 'الخطة الحاكمة', status: 'complete' },
            { id: `${id}-e2`, title: 'السجل السريري المطلوب', status: 'complete' },
            { id: `${id}-e3`, title: 'شرح سبب المطالبة', status: 'complete' },
          ],
          history: [
            {
              id: `${id}-h1`,
              title: `تم إرسال المطالبة: ${reason}`,
              dateLabel: 'الآن',
            },
          ],
          appealEligible: false,
        };
        setClaimSubmissions((current) => upsertById(current, submission));
      },
      submitCaseIssue: ({ caseId, type, reason, evidenceTitles = [] }) => {
        const id = `session-issue-${caseId}-${type}`;
        const typeLabels = {
          clinical: 'مشكلة في العلاج أو المتابعة',
          appointment: 'مشكلة في الموعد أو التواصل',
          'external-payment-dispute': 'نزاع على دفعة خارجية',
          'refund-execution': 'مشكلة في تنفيذ الاسترداد',
        };
        const submission: MockClaimSubmission = {
          id,
          caseId,
          kind: 'issue',
          type,
          typeLabel: typeLabels[type],
          title: typeLabels[type],
          amountLabel: '—',
          statusLabel: 'قيد المراجعة',
          deadlineLabel: 'تظهر المهلة بعد مراجعة فريق الدعم',
          evidenceProgressLabel: evidenceTitles.length
            ? `${evidenceTitles.length} مرفق محلي بانتظار الإرسال`
            : 'لا يوجد مرفق محلي',
          evidence: evidenceTitles.map((title, index) => ({
            id: `${id}-e${index + 1}`,
            title,
            status: 'pending' as const,
          })),
          history: [{
            id: `${id}-h1`,
            title: `حُفظت مشكلة تجريبية للمراجعة: ${reason}`,
            dateLabel: 'الآن',
          }],
          appealEligible: false,
        };
        setClaimSubmissions((current) => upsertById(current, submission));
      },
      submitClaimAppeal: (claimId, input) => {
        if (!input.reason.trim()) return;
        setClaimAppealDrafts((current) => ({
          ...current,
          [claimId]: { reason: input.reason.trim(), evidenceName: input.evidenceName },
        }));
        setClaimAppealIds((current) =>
          current.includes(claimId) ? current : [claimId, ...current],
        );
      },

      reviewSubmissions,
      reviewAppealIds,
      submitReview: ({ caseId, title, provider, rating, comment }) => {
        const id = `session-review-${caseId}`;
        const submission: MockReviewSubmission = {
          id,
          caseId,
          title,
          provider,
          rating,
          comment,
          submittedAtLabel: 'الآن',
          statusLabel: 'التحقق من التجربة قيد المعالجة',
          appealEligible: false,
        };
        setReviewSubmissions((current) => upsertById(current, submission));
      },
      submitReviewAppeal: (reviewId) => {
        setReviewAppealIds((current) =>
          current.includes(reviewId) ? current : [reviewId, ...current],
        );
      },

      financialSubmissions,
      financialEventResponses,
      submitExternalPayment: ({ caseId, amountLabel, reference }) => {
        const id = `session-payment-${caseId}`;
        const submission: MockFinancialSubmission = {
          id,
          caseId,
          kind: 'external-payment',
          title: 'دفعة خارج المنصة · بلاغ جديد',
          amountLabel,
          dateLabel: 'الآن',
          statusLabel: 'بانتظار تأكيد العيادة',
          detail: `تم تسجيل مرجع الدفعة الخارجية: ${reference || 'بدون مرجع إضافي'}.`,
        };
        setFinancialSubmissions((current) => upsertById(current, submission));
      },
      submitRefundExecution: ({ caseId, reference }) => {
        const id = `session-refund-execution-${caseId}`;
        const submission: MockFinancialSubmission = {
          id,
          caseId,
          kind: 'refund-execution',
          title: 'تنفيذ استرداد خارج المنصة',
          amountLabel: '—',
          dateLabel: 'الآن',
          statusLabel: 'بانتظار التأكيد',
          detail: `تم تسجيل مرجع التنفيذ الخارجي: ${reference}.`,
        };
        setFinancialSubmissions((current) => upsertById(current, submission));
      },
      submitFinancialEventResponse: (eventId, decision, reason) => {
        setFinancialEventResponses((current) => ({
          ...current,
          [eventId]: { status: 'pending', decision, reason },
        }));
      },

      stageEvidenceDrafts,
      saveStageEvidenceDraft: (draft) => {
        // This records a device-local draft only. No server upload, clinical
        // approval, or stage completion occurs without an authoritative result.
        setStageEvidenceDrafts((current) => ({
          ...current,
          [draft.caseId + ':' + draft.stageId]: draft,
        }));
      },
      planAcceptanceCaseIds,
      planAmendmentDecisions,
      planAmendmentRejectionReasons,
      submitPlanAcceptance: (caseId, decision = 'accept', reason) => {
        setPlanAcceptanceCaseIds((current) =>
          current.includes(caseId) ? current : [caseId, ...current],
        );
        setPlanAmendmentDecisions((current) => ({
          ...current,
          [caseId]: decision,
        }));
        if (decision === 'reject' && reason?.trim()) {
          setPlanAmendmentRejectionReasons((current) => ({
            ...current,
            [caseId]: reason.trim(),
          }));
        }
      },

      readNotificationIds,
      markNotificationRead: (notificationId) => {
        setReadNotificationIds((current) =>
          current.includes(notificationId) ? current : [...current, notificationId],
        );
      },
    }),
    [
      bookingRequests,
      bookingMutations,
      claimAppealIds,
      claimAppealDrafts,
      claimExplanationRequestIds,
      claimSubmissions,
      financialEventResponses,
      financialSubmissions,
      grantMutations,
      planAcceptanceCaseIds,
      planAmendmentDecisions,
      planAmendmentRejectionReasons,
      readNotificationIds,
      representationSubmissions,
      reviewAppealIds,
      reviewSubmissions,
      scenario,
      scenarioId,
      stageEvidenceDrafts,
    ],
  );

  return <MockScenarioContext.Provider value={value}>{children}</MockScenarioContext.Provider>;
}

export function useMockScenario(): MockScenarioContextValue {
  const value = useContext(MockScenarioContext);

  if (!value) {
    throw new Error('useMockScenario must be used inside MockScenarioProvider');
  }

  return value;
}
