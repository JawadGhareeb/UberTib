import { useRouter } from 'expo-router';
import { Card as HeroCard } from 'heroui-native';
import { Pressable, View } from 'react-native';
import type { getMockNeedsAttentionForScenario } from '@/features/platform/mocks/platform.mock';
import { AppIcon, AppText } from '@/shared/components/ui';
import { SectionTitle } from './home-section-title';

type HomeAttentionItem = ReturnType<typeof getMockNeedsAttentionForScenario>[number];

export function HomeAttentionSection({ attention }: { attention: HomeAttentionItem[] }) {
  const router = useRouter();
  return (
    <>
      {attention.length > 0 ? (
        <View className="gap-2.5">
          <SectionTitle
            title="يحتاج انتباهك"
            action="عرض الكل"
            onAction={() => router.push('/needs-attention')}
          />
          {attention.map((item) => (
            <Pressable
              key={item.id}
              accessibilityRole="button"
              accessibilityLabel={item.title}
              onPress={() => router.push(item.href)}
            >
              <HeroCard
                variant="default"
                className="rounded-[16px] border border-tone-warning-border bg-tone-warning-fill px-3 py-3"
              >
                <View className="flex-row-reverse items-center gap-3">
                  <AppIcon
                    name={{
                      ios: 'exclamationmark.circle',
                      android: 'error_outline',
                      web: 'error_outline',
                    }}
                    size={22}
                    tone={item.tone}
                  />
                  <View className="min-w-0 flex-1 items-end gap-1">
                    <AppText
                      align="right"
                      variant="label"
                      className="font-ui-semibold"
                      numberOfLines={1}
                    >
                      {item.title}
                    </AppText>
                    <AppText align="right" variant="caption" numberOfLines={2}>
                      {item.detail}
                    </AppText>
                  </View>
                  <AppIcon
                    name={{
                      ios: 'chevron.left',
                      android: 'chevron_left',
                      web: 'chevron_left',
                    }}
                    size={17}
                    tone="secondary"
                  />
                </View>
              </HeroCard>
            </Pressable>
          ))}
        </View>
      ) : null}
    </>
  );
}
