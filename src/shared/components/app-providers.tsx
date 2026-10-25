import type { PropsWithChildren } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { KeyboardProvider } from 'react-native-keyboard-controller';

import { CareDraftProvider } from '@/features/my-care/state/care-draft-provider';
import { DoctorFavoritesProvider } from '@/features/discovery/state/doctor-favorites-provider';
import { PreferredLocationProvider } from '@/features/location/state/preferred-location-provider';
import { useAuthSession } from '@/features/auth/state/auth-session-store';
import { queryClient } from '@/shared/query/query-client';

/** React-only providers still own storage hydration and session-local demo flows. */
function SessionScopedProviders({ children }: PropsWithChildren) {
  const sessionEpoch = useAuthSession((state) => state.sessionEpoch);
  return <SessionData key={sessionEpoch}>{children}</SessionData>;
}

/** Retains existing scoped hydration behavior until their stores are migrated. */
function SessionData({ children }: PropsWithChildren) {
  return (
    <PreferredLocationProvider>
      <CareDraftProvider>
        <DoctorFavoritesProvider>
          <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        </DoctorFavoritesProvider>
      </CareDraftProvider>
    </PreferredLocationProvider>
  );
}

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <KeyboardProvider statusBarTranslucent>
      <SessionScopedProviders>{children}</SessionScopedProviders>
    </KeyboardProvider>
  );
}
