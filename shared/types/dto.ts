// ==================== Enums ====================

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

export type RoleTypeDTO = (typeof ROLE_TYPE_DTO)[keyof typeof ROLE_TYPE_DTO];

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

export type PostStatusDTO = (typeof POST_STATUS_DTO)[keyof typeof POST_STATUS_DTO];

/**
 * Типы постов
 */
export const POST_TYPE_DTO = {
  /** Обычный пост */
  POST: 'POST',
  /** Статья */
  ARTICLE: 'ARTICLE',
} as const;

export type PostTypeDTO = (typeof POST_TYPE_DTO)[keyof typeof POST_TYPE_DTO];

/**
 * Типы локаций публикации
 */
export const POST_LOCATION_DTO = {
  /** Публикация на сайте */
  WEBSITE: 'WEBSITE',
  /** Публикация ВКонтакте */
  VK: 'VK',
  /** Публикация в Telegram */
  TELEGRAM: 'TELEGRAM',
} as const;

export type PostLocationTypeDTO = (typeof POST_LOCATION_DTO)[keyof typeof POST_LOCATION_DTO];

/**
 * Типы опросов
 */
export const SURVERY_TYPE_DTO = {
  /** Множественный выбор */
  MULTIPLE: 'MULTIPLE',
  /** Одиночный выбор */
  SINGLE: 'SINGLE',
} as const;

export type SurveyTypeDTO = (typeof SURVERY_TYPE_DTO)[keyof typeof SURVERY_TYPE_DTO];

/**
 * Типы авторства контента
 */
export const POST_AUTHOR_TYPE_DTO = {
  /** Автор текста */
  TEXT: 'TEXT',
  /** Автор фото */
  PHOTO: 'PHOTO',
  /** Автор видео */
  VIDEO: 'VIDEO',
  /** Автор опроса */
  SURVEY: 'SURVEY',
} as const;

export type PostAuthorTypeDTO = (typeof POST_AUTHOR_TYPE_DTO)[keyof typeof POST_AUTHOR_TYPE_DTO];

// ==================== Base Entity DTOs ====================

/**
 * Базовая информация о пользователе
 */
export interface UserDTO {
  /** Уникальный идентификатор пользователя */
  id: string;
  /** Имя пользователя для входа */
  username: string;
  /** Хэш пароля */
  password: string;
  /** Активен ли аккаунт */
  active: boolean;
}

/**
 * Роль пользователя
 */
export interface RoleDTO {
  /** Уникальный идентификатор роли */
  id: string;
  /** Тип роли */
  name: RoleTypeDTO;
}

/**
 * Связь пользователя с ролью
 */
export interface UserRoleDTO {
  /** Уникальный идентификатор связи */
  id: string;
  /** ID пользователя */
  user_id: string;
  /** ID роли */
  role_id: string;
}

/**
 * Профиль пользователя с дополнительной информацией
 */
export interface ProfileDTO {
  /** Уникальный идентификатор профиля */
  id: string;
  /** ID пользователя */
  user_id: string;
  /** Имя */
  first_name: string;
  /** Фамилия */
  second_name: string;
  /** Отчество */
  middle_name: string;
  /** Номер телефона */
  phone: string;
  /** Email адрес */
  email: string;
  /** Группа/курс */
  group: string;
  /** ID профиля ВКонтакте */
  vk_id: string;
  /** ID профиля Telegram */
  telegram_id: string;
}

/**
 * Базовая информация о посте
 */
export interface PostDTO {
  /** Уникальный идентификатор поста */
  id: string;
  /** Статус публикации */
  status: PostStatusDTO;
  /** Тип поста */
  type: PostTypeDTO;
  /** Дата публикации в формате ISO */
  publication_date: string;
}

/**
 * Тег поста
 */
export interface PostTagDTO {
  /** Уникальный идентификатор тега */
  id: string;
  /** ID поста */
  post_id: string;
  /** Название тега */
  tag: string;
}

/**
 * Фотография поста
 */
export interface PostPhotoDTO {
  /** Уникальный идентификатор фото */
  id: string;
  /** ID поста */
  post_id: string;
  /** Ссылка на изображение */
  link: string;
}

/**
 * Видео поста
 */
export interface PostVideoDTO {
  /** Уникальный идентификатор видео */
  id: string;
  /** ID поста */
  post_id: string;
  /** Ссылка на видео */
  link: string;
}

/**
 * Текстовое содержимое поста
 */
export interface PostTextDTO {
  /** Уникальный идентификатор текста */
  id: string;
  /** ID поста */
  post_id: string;
  /** Содержимое текста */
  content: string;
}

/**
 * Локация публикации поста
 */
export interface PostLocationDTO {
  /** Уникальный идентификатор локации */
  id: string;
  /** ID поста */
  post_id: string;
  /** Дата публикации в локации */
  publication_date: string;
  /** Статус публикации в локации */
  status: PostStatusDTO;
  /** Тип локации */
  type: PostLocationTypeDTO;
  /** Внешний ID (например, ID поста в VK) */
  external_id: string;
}

/**
 * Опрос в посте
 */
export interface PostSurveyDTO {
  /** Уникальный идентификатор опроса */
  id: string;
  /** ID поста */
  post_id: string;
  /** Тип опроса */
  type: SurveyTypeDTO;
}

/**
 * Вариант ответа в опросе
 */
export interface SurveyAnswerDTO {
  /** Уникальный идентификатор ответа */
  id: string;
  /** ID опроса */
  survey_id: string;
  /** Текст ответа */
  text: string;
  /** Порядковый номер ответа */
  index: number;
}

/**
 * Автор контента поста
 */
export interface PostAuthorDTO {
  /** Уникальный идентификатор связи */
  id: string;
  /** ID пользователя-автора */
  user_id: string;
  /** ID поста */
  post_id: string;
  /** Тип авторства */
  type: PostAuthorTypeDTO;
}

// ==================== Extended DTOs ====================

/**
 * Пользователь с профилем и ролями
 */
export interface UserWithProfileDTO extends UserDTO {
  /** Профиль пользователя */
  profile?: ProfileDTO;
  /** Роли пользователя */
  roles?: RoleDTO[];
}

/**
 * Пост со всеми связанными данными
 */
export interface PostDetailedDTO extends PostDTO {
  /** Текстовое содержимое */
  text?: PostTextDTO;
  /** Теги поста */
  tags: PostTagDTO[];
  /** Фотографии */
  photos: PostPhotoDTO[];
  /** Видео */
  videos: PostVideoDTO[];
  /** Локации публикации */
  locations: PostLocationDTO[];
  /** Опрос с ответами */
  survey?: PostSurveyDTO & { answers: SurveyAnswerDTO[] };
  /** Авторы с их профилями */
  authors: Array<PostAuthorDTO & { user: UserDTO; profile?: ProfileDTO }>;
}

// ==================== Auth API ====================

/**
 * Запрос на авторизацию
 */
export interface LoginRequestDTO {
  /** Имя пользователя */
  username: string;
  /** Пароль */
  password: string;
}

/**
 * Ответ на запрос авторизации
 */
export interface LoginResponseDTO {
  /** JWT токен */
  token: string;
  /** Данные пользователя */
  user: UserWithProfileDTO;
}

/**
 * Запрос на выход из системы
 */
export interface LogoutRequestDTO {
  // Пустой объект, токен передается в заголовке
}

/**
 * Ответ на запрос выхода
 */
export interface LogoutResponseDTO {
  /** Сообщение об успешном выходе */
  message: string;
}

/**
 * Запрос текущего пользователя
 */
export interface GetCurrentUserRequestDTO {
  // Пустой объект, токен передается в заголовке
}

/**
 * Ответ с данными текущего пользователя
 */
export interface GetCurrentUserResponseDTO extends UserWithProfileDTO {}

// ==================== Users API ====================

/**
 * Запрос списка пользователей
 */
export interface GetUsersRequestDTO {
  // В будущем можно добавить параметры фильтрации и пагинации
}

/**
 * Ответ со списком пользователей
 */
export interface GetUsersResponseDTO {
  /** Список пользователей */
  users: UserWithProfileDTO[];
}

/**
 * Запрос пользователя по ID
 */
export interface GetUserRequestDTO {
  /** ID пользователя */
  id: string;
}

/**
 * Ответ с данными пользователя
 */
export interface GetUserResponseDTO extends UserWithProfileDTO {}

/**
 * Запрос на создание пользователя
 */
export interface CreateUserRequestDTO {
  /** Имя пользователя */
  username: string;
  /** Пароль */
  password: string;
  /** Активен ли аккаунт (по умолчанию true) */
  active?: boolean;
  /** Данные профиля */
  profile?: {
    /** Имя */
    first_name?: string;
    /** Фамилия */
    second_name?: string;
    /** Отчество */
    middle_name?: string;
    /** Телефон */
    phone?: string;
    /** Email */
    email?: string;
    /** Группа */
    group?: string;
    /** VK ID */
    vk_id?: string;
    /** Telegram ID */
    telegram_id?: string;
  };
}

/**
 * Ответ на создание пользователя
 */
export interface CreateUserResponseDTO extends UserWithProfileDTO {}

/**
 * Запрос на обновление пользователя
 */
export interface PatchUserRequestDTO {
  /** Имя пользователя */
  username?: string;
  /** Пароль */
  password?: string;
  /** Активен ли аккаунт */
  active?: boolean;
  /** Данные профиля для обновления */
  profile?: {
    /** Имя */
    first_name?: string;
    /** Фамилия */
    second_name?: string;
    /** Отчество */
    middle_name?: string;
    /** Телефон */
    phone?: string;
    /** Email */
    email?: string;
    /** Группа */
    group?: string;
    /** VK ID */
    vk_id?: string;
    /** Telegram ID */
    telegram_id?: string;
  };
}

/**
 * Ответ на обновление пользователя
 */
export interface PatchUserResponseDTO extends UserWithProfileDTO {}

/**
 * Запрос на удаление пользователя
 */
export interface DeleteUserRequestDTO {
  /** ID пользователя */
  id: string;
}

/**
 * Ответ на удаление пользователя (обычно 204 No Content)
 */
export interface DeleteUserResponseDTO {
  // Пустой ответ
}

// ==================== Posts API ====================

/**
 * Запрос списка постов
 */
export interface GetPostsRequestDTO {
  // В будущем можно добавить фильтры по статусу, типу и т.д.
}

/**
 * Ответ со списком постов (краткая информация)
 */
export interface GetPostsResponseDTO {
  /** Список постов */
  posts: Array<
    PostDTO & {
      /** Текст поста */
      text?: PostTextDTO;
      /** Теги */
      tags: PostTagDTO[];
      /** Первое фото для превью */
      photos: PostPhotoDTO[];
    }
  >;
}

/**
 * Запрос поста по ID
 */
export interface GetPostRequestDTO {
  /** ID поста */
  id: string;
}

/**
 * Ответ с полной информацией о посте
 */
export interface GetPostResponseDTO extends PostDetailedDTO {}

/**
 * Запрос на создание поста
 */
export interface CreatePostRequestDTO {
  /** Статус публикации */
  status: PostStatusDTO;
  /** Тип поста */
  type: PostTypeDTO;
  /** Дата публикации (опционально, по умолчанию - текущая) */
  publication_date?: string;
  /** Текстовое содержимое */
  text?: string;
  /** Теги (массив строк) */
  tags?: string[];
  /** Ссылки на фотографии */
  photos?: string[];
  /** Ссылки на видео */
  videos?: string[];
  /** Локации публикации */
  locations?: Array<{
    /** Дата публикации в локации */
    publication_date?: string;
    /** Статус в локации */
    status?: PostStatusDTO;
    /** Тип локации */
    type: PostLocationTypeDTO;
    /** Внешний ID */
    external_id?: string;
  }>;
  /** Опрос */
  survey?: {
    /** Тип опроса */
    type: SurveyTypeDTO;
    /** Варианты ответов */
    answers: Array<{
      /** Текст ответа */
      text: string;
      /** Порядковый номер (опционально) */
      index?: number;
    }>;
  };
  /** Авторы контента */
  authors?: Array<{
    /** ID пользователя */
    user_id: string;
    /** Тип авторства */
    type: PostAuthorTypeDTO;
  }>;
}

/**
 * Ответ на создание поста
 */
export interface CreatePostResponseDTO extends PostDetailedDTO {}

/**
 * Запрос на обновление поста
 */
export interface PatchPostRequestDTO {
  /** Статус публикации */
  status?: PostStatusDTO;
  /** Тип поста */
  type?: PostTypeDTO;
  /** Дата публикации */
  publication_date?: string;
  /** Текстовое содержимое */
  text?: string;
  /** Теги (полностью заменяет существующие) */
  tags?: string[];
  /** Фотографии (полностью заменяет существующие) */
  photos?: string[];
  /** Видео (полностью заменяет существующие) */
  videos?: string[];
}

/**
 * Ответ на обновление поста
 */
export interface PatchPostResponseDTO extends PostDetailedDTO {}

/**
 * Запрос на удаление поста
 */
export interface DeletePostRequestDTO {
  /** ID поста */
  id: string;
}

/**
 * Ответ на удаление поста (обычно 204 No Content)
 */
export interface DeletePostResponseDTO {
  // Пустой ответ
}
