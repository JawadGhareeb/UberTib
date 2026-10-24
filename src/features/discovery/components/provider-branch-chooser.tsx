import { Pressable, View } from 'react-native';

import type { ProviderBranchOption } from '@/features/discovery/model/provider-branch-options';
import { AppIcon, AppText } from '@/shared/components/ui';

/** Renders only when the verified backend supplies multiple branches. */
export function ProviderBranchChooser({
  branches,
  selectedKey,
  onSelect,
}: {
  branches: readonly ProviderBranchOption[];
  selectedKey: string | undefined;
  onSelect: (branch: ProviderBranchOption) => void;
}) {
  if (branches.length < 2) return null;
  return (
    <View className="gap-2">
      <AppText align="right" variant="heading-4" className="font-ui-bold">
        اختر الفرع
      </AppText>
      <AppText align="right" variant="caption" className="text-content-secondary">
        توفر الخدمات والتصنيف العلمي والحماية مرتبط بالفرع المختار.
      </AppText>
      <View className="gap-2">
        {branches.map((branch) => {
          const selected = branch.uiKey === selectedKey;
          return (
            <Pressable
              key={branch.uiKey}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              accessibilityLabel={'اختيار فرع ' + branch.name}
              onPress={() => onSelect(branch)}
              className={
                'min-h-[64px] flex-row-reverse items-center gap-3 rounded-[13px] border p-3 ' +
                (selected
                  ? 'border-action-primary bg-action-subtle'
                  : 'border-border-subtle bg-surface-default')
              }
            >
              <AppIcon
                name={
                  selected
                    ? { ios: 'checkmark.circle.fill', android: 'check_circle', web: 'check_circle' }
                    : { ios: 'building.2', android: 'apartment', web: 'apartment' }
                }
                size={21}
                tone={selected ? 'action' : 'secondary'}
              />
              <View className="min-w-0 flex-1 gap-1">
                <AppText align="right" variant="label" className="font-ui-semibold">
                  {branch.name}
                </AppText>
                <AppText align="right" variant="caption" className="text-content-secondary">
                  {branch.area}
                </AppText>
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
