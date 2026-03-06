# Роутинг и защита маршрутов

## Структура файлов

- Провайдер роутинга: `src/app/providers/router/router-provider.tsx`
- Экспорт роутера: `src/app/providers/router/index.ts`
- Layout по умолчанию: `src/app/layouts/main-layout.tsx`
- Страницы:
  - `/` (главная): `src/app/App.tsx`
  - `/login`: `src/pages/login.tsx`
  - `/profile`: `src/pages/profile.tsx`
  - `/admin`: `src/pages/admin.tsx`
  - `/lab`: `src/pages/lab.tsx`
  - `/403`: `src/pages/forbidden.tsx`
  - `*` (404): `src/pages/not-found.tsx`
- Доступ по ролям:
  - Хранилище пользователя: `src/entities/user/model/store.ts`
  - Константы ролей: `src/entities/user/model/roles.ts`
  - Хук доступа: `src/features/access/model/use-access.ts`
  - Обёртка для UI по ролям: `src/features/access/ui/access-guard.tsx`
  - **ProtectedRoute для роутера**: `src/features/access/ui/protected-route.tsx`

## Конфигурация маршрутов

Базовая конфигурация маршрутов описана в `routesConfig` внутри `router-provider.tsx` и поддерживает дополнительное поле `requiredRoles`:

```tsx
type AppRouteObject = RouteObject & {
  requiredRoles?: Role[];
};
```

Пример конфигурации (упрощённо):

```tsx
const routesConfig: AppRouteObject[] = [
  { path: '/login', element: <LoginPage /> },
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <App /> },
      {
        path: 'profile',
        element: <ProfilePage />,
        requiredRoles: [ROLES.USER],
      },
      // ...
    ],
  },
];
```

Помощник `wrapWithProtectedRoute` оборачивает все маршруты с `requiredRoles` в `ProtectedRoute`, поэтому минимально достаточно указать `requiredRoles` в конфиге.

## Добавление нового защищённого маршрута

1. Создать/подключить страницу, например `src/pages/reports.tsx`.
2. Добавить элемент в `routesConfig`:

```tsx
{
  path: 'reports',
  element: <ReportsPage />,
  requiredRoles: [ROLES.ADMIN],
}
```

3. Маршрут автоматически будет защищён `ProtectedRoute`, логика:
   - гость → редирект на `/login`;
   - авторизован без нужных ролей → редирект на `/403`;
   - есть нужная роль → отрисовка `ReportsPage`.

## Как работает `ProtectedRoute`

`ProtectedRoute` находится в `src/features/access/ui/protected-route.tsx` и использует `useUserStore`:

- читает `isAuthenticated` и метод `checkAccess` из стора пользователя;
- для гостей делает:

```tsx
<Navigate to="/login" replace state={{ from: location }} />
```

- при отсутствии прав делает:

```tsx
<Navigate to="/403" replace />
```

Таким образом, страница логина получает информацию о том, откуда пришёл пользователь.

## Редирект после логина

На странице логина (`src/pages/login.tsx`) уже есть заготовка:

- с помощью `useLocation` читается `state.from`, переданный из `ProtectedRoute`;
- вычисляется `fromPath` (по умолчанию `'/'`).

Пример интеграции (псевдокод, см. TODO в файле):

```tsx
const location = useLocation() as { state?: { from?: Location } };
const fromPath = location.state?.from ? (location.state.from as Location).pathname : '/';

const navigate = useNavigate();

const handleSuccess = () => {
  // TODO: вызвать setUser(...) из useUserStore после успешного локального API-вызова
  navigate(fromPath, { replace: true });
};
```

**Важно:** здесь нужно руками подставить ваш реальный вызов локального API и логику записи пользователя в `useUserStore.setUser`.

## Пример использования `ProtectedRoute` вручную

Если нужно обернуть страницу без изменения конфига, можно использовать `ProtectedRoute` напрямую:

```tsx
import { ProtectedRoute } from '@/features/access';
import { ROLES } from '@/entities/user';

export function ReportsRoute() {
  return (
    <ProtectedRoute requiredRoles={[ROLES.ADMIN, ROLES.OWNER]}>
      <ReportsPage />
    </ProtectedRoute>
  );
}
```

Однако для основных страниц предпочтительно указывать `requiredRoles` прямо в `routesConfig`.
