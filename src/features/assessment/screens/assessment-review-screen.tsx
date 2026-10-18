import { useRouter } from 'expo-router';
import { Pressable, View } from 'react-native';

import { AssessmentScaffold } from '@/features/assessment/components/assessment-scaffold';
import { useAssessmentSession } from '@/features/assessment/state/assessment-session-provider';
import { AppIcon, AppText } from '@/shared/components/ui';
import type { AppIconName } from '@/shared/components/ui/app-icon';

function SummaryRow({
  title,
  value,
  icon,
  onEdit,
}: {
  title: string;
  value: string;
  icon: AppIconName;
  onEdit: () => void;
}) {
  return (
    <View className="min-h-[64px] flex-row-reverse items-center gap-2.5 rounded-[14px] border border-border-subtle bg-surface-default px-3 py-2">
      <View className="h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-surface-subtle">
        <AppIcon name={icon} size={20} tone="action" />
      </View>
      <View className="min-w-0 flex-1 items-end">
        <AppText align="right" className="font-ui-bold" style={{ fontSize: 12, lineHeight: 19 }} variant="label">
          {title}
        </AppText>
        <AppText
          align="right"
          className="mt-0.5 text-content-secondary"
          numberOfLines={2}
          style={{ fontSize: 10, lineHeight: 16 }}
          variant="caption"
        >
          {value}
        </AppText>
      </View>
      <Pressable
        accessibilityLabel={'تعديل ' + title}
        accessibilityRole="button"
        className="min-h-[44px] min-w-[44px] items-start justify-center"
        hitSlop={4}
        onPress={onEdit}
      >
        <AppText className="font-ui-semibold text-content-link" style={{ fontSize: 11 }} variant="label">
          تعديل
        </AppText>
      </Pressable>
    </View>
  );
}

export function AssessmentReviewScreen() {
  const router = useRouter();
  const {
    patient, complaint, details, location, selectedTeeth,
    answers, healthConfirmed, mediaAttachments,
  } = useAssessmentSession();

  const patientName = patient === 'adam' ? 'آدم الخطيب'
    : patient === 'nour' ? 'نور الخطيب' : 'ريم الخطيب';
  const issueSummary = [
    complaint || 'لم تُحدّد شكوى بعد',
    location || 'لم يُحدّد المكان',
    selectedTeeth.length > 1 ? selectedTeeth.length + ' أسنان' : '',
  ].filter(Boolean).join(' · ');
  const healthSummary = [
    answers.length ? answers.join('، ') : 'لا توجد إجابات',
    healthConfirmed ? 'تمت مراجعة الصحة' : 'المعلومات الصحية بانتظار المراجعة',
  ].join(' · ');
  const fileSummary = mediaAttachments.length
    ? patientName + ' · ' + mediaAttachments.length + ' مرفق'
    : patientName + ' · بدون مرفقات';

  return (
    <AssessmentScaffold
      phase="المراجعة والموافقة"
      title="راجع معلوماتك قبل التقييم"
      primaryLabel="أوافق وأبدأ التقييم"
      onPrimary={() => router.push('/assessment/processing')}
      topContent={
        <View className="pt-1">
          <View className="min-h-[71px] flex-row-reverse items-center gap-3 rounded-[16px] bg-action-subtle px-3 py-2.5">
            <View className="h-11 w-11 items-center justify-center rounded-[14px] bg-surface-default">
              <AppIcon name={{ ios: 'checklist', android: 'fact_check', web: 'fact_check' }} size={23} tone="action" />
            </View>
            <View className="min-w-0 flex-1 items-end">
              <AppText align="right" className="font-ui-bold" variant="label">كل معلومة في مكانها</AppText>
              <AppText align="right" className="mt-0.5 text-content-secondary" style={{ fontSize: 10.5, lineHeight: 17 }} variant="caption">
                راجع المختصر وعدّل أي جزء قبل البدء.
              </AppText>
            </View>
          </View>
        </View>
      }
    >
      <View className="mt-2 gap-[7px]">
        <SummaryRow
          icon={{ ios: 'waveform.path.ecg', android: 'monitor_heart', web: 'monitor_heart' }}
          title="الشكوى والمكان"
          value={issueSummary}
          onEdit={() => router.push({ pathname: '/assessment/location', params: { returnTo: 'review' } })}
        />
        <SummaryRow
          icon={{ ios: 'heart.text.square.fill', android: 'medical_information', web: 'medical_information' }}
          title="الإجابات والصحة"
          value={healthSummary}
          onEdit={() => router.push({ pathname: '/assessment/questions', params: { returnTo: 'review' } })}
        />
        <SummaryRow
          icon={{ ios: 'paperclip', android: 'attach_file', web: 'attach_file' }}
          title="المريض والملفات"
          value={fileSummary}
          onEdit={() => router.push({ pathname: '/assessment/media', params: { returnTo: 'review' } })}
        />
      </View>

      {details ? (
        <View className="mt-2 rounded-[11px] bg-surface-subtle px-3 py-2">
          <AppText align="right" className="text-content-secondary" style={{ fontSize: 10.5, lineHeight: 17 }} variant="caption">
            {details}
          </AppText>
        </View>
      ) : null}

      <View className="mt-3 rounded-[15px] border border-action-primary/25 bg-action-subtle p-3">
        <View className="flex-row-reverse items-center gap-2">
          <View className="h-7 w-7 items-center justify-center rounded-[9px] bg-surface-default">
            <AppIcon name={{ ios: 'sparkles', android: 'auto_awesome', web: 'auto_awesome' }} size={16} tone="action" />
          </View>
          <AppText className="min-w-0 flex-1 font-ui-bold text-content-link" variant="label">
            ما سيُحلَّل الآن
          </AppText>
          <View className="h-6 w-6 items-center justify-center rounded-[7px] bg-action-primary">
            <AppIcon name={{ ios: 'checkmark', android: 'check', web: 'check' }} size={14} tone="onAction" />
          </View>
        </View>
        <AppText align="right" className="mt-2 text-content-secondary" style={{ fontSize: 10.5, lineHeight: 18 }} variant="caption">
          نحلّل إجاباتك والمنطقة والسياق الصحي والملفات التي اخترتها لتوجيه البحث داخل UperTib. لا يراها الطبيب الآن.
        </AppText>
      </View>

      <View className="mt-2 rounded-[15px] border border-border-subtle bg-surface-default p-3">
        <View className="flex-row-reverse items-center gap-2">
          <AppIcon name={{ ios: 'square.and.arrow.up', android: 'share', web: 'share' }} size={17} tone="secondary" />
          <AppText className="min-w-0 flex-1 font-ui-bold" variant="label">
            ما سيُشارك لاحقاً فقط
          </AppText>
        </View>
        <AppText align="right" className="mt-2 text-content-secondary" style={{ fontSize: 10.5, lineHeight: 18 }} variant="caption">
          بعد اختيار الطبيب، ستراجع وتحدد ما تريد مشاركته قبل إرسال الحجز.
        </AppText>
      </View>

      <View className="mt-2 flex-row-reverse items-center gap-2 rounded-[11px] bg-tone-info-fill px-3 py-2.5">
        <AppIcon name={{ ios: 'checkmark.shield.fill', android: 'verified_user', web: 'verified_user' }} size={17} tone="info" />
        <AppText className="min-w-0 flex-1 text-tone-info-text" style={{ fontSize: 10.5, lineHeight: 17 }} variant="caption">
          التقييم الأولي ليس تشخيصاً نهائياً.
        </AppText>
      </View>
    </AssessmentScaffold>
  );
}
