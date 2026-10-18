import type { PropsWithChildren } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';

import { DiscoverySessionProvider } from '@/features/discovery/state/discovery-session-provider';
import { ProfilePrivacyProvider } from '@/features/profile/state/profile-privacy-provider';
import { PreferredLocationProvider } from '@/features/location/state/preferred-location-provider';
import { AppDirectionProvider } from '@/providers/app-direction-provider';
import { AuthSessionProvider } from '@/providers/auth-session-provider';
import { MockScenarioProvider } from '@/shared/mock';
import { queryClient } from '@/shared/query/query-client';
import { ThemeProvider } from '@/shared/theme/theme-provider';

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <ThemeProvider>
      <AppDirectionProvider>
        <AuthSessionProvider>
          <PreferredLocationProvider>
            <DiscoverySessionProvider>
              <MockScenarioProvider>
                <ProfilePrivacyProvider>
                  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
                </ProfilePrivacyProvider>
              </MockScenarioProvider>
            </DiscoverySessionProvider>
          </PreferredLocationProvider>
        </AuthSessionProvider>
      </AppDirectionProvider>
    </ThemeProvider>
  );
}
