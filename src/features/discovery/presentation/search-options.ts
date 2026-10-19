import type { AppIconName } from '@/shared/components/ui/app-icon';

export const quickTypes: {
  label: string;
  icon: AppIconName;
  kind: 'pain' | 'service' | 'doctor' | 'area';
}[] = [
  {
    label: 'ألم أو شكوى',
    icon: { ios: 'bubble.left', android: 'chat_bubble_outline', web: 'chat_bubble_outline' },
    kind: 'pain',
  },
  {
    label: 'خدمة سنية',
    icon: { ios: 'stethoscope', android: 'medical_services', web: 'medical_services' },
    kind: 'service',
  },
  {
    label: 'اسم طبيب',
    icon: { ios: 'person', android: 'person_outline', web: 'person_outline' },
    kind: 'doctor',
  },
  { label: 'منطقة', icon: { ios: 'mappin', android: 'place', web: 'place' }, kind: 'area' },
];
export const recentSearches = [
  'علاج جذور في الجميلية',
  'د. ليان يوسف',
  'تنظيف أسنان بسعر ثابت',
] as const;
