export const mockWorldIds = {
  account: 'acct-patient-001',
  patient: {
    primary: 'patient-001',
    dependent: 'patient-002',
  },
  provider: {
    layan: 'provider-layan',
    omar: 'provider-omar',
    rama: 'provider-rama',
    yazan: 'provider-yazan',
  },
  service: {
    dentalCheckup: 'dental-checkup',
    dentalCleaning: 'dental-cleaning',
    dentalFilling: 'dental-filling',
    rootCanal: 'root-canal',
    teethWhitening: 'teeth-whitening',
  },
  booking: {
    primary: 'booking-001',
    completed: 'booking-002',
  },
  careCase: {
    active: 'case-001',
    completed: 'case-002',
  },
  claim: {
    underReview: 'claim-001',
    appealEligible: 'claim-002',
  },
  notification: {
    bookingConfirmed: 'notification-001',
    careUpdated: 'notification-002',
    planAccepted: 'notification-003',
    unreadByDefault: ['notification-001', 'notification-002'],
  },
} as const;
