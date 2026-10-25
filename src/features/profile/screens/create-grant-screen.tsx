import { useRouter } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';
import { Checkbox, Radio } from 'heroui-native';

import { ProfileScreenShell } from '@/features/profile/components/profile-screen-shell';
import { mockDependents } from '@/features/profile/mocks/representation.mock';
import { useAppDirection } from '@/shared/utils/app-direction';
import {
  AppIcon,
  AppText,
  Button,
  ConfirmationDialog,
  ReadStateBoundary,
  TextField,
} from '@/shared/components/ui';
import { useMockScenario } from '@/shared/mock';
import { cn } from '@/shared/utils/cn';

const grantActions = ['عرض المواعيد', 'إدارة الحجوزات', 'عرض ملخص الرعاية'] as const;
const dataScopes = ['المواعيد فقط', 'المواعيد وملخص الرعاية'] as const;
const periods = ['شهر واحد', '3 أشهر', '6 أشهر'] as const;

function Choice({
  label,
  selected,
  onPress,
  disabled = false,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <Radio
      isSelected={selected}
      isDisabled={disabled}
      onSelectedChange={onPress}
      className={cn(
        'min-h-target-comfortable flex-row-reverse items-center gap-2 rounded-control border px-3 py-2.5',
        selected
          ? 'border-state-selected-border bg-state-selected'
          : 'border-action-primary bg-surface-default active:bg-action-subtle',
        disabled && 'opacity-50',
      )}
    >
      <Radio.Indicator />
      <AppText variant="label">{label}</AppText>
    </Radio>
  );
}

export function CreateGrantScreen() {
  const router = useRouter();
  const { rowClassName } = useAppDirection();
  const getSurfaceState = useMockScenario((state) => state.getSurfaceState);
  const submitGrantRequest = useMockScenario((state) => state.submitGrantRequest);
  useMockScenario((state) => state.scenarioId);
  const readState = getSurfaceState('representation');
  const [subjectId, setSubjectId] = useState('patient-001');
  const [granteeName, setGranteeName] = useState('');
  const [selectedActions, setSelectedActions] = useState<string[]>(['عرض المواعيد']);
  const [dataScope, setDataScope] = useState<(typeof dataScopes)[number]>('المواعيد فقط');
  const [period, setPeriod] = useState<(typeof periods)[number]>('3 أشهر');
  const [purpose, setPurpose] = useState('');
  const legalBasis = 'تفويض مباشر من صاحب الحساب';
  const [submitted, setSubmitted] = useState(false);
  const [confirmingGrant, setConfirmingGrant] = useState(false);

  const toggleAction = (action: string) => {
    setSelectedActions((current) =>
      current.includes(action) ? current.filter((item) => item !== action) : [...current, action],
    );
  };

  const subject = mockDependents.find((person) => person.id === subjectId);
  const canSubmit =
    readState === 'success' &&
    Boolean(
      subjectId &&
      subject?.active === true &&
      granteeName.trim() &&
      selectedActions.length > 0 &&
      dataScope &&
      period &&
      purpose.trim(),
    );

  return (
    <ProfileScreenShell
      description={
        submitted
          ? 'استلمنا الطلب، لكنه لا يمنح أي صلاحية قبل اكتمال التحقق.'
          : 'حدد الشخص، الصلاحيات، نطاق البيانات، الغرض والمدة بشكل واضح قبل إرسال الطلب.'
      }
      eyebrow="إنشاء تفويض"
      title={submitted ? 'طلب التفويض قيد التحقق' : 'تفويض محدد وواضح'}
    >
      <ReadStateBoundary
        emptyTitle="إنشاء التفويض غير متاح"
        permissionDescription="صلاحيتك الحالية ما عاد تسمح بإنشاء تفويض جديد."
        permissionTitle="ما عاد في صلاحية لإنشاء التفويض"
        state={readState}
        staleAtLabel="آخر تحديث محفوظ"
      >
        {submitted ? (
          <View className="mt-0">
            <View className="rounded-surface border border-tone-warning-border bg-tone-warning-fill p-4">
              <View className={cn('items-start gap-3', rowClassName)}>
                <AppIcon
                  name={{ ios: 'clock.fill', android: 'schedule', web: 'schedule' }}
                  size={20}
                  tone="warning"
                />
                <View className="min-w-0 flex-1">
                  <AppText className="text-tone-warning-text" variant="body-strong">
                    ما صار التفويض فعال بعد
                  </AppText>
                  <AppText className="mt-1 text-tone-warning-text" variant="caption">
                    الطلب محفوظ للمراجعة. النطاق الذي اخترته لا يعمل قبل اعتماد التفويض.
                  </AppText>
                </View>
              </View>
            </View>

            <Button
              className="mt-6"
              label="العودة للعائلة والتفويضات"
              onPress={() => router.replace('/profile/family')}
            />
          </View>
        ) : (
          <>
            <View>
              <AppText variant="heading-4">1. صاحب البيانات</AppText>
              <AppText className="mt-1 text-content-secondary" variant="caption">
                اختر الحساب الذي سيكون التفويض عليه.
              </AppText>
              <View accessibilityRole="radiogroup" className="mt-3 gap-2">
                {mockDependents.map((person) => (
                  <Choice
                    disabled={!person.active}
                    key={person.id}
                    label={
                      person.active
                        ? `${person.name} · ${person.relation}`
                        : `${person.name} · يتطلب مسار تحقق قانوني`
                    }
                    onPress={() => setSubjectId(person.id)}
                    selected={subjectId === person.id}
                  />
                ))}
              </View>
              <View className="mt-3 rounded-control border border-tone-info-border bg-tone-info-fill p-3">
                <AppText className="text-tone-info-text" variant="caption">
                  التفويض المباشر من هذه الشاشة يكون على حسابك أنت فقط. التفويض على تابع لا يمكن
                  للولي منحه لنفسه؛ يبدأ من طلب التمثيل ويحتاج تحققاً مستقلاً.
                </AppText>
              </View>
            </View>

            <View className="mt-6">
              <AppText variant="heading-4">2. الشخص المفوّض</AppText>
              <View className="mt-3">
                <TextField
                  label="اسم الشخص"
                  onChangeText={setGranteeName}
                  placeholder="الاسم الكامل"
                  value={granteeName}
                />
              </View>
            </View>

            <View className="mt-6">
              <AppText variant="heading-4">3. ماذا يستطيع أن يفعل؟</AppText>
              <AppText className="mt-1 text-content-secondary" variant="caption">
                اختر الصلاحيات المطلوبة فقط.
              </AppText>
              <View className="mt-3 gap-2">
                {grantActions.map((action) => {
                  const selected = selectedActions.includes(action);

                  return (
                    <Checkbox
                      key={action}
                      isSelected={selected}
                      onSelectedChange={() => toggleAction(action)}
                      className={cn(
                        rowClassName,
                        'min-h-target-comfortable items-center gap-3 rounded-control border px-3 py-2.5',
                        selected
                          ? 'border-state-selected-border bg-state-selected'
                          : 'border-action-primary bg-surface-default active:bg-action-subtle',
                      )}
                    >
                      <Checkbox.Indicator />
                      <AppText className="min-w-0 flex-1" variant="label">
                        {action}
                      </AppText>
                    </Checkbox>
                  );
                })}
              </View>
            </View>

            <View className="mt-6">
              <AppText variant="heading-4">4. نطاق البيانات</AppText>
              <View accessibilityRole="radiogroup" className="mt-3 gap-2">
                {dataScopes.map((scope) => (
                  <Choice
                    key={scope}
                    label={scope}
                    onPress={() => setDataScope(scope)}
                    selected={dataScope === scope}
                  />
                ))}
              </View>
            </View>

            <View className="mt-6">
              <AppText variant="heading-4">5. المدة والغرض</AppText>
              <View accessibilityRole="radiogroup" className="mt-3 gap-2">
                {periods.map((item) => (
                  <Choice
                    key={item}
                    label={item}
                    onPress={() => setPeriod(item)}
                    selected={period === item}
                  />
                ))}
              </View>
              <View className="mt-3">
                <TextField
                  label="الغرض من التفويض"
                  onChangeText={setPurpose}
                  placeholder="مثال: متابعة المواعيد خلال فترة العلاج"
                  value={purpose}
                />
              </View>
            </View>

            <View className="mt-5 rounded-surface border border-tone-info-border bg-tone-info-fill p-4">
              <View className={cn('items-start gap-3', rowClassName)}>
                <AppIcon
                  name={{ ios: 'lock.shield.fill', android: 'verified_user', web: 'verified_user' }}
                  size={20}
                  tone="info"
                />
                <View className="min-w-0 flex-1">
                  <AppText className="text-tone-info-text" variant="body-strong">
                    أساس الطلب: {legalBasis}
                  </AppText>
                  <AppText className="mt-1 text-tone-info-text" variant="caption">
                    المسار القانوني أو تمثيل التابع لا يمكن اعتماده ذاتياً من هذه الشاشة.
                  </AppText>
                </View>
              </View>
            </View>

            <Button
              className="mt-6"
              disabled={!canSubmit}
              label="إرسال طلب التفويض"
              onPress={() => setConfirmingGrant(true)}
            />
            <Button
              className="mt-2"
              label="إلغاء"
              onPress={() => router.back()}
              variant="secondary"
            />
          </>
        )}
        <ConfirmationDialog
          visible={confirmingGrant && !submitted}
          title="إرسال طلب التفويض؟"
          description="راجع الشخص والصلاحيات والنطاق والمدة. لن يصبح التفويض فعالاً قبل التحقق واعتماد الطلب من الجهة المخوّلة."
          confirmLabel="إرسال طلب التفويض"
          onCancel={() => setConfirmingGrant(false)}
          onConfirm={() => {
            if (!subject || !canSubmit) return;
            submitGrantRequest({
              subjectId: subject.id,
              subjectName: subject.name,
              granteeName: granteeName.trim(),
              actions: selectedActions,
              dataScope,
              period,
              purpose: purpose.trim(),
              legalBasis,
            });
            setSubmitted(true);
            setConfirmingGrant(false);
          }}
        />
      </ReadStateBoundary>
    </ProfileScreenShell>
  );
}
