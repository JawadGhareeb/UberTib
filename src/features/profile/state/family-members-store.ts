import { create } from 'zustand';
import { registerSessionStore } from '@/shared/state/session-stores';
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

type FamilyMembersState = {
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

/** A local family member is NOT a representation authorization. */
export const useFamilyMembers = create<FamilyMembersState>()((set) => ({
  members: seed,
  addMember: ({ name, age, relation }) =>
    set(({ members }) => ({
      members: members.concat({
        id: 'family-local-' + (members.filter((member) => member.isNew).length + 1),
        name: name.trim(),
        age,
        relation,
        initials: name.trim().slice(0, 2),
        active: false,
        isNew: true,
      }),
    })),
}));

registerSessionStore(useFamilyMembers);
