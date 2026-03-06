import type { ReactNode } from 'react';
import { useAccess } from '../model/use-access';

export interface AccessGuardProps {
  /** Роли, при наличии хотя бы одной — контент показывается */
  roles: string[];
  /** Контент при наличии доступа */
  children: ReactNode;
  /** Опциональная заглушка при отсутствии доступа */
  fallback?: ReactNode;
}

/**
 * Обёртка для условного отображения UI по ролям.
 * Скрывает children, если у пользователя нет ни одной из переданных ролей.
 */
export function AccessGuard({ roles, children, fallback = null }: AccessGuardProps) {
  const hasAccess = useAccess(roles);

  return hasAccess ? children : fallback;
}
