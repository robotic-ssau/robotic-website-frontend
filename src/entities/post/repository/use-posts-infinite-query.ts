import { useInfiniteQuery } from '@tanstack/react-query';
import { getPosts } from '../api';
import { mapGetPostsResponseDtoToDomain } from './mappers';

export const POSTS_INFINITE_QUERY_KEY = ['posts', 'list'] as const;

const DEFAULT_PAGE_SIZE = 10;

/**
 * Бесконечный список постов с постраничной пагинацией.
 * Каждая страница возвращает доменный тип PostsPage.
 */
export function usePostsInfiniteQuery(params?: { pageSize?: number }) {
  const pageSize = params?.pageSize ?? DEFAULT_PAGE_SIZE;

  return useInfiniteQuery({
    queryKey: [...POSTS_INFINITE_QUERY_KEY, pageSize],
    queryFn: async ({ pageParam }) => {
      const dto = await getPosts({ page: pageParam, pageSize });
      return mapGetPostsResponseDtoToDomain(dto);
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, pageSize: size, total } = lastPage.meta;
      const nextStart = page * size;
      return nextStart < total ? page + 1 : undefined;
    },
  });
}
