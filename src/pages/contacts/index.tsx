import type { AppRouteMeta } from '@/shared/routing/types';
import { type Role } from '@/entities/user';

export function ContactsPage() {
  return (
    <div>
      <h1>Контакты</h1>
      <p>Здесь будут контактные данные и способы связи с клубом.</p>
    </div>
  );
}

export default ContactsPage;

export const contactsRouteMeta: AppRouteMeta<Role> = {
  path: '/contacts',
  key: 'contacts',
  title: 'Контакты',
  requiredRoles: undefined,
  showInMainNav: true,
  element: <ContactsPage />,
};
