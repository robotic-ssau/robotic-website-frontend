import { BASE_API_URL } from '@/shared/config/api';
import { createApiClient } from './base-client';

function getToken(): string | null {
  return typeof localStorage !== 'undefined' ? localStorage.getItem('access_token') : null;
}

/** Инстансы по умолчанию: один общий токен для всех */
export const apiClient = createApiClient({
  baseURL: BASE_API_URL,
  getAccessToken: getToken,
});
