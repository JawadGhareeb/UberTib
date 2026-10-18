import { ProfileLocationMapFallback } from './profile-location-map-fallback';
import type { ProfileLocationMapProps } from './profile-location-map.types';

export function ProfileLocationMap({ coordinate, onChange }: ProfileLocationMapProps) {
  return (
    <ProfileLocationMapFallback
      coordinate={coordinate}
      description="الخريطة التفاعلية متاحة داخل نسخة الهاتف التي تدعم الخرائط."
      onChange={onChange}
    />
  );
}
