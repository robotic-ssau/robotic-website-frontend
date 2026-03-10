import { lazy } from 'react';

import type { AppRouteMeta } from '@/shared/routing/types';
import { ROLES, type Role } from '@/entities/user';

const LabPage = lazy(() => import('./lab-page'));

export const labRouteMeta: AppRouteMeta<Role> = {
  path: '/lab',
  key: 'lab',
  title: 'Лаборатория',
  requiredRoles: [ROLES.COUNCIL, ROLES.ADMIN, ROLES.SMM, ROLES.OWNER],
  showInMainNav: true,
  element: <LabPage />,
};
