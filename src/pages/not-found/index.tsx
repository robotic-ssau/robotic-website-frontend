import type { AppRouteMeta } from '@/shared/routing/types';
import type { Role } from '@/entities/user';

export function NotFoundPage() {
  return (
    <div>
      <h1>404</h1>
      <p>Страница не найдена.</p>
    </div>
  );
}
export default NotFoundPage;

export const notFoundRouteMeta: AppRouteMeta<Role> = {
  path: '*',
  key: 'not-found',
  title: 'Страница не найдена',
  requiredRoles: undefined,
  showInMainNav: false,
  element: <NotFoundPage />,
};
