import { useLocalSearchParams, useRouter } from 'expo-router';
import { Accordion } from 'heroui-native';
import { View } from 'react-native';

import { AssessmentScaffold } from '@/features/assessment/components/assessment-scaffold';
import { ASSESSMENT_PATIENT_FIXTURES } from '@/features/assessment/presentation/assessment-patient-copy';
import { useAuthSession } from '@/providers/auth-session-provider';
import { useAssessmentSession } from '@/features/assessment/state/assessment-session-provider';
import { AppIcon, AppText, Button } from '@/shared/components/ui';
import type { AppIconName } from '@/shared/components/ui/app-icon';

const categories: { id: string; title: string; description: string; icon: AppIconName }[] = [
  {
    id: 'allergy',
    title: 'الحساسيات',
    description: 'راجع الحساسيات المسجلة قبل بدء التقييم.',
    icon: { ios: 'shield.lefthalf.filled', android: 'health_and_safety', web: 'health_and_safety' },
  },
  {
    id: 'medicine',
    title: 'الأدوية الحالية',
    description: 'راجع الأدوية والمكملات التي تتناولها حالياً.',
    icon: { ios: 'pills.fill', android: 'medication', web: 'medication' },
  },
  {
    id: 'conditions',
    title: 'الحالات الصحية',
    description: 'راجع الحالات الصحية المهمة قبل الحجز.',
    icon: { ios: 'heart.text.square', android: 'monitor_heart', web: 'monitor_heart' },
  },
  {
    id: 'dental',
    title: 'تاريخ الأسنان والعلاجات السابقة',
    description: 'العلاجات السابقة، التيجان والزراعات والصور الطبية.',
    icon: { ios: 'cross.case.fill', android: 'dentistry', web: 'dentistry' },
  },
];

export function AssessmentHealthScreen() {
  const router = useRouter();
  const { returnTo } = useLocalSearchParams<{ returnTo?: string }>();
  const { patient, setHealthConfirmed } = useAssessmentSession();
  const person = ASSESSMENT_PATIENT_FIXTURES[patient];
  const { isAuthenticated } = useAuthSession();

  return (
    <AssessmentScaffold
      phase="السياق الصحي"
      title="مراجعة المعلومات الصحية"
      primaryLabel="راجعت المعلومات، متابعة"
      onPrimary={() => {
        setHealthConfirmed(true);
        if (returnTo === 'review') router.replace('/assessment/review');
        else router.push('/assessment/media');
      }}
      topContent={
        <View className="flex-row-reverse items-center gap-3 rounded-[14px] bg-action-subtle p-3">
          <View className="h-11 w-11 items-center justify-center rounded-full bg-surface-default">
            <AppIcon
              name={{ ios: 'person.fill', android: 'person', web: 'person' }}
              tone="action"
              size={23}
            />
          </View>
          <View className="min-w-0 flex-1 items-end gap-1">
            <AppText variant="label" className="font-ui-bold">
              {isAuthenticated ? person.name : 'تقييم مبدئي'}
            </AppText>
            <AppText variant="caption" className="text-content-secondary">
              {isAuthenticated ? `${person.age} سنة · المعلومات تخص المريض المختار` : 'راجع المعلومات الصحية العامة قبل المتابعة'}
            </AppText>
          </View>
        </View>
      }
    >
      <AppText align="right" variant="label" className="text-content-secondary">
        راجع المعلومات الصحية المهمة قبل المتابعة. لا يتم ربط هذا التقييم بملف صحي شخصي للزائر.
      </AppText>
      <Accordion
        selectionMode="multiple"
        variant="default"
        className="overflow-hidden rounded-[15px] border border-border-subtle bg-surface-default"
      >
        {categories.map((item) => (
          <Accordion.Item key={item.id} value={item.id}>
            <Accordion.Trigger className="min-h-[65px] flex-row-reverse items-center gap-3 px-3 py-2.5">
              <View className="h-10 w-10 items-center justify-center rounded-[11px] bg-action-subtle">
                <AppIcon name={item.icon} size={20} tone="action" />
              </View>
              <View className="min-w-0 flex-1 items-end gap-1">
                <AppText align="right" variant="label" className="font-ui-semibold">
                  {item.title}
                </AppText>
                <AppText align="right" variant="caption" className="text-content-secondary">
                  افتح القسم لمراجعة المعلومات
                </AppText>
              </View>
              <Accordion.Indicator />
            </Accordion.Trigger>
            <Accordion.Content className="px-4 pb-4">
              <AppText align="right" variant="label" className="text-content-secondary">
                {item.description}
              </AppText>
              <AppText align="right" variant="caption" className="mt-1 text-content-secondary">
                ما في معلومات صحية متصلة بملف طبي معتمد لهالقسم حالياً.
              </AppText>
            </Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion>
      <Button
        label="عرض وتحديث الملف الصحي"
        variant="outline"
        endIcon={{ ios: 'pencil', android: 'edit', web: 'edit' }}
        onPress={() =>
          router.push({
            pathname: '/profile/health',
            params: { assessmentPatient: patient },
          })
        }
      />
      <View className="flex-row-reverse items-start gap-2 rounded-[12px] bg-tone-info-fill p-3">
        <AppIcon
          name={{ ios: 'lock.shield', android: 'lock', web: 'lock' }}
          tone="info"
          size={18}
        />
        <AppText align="right" variant="caption" className="min-w-0 flex-1 text-tone-info-text">
          هذا تأكيد أنك راجعت الخطوة، وليس إقراراً بعدم وجود حساسية أو مرض. لن تُرسل المعلومات
          للطبيب قبل مراجعة المشاركة.
        </AppText>
      </View>
    </AssessmentScaffold>
  );
}
