import { View } from 'react-native';
import { ProfileScreenShell } from '@/features/profile/components/profile-screen-shell';
import { AppIcon, AppText } from '@/shared/components/ui';

const subjects = [
  {
    title: 'الإلغاء والاسترداد',
    body: 'تُحدد أهلية الاسترداد والمبلغ والسطر المتأثر والمهلة وفق الشروط السارية والنسخة المقبولة من الخطة أو الحجز. أوبرطب يتابع الحالة ولا يعيد الأموال من محفظة داخل التطبيق.',
    icon: { ios: 'arrow.uturn.backward', android: 'undo', web: 'undo' },
  },
  {
    title: 'الحماية المشروطة',
    body: 'ليست تعويضاً مضموناً أو تلقائياً. تخضع لنوع الخدمة والأهلية والسياسة المعتمدة وقرار مراجعة بشري عند الحاجة.',
    icon: { ios: 'shield.lefthalf.filled', android: 'security', web: 'security' },
  },
  {
    title: 'الأهلية والتقييم',
    body: 'تعتمد إتاحة الحجز وبعض الإجراءات على أهلية الطبيب والخدمة والفرع والمرحلة. التقييم مرتبط بالحالة المكتملة والمؤهلة ويخضع للتحقق.',
    icon: { ios: 'checkmark.seal', android: 'verified', web: 'verified' },
  },
] as const;
export function SupportPoliciesScreen() {
  return (
    <ProfileScreenShell eyebrow="المساعدة" title="المساعدة والسياسات">
      <View className="mt-3 gap-3">
        {subjects.map((item) => (
          <View
            key={item.title}
            className="gap-2 rounded-[15px] border border-border-subtle bg-surface-default p-4"
          >
            <View className="flex-row-reverse items-center gap-2">
              <View className="h-10 w-10 items-center justify-center rounded-[11px] bg-action-subtle">
                <AppIcon name={item.icon} size={20} tone="action" />
              </View>
              <AppText variant="heading-4" className="min-w-0 flex-1" align="right">
                {item.title}
              </AppText>
            </View>
            <AppText variant="label" align="right" className="text-content-secondary">
              {item.body}
            </AppText>
          </View>
        ))}
        <View className="gap-2 rounded-[13px] bg-surface-subtle p-3">
          <AppText variant="label" align="right" className="font-ui-semibold">
            النسخة المعتمدة من السياسة
          </AppText>
          <AppText variant="caption" align="right" className="text-content-secondary">
            نص السياسة الرسمي ورقم إصدارها وتاريخ سريانها غير متاحين بالبيانات التجريبية. هذا شرح
            عام فقط، ولا يغني عن شروط الحجز أو الخطة المقبولة أو السياسة المعتمدة للحالة.
          </AppText>
        </View>
      </View>
    </ProfileScreenShell>
  );
}
