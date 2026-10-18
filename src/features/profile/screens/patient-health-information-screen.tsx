import { useRef, useState } from 'react';
import { Pressable, ScrollView, TextInput, View } from 'react-native';

import {
  ReferenceCard,
  ReferenceHeader,
  ReferenceIcon,
} from '@/features/profile/components/patient-reference-ui';
import { AppIcon, AppText, Button, ReadStateBoundary, Screen } from '@/shared/components/ui';
import type { AppIconName } from '@/shared/components/ui/app-icon';
import { mockPatientWorld } from '@/shared/mock/patient.mock';
import { useMockScenario } from '@/shared/mock';
import { cn } from '@/shared/utils/cn';

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

function HealthAccordion({
  section,
  expanded,
  onToggle,
}: {
  section: HealthSection;
  expanded: boolean;
  onToggle: () => void;
}) {
  const cardTone =
    section.tone === 'warning'
      ? 'border-tone-warning-border/50 bg-tone-warning-fill/70'
      : section.tone === 'info'
        ? 'border-tone-info-border/40 bg-tone-info-fill/80'
        : section.tone === 'primary'
          ? 'border-action-primary/40'
          : '';

  return (
    <ReferenceCard className={cn('overflow-hidden px-[9px] py-[6px]', expanded && cardTone)}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded }}
        className="min-h-[42px] flex-row-reverse items-center gap-[8px]"
        onPress={onToggle}
      >
        <ReferenceIcon icon={section.icon} warm={section.tone === 'warning'} size={33} />
        <View className="min-w-0 flex-1 items-end">
          <AppText
            align="right"
            className="font-ui-semibold"
            numberOfLines={2}
            style={{ fontSize: 11.5, lineHeight: 18 }}
            variant="caption"
          >
            {section.title}
          </AppText>
          <AppText
            align="right"
            className="mt-0.5 text-content-secondary"
            numberOfLines={1}
            style={{ fontSize: 9.5, lineHeight: 14 }}
            variant="caption"
          >
            {section.summary}
          </AppText>
        </View>
        <AppIcon
          name={{
            ios: expanded ? 'chevron.up' : 'chevron.down',
            android: expanded ? 'expand_less' : 'expand_more',
            web: expanded ? 'expand_less' : 'expand_more',
          }}
          size={15}
          tone="secondary"
        />
      </Pressable>
      {expanded ? (
        <View className="mt-1 gap-1 rounded-[9px] bg-surface-subtle px-3 py-[7px]">
          {section.facts.map((fact) => (
            <AppText
              align="right"
              className="text-content-secondary"
              key={fact}
              style={{ fontSize: 9.5, lineHeight: 16 }}
              variant="caption"
            >
              {fact}
            </AppText>
          ))}
        </View>
      ) : null}
    </ReferenceCard>
  );
}

export function PatientHealthInformationScreen() {
  const { getSurfaceState } = useMockScenario();
  const [expanded, setExpanded] = useState<string[]>(['allergy', 'dental', 'media']);
  const [editing, setEditing] = useState(false);
  const scrollRef = useRef<ScrollView>(null);
  const [draftNote, setDraftNote] = useState('');
  const [previewNote, setPreviewNote] = useState('');
  const toggle = (id: string) =>
    setExpanded((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );

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
                ملف الصحة والأسنان · بيانات تجريبية للمعاينة
              </AppText>
            </View>
          </View>

          <View className="mt-[4px] gap-[4px]">
            {sections.map((section) => (
              <HealthAccordion
                expanded={expanded.includes(section.id)}
                key={section.id}
                onToggle={() => toggle(section.id)}
                section={section}
              />
            ))}
          </View>

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
                  التحديث هنا مسودة محلية للمعاينة فقط؛ لا تُرسل إلى طبيب أو عيادة.
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
