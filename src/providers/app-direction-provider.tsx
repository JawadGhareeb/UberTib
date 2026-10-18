import type { PropsWithChildren } from 'react';
import { createContext, useContext, useMemo } from 'react';

export type AppDirection = 'rtl' | 'ltr';

type AppDirectionContextValue = {
  direction: AppDirection;
  isRTL: boolean;
  rowClassName: 'flex-row-reverse' | 'flex-row';
  rowReverseClassName: 'flex-row' | 'flex-row-reverse';
  startClassName: 'self-end' | 'self-start';
  endClassName: 'self-start' | 'self-end';
  textAlign: 'right' | 'left';
  writingDirection: AppDirection;
};

const AppDirectionContext = createContext<AppDirectionContextValue | null>(null);

interface AppDirectionProviderProps extends PropsWithChildren {
  direction?: AppDirection;
}

export function AppDirectionProvider({ children, direction = 'rtl' }: AppDirectionProviderProps) {
  const value = useMemo<AppDirectionContextValue>(() => {
    const isRTL = direction === 'rtl';

    return {
      direction,
      isRTL,
      rowClassName: isRTL ? 'flex-row-reverse' : 'flex-row',
      rowReverseClassName: isRTL ? 'flex-row' : 'flex-row-reverse',
      startClassName: isRTL ? 'self-end' : 'self-start',
      endClassName: isRTL ? 'self-start' : 'self-end',
      textAlign: isRTL ? 'right' : 'left',
      writingDirection: direction,
    };
  }, [direction]);

  return <AppDirectionContext.Provider value={value}>{children}</AppDirectionContext.Provider>;
}

export function useAppDirection(): AppDirectionContextValue {
  const value = useContext(AppDirectionContext);

  if (!value) {
    throw new Error('useAppDirection must be used inside AppDirectionProvider');
  }

  return value;
}
