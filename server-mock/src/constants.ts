/**
 * Типы ролей пользователя в системе
 */
export const ROLE_TYPE_DTO = {
  /** Анонимный пользователь */
  ANONYMOUS: 'ANONYMOUS',
  /** Обычный пользователь */
  USER: 'USER',
  /** Администратор */
  ADMIN: 'ADMIN',
  /** Владелец системы */
  OWNER: 'OWNER',
  /** SMM менеджер */
  SMM: 'SMM',
  /** Член совета */
  COUNCIL: 'COUNCIL',
} as const;

/**
 * Статусы публикации поста
 */
export const POST_STATUS_DTO = {
  /** Черновик */
  DRAFT: 'DRAFT',
  /** Опубликовано */
  PUBLISHED: 'PUBLISHED',
  /** Запланировано */
  SCHEDULED: 'SCHEDULED',
} as const;

/**
 * Типы постов
 */
export const POST_TYPE_DTO = {
  /** Обычный пост */
  POST: 'POST',
  /** Статья */
  ARTICLE: 'ARTICLE',
} as const;
