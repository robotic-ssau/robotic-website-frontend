import type { AppRouteMeta } from '@/shared/routing/types';
import type { Role } from '@/entities/user';

export function ForbiddenPage() {
  return (
    <div>
      <h1>403</h1>
      <p>Нет прав доступа к этой странице.</p>
    </div>
  );
}
export default ForbiddenPage;

export const forbiddenRouteMeta: AppRouteMeta<Role> = {
  path: '/403',
  key: 'forbidden',
  title: 'Доступ запрещён',
  requiredRoles: undefined,
  showInMainNav: false,
  element: <ForbiddenPage />,
};
