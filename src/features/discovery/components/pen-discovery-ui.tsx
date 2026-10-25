import { useRouter } from 'expo-router';
import { useState, type PropsWithChildren } from 'react';
import { Pressable, Share, View } from 'react-native';

import { useAppDirection } from '@/shared/utils/app-direction';
import { AppIcon, AppText } from '@/shared/components/ui';
import { cn } from '@/shared/utils/cn';
import { AuthBackButton } from '@/shared/components/navigation/auth-back-button';

export function DiscoveryHeader({
  title,
  subtitle,
  showBack = true,
  showSearchAction = false,
  showShareAction = false,
  showFavoriteAction = false,
  showFilterAction = false,
  onFilterPress,
  onBackPress,
  shareMessage,
}: {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  showSearchAction?: boolean;
  showShareAction?: boolean;
  showFavoriteAction?: boolean;
  showFilterAction?: boolean;
  onFilterPress?: () => void;
  onBackPress?: () => void;
  shareMessage?: string;
}) {
  const router = useRouter();
  const { rowClassName } = useAppDirection();
  // A presentation-only toggle while there is no favorites persistence contract.
  const [favorite, setFavorite] = useState(false);

  return (
    <View
      className={cn(
        'mx-auto h-16 w-full max-w-[430px] items-center justify-between px-4',
        (showShareAction || showFavoriteAction || showFilterAction) &&
          'border-b border-border-subtle bg-surface-default',
        rowClassName,
      )}
    >
      <AuthBackButton
        onPress={() => {
          if (!showBack) return router.replace('/(tabs)/home');
          if (onBackPress) return onBackPress();
          if (router.canGoBack()) return router.back();
          return router.replace('/discover');
        }}
      />

      <View className="min-w-0 flex-1 items-center px-2">
        <AppText
          align="center"
          className="w-full font-ui-bold"
          numberOfLines={1}
          variant="heading-3"
        >
          {title}
        </AppText>
        {subtitle ? (
          <AppText align="center" className="text-content-secondary" variant="caption">
            {subtitle}
          </AppText>
        ) : null}
      </View>

      {showShareAction ? (
        <Pressable
          accessibilityLabel="مشاركة ملف الطبيب"
          accessibilityRole="button"
          className="h-11 w-11 items-center justify-center rounded-full bg-action-subtle"
          onPress={() => {
            void Share.share({ message: shareMessage ?? title });
          }}
        >
          <AppIcon
            name={{ ios: 'square.and.arrow.up', android: 'share', web: 'share' }}
            size={19}
            tone="action"
          />
        </Pressable>
      ) : showFavoriteAction ? (
        <Pressable
          accessibilityLabel={
            favorite ? 'إلغاء تحديد الخدمة كمفضلة مؤقتاً' : 'تحديد الخدمة كمفضلة مؤقتاً'
          }
          accessibilityRole="button"
          accessibilityState={{ selected: favorite }}
          className="h-11 w-11 items-center justify-center rounded-full bg-action-subtle"
          onPress={() => setFavorite((current) => !current)}
        >
          <AppIcon
            name={
              favorite
                ? { ios: 'heart.fill', android: 'favorite', web: 'favorite' }
                : { ios: 'heart', android: 'favorite_border', web: 'favorite_border' }
            }
            size={21}
            tone="action"
          />
        </Pressable>
      ) : showFilterAction ? (
        <Pressable
          accessibilityLabel="تصفية النتائج"
          accessibilityRole="button"
          className="h-11 w-11 items-center justify-center rounded-full bg-action-subtle"
          onPress={onFilterPress}
        >
          <AppIcon
            name={{ ios: 'slider.horizontal.3', android: 'tune', web: 'tune' }}
            size={21}
            tone="action"
          />
        </Pressable>
      ) : showSearchAction ? (
        <Pressable
          accessibilityLabel="البحث في الخدمات"
          accessibilityRole="button"
          className="h-11 w-11 items-center justify-center rounded-full bg-action-subtle"
          onPress={() => router.push('/discover/search')}
        >
          <AppIcon
            name={{ ios: 'magnifyingglass', android: 'search', web: 'search' }}
            size={21}
            tone="action"
          />
        </Pressable>
      ) : (
        <View className="h-11 w-11" />
      )}
    </View>
  );
}

export { FamilyCard } from './service-family-card';

export function FactCard({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <View
      className={cn(
        'min-h-[58px] items-end justify-center rounded-[11px] bg-surface-default px-3 py-2',
        className,
      )}
    >
      <AppText className="text-type-caption text-content-secondary" variant="caption">
        {label}
      </AppText>
      <AppText className="mt-0.5 text-type-label" variant="label">
        {value}
      </AppText>
    </View>
  );
}

export function SectionCard({
  title,
  body,
  tone = 'default',
}: {
  title: string;
  body: string;
  tone?: 'default' | 'success' | 'warning' | 'info' | 'danger';
}) {
  const toneClass = {
    default: 'bg-surface-default',
    success: 'bg-tone-success-fill',
    warning: 'bg-tone-warning-fill',
    info: 'bg-tone-info-fill',
    danger: 'bg-tone-danger-fill',
  }[tone];

  return (
    <View className={cn('rounded-[11px] px-3 py-2.5', toneClass)}>
      <AppText className="font-ui-bold text-type-label" variant="label">
        {title}
      </AppText>
      <AppText className="mt-1 text-type-caption  text-content-secondary" variant="caption">
        {body}
      </AppText>
    </View>
  );
}

export function ScreenCard({ children, className }: PropsWithChildren<{ className?: string }>) {
  // Do not emit two competing radius utilities: NativeWind stylesheet order
  // should never decide whether a screen-specific radius overrides the token.
  const hasRadius = className
    ?.split(/\s+/)
    .some((token) => /^rounded-(?!t-|r-|b-|l-|tl-|tr-|bl-|br-)/.test(token));
  return (
    <View
      className={cn(
        !hasRadius && 'rounded-surface',
        'border border-border-subtle bg-surface-default',
        className,
      )}
    >
      {children}
    </View>
  );
}
