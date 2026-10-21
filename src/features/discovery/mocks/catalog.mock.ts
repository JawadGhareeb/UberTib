import type { ServiceGroupsResponse } from '@/features/discovery/api/catalog';
import {
  getMockProviders,
  type MockProviderPriceFact,
} from '@/features/discovery/mocks/providers.mock';
import { penServiceGroups } from '@/features/discovery/presentation/pen-discovery-data';
import { mockDelay } from '@/shared/mock/delay';

// A single canonical service tree drives the public service list and its filters.
// Do not maintain separate provider counts or invented availability labels.
const approvedDefinition = {
  version: 1,
  audience: 'evaluation' as const,
  clinical_review_state: 'approved' as const,
  production_ready: true,
  protection: { funded: false as const },
};

function numericStartingPrice(fact?: MockProviderPriceFact): number | null {
  if (!fact || fact.mode === 'requires-plan') return null;
  if (fact.mode === 'free') return 0;
  return fact.mode === 'range' ? (fact.amount_min ?? null) : (fact.amount ?? null);
}

function earliestListedDay(serviceCode: string): string {
  const providers = getMockProviders(serviceCode);
  const future = providers
    .flatMap((provider) => provider.availability)
    .filter((day) => day.dateKey >= new Date().toISOString().slice(0, 10) && day.slots.length > 0)
    .sort((a, b) => a.dateKey.localeCompare(b.dateKey))[0];
  return future ? `${future.dateLabel} · ${future.slots[0]}` : 'المواعيد تحتاج تحديثاً';
}

const mockServiceGroups: ServiceGroupsResponse = {
  data: penServiceGroups.map((group) => ({
    code: group.code,
    name: { ar: group.title, en: group.code },
    description_ar: group.description,
    services: group.families.map((family) => {
      const providers = getMockProviders(family.id);
      const numericPrices = providers.flatMap((provider) => {
        const value = numericStartingPrice(provider.prices[family.id]);
        return value === null ? [] : [value];
      });
      const cheapest = numericPrices.length ? Math.min(...numericPrices) : null;
      return {
        code: family.id,
        slug: family.id,
        name: { ar: family.title, en: family.id },
        description_ar: family.description,
        price_label:
          cheapest === null
            ? 'السعر حسب الخطة'
            : cheapest === 0
              ? 'يتوفر فحص مجاني'
              : `ابتداءً من ${cheapest.toLocaleString('en-US')} ل.س`,
        provider_count: providers.length,
        duration_label: 'المدة حسب التقييم',
        next_available_label: earliestListedDay(family.id),
        definition: approvedDefinition,
      };
    }),
  })),
  meta: { mode: 'evaluation' },
};

export async function getMockServiceGroups(): Promise<ServiceGroupsResponse> {
  await mockDelay();
  return mockServiceGroups;
}
