import { lazy } from 'react';

import type { AppRouteMeta } from '@/shared/routing/types';
import { type Role } from '@/entities/user';

const ContactsPage = lazy(() => import('./contacts-page'));

export const contactsRouteMeta: AppRouteMeta<Role> = {
  path: '/contacts',
  key: 'contacts',
  title: 'Контакты',
  requiredRoles: undefined,
  showInMainNav: true,
  element: <ContactsPage />,
};
