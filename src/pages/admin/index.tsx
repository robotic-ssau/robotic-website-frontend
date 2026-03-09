import type { AppRouteMeta } from '@/shared/routing/types';
import { ROLES, type Role } from '@/entities/user';

export function AdminPage() {
  return (
    <div>
      <h1>Админ-панель</h1>
      <p>Доступно только для ролей Admin или Owner.</p>
    </div>
  );
}
export default AdminPage;

export const adminRouteMeta: AppRouteMeta<Role> = {
  path: '/admin',
  key: 'admin',
  title: 'Админка',
  requiredRoles: [ROLES.ADMIN, ROLES.OWNER],
  showInMainNav: true,
  element: <AdminPage />,
};
