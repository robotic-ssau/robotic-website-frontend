// Re-export all DTO types from shared folder

// Internal database types (используются только внутри mock-сервера)
import type {
  UserDTO,
  RoleDTO,
  UserRoleDTO,
  ProfileDTO,
  PostDTO,
  PostTagDTO,
  PostPhotoDTO,
  PostVideoDTO,
  PostTextDTO,
  PostLocationDTO,
  PostSurveyDTO,
  SurveyAnswerDTO,
  PostAuthorDTO,
} from '@shared-types';

/** Ответ API с ошибкой (4xx, 5xx) */
export interface ApiErrorDTO {
  error: string;
  message: string;
}

// Database schema type (internal, not exposed to frontend)
export interface Database {
  users: UserDTO[];
  roles: RoleDTO[];
  user_roles: UserRoleDTO[];
  profiles: ProfileDTO[];
  posts: PostDTO[];
  post_tags: PostTagDTO[];
  post_photos: PostPhotoDTO[];
  post_videos: PostVideoDTO[];
  post_texts: PostTextDTO[];
  post_locations: PostLocationDTO[];
  post_surveys: PostSurveyDTO[];
  survey_answers: SurveyAnswerDTO[];
  post_authors: PostAuthorDTO[];
}

export * from '@shared-types';
