import { useGlobalSearchParams, usePathname, useRouter } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';
import {
  buildAssessmentDraft,
  isAssessmentDraftRoute,
} from '@/features/assessment/utils/assessment-draft';
import { useAssessmentSession } from '@/features/assessment/state/assessment-session-provider';
import { useCareDrafts } from '@/features/my-care/state/care-draft-provider';
import { useHealthNotes } from '@/features/profile/state/health-notes-store';
import { AppText, Button } from '@/shared/components/ui';

export function AssessmentSaveLaterAction() {
  const router = useRouter();
  const pathname = usePathname();
  const { returnTo } = useGlobalSearchParams<{ returnTo?: string }>();
  const { snapshot } = useAssessmentSession();
  const { getNotes } = useHealthNotes();
  const { saveDraft, hydrated } = useCareDrafts();
  const [saving, setSaving] = useState(false);
  const [failed, setFailed] = useState(false);

  const save = async () => {
    if (!hydrated || saving || !isAssessmentDraftRoute(pathname)) return;
    setSaving(true);
    const saved = await saveDraft(
      buildAssessmentDraft(
        pathname,
        { ...snapshot, healthNotes: getNotes(snapshot.patient) },
        returnTo,
      ),
    );
    setSaving(false);
    if (!saved) {
      setFailed(true);
      return;
    }
    setFailed(false);
    router.replace({ pathname: '/(tabs)/care', params: { tab: 'cases' } });
  };

  return (
    <View className="gap-1">
      <Button
        variant="outline"
        label={saving ? 'عم نحفظ المرحلة...' : 'حفظ المسودة والإكمال لاحقاً'}
        endIcon={{ ios: 'bookmark', android: 'bookmark_border', web: 'bookmark_border' }}
        className="min-h-[46px] rounded-[12px]"
        disabled={!hydrated || saving}
        onPress={() => void save()}
      />
      {failed ? (
        <AppText align="center" variant="caption" className="text-tone-danger-text">
          تعذّر حفظ المسودة، حاول مرة ثانية قبل الخروج.
        </AppText>
      ) : (
        <AppText align="center" variant="caption" className="text-content-secondary">
          منحتفظ باختياراتك وخطوتك الحالية تلقائياً، وبتقدر تكمل من «حالاتي العلاجية».
        </AppText>
      )}
    </View>
  );
}
