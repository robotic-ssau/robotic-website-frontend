import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';

export type ApiClientConfig = {
  baseURL: string;
  timeout?: number;
  getAccessToken?: () => string | null;
};
export const UNAUTHORIZED_EVENT_TYPE = 'auth:unauthorized';
export type UnauthorizedCustomEventType = { pathname: string };

/**
 * Фабрика Axios-инстансов для разных микросервисов.
 * Каждый сервис может иметь свой baseURL и опционально свой токен.
 */
export function createApiClient(config: ApiClientConfig): AxiosInstance {
  const { baseURL, timeout = 10000, getAccessToken } = config;

  const client = axios.create({
    baseURL,
    timeout,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  client.interceptors.request.use((req: InternalAxiosRequestConfig) => {
    const token = getAccessToken?.();
    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
  });

  client.interceptors.response.use(
    (res) => res,
    (err) => {
      if (err.response?.status === 401) {
        if (typeof localStorage !== 'undefined') {
          localStorage.removeItem('access_token');
        }

        const pathname = typeof window !== 'undefined' ? window.location.pathname : '/';
        const event = new CustomEvent<UnauthorizedCustomEventType>(UNAUTHORIZED_EVENT_TYPE, {
          detail: { pathname },
        });
        if (typeof window !== 'undefined') {
          window.dispatchEvent(event);
        }
      }
      return Promise.reject(err);
    },
  );

  return client;
}
