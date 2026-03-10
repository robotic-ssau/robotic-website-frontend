/**
 * Ролевая модель портала клуба (часть сущности User).
 * Порядок не влияет на иерархию — проверка через checkAccess(requiredRoles).
 */
export const ROLES = {
  /** Неавторизованный: только лента и инфо */
  GUEST: 'Guest',
  /** Пользователь: свой профиль */
  USER: 'User',
  /** Совет: статус лаборатории, экспорт SMM */
  COUNCIL: 'Council',
  /** SMM мэнеджер */
  SMM: 'Smm',
  /** Админ: управление всеми юзерами */
  ADMIN: 'Admin',
  /** Владелец: все права админа + иммунитет к удалению */
  OWNER: 'Owner',
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

/** Роли, требующие авторизации (не Guest) */
export const AUTH_ROLES: Role[] = [ROLES.USER, ROLES.COUNCIL, ROLES.ADMIN, ROLES.OWNER];
