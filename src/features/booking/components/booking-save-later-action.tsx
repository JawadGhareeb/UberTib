import { useState } from 'react';
import { useRouter } from 'expo-router';
import { View } from 'react-native';
import {
  createBookingCareDraft,
  type BookingDraftStep,
} from '@/features/booking/utils/booking-care-draft';
import {
  useCareDrafts,
  type BookingSavedFields,
} from '@/features/my-care/state/care-draft-provider';
import { AppText, Button } from '@/shared/components/ui';

export function BookingSaveLaterAction({
  data,
  step,
}: {
  data: BookingSavedFields;
  step: BookingDraftStep;
}) {
  const router = useRouter();
  const { saveDraft, hydrated, persistError } = useCareDrafts();
  const [saving, setSaving] = useState(false);
  const [failed, setFailed] = useState(false);
  const save = async () => {
    if (saving) return;
    setSaving(true);
    const saved = await saveDraft(createBookingCareDraft(data, step));
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
        className="min-h-[46px] rounded-[12px]"
        label={saving ? 'عم نحفظ المسودة...' : 'إكمال الحجز لاحقاً'}
        disabled={!hydrated || saving}
        endIcon={{ ios: 'bookmark', android: 'bookmark_border', web: 'bookmark_border' }}
        onPress={() => void save()}
      />
      {failed || persistError ? (
        <AppText variant="caption" align="center" className="text-tone-danger-text">
          تعذّر حفظ المسودة على الجهاز، حاول مرة ثانية.
        </AppText>
      ) : (
        <AppText variant="caption" align="center" className="text-content-secondary">
          منحتفظ بخطوات حجزك تلقائياً، وفيك تكمّل من «حالاتي العلاجية».
        </AppText>
      )}
    </View>
  );
}
