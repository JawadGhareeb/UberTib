import { useState } from 'react';
import { BottomSheet, Card as HeroCard, PressableFeedback, Separator } from 'heroui-native';
import { View } from 'react-native';

import {
  getDoctorClassification,
  protectionMaximums,
  type DoctorClassificationView,
} from '@/features/discovery/model/doctor-classification';
import { findPenFamily } from '@/features/discovery/presentation/pen-discovery-data';
import type { MockProvider } from '@/features/discovery/mocks/providers.mock';
import { AppIcon, AppText } from '@/shared/components/ui';
import type { AppIconName } from '@/shared/components/ui/app-icon';

type DetailKind = 'science' | 'reviews' | 'prices' | 'protection';

const icons: Record<DetailKind, AppIconName> = {
  science: { ios: 'seal', android: 'workspace_premium', web: 'workspace_premium' },
  reviews: { ios: 'star.fill', android: 'star', web: 'star' },
  prices: { ios: 'creditcard', android: 'payments', web: 'payments' },
  protection: { ios: 'checkmark.shield', android: 'verified_user', web: 'verified_user' },
};

const scientificExplanations: Record<DoctorClassificationView['scientific'], string> = {
  A: 'يشير إلى مستوى علمي مرجعي ضمن هذا المجال عند توفر الأدلة اللازمة ومرور المراجعة.',
  B: 'يشير إلى مستوى أداء علمي متقدم في المجال المحدد.',
  C: 'يشير إلى مستوى أداء معياري في المجال المحدد.',
  D: 'يشير إلى نطاق أداء محافظ يحتاج متابعة وتطويراً.',
  pending:
    'لم تكتمل الأدلة والمراجعات اللازمة لإظهار مستوى علمي. قيد التقييم ليس حكماً سلبياً على الطبيب.',
};

function detailContent(kind: DetailKind, facts: DoctorClassificationView) {
  switch (kind) {
    case 'science':
      return {
        title: 'المستوى العلمي والسريري',
        value: facts.scientificLabel,
        body: scientificExplanations[facts.scientific],
        note: 'يتعلق هذا المستوى بالخدمة والفرع المختارين، وليس تقييماً عاماً للطبيب. لا يضمن نجاح العلاج.',
      };
    case 'reviews':
      return {
        title: 'تجارب المرضى',
        value: facts.rating === null ? 'لا توجد تقييمات' : `${facts.rating.toFixed(1)} من 5`,
        body: facts.reviews
          ? `معروض ضمن بيانات التجربة: ${facts.reviews} تقييماً. تقييم التجربة مختلف عن التقييم العلمي.`
          : 'لا توجد مراجعات كافية لعرض متوسط تجربة المرضى.',
        note: 'التقييمات الظاهرة تجريبية، ولا تعني اعتماداً علمياً للطبيب.',
      };
    case 'prices':
      return {
        title: 'الأسعار',
        value: facts.priceLabel,
        body: facts.pricing
          ? `الفئة السعرية: ${facts.pricingLabel}. السعر الفعلي يعتمد على الخدمة والخطة إن لزمت، وتظهر التفاصيل قبل طلب الحجز.`
          : 'تُحدد تكلفة الخدمة بعد الفحص أو المراجعة. الفئة السعرية غير محددة بهذه المعاينة.',
        note: 'الفئة السعرية مستقلة عن المستوى العلمي. الأسعار التجريبية لا تُعد عرضاً نهائياً.',
      };
    case 'protection':
      return {
        title: 'حماية المريض',
        value: facts.protectionLabel,
        body: facts.protection
          ? `الحد النظري الأعلى للحماية في هذا المستوى قد يصل إلى ${protectionMaximums[facts.protection]} من الخسارة المؤهلة، بعد التحقق وتطبيق الشروط.`
          : 'الحماية الممولة غير مفعّلة لهذه الخدمة في بيانات التجربة.',
        note: 'الحماية ليست تأميناً أو ضماناً لنجاح العلاج، ولا تعويضاً تلقائياً. تُراجع الشروط المعتمدة قبل الحجز.',
      };
  }
}

function ClassificationTile({
  kind,
  facts,
  onPress,
}: {
  kind: DetailKind;
  facts: DoctorClassificationView;
  onPress: () => void;
}) {
  const title =
    kind === 'science'
      ? 'الأداء السريري'
      : kind === 'reviews'
        ? 'تجارب المرضى'
        : kind === 'prices'
          ? 'أسعار الخدمات'
          : 'حماية المريض';
  const value =
    kind === 'science'
      ? facts.scientificLabel
      : kind === 'reviews'
        ? facts.rating === null
          ? 'لا توجد تقييمات'
          : `${facts.rating.toFixed(1)} من 5`
        : kind === 'prices'
          ? facts.priceLabel
          : facts.protectionLabel;

  return (
    <PressableFeedback
      accessibilityRole="button"
      accessibilityLabel={`تفاصيل ${title}: ${value}`}
      accessibilityHint="يفتح شرحاً مختصراً من أسفل الشاشة"
      onPress={onPress}
      className="w-[48.5%] rounded-[14px]"
      testID={`doctor-classification-${kind}`}
    >
      <HeroCard
        variant="default"
        className="min-h-[122px] gap-2 rounded-[14px] border border-border-subtle bg-surface-default px-3 py-3"
      >
        <View className="flex-row-reverse items-center justify-between">
          <View className="h-9 w-9 items-center justify-center rounded-[11px] bg-action-subtle">
            <AppIcon name={icons[kind]} size={19} tone="action" />
          </View>
          <AppIcon
            name={{ ios: 'chevron.left', android: 'chevron_left', web: 'chevron_left' }}
            size={15}
            tone="secondary"
          />
        </View>
        <AppText align="right" variant="caption" className="text-content-secondary">
          {title}
        </AppText>
        <AppText
          align="right"
          variant="label"
          className="font-ui-bold text-content-primary"
          numberOfLines={2}
        >
          {value}
        </AppText>
      </HeroCard>
    </PressableFeedback>
  );
}

export function DoctorClassificationDetails({
  provider,
  serviceCode,
}: {
  provider: MockProvider;
  serviceCode: string;
}) {
  const [openDetail, setOpenDetail] = useState<DetailKind | null>(null);
  const facts = getDoctorClassification(provider, serviceCode);
  const info = openDetail ? detailContent(openDetail, facts) : null;
  const serviceTitle = findPenFamily(serviceCode)?.title ?? 'الخدمة المختارة';

  return (
    <View className="gap-3">
      <View className="gap-1">
        <AppText align="right" variant="heading-4" className="font-ui-bold">
          مستوى الطبيب ومعلومات الخدمة
        </AppText>
        <AppText align="right" variant="caption" className="text-content-secondary">
          {serviceTitle} · {provider.branch}
        </AppText>
      </View>

      <View className="flex-row-reverse flex-wrap justify-between gap-y-2.5">
        {(['science', 'reviews', 'prices', 'protection'] as const).map((kind) => (
          <ClassificationTile
            key={kind}
            kind={kind}
            facts={facts}
            onPress={() => setOpenDetail(kind)}
          />
        ))}
      </View>
      <View className="flex-row-reverse items-start gap-1.5">
        <AppIcon
          name={{ ios: 'info.circle', android: 'info', web: 'info' }}
          size={14}
          tone="secondary"
        />
        <AppText align="right" variant="caption" className="min-w-0 flex-1 text-content-secondary">
          التصنيفات المعروضة أمثلة تجريبية لشرح التصميم، وليست تقييماً أو حماية معتمدة.
        </AppText>
      </View>

      <BottomSheet
        isOpen={openDetail !== null}
        onOpenChange={(open) => {
          if (!open) setOpenDetail(null);
        }}
      >
        <BottomSheet.Portal>
          <BottomSheet.Overlay />
          <BottomSheet.Content contentContainerClassName="gap-3 bg-surface-default px-4 pb-7 pt-3">
            <View className="flex-row-reverse items-center justify-between gap-2">
              <View className="min-w-0 flex-1 flex-row-reverse items-center gap-2">
                {openDetail ? <AppIcon name={icons[openDetail]} tone="action" size={21} /> : null}
                <BottomSheet.Title className="font-ui-bold text-content-primary">
                  {info?.title ?? 'تفاصيل التصنيف'}
                </BottomSheet.Title>
              </View>
              <BottomSheet.Close />
            </View>
            <View className="gap-2 rounded-[13px] bg-action-subtle p-3.5">
              <AppText align="right" variant="heading-4" className="font-ui-bold text-content-link">
                {info?.value ?? ''}
              </AppText>
              <AppText align="right" variant="caption" className="text-content-secondary">
                {serviceTitle} · {facts.branch}
              </AppText>
            </View>
            <BottomSheet.Description className="text-right text-type-label leading-6 text-content-primary">
              {info?.body ?? ''}
            </BottomSheet.Description>
            <Separator className="bg-border-subtle" />
            <AppText align="right" variant="caption" className="text-content-secondary">
              {info?.note ?? ''}
            </AppText>
            <View className="flex-row-reverse items-center gap-2 rounded-[11px] bg-surface-subtle p-3">
              <AppIcon
                name={{ ios: 'info.circle', android: 'info', web: 'info' }}
                size={16}
                tone="secondary"
              />
              <AppText
                align="right"
                variant="caption"
                className="min-w-0 flex-1 text-content-secondary"
              >
                محتوى تجريبي غير معتمد — لا يُستخدم لاتخاذ قرار طبي أو مالي نهائي.
              </AppText>
            </View>
          </BottomSheet.Content>
        </BottomSheet.Portal>
      </BottomSheet>
    </View>
  );
}
