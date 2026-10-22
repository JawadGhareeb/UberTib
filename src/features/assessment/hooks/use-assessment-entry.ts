import { useRouter } from 'expo-router';

/** One auth check for every "ساعدني أحدد حالتي" entry point. */
export function useAssessmentEntry() {
  const router = useRouter();
  return () => router.push('/assessment/start');
}
