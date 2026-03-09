import type { PaginationMetaDTO } from '../types.js';

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 10;
const MAX_PAGE_SIZE = 100;

/**
 * Нормализует и парсит query-параметры page и pageSize из строк (Express req.query).
 */
export function parsePageParams(
  pageStr: string | undefined,
  pageSizeStr: string | undefined,
): { page: number; pageSize: number } {
  const page = Math.max(1, parseInt(String(pageStr), 10) || DEFAULT_PAGE);
  const rawPageSize = parseInt(String(pageSizeStr), 10) || DEFAULT_PAGE_SIZE;
  const pageSize = Math.max(1, Math.min(MAX_PAGE_SIZE, rawPageSize));
  return { page, pageSize };
}

/**
 * Применяет пагинацию к массиву: возвращает срез и метаданные.
 */
export function paginate<T>(
  arr: T[],
  page: number,
  pageSize: number,
): { data: T[]; meta: PaginationMetaDTO } {
  const total = arr.length;
  const start = (page - 1) * pageSize;
  const data = arr.slice(start, start + pageSize);
  return {
    data,
    meta: { total, page, pageSize },
  };
}
