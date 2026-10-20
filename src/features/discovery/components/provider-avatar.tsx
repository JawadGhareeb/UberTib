import { Avatar } from 'heroui-native';

import { getMockProvider } from '@/features/discovery/mocks/providers.mock';

/** One doctor-specific HeroUI avatar, with a stable initials fallback. */
export function ProviderAvatar({
  providerId,
  imageUrl,
  initials,
  size = 52,
}: {
  providerId?: string;
  imageUrl?: string;
  initials?: string;
  size?: number;
}) {
  const provider = getMockProvider(providerId);
  const uri = imageUrl ?? provider?.imageUrl;
  const fallback = initials ?? provider?.initials ?? 'د';

  return (
    <Avatar
      color="accent"
      variant="soft"
      size="lg"
      style={{ width: size, height: size }}
      accessibilityLabel="صورة توضيحية للطبيب"
    >
      {uri ? <Avatar.Image source={{ uri }} /> : null}
      <Avatar.Fallback>{fallback}</Avatar.Fallback>
    </Avatar>
  );
}
