export {
  usePostsStore,
  usePostsList,
  usePostQuery,
  useCreatePostMutation,
  usePatchPostMutation,
  useDeletePostMutation,
} from './facade';
export type { Post, PostListItem, PaginationMeta, PostsPage } from './model';
export { getPosts, getPost, createPost, patchPost, deletePost } from './api';
export { POSTS_INFINITE_QUERY_KEY, POST_QUERY_KEY } from './repository';
export type {
  GetPostsRequestDTO,
  GetPostsResponseDTO,
  CreatePostRequestDTO,
  PatchPostRequestDTO,
} from './api';
