const tokens = require('./src/shared/theme/tokens.json');

const colorVar = (name) => `rgb(var(--${name}) / <alpha-value>)`;

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: { mark: colorVar('brand-mark') },
        surface: {
          canvas: colorVar('surface-canvas'),
          default: colorVar('surface-default'),
          subtle: colorVar('surface-subtle'),
          inverse: colorVar('surface-inverse'),
          scrim: colorVar('surface-scrim'),
        },
        content: {
          primary: colorVar('text-primary'),
          secondary: colorVar('text-secondary'),
          placeholder: colorVar('text-placeholder'),
          disabled: colorVar('text-disabled'),
          link: colorVar('text-link'),
          'on-action': colorVar('text-on-action'),
          'on-destructive': colorVar('text-on-destructive'),
          'on-inverse': colorVar('text-on-inverse'),
        },
        border: {
          subtle: colorVar('border-subtle'),
          default: colorVar('border-default'),
          strong: colorVar('border-strong'),
          emphasis: colorVar('border-emphasis'),
        },
        focus: {
          ring: colorVar('focus-ring'),
          'ring-contrast': colorVar('focus-ring-contrast'),
        },
        state: {
          selected: colorVar('state-selected'),
          'selected-border': colorVar('state-selected-border'),
          readonly: colorVar('state-readonly'),
          'readonly-border': colorVar('state-readonly-border'),
        },
        action: {
          primary: colorVar('action-primary'),
          'primary-active': colorVar('action-primary-active'),
          subtle: colorVar('action-subtle'),
          'secondary-surface': colorVar('action-secondary-surface'),
          'secondary-border': colorVar('action-secondary-border'),
          'secondary-text': colorVar('action-secondary-text'),
          destructive: colorVar('action-destructive'),
          'destructive-active': colorVar('action-destructive-active'),
        },
        tone: {
          neutral: {
            fill: colorVar('tone-neutral-fill'),
            border: colorVar('tone-neutral-border'),
            text: colorVar('tone-neutral-text'),
          },
          info: {
            fill: colorVar('tone-info-fill'),
            border: colorVar('tone-info-border'),
            text: colorVar('tone-info-text'),
          },
          success: {
            fill: colorVar('tone-success-fill'),
            border: colorVar('tone-success-border'),
            text: colorVar('tone-success-text'),
          },
          warning: {
            fill: colorVar('tone-warning-fill'),
            border: colorVar('tone-warning-border'),
            text: colorVar('tone-warning-text'),
          },
          danger: {
            fill: colorVar('tone-danger-fill'),
            border: colorVar('tone-danger-border'),
            text: colorVar('tone-danger-text'),
          },
          restricted: {
            fill: colorVar('tone-restricted-fill'),
            border: colorVar('tone-restricted-border'),
            text: colorVar('tone-restricted-text'),
          },
        },
      },
      fontSize: Object.fromEntries(
        Object.entries(tokens.typography).map(([name, value]) => [
          `type-${name}`,
          [`${value.fontSize}px`, { lineHeight: `${value.lineHeight}px` }],
        ]),
      ),
      fontFamily: {
        'ui-regular': [tokens.font.regular],
        'ui-medium': [tokens.font.medium],
        'ui-semibold': [tokens.font.semibold],
        'ui-bold': [tokens.font.bold],
      },
      borderRadius: {
        control: `${tokens.radius.control}px`,
        surface: `${tokens.radius.surface}px`,
        chip: `${tokens.radius.chip}px`,
        'form-field': `${tokens.radius.formField}px`,
      },
      minHeight: {
        control: `${tokens.size.control}px`,
        'target-comfortable': `${tokens.size.targetComfortable}px`,
        'form-field': `${tokens.size.formField}px`,
      },
    },
  },
  plugins: [],
};
