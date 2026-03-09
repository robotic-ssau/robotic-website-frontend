import type { ReactNode } from 'react';
import { RouteObject } from 'react-router-dom';

export type AppRouteMeta<RoleType = unknown> = {
  key: string;
  path: string;
  title: string;
  /**
   * Является ли маршрут индексным (используется для редиректов по умолчанию).
   */
  index?: boolean;
  /**
   * Маршрут относится к какому layout-у.
   * Можно использовать для группировки в агрегаторе.
   */
  layout?: 'auth' | 'main';
  /**
   * Показывать ли пункт в основном меню навигации.
   */
  showInMainNav?: boolean;
  /**
   * Роли, которым доступен маршрут.
   * Конкретный тип роли задаётся дженериком при использовании (например, Role из entities/user).
   */
  requiredRoles?: RoleType[];
  /**
   * Необязательный шаблон для матчинга пути (например, для динамических страниц).
   */
  matchPathPattern?: string;
  /**
   * Кастомная функция определения активности маршрута по pathname.
   * Может использоваться для сложных/динамических маршрутов.
   */
  isActive?: (pathname: string) => boolean;
  /**
   * React-элемент страницы, который должен быть отрисован для данного маршрута.
   * Используется роутером, но не обязателен для всех сценариев (например, для сугубо служебных записей).
   */
  element?: ReactNode;
};

export type AppRouteConfig<RoleType = unknown> = RouteObject & {
  children?: AppRouteConfig<RoleType>[];
  requiredRoles?: RoleType[];
};
