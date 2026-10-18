import { Children, type ComponentProps, type ReactNode } from 'react';
import { Text } from 'react-native';

import { useAppDirection } from '@/providers/app-direction-provider';
import { cn } from '@/shared/utils/cn';

type NativeTextProps = ComponentProps<typeof Text>;
type TextVariant =
  | 'display'
  | 'heading-1'
  | 'heading-2'
  | 'heading-3'
  | 'heading-4'
  | 'body'
  | 'body-strong'
  | 'label'
  | 'caption'
  | 'badge'
  | 'onboarding-step-title'
  | 'onboarding-step-caption'
  | 'onboarding-step-number';

interface AppTextProps extends NativeTextProps {
  variant?: TextVariant;
  direction?: 'rtl' | 'ltr' | 'auto';
  align?: 'auto' | 'right' | 'left' | 'center';
}

const variantClasses: Record<TextVariant, string> = {
  display: 'font-ui-bold text-type-display text-content-primary',
  'heading-1': 'font-ui-bold text-type-heading-1 text-content-primary',
  'heading-2': 'font-ui-semibold text-type-heading-2 text-content-primary',
  'heading-3': 'font-ui-semibold text-type-heading-3 text-content-primary',
  'heading-4': 'font-ui-semibold text-type-heading-4 text-content-primary',
  body: 'font-ui-regular text-type-body text-content-primary',
  'body-strong': 'font-ui-medium text-type-body-strong text-content-primary',
  label: 'font-ui-medium text-type-label text-content-primary',
  caption: 'font-ui-regular text-type-caption text-content-secondary',
  badge: 'font-ui-medium text-type-badge text-content-secondary',
  'onboarding-step-title': 'font-ui-semibold text-type-onboarding-step-title text-content-primary',
  'onboarding-step-caption':
    'font-ui-regular text-type-onboarding-step-caption text-content-secondary',
  'onboarding-step-number': 'font-ui-semibold text-type-onboarding-step-number text-content-link',
};

const LRI = '\u2066';
const PDI = '\u2069';
const ltrRunPattern =
  /([+]?(?:[A-Za-z0-9٠-٩][A-Za-z0-9٠-٩._:/@+,%#٬٫-]*)(?:\s+[A-Za-z0-9٠-٩][A-Za-z0-9٠-٩._:/@+,%#٬٫-]*)*)/g;

function isolateLtrRuns(value: string): string {
  return value.replace(ltrRunPattern, `${LRI}$1${PDI}`);
}

function isolateRtlChildren(children: ReactNode): ReactNode {
  if (typeof children === 'string') {
    return isolateLtrRuns(children);
  }

  if (typeof children === 'number') {
    return `${LRI}${children}${PDI}`;
  }

  if (Array.isArray(children)) {
    return children.map((child) => isolateRtlChildren(child));
  }

  return children;
}

function firstStrongDirection(value: unknown, fallback: 'rtl' | 'ltr'): 'rtl' | 'ltr' {
  if (typeof value !== 'string' && typeof value !== 'number') {
    return fallback;
  }

  const text = String(value).trim();
  if (!text) {
    return fallback;
  }

  for (const char of text) {
    if (/[؀-ۿݐ-ݿࢠ-ࣿ]/.test(char)) return 'rtl';
    if (/[A-Za-z]/.test(char)) return 'ltr';
  }

  return /\d/.test(text) ? 'ltr' : fallback;
}

function resolveContentWritingDirection(
  children: ReactNode,
  fallback: 'rtl' | 'ltr',
): 'rtl' | 'ltr' {
  for (const child of Children.toArray(children)) {
    if (typeof child !== 'string' && typeof child !== 'number') continue;

    const text = String(child).trim();
    if (!text) continue;

    return firstStrongDirection(child, fallback);
  }

  return fallback;
}

export function AppText({
  variant = 'body',
  direction = 'auto',
  align = 'auto',
  className,
  style,
  children,
  ...props
}: AppTextProps) {
  const appDirection = useAppDirection();
  // An explicit semantic type role takes precedence over the default variant.
  // Never combine two size utilities on the same text element.
  const explicitRole =
    /\btext-type-(?:display|heading-[1-4]|body(?:-strong)?|label|caption|badge)\b/.test(
      className ?? '',
    );
  // A consumer-supplied semantic text color must replace the variant default.
  // Keeping both classes is unreliable in NativeWind: stylesheet order, not
  // the order of className words, can otherwise make bold accent text black.
  const explicitColor =
    /\btext-(?:content-[\w-]+|tone-[\w-]+-text)\b/.test(className ?? '');
  let baseClasses = variantClasses[variant];
  if (explicitRole) baseClasses = baseClasses.replace(/\btext-type-[\w-]+\b/, '');
  if (explicitColor) baseClasses = baseClasses.replace(/\btext-content-[\w-]+\b/, '');
  const resolvedWritingDirection =
    direction === 'auto'
      ? resolveContentWritingDirection(children, appDirection.writingDirection)
      : direction;
  const resolvedAlign = align === 'auto' ? appDirection.textAlign : align;
  const renderedChildren =
    resolvedWritingDirection === 'rtl' ? isolateRtlChildren(children) : children;

  return (
    <Text
      {...props}
      className={cn(baseClasses, className)}
      style={[
        {
          letterSpacing: 0,
          textAlign: resolvedAlign,
          writingDirection: resolvedWritingDirection,
        },
        style,
      ]}
    >
      {renderedChildren}
    </Text>
  );
}
