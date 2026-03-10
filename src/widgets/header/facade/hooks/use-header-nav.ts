import { useMemo } from 'react';
import { useUserStore } from '@/entities/user';
import { useAccess } from '@/features/access';

import type { UseHeaderNavParams, UseHeaderNavResult } from '../types';
import { matchRouteMeta } from '@/shared/routing';

export function useHeaderNav({ routesMeta, pathname }: UseHeaderNavParams): UseHeaderNavResult {
  const isAuthenticated = useUserStore((s) => s.isAuthenticated);
  const user = useUserStore((s) => s.user);

  const checkAccess = useAccess();

  const navItems = useMemo(() => {
    if (!routesMeta) return [];

    return routesMeta
      .filter((meta) => {
        if (!meta.showInMainNav) return false;

        if (meta.requiredRoles && meta.requiredRoles.length > 0) {
          return checkAccess(meta.requiredRoles);
        }

        return true;
      })
      .map((meta) => ({
        key: meta.key,
        title: meta.title,
        path: meta.path,
        meta,
      }));
  }, [routesMeta, checkAccess]);

  const activeKey = useMemo(() => {
    if (!pathname || !routesMeta || routesMeta.length === 0) return '';

    const matched = matchRouteMeta(pathname, routesMeta);

    if (!matched) return '';
    return matched.key;
  }, [pathname, routesMeta]);

  return {
    navItems,
    activeKey,
    isAuthenticated,
    user,
  };
}
