export type PatientTabName = 'profile' | 'care' | 'discover' | 'home';

export const patientTabDestinations: readonly {
  name: PatientTabName;
  label: string;
}[] = [
  { name: 'profile', label: 'حسابي' },
  { name: 'care', label: 'علاجي' },
  { name: 'discover', label: 'اكتشف' },
  { name: 'home', label: 'الرئيسية' },
];
