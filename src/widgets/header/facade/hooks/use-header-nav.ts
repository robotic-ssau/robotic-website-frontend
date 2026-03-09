import { useMemo } from 'react';
import { useUserStore } from '@/entities/user';
import type { UseHeaderNavParams, UseHeaderNavResult } from '../types';

export function useHeaderNav({ routesMeta, pathname }: UseHeaderNavParams): UseHeaderNavResult {
  const isAuthenticated = useUserStore((s) => s.isAuthenticated);
  const user = useUserStore((s) => s.user);
  const effectiveRoles = useUserStore((s) => s.getEffectiveRoles());

  const navItems = useMemo(() => {
    if (!routesMeta) return [];

    return routesMeta
      .filter((meta) => {
        if (!meta.showInMainNav) return false;

        if (meta.requiredRoles && meta.requiredRoles.length > 0) {
          return meta.requiredRoles.some((role) => effectiveRoles.includes(role));
        }

        return true;
      })
      .map((meta) => ({
        key: meta.key,
        title: meta.title,
        path: meta.path,
        meta,
      }));
  }, [routesMeta, effectiveRoles]);

  const activeKey = useMemo(() => {
    if (!pathname || navItems.length === 0) return '';

    const matched = navItems.find(({ meta }) => {
      if (meta.isActive) {
        return meta.isActive(pathname);
      }

      if (!meta.path) {
        return false;
      }

      if (meta.path === '/') {
        return pathname === '/';
      }

      return pathname === meta.path || pathname.startsWith(`${meta.path}/`);
    });

    return matched?.key ?? '';
  }, [pathname, navItems]);

  return {
    navItems,
    activeKey,
    isAuthenticated,
    user,
  };
}
