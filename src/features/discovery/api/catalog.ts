import { getMockServiceGroups } from '@/features/discovery/mocks/catalog.mock';

export interface LocalizedName {
  ar: string;
  en: string;
}

export interface ServiceDefinitionSummary {
  version: number;
  audience: 'evaluation' | 'production';
  clinical_review_state: 'pending' | 'approved';
  production_ready: boolean;
  protection: {
    funded: false;
  };
}

export interface CatalogService {
  code: string;
  slug: string;
  name: LocalizedName;
  description_ar: string;
  price_label: string;
  provider_count: number;
  duration_label: string;
  next_available_label: string;
  definition: ServiceDefinitionSummary;
}

export interface ServiceGroup {
  code: string;
  name: LocalizedName;
  description_ar: string;
  services: CatalogService[];
}

export interface ServiceGroupsResponse {
  data: ServiceGroup[];
  meta: {
    mode: 'evaluation' | 'production';
  };
}

export async function getServiceGroups(): Promise<ServiceGroupsResponse> {
  return getMockServiceGroups();
}
