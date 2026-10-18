import type { PatientV5Operation } from '@/shared/api/patient-v5-contract';

/**
 * Pen V5 boards 02–08 — client route → backend operations.
 *
 * This is a wiring manifest, not a list of live or agreed endpoint URLs.
 * A route is kept mock-driven until every listed operation has an approved
 * server contract and screen-specific error/pending/permission handling.
 */
export const patientV5ScreenOperations = {
  // 02 — First use, login and profile
  '/': ['identity.profile'],
  '/auth/phone': ['identity.sendOtp'],
  '/auth/code': ['identity.verifyOtp'],
  '/auth/profile-setup': ['identity.profile', 'identity.profileUpdate'],

  // 03 — Assessment and patient-safe recommendation
  '/(tabs)/home': ['care.list', 'booking.list', 'platform.notifications'],
  '/assessment/start': ['assessment.read'],
  '/assessment/patient': ['profile.family', 'assessment.save'],
  '/assessment/complaint': ['assessment.save'],
  '/assessment/location': ['assessment.save'],
  '/assessment/questions': ['assessment.save'],
  '/assessment/health': ['profile.health', 'assessment.save'],
  '/assessment/media': ['assets.prepareUpload', 'assessment.save'],
  '/assessment/review': ['assessment.read', 'assessment.submit'],
  '/assessment/processing': ['assessment.read'],
  '/assessment/result': ['assessment.read'],
  '/assessment/needs-more-info': ['assessment.read', 'assessment.save'],
  '/assessment/manual-review': ['assessment.read'],

  // 04 — Catalog, provider identity, pricing and eligibility
  '/discover': ['catalog.groups'],
  '/discover/group/[groupCode]': ['catalog.groups'],
  '/discover/family/[familyCode]': ['catalog.groups'],
  '/discover/service/[serviceCode]': ['catalog.groups'],
  '/discover/search': ['catalog.groups'],
  '/discover/search/results': ['catalog.groups'],
  '/discover/providers': ['providers.search'],
  '/discover/providers/results': ['providers.search'],
  '/discover/providers/compare': ['providers.detail'],
  '/discover/provider/[providerId]': ['providers.detail'],
  '/discover/provider/[providerId]/branch': ['providers.detail'],
  '/discover/provider/[providerId]/reviews': ['providers.detail', 'providers.reviews'],

  // 05 — Booking state machine
  '/booking': ['booking.list'],
  '/booking/reason': ['booking.slots'],
  '/booking/patient': ['profile.family'],
  '/booking/slots': ['booking.slots', 'providers.detail'],
  '/booking/review': ['booking.slots', 'booking.create'],
  '/booking/[bookingId]': ['booking.read'],
  '/booking/[bookingId]/status': ['booking.read'],
  '/booking/[bookingId]/alternative': ['booking.read', 'booking.alternativeDecision'],
  '/booking/[bookingId]/reschedule': ['booking.read', 'booking.slots', 'booking.reschedule'],
  '/booking/[bookingId]/cancel': ['booking.read', 'booking.cancel'],

  // 06 — Clinical case, plan, evidence and follow-up
  '/(tabs)/care': ['care.list'],
  '/care/[caseId]/timeline': ['care.read', 'care.timeline'],
  '/care/[caseId]/plan': ['care.plan'],
  '/care/[caseId]/plan-acceptance': ['care.plan', 'care.planDecision'],
  '/care/[caseId]/stage/[stageId]': ['care.stage', 'care.evidenceUpload'],
  '/care/[caseId]/follow-ups': ['care.followUps', 'care.stage', 'assets.prepareUpload'],

  // 07 — External payments, refund and complaints
  '/care/[caseId]/financial': ['finance.snapshot', 'finance.events'],
  '/care/[caseId]/financial/timeline': ['finance.events', 'finance.verifyPayment', 'finance.respondPayment'],
  '/care/[caseId]/financial/report-payment': ['finance.reportExternalPayment', 'assets.prepareUpload'],
  '/care/[caseId]/financial/refund-execution': ['finance.refund', 'finance.reportRefundExecution'],
  '/care/[caseId]/claims': ['claims.create', 'claims.list', 'claims.refundCreate'],
  '/care/[caseId]/claims/refund': ['finance.refund', 'finance.confirmRefundReceipt'],
  '/care/[caseId]/claims/[claimId]': ['claims.read'],
  '/care/[caseId]/claims/[claimId]/appeal': ['claims.read', 'claims.appeal'],
  '/care/[caseId]/reviews/new': ['reviews.eligibility', 'reviews.submit'],
  '/care/[caseId]/reviews/[reviewId]': ['reviews.read'],
  '/care/[caseId]/reviews/[reviewId]/appeal': ['reviews.read', 'reviews.appeal'],

  // 08 — Account, privacy, family and support
  '/(tabs)/profile': ['identity.profile', 'profile.family'],
  '/profile/settings': ['identity.profile', 'profile.sessions', 'profile.consentList'],
  '/profile/security': ['profile.sessions', 'identity.reverify', 'profile.endSession', 'profile.endOtherSessions'],
  '/profile/privacy': ['profile.consentList'],
  '/profile/privacy/consents/[consentId]': ['profile.consentRead', 'profile.consentWithdraw'],
  '/profile/data': ['profile.exportCreate', 'profile.exportStatus'],
  '/profile/account-closure': ['identity.reverify', 'profile.closureCreate', 'profile.closureStatus'],
  '/profile/health': ['profile.health', 'profile.healthUpdate'],
  '/profile/family': ['profile.family', 'profile.grantCreate', 'profile.grantRevoke'],
  '/profile/active-patient': ['profile.family'],
  '/profile/dependents/new': ['profile.dependentCreate'],
  '/profile/grants/new': ['profile.grantCreate'],
  '/profile/grants/[grantId]': ['profile.grantRead', 'profile.grantRevoke'],
  '/notifications': ['platform.notifications', 'platform.notificationRead'],
  '/needs-attention': ['platform.notifications'],
  '/support': ['support.list', 'support.read', 'support.create', 'support.addEvidence', 'assets.prepareUpload'],
} as const satisfies Record<string, readonly PatientV5Operation[]>;

export type PatientV5MappedScreen = keyof typeof patientV5ScreenOperations;
