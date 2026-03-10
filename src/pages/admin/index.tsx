import { lazy } from 'react';

import type { AppRouteMeta } from '@/shared/routing/types';
import { ROLES, type Role } from '@/entities/user';

const AdminPage = lazy(() => import('./admin-page'));

export const adminRouteMeta: AppRouteMeta<Role> = {
  path: '/admin',
  key: 'admin',
  title: 'Админка',
  requiredRoles: [ROLES.ADMIN, ROLES.OWNER],
  showInMainNav: true,
  element: <AdminPage />,
};
