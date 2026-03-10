import { apiClient } from '@/shared/api/instances';
import type {
  GetPostsRequestDTO,
  GetPostsResponseDTO,
  GetPostResponseDTO,
  CreatePostRequestDTO,
  CreatePostResponseDTO,
  PatchPostRequestDTO,
  PatchPostResponseDTO,
} from './types';

/**
 * Список постов с постраничной пагинацией.
 */
export async function getPosts(params?: GetPostsRequestDTO): Promise<GetPostsResponseDTO> {
  const { data } = await apiClient.get<GetPostsResponseDTO>('/posts', { params });
  return data;
}

/**
 * Получить пост по ID (полная информация).
 */
export async function getPost(id: string): Promise<GetPostResponseDTO> {
  const { data } = await apiClient.get<GetPostResponseDTO>(`/posts/${id}`);
  return data;
}

/**
 * Создать пост (требует авторизации).
 */
export async function createPost(body: CreatePostRequestDTO): Promise<CreatePostResponseDTO> {
  const { data } = await apiClient.post<CreatePostResponseDTO>('/posts', body);
  return data;
}

/**
 * Обновить пост по ID (требует авторизации).
 */
export async function patchPost(
  id: string,
  body: PatchPostRequestDTO,
): Promise<PatchPostResponseDTO> {
  const { data } = await apiClient.patch<PatchPostResponseDTO>(`/posts/${id}`, body);
  return data;
}

/**
 * Удалить пост по ID (требует авторизации).
 */
export async function deletePost(id: string): Promise<void> {
  await apiClient.delete(`/posts/${id}`);
}
