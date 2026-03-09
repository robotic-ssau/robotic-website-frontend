import type { AppRouteMeta } from '@/shared/routing/types';
import { type Role } from '@/entities/user';

export function AboutClubPage() {
  return (
    <div>
      <h1>О клубе</h1>
      <p>Информация о клубе, его миссии и активности.</p>
    </div>
  );
}

export default AboutClubPage;

export const aboutClubRouteMeta: AppRouteMeta<Role> = {
  path: '/about',
  key: 'about',
  title: 'О клубе',
  requiredRoles: undefined,
  showInMainNav: true,
  element: <AboutClubPage />,
};
