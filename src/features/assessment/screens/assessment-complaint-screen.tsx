import { useRouter } from 'expo-router';
import { Pressable, View } from 'react-native';

import { AssessmentScaffold } from '@/features/assessment/components/assessment-scaffold';
import { useAssessmentSession } from '@/features/assessment/state/assessment-session-provider';
import { AppIcon, AppText, TextField } from '@/shared/components/ui';
import { cn } from '@/shared/utils/cn';

const complaints = [
  ['ألم في سن أو ضرس', { ios: 'bolt.fill', android: 'bolt', web: 'bolt' }, false],
  ['تورم أو انتفاخ', { ios: 'drop.fill', android: 'water_drop', web: 'water_drop' }, true],
  ['كسر أو إصابة', { ios: 'bandage.fill', android: 'healing', web: 'healing' }, true],
  ['نزيف أو مشكلة لثة', { ios: 'heart.fill', android: 'favorite', web: 'favorite' }, false],
  ['حشوة أو تاج', { ios: 'square.fill', android: 'crop_square', web: 'crop_square' }, false],
  [
    'سن مفقود / زرعة',
    { ios: 'circle.dashed', android: 'radio_button_unchecked', web: 'radio_button_unchecked' },
    true,
  ],
  ['المظهر أو اللون', { ios: 'sparkles', android: 'auto_awesome', web: 'auto_awesome' }, true],
  ['فحص أو تنظيف', { ios: 'checkmark.seal.fill', android: 'verified', web: 'verified' }, false],
  ['مشكلة لدى طفل', { ios: 'figure.child', android: 'child_care', web: 'child_care' }, false],
  ['شيء آخر / غير متأكد', { ios: 'ellipsis', android: 'more_horiz', web: 'more_horiz' }, true],
] as const;

export function AssessmentComplaintScreen() {
  const router = useRouter();
  const { complaint, details, setComplaint, setDetails } = useAssessmentSession();

  return (
    <AssessmentScaffold
      onPrimary={() => router.push('/assessment/location')}
      primaryDisabled={!complaint}
      primaryLabel="متابعة"
      phase="المشكلة الرئيسية"
      title="ما أكثر شيء يزعجك الآن؟"
      topContent={
        <View className="gap-2 pt-1">
          <View className="self-end flex-row items-center gap-1.5 rounded-full bg-action-subtle px-2.5 py-1.5">
            <AppText className="text-type-label text-content-link" variant="caption">
              سارة الأحمد • 31 سنة
            </AppText>
            <AppIcon
              name={{ ios: 'person.fill', android: 'person', web: 'person' }}
              size={13}
              tone="action"
            />
          </View>
          <AppText className="text-type-label  text-content-secondary">
            اختر المشكلة الرئيسية فقط. سنسألك عن الأعراض الأخرى لاحقاً.
          </AppText>
        </View>
      }
    >
      <View className="mt-2 flex-row flex-wrap justify-between gap-y-1.5">
        {complaints.map(([label, icon, warm]) => {
          const selected = complaint === label;

          return (
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ selected }}
              className={cn(
                'h-[58px] w-[49%] flex-row items-center gap-2 rounded-[13px] border px-2',
                selected
                  ? 'border-action-primary bg-action-subtle'
                  : 'border-border-subtle bg-surface-default',
              )}
              key={label}
              onPress={() => setComplaint(label)}
            >
              <View
                className={cn(
                  'h-[38px] w-[38px] items-center justify-center rounded-[12px]',
                  selected
                    ? 'bg-action-primary'
                    : warm
                      ? 'bg-tone-warning-fill'
                      : 'bg-action-subtle',
                )}
              >
                <AppIcon name={icon} size={20} tone={selected ? 'onAction' : 'action'} />
              </View>
              <AppText
                className={cn(
                  'min-w-0 flex-1 text-type-label ',
                  selected && 'font-ui-bold text-content-link',
                )}
                variant="label"
              >
                {label}
              </AppText>
            </Pressable>
          );
        })}
      </View>

      <View className="mt-3 gap-1">
        <TextField
          label="صف المشكلة بكلماتك (اختياري)"
          maxLength={240}
          multiline
          onChangeText={setDetails}
          placeholder="ألم في الضرس الخلفي الأيمن منذ 3 أيام ويزداد مع البارد."
          value={details}
        />
        <AppText
          align="left"
          className="text-content-placeholder"
          direction="ltr"
          variant="caption"
        >
          {details.length} / 240
        </AppText>
      </View>
    </AssessmentScaffold>
  );
}
