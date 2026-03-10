import { lazy } from 'react';

import type { AppRouteMeta } from '@/shared/routing/types';
import type { Role } from '@/entities/user';

const ForbiddenPage = lazy(() => import('./forbidden-page'));

export const forbiddenRouteMeta: AppRouteMeta<Role> = {
  path: '/403',
  key: 'forbidden',
  title: 'Доступ запрещён',
  requiredRoles: undefined,
  showInMainNav: false,
  element: <ForbiddenPage />,
};
