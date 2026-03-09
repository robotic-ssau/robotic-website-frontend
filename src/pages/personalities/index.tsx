import type { AppRouteMeta } from '@/shared/routing/types';
import { type Role } from '@/entities/user';

export function PersonalitiesPage() {
  return (
    <div>
      <h1>Личности</h1>
      <p>Раздел о ключевых участниках и лидерах клуба.</p>
    </div>
  );
}

export default PersonalitiesPage;

export const personalitiesRouteMeta: AppRouteMeta<Role> = {
  path: '/personalities',
  key: 'personalities',
  title: 'Личности',
  requiredRoles: undefined,
  showInMainNav: true,
  element: <PersonalitiesPage />,
};
