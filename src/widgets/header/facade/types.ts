import type { AppRouteMeta } from '@/shared/routing/types';
import type { Role, User } from '@/entities/user';

export interface HeaderNavItem {
  key: string;
  title: string;
  path: string;
  meta: AppRouteMeta<Role>;
}

export interface UseHeaderNavParams {
  routesMeta?: AppRouteMeta<Role>[];
  pathname?: string;
}

export interface UseHeaderNavResult {
  navItems: HeaderNavItem[];
  activeKey: string;
  isAuthenticated: boolean;
  user: User | null;
}
