import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { Image, View } from 'react-native';

import { CareScreenShell } from '@/features/my-care/components/care-screen-shell';
import { getMockCareCaseForScenario } from '@/features/my-care/mocks/care.mock';
import { useAppDirection } from '@/providers/app-direction-provider';
import { AppIcon, AppText, Button, ReadStateBoundary, StateView, StatusTag } from '@/shared/components/ui';
import { useMockScenario } from '@/shared/mock';
import { cn } from '@/shared/utils/cn';

interface StageDetailScreenProps {
  caseId: string;
  stageId: string;
}

export function StageDetailScreen({ caseId, stageId }: StageDetailScreenProps) {
  const router = useRouter();
  const { rowClassName } = useAppDirection();
  const { getSurfaceState, scenario, stageEvidenceDrafts, saveStageEvidenceDraft } = useMockScenario();
  const [selectedImage, setSelectedImage] = useState<{ uri: string; fileName: string } | null>(null);
  const [pickerError, setPickerError] = useState('');
  const draft = stageEvidenceDrafts[caseId + ':' + stageId];
  const canAddEvidence = caseId === 'case-001' && stageId === 'stage-root-canal';
  const pickEvidence = async () => {
    setPickerError('');
    try {
      const response = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: false,
        quality: 0.8,
      });
      if (response.canceled || !response.assets[0]?.uri) return;
      const asset = response.assets[0];
      setSelectedImage({
        uri: asset.uri,
        fileName: asset.fileName ?? 'أشعة نهائية',
      });
    } catch {
      setPickerError('ما قدرنا نفتح الصور. تأكد من صلاحية الوصول للمعرض وجرّب مرة ثانية.');
    }
  };
  const readState = getSurfaceState('care');
  const careCase = getMockCareCaseForScenario(caseId, scenario);
  const stage = careCase?.stages.find((item) => item.id === stageId);

  if (!careCase || !stage) {
    return (
      <CareScreenShell eyebrow="مرحلة العلاج" title="تفاصيل المرحلة">
        <StateView title="المرحلة غير موجودة" />
      </CareScreenShell>
    );
  }

  const stageTone =
    stage.status === 'completed' ? 'success' : stage.status === 'current' ? 'info' : 'neutral';

  return (
    <CareScreenShell eyebrow="مرحلة العلاج" title={stage.title}>
      <ReadStateBoundary
        emptyTitle="المرحلة غير متاحة"
        permissionDescription="التفويض الحالي ما عاد يسمح بعرض تفاصيل هالمرحلة."
        permissionTitle="ما عاد في صلاحية لعرض المرحلة"
        state={readState}
        staleAtLabel="آخر تحديث محفوظ"
      >
        <View className="mt-5 rounded-surface border border-border-subtle bg-surface-default p-4">
          <View className={cn('items-center justify-between gap-3', rowClassName)}>
            <View>
              <AppText className="text-content-secondary" variant="caption">
                الحالة
              </AppText>
              <View className="mt-1 self-start">
                <StatusTag label={stage.statusLabel} tone={stageTone} />
              </View>
            </View>
            <View className="items-end">
              <AppText className="text-content-secondary" variant="caption">
                التاريخ
              </AppText>
              <AppText className="mt-1" variant="body-strong">
                {stage.dateLabel}
              </AppText>
            </View>
          </View>
        </View>

        {stage.correction ? (
          <View className="mt-5 rounded-surface border border-tone-warning-border bg-tone-warning-fill p-4">
            <AppText className="text-tone-warning-text" variant="body-strong">
              إعادة فتح مسجلة كتَصحيح
            </AppText>
            <AppText className="mt-2 text-content-secondary" variant="caption">
              {stage.correction.previousStatusLabel} · {stage.correction.correctedAtLabel}
            </AppText>
            <View className="mt-3 border-t border-tone-warning-border pt-3">
              <AppText className="text-content-secondary" variant="caption">
                سبب إعادة الفتح
              </AppText>
              <AppText className="mt-1" variant="label">
                {stage.correction.reason}
              </AppText>
            </View>
          </View>
        ) : null}

        <View className="mt-5 border-y border-border-subtle py-4">
          <AppText variant="heading-3">تفاصيل المرحلة</AppText>
          <AppText className="mt-2 text-content-secondary">{stage.note}</AppText>
        </View>

        {canAddEvidence ? (
          <View className="mt-4 gap-2 rounded-[14px] border border-tone-warning-border bg-tone-warning-fill p-3">
            <View className={cn('items-center gap-2', rowClassName)}>
              <AppIcon name={{ ios: 'photo.on.rectangle.angled', android: 'add_photo_alternate', web: 'add_photo_alternate' }} size={20} tone="warning" />
              <AppText align="right" className="min-w-0 flex-1 font-ui-bold text-content-primary" variant="label">
                الأشعة النهائية بعد العلاج
              </AppText>
              <StatusTag label={draft ? 'مسودة محلية' : 'دليل مطلوب'} tone="warning" />
            </View>
            <AppText align="right" className="text-content-secondary" variant="caption">
              اختر صورة الأشعة من جهازك. رح تنحفظ كمسودة ضمن التجربة فقط، وما بتنرسل للطبيب أو تنحسب مقبولة تلقائياً.
            </AppText>
            {selectedImage?.uri ?? draft?.localUri ? (
              <Image
                accessibilityLabel="معاينة صورة الأشعة التي اخترتها"
                className="h-[150px] w-full rounded-[10px] bg-surface-default"
                resizeMode="contain"
                source={{ uri: selectedImage?.uri ?? draft?.localUri }}
              />
            ) : null}
            {pickerError ? <AppText className="text-tone-danger-text" variant="caption">{pickerError}</AppText> : null}
            <Button
              label={draft || selectedImage ? 'تغيير صورة الأشعة' : 'اختيار صورة من الجهاز'}
              onPress={() => { void pickEvidence(); }}
              variant="outline"
            />
            <Button
              disabled={!selectedImage}
              label="حفظ المسودة والعودة للأدلة"
              onPress={() => {
                if (!selectedImage) return;
                saveStageEvidenceDraft({
                  caseId,
                  stageId,
                  fileName: selectedImage.fileName,
                  localUri: selectedImage.uri,
                  status: 'local-draft',
                });
                router.replace({ pathname: '/care/[caseId]/follow-ups', params: { caseId } });
              }}
            />
          </View>
        ) : null}

        <View className="mt-5">
          <AppText className="text-content-secondary" variant="caption">
            {careCase.provider} · {careCase.branch}
          </AppText>
        </View>
      </ReadStateBoundary>
    </CareScreenShell>
  );
}
