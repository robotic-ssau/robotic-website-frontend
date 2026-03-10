import { lazy } from 'react';

import type { AppRouteMeta } from '@/shared/routing/types';
import { type Role } from '@/entities/user';

const PersonalitiesPage = lazy(() => import('./personalities-page'));

export const personalitiesRouteMeta: AppRouteMeta<Role> = {
  path: '/personalities',
  key: 'personalities',
  title: 'Личности',
  requiredRoles: undefined,
  showInMainNav: true,
  element: <PersonalitiesPage />,
};
