import type { AppRouteMeta } from '@/shared/routing/types';
import type { Role } from '@/entities/user';
import type { AuthRoutesConfig } from '@/shared/routing/auth-routes';

export type AppHeaderVariant = 'full' | 'minimal';

export interface AppHeaderProps {
  /** full — меню навигации и юзер/кнопка «Войти», minimal — только логотип, заголовок и переключатель темы */
  variant?: AppHeaderVariant;
  /**
   * Метаданные маршрутов для основного layout-а.
   * Используются для построения навигационного меню и определения доступности пунктов по ролям.
   */
  routesMeta?: AppRouteMeta<Role>[];
  /**
   * Текущий pathname из роутера.
   * Нужен для определения активного пункта меню.
   */
  pathname?: string;
  /**
   * Контракт с путями auth-маршрутов (login/profile), чтобы не хардкодить их на уровне виджета.
   */
  authRoutes?: AuthRoutesConfig;
}
