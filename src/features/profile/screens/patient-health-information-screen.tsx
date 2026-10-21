import { useRef, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ASSESSMENT_PATIENT_FIXTURES } from '@/features/assessment/presentation/assessment-patient-copy';
import type { AssessmentPatient } from '@/features/assessment/state/assessment-session-provider';
import { ScrollView, TextInput, View } from 'react-native';
import { Accordion } from 'heroui-native';

import {
  ReferenceCard,
  ReferenceHeader,
  ReferenceIcon,
} from '@/features/profile/components/patient-reference-ui';
import { AppIcon, AppText, Button, ReadStateBoundary, Screen } from '@/shared/components/ui';
import type { AppIconName } from '@/shared/components/ui/app-icon';
import { mockPatientWorld } from '@/shared/mock/patient.mock';
import { useMockScenario } from '@/shared/mock';

type HealthSection = {
  id: string;
  title: string;
  summary: string;
  facts: string[];
  icon: AppIconName;
  tone?: 'warning' | 'info' | 'primary';
};

/** Demo content is local. The backend owns the future patient/assessment health snapshots. */
const sections: HealthSection[] = [
  {
    id: 'allergy',
    title: 'الحساسيات',
    summary: 'بنسلين — طفح جلدي سابق',
    facts: ['بنسلين — طفح جلدي سابق'],
    icon: { ios: 'shield.lefthalf.filled', android: 'health_and_safety', web: 'health_and_safety' },
    tone: 'warning',
  },
  {
    id: 'medicine',
    title: 'الأدوية الحالية',
    summary: 'لا توجد أدوية يومية',
    facts: ['لا توجد أدوية يومية مسجلة'],
    icon: { ios: 'pills.fill', android: 'medication', web: 'medication' },
  },
  {
    id: 'conditions',
    title: 'الحالات الهامة والنشطة',
    summary: 'لا توجد حالات مسجلة',
    facts: ['لا توجد حالات نشطة مسجلة'],
    icon: { ios: 'waveform.path.ecg', android: 'monitor_heart', web: 'monitor_heart' },
  },
  {
    id: 'operations',
    title: 'العمليات والإجراءات السابقة',
    summary: '2018 — استئصال زائدة',
    facts: ['2018 — استئصال زائدة', 'علاج جذور سابق — 2022'],
    icon: { ios: 'cross.case.fill', android: 'medical_services', web: 'medical_services' },
  },
  {
    id: 'dental',
    title: 'التيجان والجسور والزراعات وعلاج الجذور والأطقم',
    summary: 'آخر إجراء منذ 8 أشهر',
    facts: [
      '2022 — علاج جذور للضرس سفلي أيسر',
      '2023 — تاج خزفي أمامي علوي',
      'لا جسور أو زرعات أو أطقم حسب الملف',
    ],
    icon: { ios: 'cross.circle', android: 'health_and_safety', web: 'health_and_safety' },
    tone: 'primary',
  },
  {
    id: 'injury',
    title: 'إصابات أو رضوض الأسنان',
    summary: 'لا توجد إصابات مسجلة',
    facts: ['لا توجد إصابات مسجلة'],
    icon: { ios: 'bandage.fill', android: 'healing', web: 'healing' },
  },
  {
    id: 'media',
    title: 'الصور والسجلات السابقة',
    summary: 'صورة بانورامية سابقة',
    facts: ['2022 صورة بانورامية — متوفرة للعرض'],
    icon: { ios: 'photo.on.rectangle', android: 'photo_library', web: 'photo_library' },
    tone: 'info',
  },
];

function HealthCategory({ section }: { section: HealthSection }) {
  return (
    <Accordion.Item value={section.id}>
      <Accordion.Trigger className="min-h-[66px] flex-row-reverse items-center gap-3 px-3 py-2.5">
        <ReferenceIcon icon={section.icon} warm={section.tone === 'warning'} size={37} />
        <View className="min-w-0 flex-1 items-end gap-1">
          <AppText align="right" variant="label" className="font-ui-semibold" numberOfLines={2}>
            {section.title}
          </AppText>
          <AppText
            align="right"
            variant="caption"
            className="text-content-secondary"
            numberOfLines={2}
          >
            {section.summary}
          </AppText>
        </View>
        <Accordion.Indicator />
      </Accordion.Trigger>
      <Accordion.Content className="px-4 pb-4">
        <View className="gap-2 rounded-[11px] bg-surface-subtle px-3 py-3">
          {section.facts.map((fact) => (
            <AppText key={fact} align="right" variant="label" className="text-content-secondary">
              {fact}
            </AppText>
          ))}
        </View>
      </Accordion.Content>
    </Accordion.Item>
  );
}

export function PatientHealthInformationScreen() {
  const router = useRouter();
  const { assessmentPatient } = useLocalSearchParams<{ assessmentPatient?: string }>();
  const assessmentPerson =
    assessmentPatient === 'self' || assessmentPatient === 'adam' || assessmentPatient === 'nour'
      ? ASSESSMENT_PATIENT_FIXTURES[assessmentPatient as AssessmentPatient]
      : undefined;
  const { getSurfaceState } = useMockScenario();
  const [editing, setEditing] = useState(false);
  const scrollRef = useRef<ScrollView>(null);
  const [draftNote, setDraftNote] = useState('');
  const [previewNote, setPreviewNote] = useState('');
  // The account mock health screen cannot impersonate another selected patient's record.
  if (assessmentPerson) {
    return (
      <Screen contentClassName="px-0 py-0">
        <ReferenceHeader
          title="معلومات المريض الصحية"
          icon={{ ios: 'heart.text.square', android: 'monitor_heart', web: 'monitor_heart' }}
        />
        <View className="mx-auto w-full max-w-[430px] flex-1 gap-3 px-4 pt-3">
          <View className="flex-row-reverse items-center gap-3 rounded-[15px] bg-action-subtle p-3">
            <View className="h-11 w-11 items-center justify-center rounded-full bg-surface-default">
              <AppIcon
                name={{ ios: 'person.fill', android: 'person', web: 'person' }}
                tone="action"
                size={22}
              />
            </View>
            <View className="min-w-0 flex-1 items-end gap-1">
              <AppText variant="label" className="font-ui-bold">
                {assessmentPerson.name}
              </AppText>
              <AppText variant="caption" className="text-content-secondary">
                {assessmentPerson.age} سنة · المريض الذي اخترته للتقييم
              </AppText>
            </View>
          </View>
          <View className="gap-2 rounded-[15px] border border-border-subtle bg-surface-default p-4">
            <AppText align="right" variant="heading-4" className="font-ui-bold">
              السجل الصحي غير متصل بعد
            </AppText>
            <AppText align="right" variant="label" className="text-content-secondary">
              لا نعرض بيانات طبية تخص صاحب الحساب أو شخصاً آخر على أنها معلومات هذا المريض. الربط
              والتحديث الفعلي للسجل يحتاجان إلى خدمة الملف الصحي للمريض المختار.
            </AppText>
          </View>
          <Button label="العودة لمراجعة معلومات المريض" onPress={() => router.back()} />
        </View>
      </Screen>
    );
  }

  return (
    <Screen contentClassName="px-0 py-0">
      <ReferenceHeader
        title="معلوماتي الصحية"
        icon={{ ios: 'pencil', android: 'edit', web: 'edit' }}
        onAction={() => setEditing(true)}
        actionLabel="تحديث ملف الصحة والأسنان"
      />
      <ScrollView
        ref={scrollRef}
        contentContainerClassName="mx-auto w-full max-w-[430px] px-4 pb-24 pt-1"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <ReadStateBoundary
          state={getSurfaceState('profile')}
          emptyTitle="لا توجد بيانات صحية"
          permissionTitle="الملف الصحي غير متاح"
        >
          <View className="min-h-[64px] flex-row-reverse items-center gap-2 rounded-[14px] bg-action-subtle px-3 py-2">
            <ReferenceIcon
              icon={{ ios: 'heart.text.square.fill', android: 'favorite', web: 'favorite' }}
              warm
              round
              size={42}
            />
            <View className="min-w-0 flex-1 items-end">
              <AppText align="right" className="font-ui-bold" variant="label">
                {mockPatientWorld.account.activePatientName}
              </AppText>
              <AppText
                align="right"
                className="text-content-secondary"
                style={{ fontSize: 9.5, lineHeight: 16 }}
                variant="caption"
              >
                ملف الصحة والأسنان
              </AppText>
            </View>
          </View>

          <Accordion
            selectionMode="multiple"
            variant="default"
            className="mt-3 overflow-hidden rounded-[15px] border border-border-subtle bg-surface-default"
          >
            {sections.map((section) => (
              <HealthCategory key={section.id} section={section} />
            ))}
          </Accordion>

          <View className="mt-[6px] rounded-[12px] bg-tone-warning-fill px-3 py-[10px]">
            <View className="flex-row-reverse items-center gap-2">
              <AppIcon
                name={{ ios: 'square.and.arrow.up', android: 'upload_file', web: 'upload_file' }}
                size={17}
                tone="warning"
              />
              <View className="min-w-0 flex-1 items-end">
                <AppText
                  align="right"
                  className="font-ui-semibold text-tone-warning-text"
                  variant="caption"
                >
                  النسخة المستخدمة في التقييم
                </AppText>
                <AppText
                  align="right"
                  className="mt-0.5 text-tone-warning-text"
                  style={{ fontSize: 9.5, lineHeight: 16 }}
                  variant="caption"
                >
                  تختلف نسخة التقييم المحفوظة عن الملف الحالي. التعديل الجديد لا يغيّر ما استُخدم
                  سابقاً.
                </AppText>
              </View>
            </View>
          </View>

          <View className="mt-[6px] rounded-[12px] bg-action-subtle px-3 py-[10px]">
            <View className="flex-row-reverse items-center gap-[7px]">
              <AppIcon
                name={{ ios: 'lock.shield', android: 'verified_user', web: 'verified_user' }}
                size={16}
                tone="action"
              />
              <AppText
                align="right"
                className="min-w-0 flex-1 font-ui-semibold text-content-link"
                variant="caption"
              >
                نطاق المشاركة في الحجز القادم
              </AppText>
            </View>
            <View className="mt-[6px] flex-row-reverse flex-wrap gap-[5px]">
              {['الملفات المختارة', 'تاريخ الأسنان', 'حساسية البنسلين'].map((label) => (
                <View className="rounded-[7px] bg-surface-default px-[7px] py-[4px]" key={label}>
                  <AppText
                    className="text-content-link"
                    style={{ fontSize: 9, lineHeight: 14 }}
                    variant="caption"
                  >
                    {label}
                  </AppText>
                </View>
              ))}
            </View>
            <AppText
              align="right"
              className="mt-1 text-content-secondary"
              style={{ fontSize: 9.5, lineHeight: 16 }}
              variant="caption"
            >
              يمكنك مراجعة النطاق قبل كل حجز، ولا تُشارك باقي البيانات تلقائياً.
            </AppText>
          </View>

          {editing ? (
            <View
              className="mt-2"
              onLayout={() => scrollRef.current?.scrollToEnd({ animated: true })}
            >
              <ReferenceCard className="gap-2">
                <AppText align="right" className="font-ui-bold" variant="label">
                  تحديث ملف الصحة والأسنان
                </AppText>
                <TextInput
                  accessibilityLabel="ملاحظة صحية"
                  className="min-h-[72px] rounded-[9px] border border-border-subtle px-3 py-2 text-content-primary"
                  multiline
                  onChangeText={setDraftNote}
                  placeholder="أضف ملاحظة للتحديث..."
                  style={{ textAlign: 'right', writingDirection: 'rtl', textAlignVertical: 'top' }}
                  value={draftNote}
                />
                <AppText align="right" className="text-content-secondary" variant="caption">
                  تُحفظ ملاحظاتك على هذا الجهاز، ولا تظهر للطبيب تلقائياً.
                </AppText>
                <Button
                  label="حفظ المسودة محلياً"
                  disabled={!draftNote.trim()}
                  size="sm"
                  onPress={() => {
                    setPreviewNote(draftNote.trim());
                    setEditing(false);
                  }}
                />
              </ReferenceCard>
            </View>
          ) : null}
          {previewNote ? (
            <AppText align="right" className="mt-2 text-content-secondary" variant="caption">
              مسودة غير مرسلة: {previewNote}
            </AppText>
          ) : null}

          <Button
            className="mt-[7px] h-[48px]"
            endIcon={{ ios: 'pencil', android: 'edit', web: 'edit' }}
            label={editing ? 'إغلاق التعديل' : 'تحديث ملف الصحة والأسنان'}
            onPress={() => setEditing((value) => !value)}
          />
        </ReadStateBoundary>
      </ScrollView>
    </Screen>
  );
}
