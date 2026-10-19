import * as DocumentPicker from 'expo-document-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, TextInput, View } from 'react-native';

import { BookingHeader } from '@/features/booking/components/booking-v5-ui';
import { getMockProvider } from '@/features/discovery/mocks/providers.mock';
import { canBookForPatient } from '@/features/booking/utils/patient-booking-permissions';
import { useMockScenario } from '@/shared/mock';
import { useBookingDraft, type BookingVisitReason } from '@/features/booking/state/booking-draft-provider';
import { useAppDirection } from '@/providers/app-direction-provider';
import { AppIcon, AppText, Button, Screen, StateView } from '@/shared/components/ui';
import { useAppTheme } from '@/shared/theme/use-app-theme';
import { cn } from '@/shared/utils/cn';

const reasons = [
  { id: 'new', label: 'زيارة أولى' },
  { id: 'followup', label: 'متابعة علاج' },
  { id: 'other', label: 'استشارة أخرى' },
] as const;

export function BookingVisitReasonScreen() {
  const router = useRouter();
  const { rowClassName } = useAppDirection();
  const { colors } = useAppTheme();
  const { providerId, serviceCode, dateKey, dateLabel, timeLabel, patientId } = useLocalSearchParams<{
    providerId?: string;
    serviceCode?: string;
    dateKey?: string;
    dateLabel?: string;
    timeLabel?: string;
    patientId?: string;
  }>();
  const { scenario } = useMockScenario();
  const provider = getMockProvider(providerId);
  const selectedDate = provider?.availability.find((day) => day.dateKey === dateKey);
  const validSlot = Boolean(
    provider?.serviceCodes.includes(serviceCode ?? '') &&
    selectedDate?.dateLabel === dateLabel &&
    selectedDate?.slots.includes(timeLabel ?? ''),
  );
  const patientCanBook = canBookForPatient(patientId, scenario);
  const { reason, setReason, note, setNote, attachment, setAttachment, shareAttachment, setShareAttachment, prepareForService } = useBookingDraft();
  const [editingReason, setEditingReason] = useState(false);
  const [selectingFile, setSelectingFile] = useState(false);
  const [attachmentError, setAttachmentError] = useState('');

  useEffect(() => {
    prepareForService((providerId ?? '') + ':' + (serviceCode ?? ''));
  }, [providerId, serviceCode, prepareForService]);

  const pickPhoto = async () => {
    if (selectingFile) return;
    setSelectingFile(true);
    setAttachmentError('');
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['image/*', 'application/pdf'],
        multiple: false,
        copyToCacheDirectory: true,
      });
      if (result.canceled) return;
      const file = result.assets[0];
      if (!file) return;
      if (file.size && file.size > 25 * 1024 * 1024) {
        setAttachmentError('الملف أكبر من 25 ميغابايت.');
        return;
      }
      setAttachment({
        uri: file.uri,
        fileName: file.name || 'مرفق إضافي',
        mimeType: file.mimeType,
      });
      setShareAttachment(false);
    } catch {
      setAttachmentError('تعذّر فتح ملفات الجهاز. جرّب مرة ثانية.');
    } finally {
      setSelectingFile(false);
    }
  };

  if (!validSlot || !patientCanBook) {
    return (
      <Screen>
        <StateView
          title={!validSlot ? 'اختيار الموعد مطلوب' : 'اختيار المريض مطلوب'}
          description={!validSlot
            ? 'ابدأ باختيار الموعد قبل ملخص الحالة والمرفقات.'
            : 'اختر مريضاً يملك صلاحية الحجز قبل المتابعة.'}
          actionLabel={!validSlot ? 'اختيار الموعد' : 'تحديد المريض'}
          onAction={() => router.replace(!validSlot
            ? {
                pathname: '/booking/slots',
                params: { providerId: providerId ?? '', serviceCode: serviceCode ?? '' },
              }
            : {
                pathname: '/booking/patient',
                params: {
                  providerId: providerId ?? '',
                  serviceCode: serviceCode ?? '',
                  dateKey: dateKey ?? '',
                  dateLabel: dateLabel ?? '',
                  timeLabel: timeLabel ?? '',
                },
              })}
        />
      </Screen>
    );
  }

  return (
    <Screen contentClassName="px-0 py-0">
      <BookingHeader leadingIcon="reason" title="ملخص الحالة والمرفقات" />
      <ScrollView
        contentContainerClassName="mx-auto w-full max-w-[430px] px-4 pb-[104px] pt-1"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <AppText align="right" className="mt-3 font-ui-bold text-content-primary" variant="label">
          خلّينا نجهّز سبب الزيارة للطبيب
        </AppText>

        <View className="mt-2 rounded-[15px] border border-action-primary/25 bg-action-subtle p-3">
          <View className={cn('items-center gap-3', rowClassName)}>
            <View className="h-[48px] w-[48px] items-center justify-center rounded-full bg-surface-default">
              <AppIcon
                name={{ ios: 'checklist', android: 'fact_check', web: 'fact_check' }}
                size={22}
                tone="action"
              />
            </View>
            <View className="min-w-0 flex-1 items-end">
              <AppText align="right" className="text-content-link" variant="caption">
                سبب الزيارة المحدد
              </AppText>
              <AppText align="right" className="mt-0.5 font-ui-bold text-content-primary" variant="label">
                {reasons.find((item) => item.id === reason)?.label}
              </AppText>
              <AppText align="right" className="mt-1 text-content-secondary" variant="caption">
                سيتم توضيح السبب للطبيب عند مراجعة الطلب، دون افتراض أي تشخيص طبي.
              </AppText>
              <Pressable
                accessibilityLabel="تعديل سبب الزيارة"
                accessibilityRole="button"
                className="mt-1 min-h-[28px] justify-center"
                onPress={() => setEditingReason((value) => !value)}
              >
                <AppText className="font-ui-semibold text-content-link" variant="caption">
                  تعديل السبب
                </AppText>
              </Pressable>
            </View>
          </View>
          {editingReason ? (
            <View className={cn('mt-2 flex-wrap gap-2', rowClassName)}>
              {reasons.map((item) => (
                <Pressable
                  accessibilityRole="radio"
                  accessibilityState={{ checked: item.id === reason }}
                  className={cn(
                    'min-h-[42px] items-center justify-center rounded-[10px] border px-3',
                    item.id === reason
                      ? 'border-action-primary bg-surface-default'
                      : 'border-border-subtle bg-surface-subtle',
                  )}
                  key={item.id}
                  onPress={() => {
                    setReason(item.id as BookingVisitReason);
                    setEditingReason(false);
                  }}
                >
                  <AppText className={item.id === reason ? 'font-ui-bold text-content-link' : 'text-content-primary'} variant="caption">
                    {item.label}
                  </AppText>
                </Pressable>
              ))}
            </View>
          ) : null}
        </View>

        <View className="mt-2 rounded-[13px] border border-border-subtle bg-surface-default p-3">
          <AppText align="right" className="font-ui-semibold text-content-primary" variant="label">
            ملاحظة شخصية للطبيب — اختيارية
          </AppText>
          <TextInput
            accessibilityLabel="ملاحظة شخصية للطبيب"
            className="mt-1 min-h-[50px] font-ui-regular text-content-primary"
            maxLength={500}
            multiline
            onChangeText={setNote}
            placeholder="تفاصيل، شرح الخطوات قبل أي إجراء..."
            placeholderTextColor={colors.text.placeholder}
            style={{ writingDirection: 'rtl', textAlign: 'right', textAlignVertical: 'top', fontSize: 12 }}
            value={note}
          />
        </View>

        <AppText align="right" className="mt-3 font-ui-bold text-content-primary" variant="label">
          الملفات المحددة للمشاركة
        </AppText>

        <View className="mt-2 gap-2">
          <View className={cn('min-h-[54px] items-center gap-2 rounded-[12px] border border-border-subtle bg-surface-default px-3 py-2', rowClassName)}>
            <View className="h-[30px] w-[30px] items-center justify-center rounded-[8px] bg-tone-info-fill">
              <AppIcon name={{ ios: 'photo', android: 'image', web: 'image' }} size={16} tone="info" />
            </View>
            <View className="min-w-0 flex-1 items-end">
              <AppText align="right" className="font-ui-semibold text-content-primary" variant="label">
                صورة المنطقة
              </AppText>
              <AppText align="right" className="text-content-secondary" numberOfLines={2} variant="caption">
                {attachment ? attachment.fileName : 'ما تم اختيار صورة بعد'}
              </AppText>
            </View>
            <View className="rounded-[7px] bg-tone-success-fill px-2 py-1">
              <AppText className="text-tone-success-text" variant="badge">
                {attachment ? 'محلية فقط' : 'غير مرفق'}
              </AppText>
            </View>
            <Pressable
              accessibilityLabel="اختيار الصورة للمراجعة"
              accessibilityRole="switch"
              accessibilityState={{ checked: Boolean(attachment && shareAttachment), disabled: !attachment }}
              className={cn(
                'h-[28px] w-[42px] justify-center rounded-full px-1',
                attachment && shareAttachment ? 'bg-action-primary' : 'bg-surface-subtle',
              )}
              disabled={!attachment}
              onPress={() => setShareAttachment(!shareAttachment)}
            >
              <View className={cn('h-5 w-5 rounded-full bg-surface-default', attachment && shareAttachment ? 'self-end' : 'self-start')} />
            </Pressable>
          </View>

          <View className={cn('min-h-[54px] items-center gap-2 rounded-[12px] border border-border-subtle bg-surface-default px-3 py-2', rowClassName)}>
            <View className="h-[30px] w-[30px] items-center justify-center rounded-[8px] bg-surface-subtle">
              <AppIcon name={{ ios: 'viewfinder', android: 'center_focus_strong', web: 'center_focus_strong' }} size={17} tone="secondary" />
            </View>
            <View className="min-w-0 flex-1 items-end">
              <AppText align="right" className="font-ui-semibold text-content-primary" variant="label">
                أشعة حول ذروية سابقة
              </AppText>
              <AppText align="right" className="text-content-secondary" variant="caption">
                لم يتم اختيار ملف أشعة
              </AppText>
            </View>
            <View className="rounded-[7px] bg-surface-subtle px-2 py-1">
              <AppText className="text-content-secondary" variant="badge">غير مرفق</AppText>
            </View>
            <View className="h-[28px] w-[42px] items-start justify-center rounded-full bg-surface-subtle px-1">
              <View className="h-5 w-5 rounded-full bg-surface-default" />
            </View>
          </View>
        </View>

        <View className={cn('mt-2 min-h-[54px] items-center gap-2 rounded-[12px] bg-tone-info-fill px-3 py-2', rowClassName)}>
          <View className="h-9 w-9 items-center justify-center rounded-full bg-surface-default">
            <AppIcon name={{ ios: 'shield.lefthalf.filled', android: 'verified_user', web: 'verified_user' }} size={19} tone="info" />
          </View>
          <View className="min-w-0 flex-1 items-end">
            <AppText align="right" className="font-ui-semibold text-content-primary" variant="label">
              السياق الصحي المحدد للمشاركة
            </AppText>
            <AppText align="right" className="text-content-secondary" variant="caption">
              لم يتم إرفاق تاريخ صحي بهذا الحجز
            </AppText>
          </View>
        </View>

        <Button
          className="mt-2 h-[44px] rounded-[11px]"
          label={attachment ? 'تغيير الصورة المضافة' : 'إضافة ملف أو صورة'}
          loading={selectingFile}
          onPress={() => void pickPhoto()}
          size="sm"
          variant="outline"
        />
        {attachmentError ? (
          <AppText align="right" className="mt-1 text-tone-danger-text" variant="caption">
            {attachmentError}
          </AppText>
        ) : null}
        {attachment ? (
          <Pressable className="mt-1 min-h-[34px] justify-center self-end" onPress={() => setAttachment(null)}>
            <AppText className="text-tone-danger-text" variant="caption">إزالة الصورة</AppText>
          </Pressable>
        ) : null}
        <AppText align="right" className="mt-2 text-content-secondary" variant="caption">
          الصورة تبقى محلية أثناء المعاينة، ولا تُرفع أو تُرسل إلى الطبيب ضمن النسخة التجريبية.
        </AppText>
      </ScrollView>

      <View className="absolute bottom-0 left-0 right-0 border-t border-border-subtle bg-surface-canvas px-4 pb-3 pt-2">
        <View className="mx-auto w-full max-w-[430px]">
          <Button
            className="h-[52px] rounded-[12px]"
            endIcon={{ ios: 'arrow.left', android: 'arrow_back', web: 'arrow_back' }}
            label="متابعة لمراجعة طلب الحجز"
            onPress={() => router.push({
              pathname: '/booking/review',
              params: {
                providerId: providerId ?? '',
                serviceCode: serviceCode ?? '',
                patientId: patientId ?? '',
                dateKey: dateKey ?? '',
                dateLabel: dateLabel ?? '',
                timeLabel: timeLabel ?? '',
                reason,
              },
            })}
          />
        </View>
      </View>
    </Screen>
  );
}
