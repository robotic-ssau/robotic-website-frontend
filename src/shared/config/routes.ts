/**
 * Пути, требующие авторизации (защищённые маршруты).
 * При добавлении новых защищённых страниц — дополнять массив.
 */
export const PROTECTED_PATHS = ['/profile', '/admin', '/lab'];

/**
 * Проверяет, является ли путь защищённым (требующим авторизации).
 */
export function isProtectedPath(pathname: string): boolean {
  return PROTECTED_PATHS.some((path) => pathname.startsWith(path));
}
