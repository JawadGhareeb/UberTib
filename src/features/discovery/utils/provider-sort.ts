import { getMockProvider } from '@/features/discovery/mocks/providers.mock';

export type ProviderResultSort =
  'default' | 'rating-desc' | 'rating-asc' | 'price-asc' | 'price-desc';

export const providerSortChoices: readonly { value: ProviderResultSort; label: string }[] = [
  { value: 'default', label: 'الترتيب الافتراضي' },
  { value: 'rating-desc', label: 'الأعلى تقييماً' },
  { value: 'rating-asc', label: 'الأقل تقييماً' },
  { value: 'price-asc', label: 'السعر: من الأقل للأعلى' },
  { value: 'price-desc', label: 'السعر: من الأعلى للأقل' },
];

function comparablePrice(providerId: string, serviceCode: string): number | null {
  const fact = getMockProvider(providerId)?.prices[serviceCode];
  if (!fact || fact.mode === 'requires-plan') return null;
  if (fact.mode === 'free') return 0;
  if (fact.mode === 'fixed') return fact.amount ?? null;
  if (fact.mode === 'range') return fact.amount_min ?? null;
  return null;
}

/** Sort the service-specific mock results without mutating the source list.
 * Unpriced services remain last in both price directions, never treated as free.
 */
export function sortServiceDoctors<T extends { id: string }>(
  doctors: readonly T[],
  sort: ProviderResultSort,
  serviceCode: string,
): T[] {
  if (sort === 'default') return [...doctors];
  return [...doctors].sort((a, b) => {
    if (sort === 'rating-desc' || sort === 'rating-asc') {
      const aRating = getMockProvider(a.id)?.rating ?? 0;
      const bRating = getMockProvider(b.id)?.rating ?? 0;
      return sort === 'rating-desc' ? bRating - aRating : aRating - bRating;
    }
    const aPrice = comparablePrice(a.id, serviceCode);
    const bPrice = comparablePrice(b.id, serviceCode);
    if (aPrice === null) return bPrice === null ? 0 : 1;
    if (bPrice === null) return -1;
    return sort === 'price-asc' ? aPrice - bPrice : bPrice - aPrice;
  });
}
