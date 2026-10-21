/** Search-page comparison stays local until the user explicitly opens the table. */
export interface CatalogComparisonSelection {
  serviceCode: string | null;
  providerIds: string[];
}

/**
 * The table compares one service at a time. Keep selected doctors while
 * searching/filtering, cap at three, and never silently switch the service.
 */
export function toggleCatalogComparison(
  current: CatalogComparisonSelection | null,
  providerId: string,
  serviceCode: string | null,
  providerServices: readonly string[],
): CatalogComparisonSelection | null {
  if (current?.providerIds.includes(providerId)) {
    const remaining = current.providerIds.filter((id) => id !== providerId);
    return remaining.length ? { ...current, providerIds: remaining } : null;
  }
  if (current && current.providerIds.length >= 3) return current;
  if (current && current.serviceCode !== serviceCode) return current;
  const targetService = current ? current.serviceCode : serviceCode;
  if (targetService && !providerServices.includes(targetService)) return current;

  return {
    serviceCode: targetService,
    providerIds: [...(current?.providerIds ?? []), providerId],
  };
}
