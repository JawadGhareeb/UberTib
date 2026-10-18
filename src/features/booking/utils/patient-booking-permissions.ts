import {
  getMockGrantsForScenario,
} from '@/features/profile/mocks/representation.mock';
import type { MockScenarioDefinition } from '@/shared/mock';
import { mockPatientWorld } from '@/shared/mock/patient.mock';

/**
 * Demo authorization for choosing a booking subject.
 * A health-assessment permission must not be treated as booking permission.
 * Production booking submission still requires authoritative server validation.
 */
export function canBookForPatient(patientId: string | undefined, scenario: MockScenarioDefinition) {
  const patient = mockPatientWorld.family.find((item) => item.id === patientId);
  if (!patient) return false;
  if (patient.active) return true;

  return getMockGrantsForScenario(scenario).some(
    (grant) =>
      grant.subjectPatientId === patient.id &&
      grant.directionLabel === 'أدير نيابة عنها' &&
      grant.statusLabel === 'فعال' &&
      grant.actions.some((action) => action === 'إدارة الحجوزات'),
  );
}
