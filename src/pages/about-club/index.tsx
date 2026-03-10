import { lazy } from 'react';

import { AppRouteMeta } from '@/shared/routing';
import { Role } from '@/entities/user';

const AboutClubPage = lazy(() => import('./about-club'));

export const aboutClubRouteMeta: AppRouteMeta<Role> = {
  path: '/about',
  key: 'about',
  title: 'О клубе',
  requiredRoles: undefined,
  showInMainNav: true,
  element: <AboutClubPage />,
};
