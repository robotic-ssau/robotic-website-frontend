import { lazy } from 'react';

import type { AppRouteMeta } from '@/shared/routing/types';
import type { Role } from '@/entities/user';

const NotFoundPage = lazy(() => import('./not-found-page'));

export const notFoundRouteMeta: AppRouteMeta<Role> = {
  path: '*',
  key: 'not-found',
  title: 'Страница не найдена',
  requiredRoles: undefined,
  showInMainNav: false,
  element: <NotFoundPage />,
};
