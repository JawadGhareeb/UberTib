import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScrollView, View } from 'react-native';

import { DiscoveryHeader } from '@/features/discovery/components/pen-discovery-ui';
import { ServiceIcon } from '@/features/discovery/components/service-icon';
import { findPenFamily, findPenGroup } from '@/features/discovery/presentation/pen-discovery-data';
import { useAppDirection } from '@/providers/app-direction-provider';
import { AppIcon, AppText, Button, Screen, StateView } from '@/shared/components/ui';
import type { AppIconName } from '@/shared/components/ui/app-icon';
import { cn } from '@/shared/utils/cn';

type NoteTone = 'success' | 'default' | 'warning' | 'info';
type ServiceNote = {
  title: string;
  detail: string;
  tone: NoteTone;
  icon: AppIconName;
};

const rootCanalNotes: ServiceNote[] = [
  {
    title: 'الهدف العملي',
    detail: 'تخفيف المشكلة والمحافظة على السن عندما يرى الطبيب أن ذلك مناسب.',
    tone: 'success',
    icon: { ios: 'checklist', android: 'checklist', web: 'checklist' },
  },
  {
    title: 'مو قرار نهائي',
    detail: 'اختيار العائلة لا يغني عن الفحص، ولا يحدد تفاصيل الإجراء.',
    tone: 'default',
    icon: { ios: 'checkmark.shield', android: 'rule', web: 'rule' },
  },
  {
    title: 'شو ممكن يغيّر الخطة؟',
    detail: 'حالة السن وصورته وإمكانية ترميمه لاحقاً حسب تقييم الطبيب.',
    tone: 'warning',
    icon: { ios: 'creditcard', android: 'add_card', web: 'add_card' },
  },
  {
    title: 'ملفات مفيدة إن وجدت',
    detail: 'صورة سابقة أو تقرير إحالة مو شرط حتى تبحث عن طبيب.',
    tone: 'info',
    icon: { ios: 'photo', android: 'image', web: 'image' },
  },
  {
    title: 'بعد الموعد',
    detail: 'يوضّح الطبيب المتابعة والترميم المناسب ضمن خطة العلاج.',
    tone: 'default',
    icon: { ios: 'calendar', android: 'event_repeat', web: 'event_repeat' },
  },
];

const generalNotes: ServiceNote[] = [
  {
    title: 'الهدف العملي',
    detail: 'يفحص الطبيب الحالة ويشرح ما إذا كانت الخدمة مناسبة.',
    tone: 'success',
    icon: { ios: 'checklist', android: 'checklist', web: 'checklist' },
  },
  {
    title: 'مو قرار نهائي',
    detail: 'اختيار الخدمة لا يغني عن فحص الطبيب وتحديد الإجراء.',
    tone: 'default',
    icon: { ios: 'checkmark.shield', android: 'rule', web: 'rule' },
  },
  {
    title: 'شو ممكن يغيّر الخطة؟',
    detail: 'نتائج الفحص والتصوير عند الحاجة قد تغيّر الخطة والسعر.',
    tone: 'warning',
    icon: { ios: 'creditcard', android: 'add_card', web: 'add_card' },
  },
  {
    title: 'ملفات مفيدة إن وجدت',
    detail: 'أي صور أو تقارير سابقة قد تساعد الطبيب على فهم الحالة.',
    tone: 'info',
    icon: { ios: 'photo', android: 'image', web: 'image' },
  },
  {
    title: 'بعد الموعد',
    detail: 'يشرح الطبيب تعليمات المتابعة بحسب الإجراء الذي تم اختياره.',
    tone: 'default',
    icon: { ios: 'calendar.badge.clock', android: 'event_repeat', web: 'event_repeat' },
  },
];

const noteToneClasses: Record<NoteTone, string> = {
  success: 'border-tone-success-border/40 bg-tone-success-fill',
  default: 'border-border-subtle bg-surface-default',
  warning: 'border-tone-warning-border/40 bg-tone-warning-fill',
  info: 'border-tone-info-border/40 bg-tone-info-fill',
};

const serviceSteps: { number: string; label: string; icon: AppIconName }[] = [
  {
    number: '1',
    label: 'فهم الحالة',
    icon: { ios: 'magnifyingglass', android: 'search', web: 'search' },
  },
  {
    number: '2',
    label: 'مناقشة الخيارات',
    icon: { ios: 'bubble.left.and.bubble.right', android: 'forum', web: 'forum' },
  },
  {
    number: '3',
    label: 'متابعة مناسبة',
    icon: { ios: 'calendar', android: 'event_available', web: 'event_available' },
  },
];

function ServiceNoteCard({ note }: { note: ServiceNote }) {
  const { rowClassName } = useAppDirection();
  return (
    <View
      className={cn(
        'min-h-[51px] items-start gap-2 rounded-[12px] border px-3 py-[7px]',
        rowClassName,
        noteToneClasses[note.tone],
      )}
    >
      <AppIcon
        name={note.icon}
        size={18}
        tone={note.tone === 'warning' ? 'warning' : note.tone === 'info' ? 'info' : 'action'}
      />
      <View className="min-w-0 flex-1">
        <AppText align="right" className="font-ui-semibold text-content-primary" variant="label">
          {note.title}
        </AppText>
        <AppText align="right" className="text-content-secondary" variant="caption">
          {note.detail}
        </AppText>
      </View>
    </View>
  );
}

export function ServiceDetailScreen() {
  const router = useRouter();
  const { rowClassName } = useAppDirection();
  const { serviceCode = 'root-canal' } = useLocalSearchParams<{ serviceCode?: string }>();
  const family = findPenFamily(serviceCode);
  const group = family ? findPenGroup(family.groupCode) : undefined;

  if (!family) {
    return (
      <Screen>
        <StateView
          title="الخدمة غير موجودة"
          actionLabel="العودة للخدمات"
          onAction={() => router.replace('/discover')}
        />
      </Screen>
    );
  }

  const isRootCanal = serviceCode === 'root-canal';
  const serviceTitle = isRootCanal ? 'العلاج الأولي لقنوات الجذر' : family.title;
  const bannerTitle = isRootCanal ? 'علاج الجذور وحماية السن' : family.title;
  const bannerDescription = isRootCanal
    ? 'يساعد على الحفاظ على السن عندما تحتاج الأنسجة الداخلية تقييماً وعناية متخصصة.'
    : family.description;
  const notes = isRootCanal ? rootCanalNotes : generalNotes;

  // General services use the concise Pen service card; the root-canal example
  // has its own deeper, service-specific preparation and pricing explanation.
  if (!isRootCanal) {
    const why = family.id === 'implant-prosthetics'
      ? 'إذا عندك زرعة جاهزة للتركيب، أو عم تستكشف تعويض أسنان مفقودة. الطبيب يفحص ثبات الزرعات واللثة والإطباق قبل اقتراح الخطة.'
      : `إذا عم تبحث عن ${family.title} أو عم تستكشف الخيارات المناسبة لحالتك. الطبيب يفحص حالتك ويشرح الخطة قبل أي إجراء.`;

    return (
      <Screen contentClassName="px-0 py-0">
        <DiscoveryHeader showFavoriteAction title="تفاصيل الخدمة" />
        <ScrollView
          contentContainerClassName="mx-auto w-full max-w-[430px] px-4 pb-10 pt-3"
          showsVerticalScrollIndicator={false}
        >
          <View className="min-h-[230px] rounded-[20px] border border-border-subtle bg-surface-default px-4 pb-4 pt-4">
            <View className="h-[76px] w-[76px] self-end items-center justify-center rounded-[19px] bg-action-subtle">
              <ServiceIcon serviceId={family.id} size={49} />
            </View>
            <AppText
              align="right"
              className="mt-3 font-ui-semibold text-content-link"
              style={{ fontSize: 11, lineHeight: 18 }}
              variant="caption"
            >
              {group?.title ?? 'الخدمات'} · {family.groupCode}
            </AppText>
            <AppText
              align="right"
              className="mt-2 font-ui-bold"
              style={{ fontSize: 21, lineHeight: 31 }}
              variant="heading-3"
            >
              {family.title}
            </AppText>
            <AppText
              align="right"
              className="mt-1.5 text-content-secondary"
              style={{ fontSize: 12, lineHeight: 20 }}
              variant="caption"
            >
              {bannerDescription}
            </AppText>
          </View>

          <AppText
            align="right"
            className="mt-4 font-ui-bold"
            style={{ fontSize: 14, lineHeight: 23 }}
            variant="label"
          >
            ليش ممكن تبحث عنها؟
          </AppText>
          <AppText
            align="right"
            className="mt-1.5 text-content-secondary"
            style={{ fontSize: 11.5, lineHeight: 20 }}
            variant="caption"
          >
            {why}
          </AppText>
          <View className="mt-3 flex-row-reverse items-center gap-2 rounded-[13px] bg-tone-info-fill px-3 py-3">
            <AppIcon
              name={{ ios: 'stethoscope', android: 'medical_services', web: 'medical_services' }}
              size={19}
              tone="info"
            />
            <AppText
              align="right"
              className="min-w-0 flex-1 text-tone-info-text"
              style={{ fontSize: 11, lineHeight: 18 }}
              variant="caption"
            >
              هذه عائلة خدمة للتوجيه، ونوع العلاج والمواد والتفاصيل المهنية يحددها الطبيب لاحقاً ضمن خطة العلاج بعد الفحص.
            </AppText>
          </View>
          <Button
            className="mt-4 h-[50px]"
            label="ابحث عن طبيب مؤهّل"
            onPress={() => router.push({
              pathname: '/discover/providers/results',
              params: { serviceCode: family.id },
            })}
            size="sm"
          />
          <Button
            className="mt-2 h-[49px]"
            label="مو متأكد؟ خلينا نحدد حالتك"
            onPress={() => router.push('/assessment/start')}
            size="sm"
            variant="outline"
          />
        </ScrollView>
      </Screen>
    );
  }

  return (
    <Screen contentClassName="px-0 py-0">
      <DiscoveryHeader showFavoriteAction title="تفاصيل الخدمة" />
      <ScrollView
        contentContainerClassName="mx-auto w-full max-w-[430px] px-4 pb-8 pt-3"
        showsVerticalScrollIndicator={false}
      >
        <View className={cn('items-center justify-between gap-2', rowClassName)}>
          <AppText
            align="right"
            className="min-w-0 flex-1 font-ui-semibold text-content-primary"
            numberOfLines={2}
            variant="label"
          >
            {serviceTitle}
          </AppText>
          <View className="rounded-[9px] bg-action-subtle px-2.5 py-1.5">
            <AppText className="text-content-link" variant="badge">
              {family.groupCode} · {group?.title ?? 'الخدمات'}
            </AppText>
          </View>
        </View>

        <View className="mt-2 rounded-[17px] border border-action-primary/25 bg-action-subtle p-3">
          <View className={cn('items-center gap-3', rowClassName)}>
            <View className="h-[60px] w-[60px] shrink-0 items-center justify-center rounded-full bg-surface-default">
              <ServiceIcon serviceId={family.id} size={43} />
            </View>
            <View className="min-w-0 flex-1 items-end">
              <AppText align="right" className="font-ui-bold text-content-primary" variant="heading-4">
                {bannerTitle}
              </AppText>
              <AppText align="right" className="mt-0.5 text-content-secondary" variant="caption">
                {bannerDescription}
              </AppText>
            </View>
          </View>
          <View className={cn('mt-3 gap-1.5', rowClassName)}>
            {[...serviceSteps].reverse().map((step) => (
              <View
                className="min-w-0 flex-1 items-center rounded-[10px] bg-surface-default px-1.5 py-2"
                key={step.number}
              >
                <AppIcon name={step.icon} size={17} tone="action" />
                <AppText align="center" className="mt-0.5 font-ui-semibold text-content-link" variant="caption">
                  {step.number}
                </AppText>
                <AppText
                  align="center"
                  className="text-content-secondary"
                  numberOfLines={2}
                  style={{ fontSize: 10, lineHeight: 15 }}
                  variant="caption"
                >
                  {step.label}
                </AppText>
              </View>
            ))}
          </View>
        </View>

        <View className={cn('mt-3 flex-wrap items-center justify-between gap-1', rowClassName)}>
          <AppText className="font-ui-semibold text-content-primary" variant="caption">
            طرق عرض السعر
          </AppText>
          <AppText className="font-ui-semibold text-content-link" variant="caption">
            السعر النهائي والتفاصيل تُراجع مع الطبيب
          </AppText>
        </View>
        <View className={cn('mt-2 gap-1', rowClassName)}>
          {[
            ['بعد الخطة', 'bg-tone-warning-fill'],
            ['نطاق', 'bg-action-subtle'],
            ['يبدأ من', 'bg-surface-subtle'],
            ['ثابت', 'bg-surface-subtle'],
            ['مجاني', 'bg-tone-success-fill'],
          ].map(([label, tone]) => (
            <View className={cn('min-w-0 flex-1 items-center justify-center rounded-[8px] px-1 py-2', tone)} key={label}>
              <AppText align="center" className="text-content-secondary" numberOfLines={1} variant="badge">
                {label}
              </AppText>
            </View>
          ))}
        </View>

        <View className="mt-2 gap-[6px]">
          {notes.map((note) => <ServiceNoteCard key={note.title} note={note} />)}
        </View>

        <View className={cn('mt-2 items-center gap-2 rounded-[10px] bg-tone-danger-fill px-3 py-2', rowClassName)}>
          <AppIcon name={{ ios: 'stethoscope', android: 'medical_services', web: 'medical_services' }} size={17} tone="danger" />
          <AppText align="right" className="min-w-0 flex-1 text-tone-danger-text" variant="caption">
            الخدمة المعروضة للتوجيه؛ التشخيص والخطة النهائية يقرّرهما الطبيب.
          </AppText>
        </View>

        <View className="mt-2 gap-2">
          <Button
            label="ابحث عن طبيب مؤهّل"
            onPress={() => router.push({
              pathname: '/discover/providers/results',
              params: { serviceCode },
            })}
            size="sm"
          />
          <Button
            label="مو متأكد؟ خلينا نحدد حالتك"
            onPress={() => router.push('/assessment/start')}
            size="sm"
            variant="outline"
          />
        </View>
      </ScrollView>
    </Screen>
  );
}
