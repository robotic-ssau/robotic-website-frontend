import { apiClient } from '@/shared/api/instances';
import type { LoginRequestDTO, LoginResponseDTO, GetCurrentUserResponseDTO } from './types';

/**
 * Запрос на авторизацию. Возвращает сырой ответ бэкенда (без трансформации).
 */
export async function login(credentials: LoginRequestDTO): Promise<LoginResponseDTO> {
  const { data } = await apiClient.post<LoginResponseDTO>('/auth/login', credentials);
  return data;
}

/**
 * Запрос текущего пользователя (гидратация сессии). Возвращает сырой ответ бэкенда.
 */
export async function getCurrentUser(): Promise<GetCurrentUserResponseDTO> {
  const { data } = await apiClient.get<GetCurrentUserResponseDTO>('/auth/me');
  return data;
}

/**
 * Выход из системы. POST /api/auth/logout (токен в заголовке).
 */
export async function logout(): Promise<void> {
  await apiClient.post('/auth/logout');
}
