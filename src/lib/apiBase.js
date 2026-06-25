const trimTrailingSlash = (value) => value.replace(/\/+$/, '');

const railwayFallback = 'https://quads-fitness-production.up.railway.app';
const configuredApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim() || railwayFallback;

export const hasConfiguredApiBaseUrl = Boolean(configuredApiBaseUrl);

export function buildApiUrl(endpoint) {
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const baseUrl = hasConfiguredApiBaseUrl ? trimTrailingSlash(configuredApiBaseUrl) : '';
  return `${baseUrl}/api${normalizedEndpoint}`;
}

export const noStoreFetchOptions = {
  cache: 'no-store',
  headers: {
    'Cache-Control': 'no-cache',
    Pragma: 'no-cache',
  },
};
