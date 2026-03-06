# Архитектура проекта (Feature-Sliced Design)

## Структура папок

```
src/
├── app/                    # Инициализация приложения
│   ├── providers/          # Провайдеры (Query, Router, Theme)
│   ├── App.tsx
│   └── index.tsx
├── pages/                  # Страницы (композиция widgets/features)
├── widgets/                # Составные блоки страниц
├── features/               # Фичи с бизнес-логикой
│   └── access/             # Доступ по ролям: AccessGuard, useAccess
├── entities/               # Бизнес-сущности
│   └── user/               # Пользователь: типы, store (Zustand)
├── shared/                 # Переиспользуемый код
│   ├── api/                # HTTP-клиент, TanStack Query, инстансы под микросервисы
│   ├── lib/                # Утилиты, общие константы
│   └── ui/                 # UI-кит (при необходимости)
```

## Слои и зависимости

- **app** — точка входа, провайдеры.
- **pages** — используют widgets, features, entities.
- **widgets** — используют features, entities, shared.
- **features** — используют entities, shared.
- **entities** — используют shared.
- **shared** — без зависимостей от других слоёв.

Импорты только «вниз»: из `pages` в `shared` можно, из `shared` в `entities` — нельзя.

## Ключевые модули

### entities/user

- **model/roles.ts** — ролевая модель: `ROLES`, `Role`, `AUTH_ROLES` (бизнес-данные сущности).
- **model/types.ts** — `User`, `UserState`.
- **model/store.ts** — Zustand-хранилище: `user`, `isAuthenticated`, `setUser`, `logout`, `checkAccess(requiredRoles)`.

### shared/api

- **base-client.ts** — фабрика Axios с `baseURL`, `timeout`, опциональным `getAccessToken`.
- **instances.ts** — инстансы под сервисы (auth, users, feed, lab, smm), `getApiClient(service)`.
- **query-client.ts** — общий `QueryClient` для TanStack Query.

### features/access

- **ui/access-guard.tsx** — `<AccessGuard roles={[]} fallback={}>` для условного рендера по ролям.
- **model/use-access.ts** — хук `useAccess(requiredRoles)` → `boolean`.

## Ролевая модель

| Роль    | Описание                                |
| ------- | --------------------------------------- |
| Guest   | Неавторизованный: только лента и инфо.  |
| User    | Свой профиль.                           |
| Council | Статус лаборатории, экспорт SMM.        |
| Admin   | Управление всеми пользователями.        |
| Owner   | Все права Admin + иммунитет к удалению. |

Проверка: «хотя бы одна из переданных ролей есть у пользователя» — через `checkAccess(requiredRoles)` в store и `useAccess(requiredRoles)` в UI.
