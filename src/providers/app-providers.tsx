import type { PropsWithChildren } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { KeyboardProvider } from 'react-native-keyboard-controller';

import { CareDraftProvider } from '@/features/my-care/state/care-draft-provider';
import { DiscoverySessionProvider } from '@/features/discovery/state/discovery-session-provider';
import { DoctorFavoritesProvider } from '@/features/discovery/state/doctor-favorites-provider';
import { HealthNotesProvider } from '@/features/profile/state/health-notes-provider';
import { ProfilePrivacyProvider } from '@/features/profile/state/profile-privacy-provider';
import { ProfilePhotoProvider } from '@/features/profile/state/profile-photo-provider';
import { FamilyMembersProvider } from '@/features/profile/state/family-members-provider';
import { AccountDetailsProvider } from '@/features/profile/state/account-details-provider';
import { SupportTicketsProvider } from '@/features/profile/state/support-tickets-provider';
import { PreferredLocationProvider } from '@/features/location/state/preferred-location-provider';
import { AppDirectionProvider } from '@/providers/app-direction-provider';
import { AuthSessionProvider, useAuthSession } from '@/providers/auth-session-provider';
import { MockScenarioProvider } from '@/shared/mock';
import { queryClient } from '@/shared/query/query-client';

function SessionScopedProviders({ children }: PropsWithChildren) {
  const { sessionEpoch } = useAuthSession();
  return <SessionData key={sessionEpoch}>{children}</SessionData>;
}

/** Private in-memory state is discarded by session key rotation on sign out. */
function SessionData({ children }: PropsWithChildren) {
  return (
    <PreferredLocationProvider>
      <AccountDetailsProvider>
        <FamilyMembersProvider>
          <CareDraftProvider>
            <DiscoverySessionProvider>
              <DoctorFavoritesProvider>
                <MockScenarioProvider>
                  <HealthNotesProvider>
                    <ProfilePrivacyProvider>
                      <ProfilePhotoProvider>
                        <SupportTicketsProvider>
                          <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
                        </SupportTicketsProvider>
                      </ProfilePhotoProvider>
                    </ProfilePrivacyProvider>
                  </HealthNotesProvider>
                </MockScenarioProvider>
              </DoctorFavoritesProvider>
            </DiscoverySessionProvider>
          </CareDraftProvider>
        </FamilyMembersProvider>
      </AccountDetailsProvider>
    </PreferredLocationProvider>
  );
}

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <KeyboardProvider statusBarTranslucent>
      <AppDirectionProvider>
        <AuthSessionProvider>
          <SessionScopedProviders>{children}</SessionScopedProviders>
        </AuthSessionProvider>
      </AppDirectionProvider>
    </KeyboardProvider>
  );
}
