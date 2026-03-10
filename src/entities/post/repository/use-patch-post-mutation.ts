import { useMutation, useQueryClient } from '@tanstack/react-query';
import { patchPost } from '../api';
import { mapPostDtoToDomain } from './mappers';
import type { PatchPostRequestDTO } from '../api/types';
import { POSTS_INFINITE_QUERY_KEY } from './use-posts-infinite-query';
import { POST_QUERY_KEY } from './use-post-query';

/**
 * Мутация: обновление поста. Инвалидирует список и кэш поста по id.
 */
export function usePatchPostMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, body }: { id: string; body: PatchPostRequestDTO }) => {
      const dto = await patchPost(id, body);
      return mapPostDtoToDomain(dto);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: POSTS_INFINITE_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [...POST_QUERY_KEY, data.id] });
    },
  });
}
