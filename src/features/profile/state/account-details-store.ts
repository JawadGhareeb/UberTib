import { create } from 'zustand';
import { registerSessionStore } from '@/shared/state/session-stores';
import { mockPatientWorld } from '@/shared/mock/patient.mock';

interface AccountDetails {
  name: string;
  phone: string;
  city: string;
  setName: (name: string) => void;
  setVerifiedPhone: (phone: string) => void;
}

/** Session-scoped account edits; never pre-verify a phone without local OTP. */
export const useAccountDetails = create<AccountDetails>()((set) => ({
  name: mockPatientWorld.account.name,
  phone: mockPatientWorld.account.phone,
  city: mockPatientWorld.account.city,
  setName: (name) => set({ name }),
  setVerifiedPhone: (phone) => set({ phone }),
}));

registerSessionStore(useAccountDetails);
