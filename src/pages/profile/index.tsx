import type { AppRouteMeta } from '@/shared/routing/types';
import { ROLES, type Role } from '@/entities/user';

export function ProfilePage() {
  return (
    <div>
      <h1>Профиль</h1>
      <p>Страница профиля доступна только пользователям с ролью User и выше.</p>
    </div>
  );
}
export default ProfilePage;

export const profileRouteMeta: AppRouteMeta<Role> = {
  path: '/profile',
  key: 'profile',
  title: 'Профиль',
  requiredRoles: [ROLES.USER, ROLES.COUNCIL, ROLES.ADMIN, ROLES.OWNER, ROLES.SMM],
  showInMainNav: true,
  element: <ProfilePage />,
};
