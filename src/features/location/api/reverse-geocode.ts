import { Platform } from 'react-native';

import type { Coordinate } from '@/features/auth/components/profile-location-map.types';

interface OSMAddress {
  city?: string;
  town?: string;
  village?: string;
  municipality?: string;
  county?: string;
  suburb?: string;
  neighbourhood?: string;
  quarter?: string;
  residential?: string;
  city_district?: string;
  state?: string;
  region?: string;
  road?: string;
}

interface ReverseResult {
  address?: OSMAddress;
  display_name?: string;
}

function distinctNonEmpty(items: (string | undefined)[]): string[] {
  const seen = new Set<string>();
  return items
    .map((item) => item?.trim() ?? '')
    .filter((item) => {
      if (!item || seen.has(item)) return false;
      seen.add(item);
      return true;
    });
}

/**
 * Nominatim is used only for explicit user-selected coordinates (one request on confirmation).
 * Configure EXPO_PUBLIC_REVERSE_GEOCODE_URL to route requests through a production geocoder
 * when traffic grows; the public server is not suitable for bulk/automatic requests.
 */
export async function reverseGeocodeArabic(
  coordinate: Coordinate,
  signal?: AbortSignal,
): Promise<string> {
  const override = process.env.EXPO_PUBLIC_REVERSE_GEOCODE_URL?.trim();
  const baseUrl = override || 'https://nominatim.openstreetmap.org/reverse';
  const url = new URL(baseUrl);
  url.searchParams.set('lat', String(coordinate.latitude));
  url.searchParams.set('lon', String(coordinate.longitude));
  url.searchParams.set('format', 'jsonv2');
  url.searchParams.set('addressdetails', '1');
  url.searchParams.set('zoom', '17');
  url.searchParams.set('accept-language', 'ar');

  const headers: Record<string, string> = {
    Accept: 'application/json',
    'Accept-Language': 'ar',
  };
  if (Platform.OS !== 'web') {
    headers['User-Agent'] = 'UperTib-Mobile/1.0 (https://github.com/UperTip/upertip-mobile)';
  }
  const response = await fetch(url.toString(), { signal, headers });
  if (!response.ok) throw new Error('تعذر معرفة عنوان الموقع حالياً.');
  const data = (await response.json()) as ReverseResult;
  const address = data.address;

  const area =
    address?.neighbourhood ||
    address?.suburb ||
    address?.quarter ||
    address?.residential ||
    address?.city_district;
  const city =
    address?.city ||
    address?.town ||
    address?.village ||
    address?.municipality ||
    address?.county ||
    address?.state ||
    address?.region;
  const parts = distinctNonEmpty([city, area]);

  // Don't claim a fabricated city/neighborhood if map data is missing.
  if (!parts.length) throw new Error('لم نجد اسم هذه المنطقة. اكتب اسمها بالعربي.');
  return parts.join(' · ');
}
