import { createContext, useContext, useMemo, useState, type PropsWithChildren } from 'react';

import { mockPatientWorld } from '@/shared/mock/patient.mock';

export interface FamilyMember {
  id: string;
  name: string;
  age: number | null;
  relation: string;
  initials: string;
  active: boolean;
  isNew: boolean;
}

type FamilyMembersContext = {
  members: FamilyMember[];
  addMember: (input: { name: string; age: number; relation: string }) => void;
};

const seed: FamilyMember[] = mockPatientWorld.family.map((p) => ({
  id: p.id,
  name: p.name,
  age: null,
  relation: p.relation,
  initials: p.initials,
  active: p.active,
  isNew: false,
}));

const Context = createContext<FamilyMembersContext | null>(null);

/** Mock-only family address book. Adding a member NEVER creates a representation grant. */
export function FamilyMembersProvider({ children }: PropsWithChildren) {
  const [added, setAdded] = useState<FamilyMember[]>([]);
  const members = useMemo(() => [...seed, ...added], [added]);
  const value = useMemo<FamilyMembersContext>(
    () => ({
      members,
      addMember: ({ name, age, relation }) => {
        setAdded((current) =>
          current.concat({
            id: 'family-local-' + (current.length + 1),
            name: name.trim(),
            age,
            relation,
            initials: name.trim().slice(0, 2),
            active: false,
            isNew: true,
          }),
        );
      },
    }),
    [members],
  );
  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useFamilyMembers() {
  const value = useContext(Context);
  if (!value) throw new Error('useFamilyMembers requires FamilyMembersProvider');
  return value;
}
