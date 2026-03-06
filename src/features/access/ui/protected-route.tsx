import type { ReactNode } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { useUserStore } from '@/entities/user';
import type { Role } from '@/entities/user';

export interface ProtectedRouteProps {
  /** Роли, наличие хотя бы одной даёт доступ к маршруту */
  requiredRoles: Role[];
  /** Целевая страница/разметка */
  children: ReactNode;
}

/**
 * Высокоуровневая защита маршрута по ролям.
 *
 * Поведение:
 * - Гость → редирект на /login с сохранением location в state.from
 * - Авторизован, но нет requiredRoles → редирект на /403
 * - Иначе → отрисовывает children
 */
export function ProtectedRoute({ requiredRoles, children }: ProtectedRouteProps) {
  const location = useLocation();

  const isAuthenticated = useUserStore((s) => s.isAuthenticated);
  const checkAccess = useUserStore((s) => s.checkAccess);

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const hasAccess = checkAccess(requiredRoles);

  if (!hasAccess) {
    return (
      <div>
        <h2>Нет доступа</h2>
        <p>У вас нет необходимых прав для просмотра этой страницы.</p>
        <Link to="/">На главную</Link>
      </div>
    );
  }

  return children;
}
