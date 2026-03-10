import { lazy } from 'react';

import type { AppRouteMeta } from '@/shared/routing/types';
import { ROLES, type Role } from '@/entities/user';
import { DEFAULT_AUTH_ROUTES_CONFIG } from '@/shared/routing';

const ProfilePage = lazy(() => import('./profile-page'));

export const profileRouteMeta: AppRouteMeta<Role> = {
  path: DEFAULT_AUTH_ROUTES_CONFIG.profilePath,
  key: 'profile',
  title: 'Профиль',
  requiredRoles: [ROLES.USER, ROLES.COUNCIL, ROLES.ADMIN, ROLES.OWNER, ROLES.SMM],
  showInMainNav: false,
  element: <ProfilePage />,
};
