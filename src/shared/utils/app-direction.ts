export type AppDirection = 'rtl' | 'ltr';

type AppDirectionValue = {
  direction: AppDirection;
  isRTL: boolean;
  rowClassName: 'flex-row-reverse' | 'flex-row';
  rowReverseClassName: 'flex-row' | 'flex-row-reverse';
  startClassName: 'self-end' | 'self-start';
  endClassName: 'self-start' | 'self-end';
  textAlign: 'right' | 'left';
  writingDirection: AppDirection;
};

/**
 * User-facing application language is fixed to Arabic/RTL in this build.
 * These values never changed in AppDirectionProvider, so Context caused
 * unnecessary subscriptions for 31 consuming components.
 */
const rtl: AppDirectionValue = {
  direction: 'rtl',
  isRTL: true,
  rowClassName: 'flex-row-reverse',
  rowReverseClassName: 'flex-row',
  startClassName: 'self-end',
  endClassName: 'self-start',
  textAlign: 'right',
  writingDirection: 'rtl',
};

export function useAppDirection(): AppDirectionValue {
  return rtl;
}
