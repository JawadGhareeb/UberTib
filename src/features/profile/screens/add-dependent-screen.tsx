import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, View } from 'react-native';

import { ProfileScreenShell } from '@/features/profile/components/profile-screen-shell';
import { useAppDirection } from '@/providers/app-direction-provider';
import { AppIcon, AppText, Button, ReadStateBoundary, TextField } from '@/shared/components/ui';
import { useMockScenario } from '@/shared/mock';
import { cn } from '@/shared/utils/cn';

const requestedActions = ['عرض المواعيد', 'إدارة الحجوزات', 'عرض ملخص الرعاية'] as const;
const dataScopes = ['المواعيد فقط', 'المواعيد وملخص الرعاية'] as const;

export function AddDependentScreen() {
  const router = useRouter();
  const { rowClassName } = useAppDirection();
  const { getSurfaceState, submitDependentRequest } = useMockScenario();
  const readState = getSurfaceState('representation');
  const [name, setName] = useState('');
  const [relation, setRelation] = useState('');
  const [legalBasis, setLegalBasis] = useState('');
  const [documentReference, setDocumentReference] = useState('');
  const [purpose, setPurpose] = useState('');
  const [selectedActions, setSelectedActions] = useState<string[]>(['عرض المواعيد']);
  const [dataScope, setDataScope] = useState<(typeof dataScopes)[number]>('المواعيد فقط');
  const [submitted, setSubmitted] = useState(false);

  const canSubmit =
    readState === 'success' &&
    Boolean(
      name.trim() &&
      relation.trim() &&
      legalBasis.trim() &&
      documentReference.trim() &&
      purpose.trim() &&
      selectedActions.length > 0 &&
      dataScope,
    );

  return (
    <ProfileScreenShell
      description={
        submitted
          ? 'تم حفظ الطلب للمراجعة. لا توجد أي صلاحية جديدة قبل اعتماد العلاقة والتفويض.'
          : 'إضافة تابع هي طلب تحقق، وليست موافقة تلقائية على التمثيل.'
      }
      eyebrow="إضافة تابع"
      title={submitted ? 'الطلب قيد التحقق' : 'طلب تمثيل على تابع'}
    >
      <ReadStateBoundary
        emptyTitle="طلب إضافة التابع غير متاح"
        permissionDescription="صلاحيتك الحالية ما عاد تسمح بإرسال طلب تمثيل جديد."
        permissionTitle="ما عاد في صلاحية لإرسال الطلب"
        state={readState}
        staleAtLabel="آخر تحديث محفوظ"
      >
        {submitted ? (
          <View className="mt-5">
            <View className="rounded-surface border border-tone-warning-border bg-tone-warning-fill p-4">
              <View className={cn('items-start gap-3', rowClassName)}>
                <AppIcon
                  name={{ ios: 'clock.fill', android: 'schedule', web: 'schedule' }}
                  size={20}
                  tone="warning"
                />
                <View className="min-w-0 flex-1">
                  <AppText className="text-tone-warning-text" variant="body-strong">
                    المراجعة لم تكتمل بعد
                  </AppText>
                  <AppText className="mt-1 text-tone-warning-text" variant="caption">
                    استلام الطلب لا يعني أنك أصبحت مخولاً للتصرف نيابةً عن التابع.
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
            <View className="mt-6">
              <AppText variant="heading-4">بيانات التابع</AppText>
              <AppText className="mt-1 text-content-secondary" variant="caption">
                استخدم البيانات كما تظهر في المستندات الداعمة.
              </AppText>
              <View className="mt-3 gap-4">
                <TextField
                  label="اسم التابع"
                  onChangeText={setName}
                  placeholder="الاسم الكامل"
                  value={name}
                />
                <TextField
                  label="العلاقة"
                  onChangeText={setRelation}
                  placeholder="مثال: ابنتي"
                  value={relation}
                />
                <TextField
                  label="أساس العلاقة أو التمثيل"
                  onChangeText={setLegalBasis}
                  placeholder="مثال: ولي أمر"
                  value={legalBasis}
                />
              </View>
            </View>

            <View className="mt-6">
              <AppText variant="heading-4">دليل العلاقة</AppText>
              <AppText className="mt-1 text-content-secondary" variant="caption">
                في نسخة الـMock نستخدم مرجع المستند بدلاً من رفع ملف حقيقي.
              </AppText>
              <View className="mt-3">
                <TextField
                  label="مرجع المستند"
                  onChangeText={setDocumentReference}
                  placeholder="رقم أو وصف مختصر للمستند"
                  value={documentReference}
                />
              </View>

              <View className="mt-3 rounded-surface border border-border-subtle bg-surface-default p-4">
                <View className={cn('items-center gap-3', rowClassName)}>
                  <View className="h-10 w-10 items-center justify-center rounded-control bg-surface-subtle">
                    <AppIcon
                      name={{ ios: 'doc.text.fill', android: 'description', web: 'description' }}
                      size={19}
                      tone="secondary"
                    />
                  </View>
                  <View className="min-w-0 flex-1">
                    <AppText variant="label">المستند الداعم</AppText>
                    <AppText className="mt-0.5 text-content-secondary" variant="caption">
                      {documentReference.trim()
                        ? 'تم إدخال مرجع للمراجعة'
                        : 'مطلوب قبل إرسال الطلب'}
                    </AppText>
                  </View>
                  <AppIcon
                    name={
                      documentReference.trim()
                        ? {
                            ios: 'checkmark.circle.fill',
                            android: 'check_circle',
                            web: 'check_circle',
                          }
                        : {
                            ios: 'circle',
                            android: 'radio_button_unchecked',
                            web: 'radio_button_unchecked',
                          }
                    }
                    size={20}
                    tone={documentReference.trim() ? 'success' : 'secondary'}
                  />
                </View>
              </View>
            </View>

            <View className="mt-6">
              <AppText variant="heading-4">سبب الطلب</AppText>
              <View className="mt-3">
                <TextField
                  label="الغرض من التمثيل"
                  onChangeText={setPurpose}
                  placeholder="مثال: متابعة المواعيد والرعاية"
                  value={purpose}
                />
              </View>
            </View>

            <View className="mt-6">
              <AppText variant="heading-4">النطاق المطلوب بعد التحقق</AppText>
              <AppText className="mt-1 text-content-secondary" variant="caption">
                هذا النطاق لا يصبح فعالاً بمجرد إرسال الطلب؛ يظل بانتظار اعتماد العلاقة.
              </AppText>
              <View className="mt-3 gap-2">
                {requestedActions.map((action) => {
                  const selected = selectedActions.includes(action);

                  return (
                    <Pressable
                      accessibilityRole="checkbox"
                      accessibilityState={{ checked: selected }}
                      className={cn(
                        rowClassName,
                        'min-h-target-comfortable items-center gap-3 rounded-control border px-3 py-2.5',
                        selected
                          ? 'border-state-selected-border bg-state-selected'
                          : 'border-action-primary bg-surface-default active:bg-action-subtle',
                      )}
                      key={action}
                      onPress={() =>
                        setSelectedActions((current) =>
                          current.includes(action)
                            ? current.filter((item) => item !== action)
                            : [...current, action],
                        )
                      }
                    >
                      <AppIcon
                        name={
                          selected
                            ? {
                                ios: 'checkmark.square.fill',
                                android: 'check_box',
                                web: 'check_box',
                              }
                            : {
                                ios: 'square',
                                android: 'check_box_outline_blank',
                                web: 'check_box_outline_blank',
                              }
                        }
                        size={20}
                        tone={selected ? 'action' : 'secondary'}
                      />
                      <AppText className="min-w-0 flex-1" variant="label">
                        {action}
                      </AppText>
                    </Pressable>
                  );
                })}
              </View>

              <View accessibilityRole="radiogroup" className="mt-3 gap-2">
                {dataScopes.map((scope) => (
                  <Pressable
                    accessibilityRole="radio"
                    accessibilityState={{ selected: dataScope === scope }}
                    className={cn(
                      'min-h-target-comfortable justify-center rounded-control border px-3 py-2.5',
                      dataScope === scope
                        ? 'border-state-selected-border bg-state-selected'
                        : 'border-action-primary bg-surface-default active:bg-action-subtle',
                    )}
                    key={scope}
                    onPress={() => setDataScope(scope)}
                  >
                    <AppText variant="label">{scope}</AppText>
                  </Pressable>
                ))}
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
                    الطلب لا يمنح صلاحية مباشرة
                  </AppText>
                  <AppText className="mt-1 text-tone-info-text" variant="caption">
                    بعد الإرسال تتم مراجعة العلاقة والدليل. ما فيك تعتمد طلبك بنفسك أو تتصرف نيابةً
                    عن التابع قبل الموافقة.
                  </AppText>
                </View>
              </View>
            </View>

            <Button
              className="mt-6"
              disabled={!canSubmit}
              label="إرسال طلب التحقق"
              onPress={() => {
                submitDependentRequest({
                  name: name.trim(),
                  relation: relation.trim(),
                  legalBasis: legalBasis.trim(),
                  documentReference: documentReference.trim(),
                  purpose: purpose.trim(),
                  requestedActions: selectedActions,
                  dataScope,
                });
                setSubmitted(true);
              }}
            />
            <Button
              className="mt-2"
              label="إلغاء"
              onPress={() => router.back()}
              variant="secondary"
            />
          </>
        )}
      </ReadStateBoundary>
    </ProfileScreenShell>
  );
}
