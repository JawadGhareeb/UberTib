/**
 * UperTib Patient V5 — integration surface.
 *
 * Derived from the Pen handoff journeys (02–08), not a declaration of
 * currently deployed backend endpoints. No route paths are assumed.
 *
 * Committing writes return operation receipts; draft saves may return a\n * versioned snapshot. A user tap never means an
 * appointment, plan, payment, refund, grant or account closure succeeded.
 */

export type ResourceId = string;
export type ISODateTime = string;

export interface PatientScope {
  /** Authenticated operator; not necessarily the person receiving treatment. */
  actorId: ResourceId;
  subjectId: ResourceId;
  grantId?: ResourceId;
}

export interface ResourceEnvelope<T> {
  data: T;
  version: string;
  asOf: ISODateTime;
  /** Capabilities are evaluated by the server for this actor and subject. */
  capabilities: string[];
}

export interface CollectionEnvelope<T> extends ResourceEnvelope<T[]> {
  nextCursor?: string | null;
}

export interface CommandContext {
  /**
   * Persist this key across retries. Never generate a new key because the
   * network response to a previous attempt was unknown.
   */
  idempotencyKey: string;
  expectedVersion?: string;
}

export interface CommandReceipt {
  operationId: ResourceId;
  status: 'pending' | 'accepted' | 'rejected' | 'unknown';
  reasonCode?: string;
  asOf: ISODateTime;
  resourceId?: ResourceId;
}

export interface PatientProfile {
  id: ResourceId;
  fullName: string;
  phoneMasked: string;
  status: 'verified' | 'unverified' | 'suspended';
}

export interface ServiceGroup {
  code: string;
  title: string;
  families: { code: string; title: string; description: string }[];
}

export interface AssessmentSnapshot {
  id: ResourceId;
  patientId: ResourceId;
  status: 'draft' | 'submitting' | 'processing' | 'ready' | 'needs_more_info' | 'manual_review';
  version: string;
  complaint?: string;
  toothOrRegion?: string;
  answers: Record<string, unknown>;
  mediaIds: ResourceId[];
  healthSnapshotId?: ResourceId;
  /** Guidance only, never a doctor's diagnosis. */
  guidance?: string;
}

export interface EligibleProvider {
  providerId: ResourceId;
  serviceCode: string;
  branchId: ResourceId;
  name: string;
  branchName: string;
  eligibilityStatus: 'eligible' | 'review' | 'ineligible';
  assessmentAsOf: ISODateTime;
  freshnessExpiresAt?: ISODateTime;
  patientSafeReason: string;
  protectionFunded: boolean;
  nextAvailabilityLabel?: string;
  priceLabel?: string;
}

export interface BookingSlot {
  slotId: ResourceId;
  providerId: ResourceId;
  branchId: ResourceId;
  serviceCode: string;
  startsAt: ISODateTime;
  expiresAt: ISODateTime;
  availabilityVersion: string;
}

export interface BookingRecord {
  id: ResourceId;
  patientId: ResourceId;
  providerId: ResourceId;
  branchId: ResourceId;
  serviceCode: string;
  slotId: ResourceId;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'eligibility_review';
  statusLabel: string;
  proposedAlternative?: { proposalId: ResourceId; expiresAt: ISODateTime; slot: BookingSlot };
  caseId?: ResourceId;
  version: string;
}

export interface TreatmentPlan {
  id: ResourceId;
  caseId: ResourceId;
  acceptedVersionId?: ResourceId;
  proposalVersionId?: ResourceId;
  acceptedSnapshotId?: ResourceId;
  status: 'draft' | 'pending' | 'accepted' | 'superseded' | 'rejected';
  lines: Array<{ id: ResourceId; title: string; amountMinor: number; currency: 'SYP' }>;
  changes?: Array<{ lineId: ResourceId; reason: string; beforeMinor: number; afterMinor: number }>;
  totalMinor: number;
  currency: 'SYP';
}

export interface CareCase {
  id: ResourceId;
  patientId: ResourceId;
  bookingId?: ResourceId;
  title: string;
  status: 'active' | 'completed' | 'closed';
  planId?: ResourceId;
  currentStageId?: ResourceId;
  version: string;
}

export interface CaseTimelineEvent {
  id: ResourceId;
  caseId: ResourceId;
  category: 'clinical' | 'booking' | 'finance' | 'claim' | 'review';
  label: string;
  detail: string;
  recordedAt: ISODateTime;
  source: 'patient' | 'provider' | 'system';
  immutable: boolean;
  relatedResourceId?: ResourceId;
}

export interface FinancialSnapshot {
  id: ResourceId;
  caseId: ResourceId;
  planVersionId: ResourceId;
  currency: 'SYP';
  totalMinor: number;
  acceptedAt: ISODateTime;
  lines: Array<{ id: ResourceId; title: string; amountMinor: number; dueAt?: ISODateTime }>;
  cancellationTerms: string;
  externalOnly: true;
}

export interface PaymentEvent {
  id: ResourceId;
  caseId: ResourceId;
  financialSnapshotId: ResourceId;
  externalReference: string;
  status: 'sending' | 'unknown' | 'confirmed' | 'disputed' | 'rejected';
  amountMinor: number;
  currency: 'SYP';
  asOf: ISODateTime;
}

export interface RefundRecord {
  id: ResourceId;
  caseId: ResourceId;
  financialSnapshotId: ResourceId;
  affectedLineId: ResourceId;
  amountMinor: number;
  currency: 'SYP';
  status: 'requested' | 'approved' | 'rejected' | 'external_execution' | 'receipt_pending' | 'completed';
  deadlineAt?: ISODateTime;
  externalReference?: string;
}

export interface ClaimRecord {
  id: ResourceId;
  caseId: ResourceId;
  type: 'clinical' | 'appointment' | 'external_payment_dispute' | 'refund' | 'protection';
  status: 'draft' | 'pending' | 'needs_evidence' | 'accepted' | 'rejected' | 'appealed';
  evidenceIds: ResourceId[];
  decisionId?: ResourceId;
  appealEligible: boolean;
  deadlineAt?: ISODateTime;
}

export interface ReviewRecord {
  id: ResourceId;
  caseId: ResourceId;
  status: 'pending' | 'verified' | 'published' | 'moderated' | 'retired' | 'appealed';
  stars: number;
  comment: string;
  moderationReason?: string;
  appealEligible: boolean;
}

export interface ConsentRecord {
  id: ResourceId;
  purpose: string;
  version: string;
  status: 'active' | 'withdrawn' | 'unavailable';
  withdrawalAllowed: boolean;
  acceptedAt?: ISODateTime;
  nextVersion?: string;
  immutableHistory: Array<{ version: string; action: 'accepted' | 'withdrawn'; at: ISODateTime }>;
}

export interface ExportRecord {
  id: ResourceId;
  status: 'not_requested' | 'preparing' | 'ready' | 'expired' | 'failed';
  expiresAt?: ISODateTime;
  /** Short-lived authenticated URL, never fabricated on device. */
  downloadUrl?: string;
}

export interface ClosureRecord {
  id: ResourceId;
  status: 'requested' | 'review' | 'scheduled' | 'closed' | 'rejected';
  retentionExplanation: string;
  version: string;
}

export interface SecuritySession {
  id: ResourceId;
  label: string;
  isCurrent: boolean;
  trusted: boolean;
  lastActivityAt: ISODateTime;
}

export interface SupportTicket {
  id: ResourceId;
  caseId?: ResourceId;
  status: 'open' | 'awaiting_evidence' | 'in_review' | 'closed';
  title: string;
  dueAt?: ISODateTime;
  evidenceIds: ResourceId[];
}

/**
 * Source-of-truth operation names, **not** route URLs.
 * The backend will supply paths/methods/schema mappings per operation.
 */
export interface PatientV5Operations {
  'identity.sendOtp': { request: { phone: string; purpose: 'login' | 'reverify' }; response: { challengeId: string; expiresAt: ISODateTime } };
  'identity.verifyOtp': { request: { challengeId: string; code: string }; response: { accessToken: string; needsProfileSetup: boolean } };
  'identity.reverify': { request: { scope: PatientScope; purpose: 'security' | 'closure' | 'consent' }; response: { reverifyToken: string; expiresAt: ISODateTime } };
  'identity.profile': { request: { scope: PatientScope }; response: ResourceEnvelope<PatientProfile> };
  'identity.profileUpdate': { request: { scope: PatientScope; changes: Partial<PatientProfile> }; response: CommandReceipt };
  'assessment.save': { request: { scope: PatientScope; assessment: AssessmentSnapshot }; response: ResourceEnvelope<AssessmentSnapshot> };
  'assessment.submit': { request: { scope: PatientScope; assessmentId: string }; response: CommandReceipt };
  'assessment.read': { request: { scope: PatientScope; assessmentId: string }; response: ResourceEnvelope<AssessmentSnapshot> };
  'catalog.groups': { request: { lang: 'ar' | 'en' }; response: CollectionEnvelope<ServiceGroup> };
  'providers.search': { request: { scope?: PatientScope; serviceCode: string; area?: string; cursor?: string }; response: CollectionEnvelope<EligibleProvider> };
  'providers.reviews': { request: { providerId: string; serviceCode: string; cursor?: string }; response: CollectionEnvelope<ReviewRecord> };
  'providers.detail': { request: { providerId: string; serviceCode: string }; response: ResourceEnvelope<EligibleProvider> };
  'booking.slots': { request: { providerId: string; branchId: string; serviceCode: string; from: ISODateTime }; response: CollectionEnvelope<BookingSlot> };
  'booking.create': { request: { scope: PatientScope; slotId: string; serviceCode: string; branchId: string; sharedMediaIds: string[]; sharedHealthSnapshotId?: string }; response: CommandReceipt };
  'booking.list': { request: { scope: PatientScope; cursor?: string }; response: CollectionEnvelope<BookingRecord> };
  'booking.read': { request: { scope: PatientScope; bookingId: string }; response: ResourceEnvelope<BookingRecord> };
  'booking.alternativeDecision': { request: { scope: PatientScope; bookingId: string; proposalId: string; decision: 'accept' | 'decline' }; response: CommandReceipt };
  'booking.reschedule': { request: { scope: PatientScope; bookingId: string; slotId: string }; response: CommandReceipt };
  'booking.cancel': { request: { scope: PatientScope; bookingId: string; reason: string }; response: CommandReceipt };
  'care.list': { request: { scope: PatientScope }; response: CollectionEnvelope<CareCase> };
  'care.read': { request: { scope: PatientScope; caseId: string }; response: ResourceEnvelope<CareCase> };
  'care.timeline': { request: { scope: PatientScope; caseId: string; cursor?: string }; response: CollectionEnvelope<CaseTimelineEvent> };
  'care.plan': { request: { scope: PatientScope; caseId: string }; response: ResourceEnvelope<TreatmentPlan> };
  'care.planDecision': { request: { scope: PatientScope; caseId: string; proposalVersionId: string; decision: 'accept' | 'reject'; reason?: string }; response: CommandReceipt };
  'care.stage': { request: { scope: PatientScope; caseId: string; stageId: string }; response: ResourceEnvelope<{ id: string; status: string; evidenceIds: string[]; followUpIds: string[] }> };
  'care.followUps': { request: { scope: PatientScope; caseId: string }; response: CollectionEnvelope<{ id: string; dueAt: ISODateTime; status: 'scheduled' | 'due' | 'overdue' | 'completed'; bookingId?: string }> };
  'care.evidenceUpload': { request: { scope: PatientScope; caseId: string; stageId: string; uploadToken: string }; response: CommandReceipt };
  'finance.snapshot': { request: { scope: PatientScope; caseId: string }; response: ResourceEnvelope<FinancialSnapshot> };
  'finance.events': { request: { scope: PatientScope; caseId: string }; response: CollectionEnvelope<PaymentEvent> };
  'finance.verifyPayment': { request: { scope: PatientScope; caseId: string; paymentEventId: string; externalReference: string }; response: CommandReceipt };
  'finance.respondPayment': { request: { scope: PatientScope; paymentEventId: string; decision: 'confirmed' | 'disputed'; reason?: string }; response: CommandReceipt };
  'finance.reportExternalPayment': { request: { scope: PatientScope; caseId: string; financialSnapshotId: string; method: string; externalReference: string; evidenceIds: string[] }; response: CommandReceipt };
  'finance.reportRefundExecution': { request: { scope: PatientScope; refundId: string; externalReference: string; evidenceIds: string[] }; response: CommandReceipt };
  'finance.refund': { request: { scope: PatientScope; caseId: string; refundId: string }; response: ResourceEnvelope<RefundRecord> };
  'finance.confirmRefundReceipt': { request: { scope: PatientScope; refundId: string; received: boolean }; response: CommandReceipt };
  'claims.refundCreate': { request: { scope: PatientScope; caseId: string; financialSnapshotId: string; affectedLineId: string; reason: string }; response: CommandReceipt };
  'claims.read': { request: { scope: PatientScope; claimId: string }; response: ResourceEnvelope<ClaimRecord> };
  'claims.create': { request: { scope: PatientScope; caseId: string; type: ClaimRecord['type']; description: string; evidenceIds: string[] }; response: CommandReceipt };
  'claims.list': { request: { scope: PatientScope; caseId: string }; response: CollectionEnvelope<ClaimRecord> };
  'claims.appeal': { request: { scope: PatientScope; claimId: string; reason: string }; response: CommandReceipt };
  'reviews.eligibility': { request: { scope: PatientScope; caseId: string }; response: ResourceEnvelope<{ eligible: boolean; reason?: string; deadlineAt?: ISODateTime }> };
  'reviews.submit': { request: { scope: PatientScope; caseId: string; stars: number; comment: string }; response: CommandReceipt };
  'reviews.read': { request: { scope: PatientScope; reviewId: string }; response: ResourceEnvelope<ReviewRecord> };
  'reviews.appeal': { request: { scope: PatientScope; reviewId: string; reason: string }; response: CommandReceipt };
  'profile.consentList': { request: { scope: PatientScope }; response: CollectionEnvelope<ConsentRecord> };
  'profile.consentRead': { request: { scope: PatientScope; consentId: string }; response: ResourceEnvelope<ConsentRecord> };
  'profile.consentWithdraw': { request: { scope: PatientScope; consentId: string; version: string }; response: CommandReceipt };
  'profile.exportCreate': { request: { scope: PatientScope }; response: CommandReceipt };
  'profile.exportStatus': { request: { scope: PatientScope }; response: ResourceEnvelope<ExportRecord> };
  'profile.closureCreate': { request: { scope: PatientScope; reverifyToken: string }; response: CommandReceipt };
  'profile.closureStatus': { request: { scope: PatientScope }; response: ResourceEnvelope<ClosureRecord> };
  'profile.sessions': { request: { scope: PatientScope }; response: CollectionEnvelope<SecuritySession> };
  'profile.endOtherSessions': { request: { scope: PatientScope; reverifyToken: string }; response: CommandReceipt };
  'profile.endSession': { request: { scope: PatientScope; sessionId: string; reverifyToken: string }; response: CommandReceipt };
  'profile.family': { request: { scope: PatientScope }; response: CollectionEnvelope<{ patientId: string; role: string; grantId?: string; grantStatus: string }> };
  'profile.grantRead': { request: { scope: PatientScope; grantId: string }; response: ResourceEnvelope<{ id: string; subjectId: string; granteeId: string; status: string; actions: string[]; expiresAt?: ISODateTime }> };
  'profile.grantCreate': { request: { scope: PatientScope; subjectId: string; granteeId: string; actions: string[]; expiresAt?: ISODateTime; evidenceIds: string[] }; response: CommandReceipt };
  'profile.grantRevoke': { request: { scope: PatientScope; grantId: string; reason: string }; response: CommandReceipt };
  'profile.dependentCreate': { request: { scope: PatientScope; name: string; relation: string; evidenceIds: string[] }; response: CommandReceipt };
  'profile.healthUpdate': { request: { scope: PatientScope; healthVersion: string; allergies: string[]; dentalHistory: string[] }; response: CommandReceipt };
  'profile.health': { request: { scope: PatientScope }; response: ResourceEnvelope<{ healthVersion: string; allergies: string[]; dentalHistory: string[] }> };
  'platform.notificationRead': { request: { scope: PatientScope; notificationId: string }; response: CommandReceipt };
  'platform.notifications': { request: { scope: PatientScope }; response: CollectionEnvelope<{ id: string; title: string; route?: string; needsAction: boolean }> };
  'support.list': { request: { scope: PatientScope }; response: CollectionEnvelope<SupportTicket> };
  'support.addEvidence': { request: { scope: PatientScope; ticketId: string; uploadId: string }; response: CommandReceipt };
  'support.read': { request: { scope: PatientScope; ticketId: string }; response: ResourceEnvelope<SupportTicket> };
  'assets.prepareUpload': { request: { scope: PatientScope; resourceType: 'assessment' | 'booking' | 'care' | 'claim' | 'support'; mimeType: string; fileSize: number; fileName: string }; response: { uploadId: ResourceId; uploadUrl: string; expiresAt: ISODateTime } };
  'support.create': { request: { scope: PatientScope; caseId?: string; title: string; message: string; evidenceIds: string[] }; response: CommandReceipt };
}

export type PatientV5Operation = keyof PatientV5Operations;
export type PatientV5Request<K extends PatientV5Operation> = PatientV5Operations[K]['request'];
export type PatientV5Response<K extends PatientV5Operation> = PatientV5Operations[K]['response'];
