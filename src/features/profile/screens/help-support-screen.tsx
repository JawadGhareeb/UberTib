import { useLocalSearchParams, useRouter } from 'expo-router';
import { Accordion } from 'heroui-native';
import { Pressable, ScrollView, View } from 'react-native';

import { AppHeader } from '@/shared/components/navigation';
import { AppIcon, AppText, ReadStateBoundary, Screen } from '@/shared/components/ui';
import type { AppIconName } from '@/shared/components/ui';
import { useMockScenario } from '@/shared/mock';
import { useSupportTickets } from '@/features/profile/state/support-tickets-provider';

const faq = [
  {
    id: 'booking',
    question: 'كيف أتابع حجزي؟',
    answer: 'افتح علاجي ثم حجوزاتي. بتشوف حالة الموعد، وتفاصيله، والخطوة التالية المتاحة.',
  },
  {
    id: 'care',
    question: 'وين بلاقي تفاصيل العلاج؟',
    answer: 'من علاجي ثم حالاتـي العلاجية، افتح الحالة لتشوف المراحل، الخطة، والمتابعات.',
  },
  {
    id: 'refund',
    question: 'كيف بقدّم طلب استرداد؟',
    answer:
      'الاسترداد مرتبط بحالة علاجية وبشروط الاستحقاق والنسخة المقبولة من الخطة. افتح المشكلة المرتبطة بالحالة واختار طلب استرداد؛ تقديم الطلب مو موافقة تلقائية.',
  },
  {
    id: 'protection',
    question: 'شو المقصود بالحماية المشروطة؟',
    answer:
      'الحماية ليست ضمان استرداد أو تعويض تلقائي؛ تتحدد الأهلية والشروط من السياسة المعتمدة ومن قرار المراجعة.',
  },
  {
    id: 'ratings',
    question: 'متى فيني قيّم الطبيب؟',
    answer: 'التقييم بيظهر للحالة المكتملة والمؤهلة، وبخضع لشروط التحقق المحددة بالنظام.',
  },
  {
    id: 'ticket',
    question: 'كيف بتابع طلب الدعم؟',
    answer:
      'بتلاقي طلباتك ضمن المساعدة والدعم. الطلبات المحفوظة محلياً بالمعاينة مو مرسلة، والمدة المتوقعة للرد ما بتظهر إلا بعد قبول الطلب من نظام الدعم.',
  },
] as const;

function NavigationRow({
  title,
  detail,
  icon,
  onPress,
}: {
  title: string;
  detail: string;
  icon: AppIconName;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      onPress={onPress}
      className="min-h-[73px] flex-row-reverse items-center gap-3 rounded-[15px] border border-border-subtle bg-surface-default px-3 py-3"
    >
      <View className="h-11 w-11 shrink-0 items-center justify-center rounded-[12px] bg-action-subtle">
        <AppIcon name={icon} size={22} tone="action" />
      </View>
      <View className="min-w-0 flex-1 items-end gap-1">
        <AppText variant="label" align="right" className="font-ui-semibold">
          {title}
        </AppText>
        <AppText
          variant="caption"
          align="right"
          className="text-content-secondary"
          numberOfLines={2}
        >
          {detail}
        </AppText>
      </View>
      <AppIcon
        name={{ ios: 'chevron.left', android: 'chevron_left', web: 'chevron_left' }}
        size={16}
        tone="secondary"
      />
    </Pressable>
  );
}

/** SRS P-UI-34: search + FAQ + policies + ticket creation and tracking.
 * P-UI-27/28/29 case claims remain separate and require explicit scope/eligibility.
 */
export function HelpSupportScreen() {
  const router = useRouter();
  const { caseId } = useLocalSearchParams<{ caseId?: string }>();
  const { getSurfaceState } = useMockScenario();
  const { tickets } = useSupportTickets();
  const filtered = faq;

  return (
    <Screen
      contentClassName="px-0 py-0"
      header={<AppHeader title="المساعدة والدعم" variant="detail" showBack />}
    >
      <ScrollView
        style={{ flex: 1 }}
        keyboardShouldPersistTaps="handled"
        contentContainerClassName="mx-auto w-full max-w-[430px] gap-5 px-4 pb-24 pt-3"
        showsVerticalScrollIndicator={false}
      >
        <View className="gap-2">
          <AppText variant="heading-4" align="right">
            تحتاج مساعدة إضافية؟
          </AppText>
          <NavigationRow
            title="إنشاء طلب دعم"
            detail="مشكلة بالتطبيق أو الحساب أو استفسار عن حجز"
            icon={{ ios: 'square.and.pencil', android: 'edit_note', web: 'edit_note' }}
            onPress={() =>
              router.push({ pathname: '/support/new', params: caseId ? { caseId } : {} })
            }
          />
          <NavigationRow
            title="طلبات الدعم"
            detail={
              tickets.length
                ? tickets.length + ' طلب محفوظ محلياً · غير مرسل'
                : 'تابع حالة الطلبات عند توفرها'
            }
            icon={{ ios: 'ticket', android: 'confirmation_number', web: 'confirmation_number' }}
            onPress={() => router.push('/support/tickets')}
          />
          <NavigationRow
            title="مشكلة مرتبطة بعلاج أو دفعة؟"
            detail="الشكاوى والاسترداد والنزاعات حسب الحالة والأهلية"
            icon={{ ios: 'shield.lefthalf.filled', android: 'verified_user', web: 'verified_user' }}
            onPress={() =>
              router.push({
                pathname: '/support/new',
                params: { type: 'care', ...(caseId ? { caseId } : {}) },
              })
            }
          />
        </View>

        <View className="gap-2">
          <AppText variant="heading-4" align="right">
            السياسات والمعلومات
          </AppText>
          <NavigationRow
            title="الإلغاء والاسترداد والحماية"
            detail="شرح مبسّط للشروط والأهلية والتقييم"
            icon={{ ios: 'book.closed', android: 'menu_book', web: 'menu_book' }}
            onPress={() => router.push('/support/policies')}
          />
        </View>

        <View className="gap-2">
          <AppText variant="heading-4" align="right">
            الأسئلة الشائعة
          </AppText>
          {filtered.length ? (
            <Accordion
              selectionMode="single"
              isCollapsible
              variant="default"
              className="overflow-hidden rounded-[15px] border border-border-subtle bg-surface-default"
            >
              {filtered.map((entry) => (
                <Accordion.Item key={entry.id} value={entry.id}>
                  <Accordion.Trigger className="min-h-[54px] flex-row-reverse items-center justify-between px-3 py-3">
                    <AppText
                      variant="label"
                      align="right"
                      className="min-w-0 flex-1 font-ui-semibold"
                    >
                      {entry.question}
                    </AppText>
                    <Accordion.Indicator />
                  </Accordion.Trigger>
                  <Accordion.Content className="px-3 pb-4">
                    <AppText align="right" variant="label" className="text-content-secondary">
                      {entry.answer}
                    </AppText>
                  </Accordion.Content>
                </Accordion.Item>
              ))}
            </Accordion>
          ) : (
            <View className="items-center gap-2 rounded-[14px] bg-surface-subtle p-5">
              <AppText variant="label" align="center">
                ما لقينا سؤال بهالكلمات.
              </AppText>
              <AppText variant="caption" align="center" className="text-content-secondary">
                جرّب كلمة مختلفة، أو افتح طلب دعم.
              </AppText>
            </View>
          )}
        </View>

        <ReadStateBoundary
          state={getSurfaceState('profile')}
          emptyTitle="معلومات الدعم غير متاحة"
          permissionTitle="معلومات الحساب غير متاحة"
        >
          <AppText align="right" variant="caption" className="text-content-secondary">
            إنشاء تذكرة فعلية وتتبع مهلة الرد يحتاجان الاتصال بخدمة الدعم؛ المعاينة تحفظ مسودات
            محلية فقط.
          </AppText>
        </ReadStateBoundary>
      </ScrollView>
    </Screen>
  );
}
