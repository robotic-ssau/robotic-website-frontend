import type { AppRouteMeta } from '@/shared/routing/types';
import { ROLES, type Role } from '@/entities/user';

export function LabPage() {
  return (
    <div>
      <h1>Лаборатория</h1>
      <p>Доступно для ролей Council или Admin.</p>
    </div>
  );
}
export default LabPage;

export const labRouteMeta: AppRouteMeta<Role> = {
  path: '/lab',
  key: 'lab',
  title: 'Лаборатория',
  requiredRoles: [ROLES.COUNCIL, ROLES.ADMIN, ROLES.SMM, ROLES.OWNER],
  showInMainNav: true,
  element: <LabPage />,
};
