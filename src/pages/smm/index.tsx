import { lazy } from 'react';

import type { AppRouteMeta } from '@/shared/routing/types';
import { ROLES, type Role } from '@/entities/user';

const SMMPage = lazy(() => import('./smm-page'));

export const smmRouteMeta: AppRouteMeta<Role> = {
  path: '/smm',
  key: 'smm',
  title: 'SMM',
  requiredRoles: [ROLES.SMM, ROLES.ADMIN, ROLES.OWNER],
  showInMainNav: true,
  element: <SMMPage />,
};
