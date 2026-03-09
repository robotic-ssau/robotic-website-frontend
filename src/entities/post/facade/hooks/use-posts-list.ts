import { usePostsInfiniteEndpoint } from '../endpoints';
import type { PostListItem } from '../../model';

/**
 * Хук для UI: плоский список постов из всех загруженных страниц + флаги загрузки и hasNextPage.
 */
export function usePostsList(): {
  posts: PostListItem[];
  isLoading: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  fetchNextPage: () => void;
  isError: boolean;
  error: Error | null;
} {
  const query = usePostsInfiniteEndpoint();

  const posts: PostListItem[] = query.data?.pages.flatMap((page) => page.data) ?? [];

  return {
    posts,
    isLoading: query.isLoading,
    isFetchingNextPage: query.isFetchingNextPage,
    hasNextPage: query.hasNextPage ?? false,
    fetchNextPage: query.fetchNextPage,
    isError: query.isError,
    error: query.error as Error | null,
  };
}
