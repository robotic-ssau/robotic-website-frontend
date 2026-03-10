/**
 * Доменный тип: элемент списка постов (краткая информация с пагинации).
 */
export interface PostListItem {
  id: string;
  status: string;
  type: string;
  publicationDate: string;
  /** Заголовок (первая строка или начало контента) */
  title: string;
  /** Текст поста */
  content: string;
  tags: string[];
  /** Ссылка на первое фото для превью */
  photoPreviewUrl: string | null;
}

/**
 * Доменный тип: полная информация о посте.
 */
export interface Post {
  id: string;
  status: string;
  type: string;
  publicationDate: string;
  title: string;
  content: string;
  tags: string[];
  photoUrls: string[];
  videoUrls: string[];
  authorIds: string[];
}

/**
 * Метаданные постраничной пагинации.
 */
export interface PaginationMeta {
  total: number;
  page: number;
  pageSize: number;
}

/**
 * Результат страницы списка постов.
 */
export interface PostsPage {
  data: PostListItem[];
  meta: PaginationMeta;
}
