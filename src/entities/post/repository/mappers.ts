import type { GetPostsResponseDTO, PostDetailedDTO } from '../api/types';
import type { PostListItem, Post, PaginationMeta, PostsPage } from '../model/types';

type PostListItemDTO = GetPostsResponseDTO['data'][number];

/**
 * Маппер: элемент списка постов DTO → домен.
 */
export function mapPostListItemDtoToDomain(dto: PostListItemDTO): PostListItem {
  const content = dto.text?.content ?? '';
  const firstLine = content.split('\n')[0];
  const title = firstLine?.trim() || content.slice(0, 80) || 'Без названия';

  return {
    id: dto.id,
    status: dto.status,
    type: dto.type,
    publicationDate: dto.publication_date,
    title,
    content,
    tags: dto.tags?.map((t) => t.tag) ?? [],
    photoPreviewUrl: dto.photos?.[0]?.link ?? null,
  };
}

/**
 * Маппер: полный пост DTO → домен.
 */
export function mapPostDtoToDomain(dto: PostDetailedDTO): Post {
  const content = dto.text?.content ?? '';
  const firstLine = content.split('\n')[0];
  const title = firstLine?.trim() || content.slice(0, 80) || 'Без названия';

  return {
    id: dto.id,
    status: dto.status,
    type: dto.type,
    publicationDate: dto.publication_date,
    title,
    content,
    tags: dto.tags?.map((t) => t.tag) ?? [],
    photoUrls: dto.photos?.map((p) => p.link) ?? [],
    videoUrls: dto.videos?.map((v) => v.link) ?? [],
    authorIds: dto.authors?.map((a) => a.user_id) ?? [],
  };
}

/**
 * Маппер: мета пагинации DTO → домен.
 */
export function mapPaginationMetaDtoToDomain(dto: GetPostsResponseDTO['meta']): PaginationMeta {
  return {
    total: dto.total,
    page: dto.page,
    pageSize: dto.pageSize,
  };
}

/**
 * Маппер: ответ списка постов DTO → домен.
 */
export function mapGetPostsResponseDtoToDomain(dto: GetPostsResponseDTO): PostsPage {
  return {
    data: dto.data.map(mapPostListItemDtoToDomain),
    meta: mapPaginationMetaDtoToDomain(dto.meta),
  };
}
