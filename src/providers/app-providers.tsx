import type { PropsWithChildren } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';

import { DiscoverySessionProvider } from '@/features/discovery/state/discovery-session-provider';
import { ProfilePrivacyProvider } from '@/features/profile/state/profile-privacy-provider';
import { ProfilePhotoProvider } from '@/features/profile/state/profile-photo-provider';
import { FamilyMembersProvider } from '@/features/profile/state/family-members-provider';
import { AccountDetailsProvider } from '@/features/profile/state/account-details-provider';
import { SupportTicketsProvider } from '@/features/profile/state/support-tickets-provider';
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
            <AccountDetailsProvider>
              <FamilyMembersProvider>
                <DiscoverySessionProvider>
                  <MockScenarioProvider>
                    <ProfilePrivacyProvider>
                      <ProfilePhotoProvider>
                        <SupportTicketsProvider>
                          <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
                        </SupportTicketsProvider>
                      </ProfilePhotoProvider>
                    </ProfilePrivacyProvider>
                  </MockScenarioProvider>
                </DiscoverySessionProvider>
              </FamilyMembersProvider>
            </AccountDetailsProvider>
          </PreferredLocationProvider>
        </AuthSessionProvider>
      </AppDirectionProvider>
    </ThemeProvider>
  );
}
