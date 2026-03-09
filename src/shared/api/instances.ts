import { createApiClient } from './base-client';

/** Ключи микросервисов для типизации */
export const API_SERVICES = {
  AUTH: 'auth',
  USERS: 'users',
  FEED: 'feed',
  LAB: 'lab',
  SMM: 'smm',
  POSTS: 'posts',
} as const;

export type ApiServiceKey = (typeof API_SERVICES)[keyof typeof API_SERVICES];

/** Базовые URL микросервисов (из env или конфига) */
function getBaseUrl(service: string): string {
  const envKey = `VITE_API_${service.toUpperCase()}_URL`;
  const env = import.meta.env as Record<string, string | undefined>;
  return env[envKey] ?? `/api/${service}`;
}

function getToken(): string | null {
  return typeof localStorage !== 'undefined' ? localStorage.getItem('access_token') : null;
}

/** Инстансы по умолчанию: один общий токен для всех */
export const apiAuth = createApiClient({
  baseURL: getBaseUrl(API_SERVICES.AUTH),
  getAccessToken: getToken,
});

export const apiUsers = createApiClient({
  baseURL: getBaseUrl(API_SERVICES.USERS),
  getAccessToken: getToken,
});

export const apiFeed = createApiClient({
  baseURL: getBaseUrl(API_SERVICES.FEED),
  getAccessToken: getToken,
});

export const apiLab = createApiClient({
  baseURL: getBaseUrl(API_SERVICES.LAB),
  getAccessToken: getToken,
});

export const apiSmm = createApiClient({
  baseURL: getBaseUrl(API_SERVICES.SMM),
  getAccessToken: getToken,
});

export const apiPosts = createApiClient({
  baseURL: getBaseUrl(API_SERVICES.POSTS),
  getAccessToken: getToken,
});

/** Маппинг ключ → инстанс для динамического выбора сервиса */
export const apiByService: Record<ApiServiceKey, ReturnType<typeof createApiClient>> = {
  [API_SERVICES.AUTH]: apiAuth,
  [API_SERVICES.USERS]: apiUsers,
  [API_SERVICES.FEED]: apiFeed,
  [API_SERVICES.LAB]: apiLab,
  [API_SERVICES.SMM]: apiSmm,
  [API_SERVICES.POSTS]: apiPosts,
};

/**
 * Получить клиент по ключу сервиса (для универсальных хуков).
 */
export function getApiClient(service: ApiServiceKey): ReturnType<typeof createApiClient> {
  return apiByService[service];
}
