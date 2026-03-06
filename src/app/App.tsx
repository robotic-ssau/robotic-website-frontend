import { AccessGuard } from '@/features/access';
import { ROLES } from '@/entities/user';

function App() {
  return (
    <div>
      <h1>Портал клуба</h1>
      <AccessGuard roles={[ROLES.USER]}>
        <p>Доступно только пользователям с ролью User и выше.</p>
      </AccessGuard>
      <AccessGuard roles={[ROLES.ADMIN, ROLES.OWNER]} fallback={<p>Нет прав админа.</p>}>
        <p>Панель администратора</p>
      </AccessGuard>
    </div>
  );
}

export default App;
