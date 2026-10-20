import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { Checkbox } from 'heroui-native';

import type { DentitionMode } from '@/features/assessment/state/assessment-session-provider';
import { useAppDirection } from '@/providers/app-direction-provider';
import { AppIcon, AppText } from '@/shared/components/ui';
import { ToothSvg, type ToothShape } from '@/shared/components/ui/tooth-svg';
import { MixedToothTarget } from '@/features/assessment/components/mixed-tooth-target';
import { cn } from '@/shared/utils/cn';

const permanentUpper = [
  '18',
  '17',
  '16',
  '15',
  '14',
  '13',
  '12',
  '11',
  '21',
  '22',
  '23',
  '24',
  '25',
  '26',
  '27',
  '28',
];
const permanentLower = [
  '48',
  '47',
  '46',
  '45',
  '44',
  '43',
  '42',
  '41',
  '31',
  '32',
  '33',
  '34',
  '35',
  '36',
  '37',
  '38',
];
const primaryUpper = ['55', '54', '53', '52', '51', '61', '62', '63', '64', '65'];
const primaryLower = ['85', '84', '83', '82', '81', '71', '72', '73', '74', '75'];

function toothKind(code: string, primary: boolean): ToothShape {
  const position = Number(code[1]);
  if (position <= 2) return 'incisor';
  if (position === 3) return 'canine';
  if (!primary && position <= 5) return 'premolar';
  return 'molar';
}

// Use one curvature profile for both arches, mirrored vertically. The old
// lower-specific offsets flattened the bottom teeth relative to the top row.
function toothOffset(code: string, _lower: boolean, primary: boolean): number {
  const position = Number(code[1]);
  if (primary) return [0, 0, 1, 4, 9, 13][position] ?? 0;
  return [0, 30, 30, 27, 24, 22, 18, 16, 14][position] ?? 14;
}

function ToothTarget({
  code,
  selected,
  primary,
  lower,
  scale,
  onPress,
}: {
  code: string;
  selected: boolean;
  primary: boolean;
  lower: boolean;
  scale: number;
  onPress: () => void;
}) {
  const kind = toothKind(code, primary);
  const primaryWidth = kind === 'molar' ? 20 : kind === 'canine' ? 16 : 15;
  const permanentWidth = kind === 'molar' ? 18 : kind === 'premolar' ? 16 : 14;
  const width = primary ? primaryWidth : permanentWidth;
  const glyphHeight = primary ? 35 : 37;

  return (
    <Checkbox
      isSelected={selected}
      onSelectedChange={onPress}
      accessibilityLabel={`السن ${code}`}
      className="min-h-[90px] min-w-0 flex-1 items-center justify-center overflow-visible"
      hitSlop={{ top: 3, bottom: 3 }}
      style={{
        paddingTop: !lower ? toothOffset(code, lower, primary) : 0,
        paddingBottom: lower ? toothOffset(code, lower, primary) : 0,
        overflow: 'visible',
      }}
      testID={`tooth-${code}`}
    >
      <ToothSvg
        kind={kind}
        lower={lower}
        primary={primary}
        selected={selected}
        width={width * scale}
        height={glyphHeight * scale}
      />
    </Checkbox>
  );
}

function describeTooth(code: string, primary: boolean): string {
  const quadrant = Number(code[0]);
  const position = Number(code[1]);
  const upper = quadrant === 1 || quadrant === 2 || quadrant === 5 || quadrant === 6;
  const right = quadrant === 1 || quadrant === 4 || quadrant === 5 || quadrant === 8;
  const kind =
    position <= 2
      ? 'القاطع'
      : position === 3
        ? 'الناب'
        : primary && position >= 4
          ? 'الضرس'
          : position <= 5
            ? 'الضاحك'
            : 'الضرس';
  const depth = position <= 3 ? 'الأمامي' : 'الخلفي';
  return `${kind}${primary ? ' اللبني' : ''} ${upper ? 'العلوي' : 'السفلي'} ${right ? 'الأيمن' : 'الأيسر'} ${depth}`;
}

interface DentalArchSelectorProps {
  mode: DentitionMode;
  selectedTeeth: string[];
  location: string;
  onToggleTooth: (tooth: string) => void;
  onSelectRegion: () => void;
  onSelectGum: () => void;
  onClear: () => void;
}

export function DentalArchSelector({
  mode,
  selectedTeeth,
  location,
  onToggleTooth,
  onSelectRegion,
  onSelectGum,
  onClear,
}: DentalArchSelectorProps) {
  const { rowClassName } = useAppDirection();
  const [archWidth, setArchWidth] = useState(0);
  const primary = mode === 'primary';
  const mixed = mode === 'mixed' || mode === 'uncertain';
  const upper = primary ? primaryUpper : permanentUpper;
  const lower = primary ? primaryLower : permanentLower;
  // Fit all 16 permanent teeth without horizontally scrolling a dental arch.
  const glyphScale =
    !primary && !mixed && archWidth ? Math.min(1, Math.max(0.7, (archWidth - 20) / (16 * 18))) : 1;
  const hasSelection = Boolean(location);
  const humanTooth = (value: string) => {
    const match = /^mixed-(upper|lower)-(\d+)$/.exec(value);
    return match ? 'الموضع ' + match[2] + (match[1] === 'upper' ? ' العلوي' : ' السفلي') : value;
  };
  const summary =
    selectedTeeth.length === 1
      ? mixed
        ? `حددت: ${humanTooth(selectedTeeth[0]!)}`
        : `حددت: ${describeTooth(selectedTeeth[0]!, primary)}`
      : selectedTeeth.length > 1
        ? `حددت: ${selectedTeeth.length} أسنان · ${selectedTeeth.map(humanTooth).join('، ')}`
        : location
          ? `حددت: ${location}`
          : '';

  return (
    <View className="rounded-[18px] border border-border-default bg-surface-default p-[14px]">
      <View className={cn('min-h-[44px] items-start justify-between gap-2', rowClassName)}>
        <View className="rounded-full border border-border-subtle bg-surface-subtle px-2.5 py-1.5">
          <AppText className="text-content-secondary" variant="caption">
            اختيار متعدد متاح
          </AppText>
        </View>
        <View className="min-w-0 flex-1 items-end">
          <AppText className="font-ui-bold" variant="heading-4">
            حدّد مكان المشكلة
          </AppText>
          <AppText className="text-content-secondary" variant="caption">
            {mixed
              ? 'أسنان مختلطة • اختر المكان لا الرمز'
              : primary
                ? 'أسنان لبنية • 20 سناً • بدون ضواحك'
                : 'أسنان دائمة • 32 موضعاً'}
          </AppText>
        </View>
      </View>

      <View className={cn('mt-3 min-h-6 items-center justify-between', rowClassName)}>
        <AppText className="font-ui-bold text-content-link" variant="caption">
          يمينك
        </AppText>
        <View
          className={cn(
            'items-center gap-1 rounded-full bg-surface-subtle px-2 py-1',
            rowClassName,
          )}
        >
          <AppIcon
            name={{ ios: 'face.smiling', android: 'face', web: 'face' }}
            size={11}
            tone="secondary"
          />
          <AppText className="text-content-secondary" variant="caption">
            الأمام
          </AppText>
        </View>
        <AppText className="font-ui-bold text-content-link" variant="caption">
          يسارك
        </AppText>
      </View>

      {mixed ? (
        <View
          className={cn(
            'mt-2 min-h-[42px] flex-wrap items-center justify-center gap-x-4 gap-y-2 rounded-[10px] bg-surface-subtle px-2 py-2',
            rowClassName,
          )}
        >
          <View className={cn('items-center gap-1', rowClassName)}>
            <View className="h-3 w-3 rounded-full border border-action-primary bg-surface-default" />
            <AppText
              className="text-type-caption font-ui-bold text-content-secondary"
              variant="caption"
            >
              دائم
            </AppText>
          </View>
          <View className={cn('items-center gap-1', rowClassName)}>
            <View className="h-3 w-3 rounded-full border border-tone-warning-border bg-tone-warning-fill" />
            <AppText
              className="text-type-caption font-ui-bold text-content-secondary"
              variant="caption"
            >
              لبني
            </AppText>
          </View>
          <View className={cn('items-center gap-1', rowClassName)}>
            <View className="h-3 w-3 rounded-full border border-border-default bg-surface-subtle" />
            <AppText
              className="text-type-caption font-ui-bold text-content-secondary"
              variant="caption"
            >
              موقع انتقالي
            </AppText>
          </View>
        </View>
      ) : null}

      <View className="mt-2 gap-2.5">
        <View
          className={cn(
            'flex-row overflow-visible border border-border-subtle bg-surface-subtle',
            mixed
              ? 'min-h-[76px] items-center rounded-t-[24px] rounded-b-[12px] px-[7px] py-2'
              : 'min-h-[112px] items-center rounded-t-[28px] rounded-b-[14px] px-2 py-3',
          )}
          onLayout={(event) => setArchWidth(event.nativeEvent.layout.width)}
          style={{ direction: 'ltr' }}
        >
          {mixed
            ? Array.from({ length: 10 }, (_, index) => {
                const key = `mixed-upper-${index + 1}`;
                return (
                  <MixedToothTarget
                    key={key}
                    index={index}
                    lower={false}
                    onPress={() => onToggleTooth(key)}
                    selected={selectedTeeth.includes(key)}
                  />
                );
              })
            : upper.map((code) => (
                <ToothTarget
                  key={code}
                  code={code}
                  lower={false}
                  onPress={() => onToggleTooth(code)}
                  primary={primary}
                  scale={glyphScale}
                  selected={selectedTeeth.includes(code)}
                />
              ))}
        </View>

        <View
          className={cn(
            'flex-row overflow-visible border border-border-subtle bg-surface-subtle',
            mixed
              ? 'min-h-[76px] items-center rounded-t-[12px] rounded-b-[24px] px-[7px] py-2'
              : 'min-h-[112px] items-center rounded-t-[14px] rounded-b-[28px] px-2 py-3',
          )}
          style={{ direction: 'ltr' }}
        >
          {mixed
            ? Array.from({ length: 10 }, (_, index) => {
                const key = `mixed-lower-${index + 1}`;
                return (
                  <MixedToothTarget
                    key={key}
                    index={index}
                    lower={true}
                    onPress={() => onToggleTooth(key)}
                    selected={selectedTeeth.includes(key)}
                  />
                );
              })
            : lower.map((code) => (
                <ToothTarget
                  key={code}
                  code={code}
                  lower={true}
                  onPress={() => onToggleTooth(code)}
                  primary={primary}
                  scale={glyphScale}
                  selected={selectedTeeth.includes(code)}
                />
              ))}
        </View>
      </View>

      <View className={cn('mt-3 min-h-[48px] gap-2', rowClassName)}>
        <Pressable
          accessibilityRole="button"
          className={cn(
            'min-h-[48px] flex-1 items-center justify-center gap-1 rounded-[10px] border border-action-secondary-border bg-surface-default',
            rowClassName,
          )}
          onPress={onSelectRegion}
        >
          <AppText className="text-type-caption font-ui-bold" variant="label">
            تحديد منطقة
          </AppText>
          <AppIcon name={{ ios: 'map', android: 'map', web: 'map' }} size={15} tone="action" />
        </Pressable>
        <Pressable
          accessibilityRole="button"
          className={cn(
            'min-h-[48px] flex-1 items-center justify-center gap-1 rounded-[10px] border border-action-secondary-border bg-surface-default',
            rowClassName,
          )}
          onPress={onSelectGum}
        >
          <AppText className="text-type-caption font-ui-bold" variant="label">
            منطقة اللثة
          </AppText>
          <AppIcon
            name={{ ios: 'line.3.horizontal', android: 'dentistry', web: 'dentistry' }}
            size={15}
            tone="action"
          />
        </Pressable>
      </View>

      {hasSelection ? (
        <View
          className={cn(
            'mt-3 items-center gap-2 rounded-[12px] border border-action-secondary-border bg-action-subtle px-[11px] py-2',
            rowClassName,
          )}
        >
          <Pressable
            className="h-8 items-center justify-center rounded-[9px] border border-action-secondary-border bg-surface-default px-3"
            onPress={onClear}
          >
            <AppText className="font-ui-bold text-content-link" variant="caption">
              تغيير
            </AppText>
          </Pressable>
          <View className="min-w-0 flex-1 items-end">
            <AppText className="font-ui-bold text-content-link" variant="label">
              {summary}
            </AppText>
            <AppText className="mt-0.5 text-type-caption text-content-secondary" variant="caption">
              {mixed
                ? 'لبني أو دائم • اختر المكان فقط • ليس تشخيصاً'
                : primary
                  ? 'سن لبني • للموقع فقط، وليس تشخيصاً'
                  : selectedTeeth.length === 1
                    ? `معرّف السن ${selectedTeeth[0]} • للموقع فقط، وليس تشخيصاً`
                    : 'الموقع للمساعدة بالتوجيه فقط، وليس تشخيصاً'}
            </AppText>
          </View>
          <AppIcon
            name={{ ios: 'checkmark.circle.fill', android: 'check_circle', web: 'check_circle' }}
            size={19}
            tone="action"
          />
        </View>
      ) : null}
    </View>
  );
}
