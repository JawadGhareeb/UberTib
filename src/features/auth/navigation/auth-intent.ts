import type { Href } from 'expo-router';

type ReturnToParam = string | string[] | undefined;
type ReturnToParams = Record<string, string | undefined>;

export function buildReturnTo(pathname: string, params: ReturnToParams = {}): string {
  const queryParts: string[] = [];

  for (const [key, value] of Object.entries(params)) {
    if (!value) {
      continue;
    }

    queryParts.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
  }

  const query = queryParts.join('&');
  return query ? `${pathname}?${query}` : pathname;
}

export function resolveSafeReturnTo(value: ReturnToParam): Href {
  const candidate = Array.isArray(value) ? value[0] : value;

  if (
    !candidate ||
    !candidate.startsWith('/') ||
    candidate.startsWith('//') ||
    candidate.startsWith('/auth/')
  ) {
    return '/(tabs)/home';
  }

  return candidate as Href;
}
