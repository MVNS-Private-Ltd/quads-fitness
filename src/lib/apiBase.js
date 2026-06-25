const trimTrailingSlash = (value) => value.replace(/\/+$/, '');

const configuredApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();

export const hasConfiguredApiBaseUrl = Boolean(configuredApiBaseUrl);

export const isProductionMissingApiBaseUrl =
  import.meta.env.PROD && !hasConfiguredApiBaseUrl;

export function buildApiUrl(endpoint) {
  if (isProductionMissingApiBaseUrl) {
    throw new Error('Production API URL is not configured. Set VITE_API_BASE_URL to the live backend origin.');
  }

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
