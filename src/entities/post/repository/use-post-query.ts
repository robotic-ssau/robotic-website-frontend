import { useQuery } from '@tanstack/react-query';
import { getPost } from '../api';
import { mapPostDtoToDomain } from './mappers';

export const POST_QUERY_KEY = ['posts', 'detail'] as const;

function postQueryKey(id: string) {
  return [...POST_QUERY_KEY, id] as const;
}

/**
 * Запрос одного поста по ID (полная информация). Возвращает доменный тип Post.
 */
export function usePostQuery(id: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: postQueryKey(id),
    queryFn: async () => {
      const dto = await getPost(id);
      return mapPostDtoToDomain(dto);
    },
    enabled: options?.enabled !== false && Boolean(id),
  });
}
