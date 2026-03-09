import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createPost } from '../api';
import { mapPostDtoToDomain } from './mappers';
import type { CreatePostRequestDTO } from '../api/types';
import { POSTS_INFINITE_QUERY_KEY } from './use-posts-infinite-query';

/**
 * Мутация: создание поста. Инвалидирует список постов. Возвращает доменный Post.
 */
export function useCreatePostMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (body: CreatePostRequestDTO) => {
      const dto = await createPost(body);
      return mapPostDtoToDomain(dto);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: POSTS_INFINITE_QUERY_KEY });
    },
  });
}
