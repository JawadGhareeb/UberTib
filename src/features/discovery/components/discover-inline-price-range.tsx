import { LayoutDirectionScope, Slider } from 'heroui-native';
import { Pressable, View } from 'react-native';

import { AppText } from '@/shared/components/ui';
import type { PriceRange } from '../model/discover-filters';

export function DiscoverInlinePriceRange({
  limits,
  value,
  onChange,
  usingCatalogLimits = false,
}: {
  limits: PriceRange | null;
  value: PriceRange | null;
  onChange: (range: PriceRange | null) => void;
  usingCatalogLimits?: boolean;
}) {
  if (!limits) return null;

  return (
    <View className="gap-3 pt-1">
      <View className="flex-row-reverse items-center justify-between gap-2">
        <AppText align="right" variant="body-strong">
          نطاق السعر
        </AppText>
        {value ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="إلغاء فلتر السعر"
            onPress={() => onChange(null)}
            className="min-h-[36px] justify-center px-2"
          >
            <AppText variant="caption" className="text-content-link">
              إلغاء التحديد
            </AppText>
          </Pressable>
        ) : null}
      </View>
      <View className="flex-row-reverse items-center justify-between gap-2">
        <AppText variant="label" className="font-ui-medium">
          {(value?.[1] ?? limits[1]).toLocaleString('en-US')} ل.س
        </AppText>
        <AppText variant="label" className="font-ui-medium">
          {(value?.[0] ?? limits[0]).toLocaleString('en-US')} ل.س
        </AppText>
      </View>

      {/*
        App's native Yoga direction is physically LTR although HeroUI config
        is RTL for Arabic. Slider reads HeroUI's RTL JS context for gesture
        inversion, so its tap/pan direction disagrees with the actual track.
        Scope only the slider to LTR (both Yoga and JS), leaving Arabic text
        and the rest of the bottom sheet RTL.
      */}
      <LayoutDirectionScope isRTL={false}>
        <View style={{ direction: 'ltr', width: '100%' }}>
          <Slider
            aria-label="تحديد الحد الأدنى والأعلى للسعر"
            value={value ?? limits}
            minValue={limits[0]}
            maxValue={limits[1]}
            step={50}
            style={{ direction: 'ltr', minHeight: 44, justifyContent: 'center' }}
            onChange={(next) => {
              if (Array.isArray(next) && next.length === 2) {
                onChange([next[0] ?? limits[0], next[1] ?? limits[1]]);
              }
            }}
          >
            <Slider.Track className="h-5" style={{ direction: 'ltr' }} hitSlop={16}>
              {({ state }) => (
                <>
                  <Slider.Fill />
                  {state.values.map((_, index) => (
                    <Slider.Thumb key={index} index={index} hitSlop={20} />
                  ))}
                </>
              )}
            </Slider.Track>
          </Slider>
        </View>
      </LayoutDirectionScope>

      <AppText align="right" variant="caption" className="text-content-secondary">
        اسحب الطرف اليساري للحد الأدنى، واليميني للحد الأعلى.
      </AppText>
      <AppText align="right" variant="caption" className="text-content-secondary">
        {usingCatalogLimits
          ? 'هالنطاق عام من أسعار المنصة، لأن الخدمة المختارة ما إلها سعر رقمي معلن.'
          : 'الأسعار تقريبية حسب الخدمات؛ السعر اللي بيتحدد بعد الفحص ما إله رقم للمقارنة.'}
      </AppText>
    </View>
  );
}
