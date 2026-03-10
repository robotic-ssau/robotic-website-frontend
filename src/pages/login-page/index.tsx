import { lazy } from 'react';

import type { AppRouteMeta } from '@/shared/routing/types';
import { type Role } from '@/entities/user';
import { DEFAULT_AUTH_ROUTES_CONFIG } from '@/shared/routing';

const LoginPage = lazy(() => import('./login-page'));

export const loginRouteMeta: AppRouteMeta<Role> = {
  path: DEFAULT_AUTH_ROUTES_CONFIG.loginPath,
  key: 'login',
  title: 'Вход',
  requiredRoles: undefined,
  showInMainNav: false,
  element: <LoginPage />,
};
