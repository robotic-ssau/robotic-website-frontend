import { useCallback } from 'react';
import { useUserStore, type Role } from '@/entities/user';

/**
 * Проверяет доступ пользователя по ролям.
 *
 * Хук работает в двух режимах:
 *
 * 1️⃣ Если передан массив `requiredRoles` — сразу возвращает `boolean`,
 *    показывающий, есть ли у пользователя хотя бы одна из указанных ролей.
 *
 * 2️⃣ Если аргументы не переданы — возвращает мемоизированную функцию
 *    проверки доступа `(roles) => boolean`. Эта функция будет обновляться
 *    только при изменении пользователя или его ролей.
 *
 * Неавторизованный пользователь автоматически получает роль `Guest`.
 *
 * @example
 * // Прямой способ проверки
 * const canViewAdmin = useAccess(['ADMIN', 'SUPERADMIN']);
 *
 * @example
 * // Получить функцию для многократных проверок
 * const hasAccess = useAccess();
 *
 * const canEdit = hasAccess(['EDITOR']);
 * const canDelete = hasAccess(['ADMIN']);
 *
 * @param requiredRoles - Роли, наличие хотя бы одной из которых даёт доступ.
 *
 * @returns
 * Если `requiredRoles` переданы — `boolean`, результат проверки доступа.
 *
 * Если аргументы не переданы — функция `(roles: string[]) => boolean`,
 * позволяющая проверять доступ для разных наборов ролей.
 */

export function useAccess(requiredRoles: Role[]): boolean;
export function useAccess(): (roles: Role[]) => boolean;
export function useAccess(requiredRoles?: Role[]) {
  // Подписываемся только на user — чтобы компонент пересчитывался, когда меняется user.
  const effectiveRoles = useUserStore((state) => state.getEffectiveRoles());

  // Если роли не переданы — возвращаем мемоизированную функцию,
  // которая обновляется при изменении effectiveRoles.
  const hasAccessFor = useCallback(
    (roles: Role[]) => roles.some((role) => effectiveRoles.includes(role as Role)),
    [effectiveRoles],
  );

  // Если роли переданы — возвращаем булево значение (быстрая проверка).
  if (Array.isArray(requiredRoles)) {
    return hasAccessFor(requiredRoles);
  }

  return hasAccessFor;
}
