import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';

import { DiscoveryHeader, ScreenCard } from '@/features/discovery/components/pen-discovery-ui';
import { getMockProvider } from '@/features/discovery/mocks/providers.mock';
import { penReviews } from '@/features/discovery/presentation/pen-discovery-data';
import { useAppDirection } from '@/providers/app-direction-provider';
import { AppIcon, AppText, Button, Screen, StateView } from '@/shared/components/ui';
import { useAppTheme } from '@/shared/theme/use-app-theme';
import { cn } from '@/shared/utils/cn';

type ReviewTab = 'الأحدث' | 'مع تعليق' | 'الخدمة نفسها';
type MinRating = 0 | 4 | 5;

function ScoreStars({ rating, size = 12 }: { rating: number; size?: number }) {
  const { colors } = useAppTheme();
  return (
    <View accessible accessibilityLabel={`${rating.toFixed(1)} من 5 نجوم`} className="flex-row items-center justify-center gap-[2px]">
      {[1, 2, 3, 4, 5].map((star) => (
        <AppIcon
          color={star <= Math.round(rating) ? colors.text.primary : colors.border.default}
          key={star}
          name={{ ios: 'star.fill', android: 'star', web: 'star' }}
          size={size}
        />
      ))}
    </View>
  );
}

function Progress({ label, value, compact = false }: { label: string; value: number; compact?: boolean }) {
  const { rowClassName } = useAppDirection();
  return (
    <View className="min-w-0 flex-1 gap-1">
      <View className={cn('items-center justify-between gap-1', rowClassName)}>
        <AppText className="text-content-secondary" style={{ fontSize: compact ? 9 : 10, lineHeight: 15 }} variant="caption">{label}</AppText>
        {!compact ? (
          <AppText direction="ltr" className="text-content-secondary" style={{ fontSize: 10, lineHeight: 15 }} variant="caption">{value}%</AppText>
        ) : null}
      </View>
      <View className="h-[4px] overflow-hidden rounded-full bg-border-subtle">
        <View className="h-full rounded-full bg-action-primary" style={{ width: `${value}%` }} />
      </View>
    </View>
  );
}

export function ProviderReviewsScreen() {
  const router = useRouter();
  const { rowClassName } = useAppDirection();
  const { colors } = useAppTheme();
  const { providerId, serviceCode } = useLocalSearchParams<{ providerId?: string; serviceCode?: string }>();
  const [filter, setFilter] = useState<ReviewTab>('الأحدث');
  const [minRating, setMinRating] = useState<MinRating>(0);
  const [showRatingOptions, setShowRatingOptions] = useState(false);

  const provider = getMockProvider(providerId);
  const providerReviews = useMemo(
    () => penReviews.filter((review) => review.providerId === providerId),
    [providerId],
  );
  const metrics = useMemo(() => {
    if (!providerReviews.length) return null;
    const average = (key: 'explanation' | 'punctuality' | 'communication') =>
      Math.round(providerReviews.reduce((sum, review) => sum + review[key], 0) / providerReviews.length);
    return {
      explanation: average('explanation'),
      punctuality: average('punctuality'),
      communication: average('communication'),
    };
  }, [providerReviews]);
  const visibleReviews = useMemo(
    () => providerReviews
      .filter((review) => {
        if (filter === 'مع تعليق' && !review.body.trim()) return false;
        if (filter === 'الخدمة نفسها' && serviceCode && review.serviceCode !== serviceCode) return false;
        return review.rating >= minRating;
      })
      .sort((a, b) => b.dateKey.localeCompare(a.dateKey)),
    [filter, minRating, providerReviews, serviceCode],
  );

  if (!provider || (serviceCode && !provider.serviceCodes.includes(serviceCode))) {
    return (
      <Screen>
        <StateView
          title="التقييمات غير متاحة"
          actionLabel="العودة للأطباء"
          onAction={() => router.replace('/discover/providers/results')}
        />
      </Screen>
    );
  }

  return (
    <Screen contentClassName="px-0 py-0">
      <DiscoveryHeader
        title="التقييمات"
        showFilterAction
        onFilterPress={() => setShowRatingOptions((previous) => !previous)}
        onBackPress={() => router.canGoBack()
          ? router.back()
          : router.replace({
              pathname: '/discover/provider/[providerId]',
              params: { providerId: provider.id, serviceCode: serviceCode ?? 'root-canal' },
            })}
      />

      <ScrollView
        contentContainerClassName="mx-auto w-full max-w-[430px] px-3 pb-[32px] pt-2"
        showsVerticalScrollIndicator={false}
      >
        <ScreenCard className="rounded-[15px] p-[11px]">
          <View className={cn('items-center gap-3', rowClassName)}>
            <View className="w-[89px] items-center justify-center gap-[3px]">
              <AppText direction="ltr" className="font-ui-bold text-content-primary" style={{ fontSize: 29, lineHeight: 34 }} variant="heading-2">
                {provider.rating.toFixed(1)}
              </AppText>
              <ScoreStars rating={provider.rating} size={12} />
              <AppText align="center" className="text-content-secondary" style={{ fontSize: 10, lineHeight: 15 }} variant="caption">
                {provider.reviews} تقييماً مفصلاً
              </AppText>
            </View>
            <View className="min-w-0 flex-1 gap-[5px]">
              {metrics ? (
                <>
                  <Progress label="وضوح الشرح" value={metrics.explanation} />
                  <Progress label="الالتزام بالموعد" value={metrics.punctuality} />
                  <Progress label="التواصل" value={metrics.communication} />
                </>
              ) : (
                <AppText align="center" className="text-content-secondary" variant="caption">
                  محاور التقييم التفصيلية غير متاحة حالياً.
                </AppText>
              )}
            </View>
          </View>
        </ScreenCard>

        <View className={cn('mt-2 items-center gap-[6px]', rowClassName)}>
          {(['الخدمة نفسها', 'مع تعليق', 'الأحدث'] as const).map((item) => (
            <Pressable
              accessibilityRole="tab"
              accessibilityState={{ selected: filter === item }}
              className={cn(
                'min-h-[36px] min-w-0 flex-1 items-center justify-center rounded-[10px] border px-1',
                filter === item ? 'border-action-primary bg-action-subtle' : 'border-border-subtle bg-surface-default',
              )}
              key={item}
              onPress={() => setFilter(item)}
            >
              <AppText
                align="center"
                className={filter === item ? 'font-ui-bold text-content-link' : 'text-content-secondary'}
                numberOfLines={1}
                variant="caption"
              >
                {item}
              </AppText>
            </Pressable>
          ))}
        </View>

        {showRatingOptions ? (
          <View className={cn('mt-2 items-center gap-2', rowClassName)}>
            {([[0, 'كل التقييمات'], [4, '4 نجوم فأعلى'], [5, '5 نجوم']] as const).map(([value, label]) => (
              <Pressable
                accessibilityRole="button"
                accessibilityState={{ selected: minRating === value }}
                className={cn(
                  'min-h-[36px] min-w-0 flex-1 items-center justify-center rounded-[10px] border px-1',
                  minRating === value ? 'border-action-primary bg-action-subtle' : 'border-border-subtle bg-surface-default',
                )}
                key={value}
                onPress={() => setMinRating(value)}
              >
                <AppText
                  align="center"
                  className={minRating === value ? 'font-ui-semibold text-content-link' : 'text-content-secondary'}
                  numberOfLines={1}
                  variant="caption"
                >
                  {label}
                </AppText>
              </Pressable>
            ))}
          </View>
        ) : null}

        <View className="mt-2 gap-2">
          {visibleReviews.length ? visibleReviews.map((review) => (
            <ScreenCard className="rounded-[15px] p-[11px]" key={`${review.providerId}:${review.dateKey}:${review.name}`}>
              <View className={cn('items-center gap-2', rowClassName)}>
                <View className="h-[37px] w-[37px] shrink-0 items-center justify-center rounded-full bg-action-subtle">
                  <AppText align="center" className="font-ui-semibold text-content-link" variant="label">
                    {review.initials}
                  </AppText>
                </View>
                <View className="min-w-0 flex-1">
                  <View className={cn('items-center justify-between gap-2', rowClassName)}>
                    <AppText className="font-ui-bold text-content-primary" variant="label">{review.name}</AppText>
                    <View className="flex-row items-center gap-1">
                      <AppText direction="ltr" className="font-ui-semibold text-content-primary" style={{ fontSize: 11, lineHeight: 17 }} variant="caption">
                        {review.rating.toFixed(1)}
                      </AppText>
                      <AppIcon name={{ ios: 'star.fill', android: 'star', web: 'star' }} size={11} color={colors.text.primary} />
                    </View>
                  </View>
                  <AppText align="right" className="mt-0.5 text-content-secondary" variant="caption">
                    {review.meta}
                  </AppText>
                </View>
              </View>
              <AppText align="right" className="mt-[7px] text-content-primary" variant="caption">
                {review.body}
              </AppText>
              <View className={cn('mt-[7px] gap-[7px]', rowClassName)}>
                <Progress compact label="الشرح" value={review.explanation} />
                <Progress compact label="الالتزام" value={review.punctuality} />
                <Progress compact label="التواصل" value={review.communication} />
              </View>
              <View className="mt-[7px] flex-row items-center gap-1 self-start">
                <AppIcon name={{ ios: 'checkmark.seal.fill', android: 'verified', web: 'verified' }} size={13} tone="success" />
                <AppText className="text-tone-success-text" variant="caption">زيارة موثقة (نموذج)</AppText>
              </View>
            </ScreenCard>
          )) : (
            <ScreenCard className="items-center gap-3 p-5">
              <AppText align="center" className="font-ui-semibold text-content-primary" variant="label">
                ما في تقييمات تفصيلية مطابقة حالياً
              </AppText>
              <AppText align="center" className="text-content-secondary" variant="caption">
                جرّب تغيير الفلتر لعرض التقييمات المتاحة.
              </AppText>
              <Button
                label="عرض كل التقييمات"
                onPress={() => { setFilter('الأحدث'); setMinRating(0); }}
                size="sm"
                variant="outline"
              />
            </ScreenCard>
          )}
        </View>

        <View className={cn('mt-2 items-center gap-2 rounded-[12px] bg-tone-info-fill p-[10px]', rowClassName)}>
          <AppIcon name={{ ios: 'info.circle', android: 'info_outline', web: 'info_outline' }} size={16} tone="info" />
          <AppText className="min-w-0 flex-1 text-tone-info-text" variant="caption">
            المعلومات المعروضة للتوضيح فقط، والتقييمات الفعلية تظهر بعد التحقق من الزيارات.
          </AppText>
        </View>
      </ScrollView>
    </Screen>
  );
}
