import type { AppRouteMeta } from '@/shared/routing/types';
import { ROLES, type Role } from '@/entities/user';

export function SMMPage() {
  return (
    <div>
      <h1>SMM</h1>
      <p>SMM страница клуба</p>
    </div>
  );
}
export default SMMPage;

export const smmRouteMeta: AppRouteMeta<Role> = {
  path: '/smm',
  key: 'smm',
  title: 'SMM',
  requiredRoles: [ROLES.SMM, ROLES.ADMIN, ROLES.OWNER],
  showInMainNav: true,
  element: <SMMPage />,
};
