import type { PropsWithChildren } from 'react';
import { createContext, useContext, useMemo, useState } from 'react';

import { mockPatientWorld } from '@/shared/mock/patient.mock';

interface AccountDetails {
  name: string;
  phone: string;
  city: string;
  setName: (name: string) => void;
  setVerifiedPhone: (phone: string) => void;
}
const Context = createContext<AccountDetails | null>(null);

/** Mock account editing state only. Verified phone changes only after the local OTP challenge passes; server verification is needed for production. */
export function AccountDetailsProvider({ children }: PropsWithChildren) {
  const [name, setName] = useState<string>(mockPatientWorld.account.name);
  const [phone, setVerifiedPhone] = useState<string>(mockPatientWorld.account.phone);
  const value = useMemo<AccountDetails>(
    () => ({
      name,
      phone,
      city: mockPatientWorld.account.city,
      setName,
      setVerifiedPhone,
    }),
    [name, phone],
  );
  return <Context.Provider value={value}>{children}</Context.Provider>;
}
export function useAccountDetails() {
  const context = useContext(Context);
  if (!context) throw new Error('useAccountDetails requires AccountDetailsProvider');
  return context;
}
