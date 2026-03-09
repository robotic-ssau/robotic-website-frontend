import { matchPath } from 'react-router-dom';

import { AppRouteMeta } from './types';

export function matchRouteMeta<RoleType>(
  pathname: string,
  routes: AppRouteMeta<RoleType>[],
): AppRouteMeta<RoleType> | undefined {
  return routes.find((route) => {
    if (route.isActive) {
      return route.isActive(pathname);
    }

    if (route.matchPathPattern) {
      return matchPath({ path: route.matchPathPattern, end: false }, pathname);
    }

    if (route.path) {
      return pathname === route.path || pathname.startsWith(route.path);
    }

    return false;
  });
}
