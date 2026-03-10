import type { AppRouteMeta } from '@/shared/routing/types';
import type { Role } from '@/entities/user';

import { loginRouteMeta } from '@/pages/login-page';
import { postsRouteMeta } from '@/pages/posts-page';
import { profileRouteMeta } from '@/pages/profile';
import { adminRouteMeta } from '@/pages/admin';
import { labRouteMeta } from '@/pages/lab';
import { forbiddenRouteMeta } from '@/pages/forbidden';
import { notFoundRouteMeta } from '@/pages/not-found';
import { aboutClubRouteMeta } from '@/pages/about-club';
import { personalitiesRouteMeta } from '@/pages/personalities';
import { contactsRouteMeta } from '@/pages/contacts';
import { smmRouteMeta } from '@/pages/smm';

export type AppRouteMetaWithRole = AppRouteMeta<Role>;

export const authLayoutRoutesMeta: AppRouteMetaWithRole[] = [loginRouteMeta];

export const mainLayoutRoutesMeta: AppRouteMetaWithRole[] = [
  postsRouteMeta,
  profileRouteMeta,
  aboutClubRouteMeta,
  personalitiesRouteMeta,
  contactsRouteMeta,
  labRouteMeta,
  smmRouteMeta,
  adminRouteMeta,

  forbiddenRouteMeta,
  notFoundRouteMeta,
];

export const ALL_ROUTES_META: AppRouteMetaWithRole[] = [
  loginRouteMeta,

  postsRouteMeta,
  profileRouteMeta,
  aboutClubRouteMeta,
  personalitiesRouteMeta,
  contactsRouteMeta,
  labRouteMeta,
  smmRouteMeta,
  adminRouteMeta,

  forbiddenRouteMeta,
  notFoundRouteMeta,
];
