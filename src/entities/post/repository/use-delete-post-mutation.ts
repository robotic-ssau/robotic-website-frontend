import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deletePost } from '../api';
import { POSTS_INFINITE_QUERY_KEY } from './use-posts-infinite-query';
import { POST_QUERY_KEY } from './use-post-query';

/**
 * Мутация: удаление поста. Инвалидирует список и кэш поста по id.
 */
export function useDeletePostMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deletePost(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: POSTS_INFINITE_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [...POST_QUERY_KEY, id] });
    },
  });
}
