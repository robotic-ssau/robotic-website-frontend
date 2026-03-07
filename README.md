# Robotic Website Frontend

Frontend приложение для робототехнического сообщества.

## Быстрый старт

### Установка зависимостей

```bash
# Корневые зависимости
npm install

# Зависимости mock-сервера
cd server-mock
npm install
cd ..
```

### Запуск в режиме разработки

#### Вариант 1: Запустить всё одновременно (рекомендуется)

```bash
npm run dev:all
```

Запустит:

- Frontend на http://localhost:5173
- Mock Backend на http://localhost:3001

#### Вариант 2: Запустить отдельно

```bash
# Терминал 1: Frontend
npm run dev

# Терминал 2: Mock Backend
npm run dev:mock
```

### Заполнение базы данных тестовыми данными

```bash
npm run seed
```

## Mock Backend

Mock backend находится в директории `./server-mock` и полностью изолирован от основного кода фронтенда.

### Особенности

- ✅ Изолированный Node.js сервер на Express
- ✅ TypeScript типы (можно использовать на фронте)
- ✅ Полная реализация DBML схемы
- ✅ Авторизация с JWT токенами
- ✅ JOIN логика для связанных данных
- ✅ Персистентное хранилище (JSON файлы через lowdb)
- ✅ CRUD операции для всех сущностей
- ✅ Тестовые данные (3 пользователя, 5 постов)

### API Endpoints

**Авторизация:**

- `POST /api/auth/login` - Вход в систему
- `POST /api/auth/logout` - Выход
- `GET /api/auth/me` - Текущий пользователь

**Пользователи (требуют авторизацию):**

- `GET /api/users` - Список пользователей
- `GET /api/users/:id` - Пользователь по ID
- `POST /api/users` - Создать пользователя
- `PATCH /api/users/:id` - Обновить пользователя
- `DELETE /api/users/:id` - Удалить пользователя

**Посты:**

- `GET /api/posts` - Список постов
- `GET /api/posts/:id` - Полная информация о посте (JOIN)
- `POST /api/posts` - Создать пост (требует авторизацию)
- `PATCH /api/posts/:id` - Обновить пост (требует авторизацию)
- `DELETE /api/posts/:id` - Удалить пост (требует авторизацию)

### Тестовые учетные данные

- **Администратор**: `admin` / `admin123`
- **SMM менеджер**: `smm_manager` / `smm123`
- **Пользователь**: `user` / `user123`

## Интеграция с фронтендом

Подробная документация по интеграции находится в файле [MOCK_INTEGRATION.md](docs/MOCK_INTEGRATION.md).

### Использование типов

```typescript
import type { User, Post, PostDetailed } from '../server-mock/src/types';
```

### Примеры компонентов

Примеры использования API находятся в:

- `server-mock/examples/api-client.example.ts` - Настройка axios клиента
- `server-mock/examples/react-query-hooks.example.ts` - React Query хуки
- `server-mock/examples/react-components.example.tsx` - React компоненты

## Структура проекта

```
.
├── src/                    # Исходный код фронтенда
├── server-mock/            # Mock backend (изолирован)
│   ├── data/              # JSON база данных
│   ├── src/
│   │   ├── db/           # Обертка над lowdb
│   │   ├── middleware/   # Express middleware
│   │   ├── routes/       # API роуты
│   │   ├── types.ts      # TypeScript типы
│   │   ├── seed.ts       # Скрипт заполнения данных
│   │   └── index.ts      # Главный файл сервера
│   ├── examples/         # Примеры интеграции
│   └── README.md         # Документация mock-сервера
├── MOCK_INTEGRATION.md   # Руководство по интеграции
└── package.json
```

## Доступные команды

```bash
npm run dev              # Запустить только фронтенд
npm run dev:mock         # Запустить только mock-сервер
npm run dev:all          # Запустить фронт и мок одновременно
npm run seed             # Заполнить БД тестовыми данными
npm run build            # Собрать production версию
npm run lint             # Проверить код линтером
npm run lint:fix         # Исправить ошибки линтера
npm run format           # Форматировать код
npm run typecheck        # Проверить типы TypeScript
```

## Переход на production API

Когда реальный backend будет готов:

1. Измените `VITE_API_URL` в `.env`:

   ```env
   VITE_API_URL=https://api.your-domain.com
   ```

2. Обновите настройки CORS на production сервере

3. Mock-сервер не будет включен в production bundle (он изолирован)

## Технологии

- React 19
- TypeScript
- Vite
- Zustand (state management)
- React Query (data fetching)
- Ant Design (UI)
- Axios (HTTP client)

### Mock Backend

- Node.js + Express
- TypeScript
- lowdb (JSON database)
- uuid, cors, morgan

## Разработка

### Линтинг

Проект использует ESLint с конфигурацией Airbnb и проверку типов TypeScript.

### Форматирование

Prettier автоматически форматирует код при коммите через husky и lint-staged.

## Дополнительные материалы

- [ARCHITECTURE](docs/FSD_ARCHITECTURE.md)
- [MOCK_BACKEND](docs/MOCK_INTEGRATION.md)
- [ROUTING](docs/routing.md)

- [Postman collection](docs/postman/collection.json)

## Лицензия

Private
