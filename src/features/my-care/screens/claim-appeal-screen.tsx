import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { View } from 'react-native';

import { CareScreenShell } from '@/features/my-care/components/care-screen-shell';
import { getMockClaimForScenario } from '@/features/my-care/mocks/records.mock';
import {
  AppText,
  Button,
  ReadStateBoundary,
  StateView,
  StatusIndicator,
  TextField,
} from '@/shared/components/ui';
import { useMockScenario } from '@/shared/mock';

interface ClaimAppealScreenProps {
  caseId: string;
  claimId: string;
}

export function ClaimAppealScreen({ caseId, claimId }: ClaimAppealScreenProps) {
  const {
    claimAppealDrafts,
    claimAppealIds,
    claimSubmissions,
    getSurfaceState,
    scenario,
    submitClaimAppeal,
  } = useMockScenario();
  const claim =
    claimSubmissions.find((item) => item.id === claimId && item.caseId === caseId) ??
    getMockClaimForScenario(claimId, scenario);
  const readState = getSurfaceState('claims');
  const [reason, setReason] = useState('');
  const [localEvidenceName, setLocalEvidenceName] = useState<string>();
  const [attachmentError, setAttachmentError] = useState('');
  const pickLocalEvidence = async () => {
    try {
      setAttachmentError('');
      const response = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        quality: 0.8,
      });
      if (response.canceled || !response.assets[0]) return;
      const asset = response.assets[0];
      if (asset.fileSize && asset.fileSize > 25 * 1024 * 1024) {
        setAttachmentError('الصورة أكبر من الحجم المسموح.');
        return;
      }
      setLocalEvidenceName(asset.fileName ?? 'صورة داعمة');
    } catch {
      setAttachmentError('تعذر اختيار الصورة من الجهاز. حاول مرة ثانية.');
    }
  };
  const appealPending = claimAppealIds.includes(claimId);

  if (!claim || claim.caseId !== caseId) {
    return (
      <CareScreenShell eyebrow="استئناف المطالبة" title="الاستئناف">
        <StateView title="المطالبة غير موجودة" />
      </CareScreenShell>
    );
  }

  const canSubmit =
    readState === 'success' && claim.appealEligible && !appealPending && reason.trim().length >= 8;

  return (
    <CareScreenShell
      eyebrow="استئناف المطالبة"
      title={claim.appealEligible || appealPending ? 'راجع القرار' : 'الاستئناف غير متاح'}
    >
      <ReadStateBoundary
        emptyTitle="الاستئناف غير متاح"
        permissionDescription="التفويض الحالي ما عاد يسمح بعرض قرار المطالبة أو إرسال استئناف."
        permissionTitle="ما عاد في صلاحية للاستئناف"
        state={readState}
        staleAtLabel="آخر تحديث محفوظ"
      >
        <View className="mt-5 rounded-surface border border-border-subtle bg-surface-default p-4">
          <AppText className="text-content-secondary" variant="caption">
            القرار الأصلي
          </AppText>
          <AppText className="mt-1" variant="body-strong">
            {claim.statusLabel}
          </AppText>
          <AppText className="mt-2 text-content-secondary" variant="caption">
            {claim.deadlineLabel}
          </AppText>
        </View>

        {appealPending ? (
          <View className="mt-5">
            <StatusIndicator label="الاستئناف محفوظ · بانتظار المراجعة" tone="warning" />
            <AppText className="mt-2 text-content-secondary" variant="caption">
              القرار الأصلي بقي كما هو. بانتظار مراجعة الاستئناف.
            </AppText>
            {claimAppealDrafts[claimId] ? (
              <AppText className="mt-2 text-content-secondary" variant="caption">
                السبب: {claimAppealDrafts[claimId].reason}
                {claimAppealDrafts[claimId].evidenceName
                  ? ` · الصورة المحلية: ${claimAppealDrafts[claimId].evidenceName}`
                  : ''}
              </AppText>
            ) : null}
          </View>
        ) : !claim.appealEligible ? (
          <View className="mt-5">
            <StatusIndicator label="لا يوجد قرار قابل للاستئناف" tone="info" />
            <AppText className="mt-2 text-content-secondary" variant="caption">
              لما يصدر قرار نهائي قابل للاستئناف، رح يظهر الإجراء والمهلة هون.
            </AppText>
          </View>
        ) : (
          <>
            <View className="mt-5">
              <TextField
                label="سبب الاستئناف"
                multiline
                numberOfLines={4}
                onChangeText={setReason}
                placeholder="وضح سبب طلب إعادة المراجعة"
                value={reason}
              />
            </View>

            <View className="mt-3 gap-1">
              <Button
                label={
                  localEvidenceName ? 'تغيير الصورة الداعمة' : 'إضافة دليل جديد من الصور (اختياري)'
                }
                onPress={() => {
                  void pickLocalEvidence();
                }}
                variant="outline"
              />
              {localEvidenceName ? (
                <AppText className="text-content-secondary" variant="caption">
                  {localEvidenceName} · محفوظ محلياً ضمن التجربة، وليس مرفوعاً للسيرفر
                </AppText>
              ) : null}
              {attachmentError ? (
                <AppText className="text-tone-danger-text" variant="caption">
                  {attachmentError}
                </AppText>
              ) : null}
            </View>
            {readState === 'success' ? (
              <Button
                className="mt-6"
                disabled={!canSubmit}
                label="إرسال الاستئناف"
                onPress={() =>
                  submitClaimAppeal(claimId, {
                    reason: reason.trim(),
                    evidenceName: localEvidenceName,
                  })
                }
              />
            ) : (
              <AppText className="mt-5 text-content-secondary" variant="caption">
                إرسال الاستئناف متوقف مؤقتاً لحد ما نتحقق من القرار والمهلة الحاكمة.
              </AppText>
            )}
          </>
        )}
      </ReadStateBoundary>
    </CareScreenShell>
  );
}
