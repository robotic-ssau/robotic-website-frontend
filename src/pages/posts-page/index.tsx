import { lazy } from 'react';

import type { AppRouteMeta } from '@/shared/routing/types';
import type { Role } from '@/entities/user';

const PostsPage = lazy(() => import('./posts-page'));

export const postsRouteMeta: AppRouteMeta<Role> = {
  path: '/posts',
  key: 'posts',
  title: 'Новости',
  showInMainNav: true,
  element: <PostsPage />,
};
