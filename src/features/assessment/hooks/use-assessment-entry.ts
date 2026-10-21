import { useRouter } from 'expo-router';

import { useAuthAccess } from '@/providers/auth-access-provider';

/** One auth check for every "ساعدني أحدد حالتي" entry point. */
export function useAssessmentEntry() {
  const router = useRouter();
  const { requireAuth } = useAuthAccess();

  return () => {
    const allowed = requireAuth({
      returnTo: '/assessment/start',
      description: 'سجّل دخولك لتبدأ تحديد حالتك وتربط التقييم بملفك الصحي، أو أكمل التصفح كزائر.',
    });
    if (allowed) router.push('/assessment/start');
  };
}
