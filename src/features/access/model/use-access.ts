import { useUserStore, ROLES, type Role } from '@/entities/user';

/**
 * Эффективные роли текущего пользователя: авторизованный — свои роли, гость — [Guest].
 */
function getEffectiveRoles(user: { roles: Role[] } | null): Role[] {
  return user?.roles?.length ? user.roles : [ROLES.GUEST];
}

/**
 * Хук проверки доступа по ролям (реактивный).
 * Неавторизованный пользователь считается с ролью Guest (лента, инфо).
 * @param requiredRoles — массив ролей, наличие хотя бы одной даёт доступ
 * @returns hasAccess — true, если у пользователя есть подходящая роль
 */
export function useAccess(requiredRoles: string[]): boolean {
  return useUserStore((state) => {
    const effectiveRoles = getEffectiveRoles(state.user);
    return requiredRoles.some((role) => effectiveRoles.includes(role as Role));
  });
}
