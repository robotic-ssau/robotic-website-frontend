import { useQuery } from '@tanstack/react-query';
import { getCurrentUser } from '../api';
import { mapUserDtoToDomain } from './mappers';

export const CURRENT_USER_QUERY_KEY = ['auth', 'me'] as const;

/**
 * TanStack Query: запрос текущего пользователя (/me). Преобразует DTO в доменную модель.
 * Не взаимодействует со стором.
 */
export function useCurrentUserQuery(options: { enabled: boolean }) {
  return useQuery({
    queryKey: CURRENT_USER_QUERY_KEY,
    queryFn: async () => {
      const dto = await getCurrentUser();
      return mapUserDtoToDomain(dto);
    },
    enabled: options.enabled,
    retry: false,
    staleTime: Infinity,
  });
}
