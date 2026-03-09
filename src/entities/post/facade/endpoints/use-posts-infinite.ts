import { usePostsStore } from '../store';
import { usePostsInfiniteQuery } from '../../repository';

/**
 * Endpoint: бесконечный список постов с пагинацией (использует pageSize из стора).
 */
export function usePostsInfiniteEndpoint() {
  const pageSize = usePostsStore((s) => s.pageSize);
  return usePostsInfiniteQuery({ pageSize });
}
