# Созданные файлы Mock Backend

## Структура проекта

```
server-mock/
├── src/
│   ├── db/
│   │   └── index.ts           # Обертка над lowdb для работы с JSON БД
│   ├── middleware/
│   │   └── auth.ts            # Middleware для проверки Authorization заголовка
│   ├── routes/
│   │   ├── auth.ts            # Роуты авторизации (login, logout, me)
│   │   ├── users.ts           # CRUD операции для пользователей
│   │   └── posts.ts           # CRUD операции для постов с JOIN логикой
│   ├── types.ts               # TypeScript типы для всех сущностей из DBML
│   ├── seed.ts                # Скрипт заполнения БД тестовыми данными
│   └── index.ts               # Главный файл Express сервера
├── data/
│   └── db.json                # JSON файл базы данных (lowdb)
├── examples/
│   ├── api-client.example.ts              # Пример настройки axios клиента
│   ├── react-query-hooks.example.ts       # Пример React Query хуков
│   └── react-components.example.tsx       # Пример React компонентов
├── package.json               # Зависимости mock-сервера
├── tsconfig.json              # Конфигурация TypeScript
├── .gitignore                 # Игнорируемые файлы
└── README.md                  # Документация mock-сервера

# Корневые файлы
├── MOCK_INTEGRATION.md        # Руководство по интеграции с фронтендом
├── README.md                  # Обновленный главный README
├── .env.example               # Пример переменных окружения
└── package.json               # Обновлен: добавлены скрипты dev:mock, dev:all, seed
```

## Что было реализовано

### 1. База данных (db.json)

- ✅ Полная реализация DBML схемы
- ✅ 13 таблиц: users, roles, user_roles, profiles, posts, post_tags, post_photos, post_videos, post_texts, post_locations, post_surveys, survey_answers, post_authors
- ✅ Персистентное хранилище через lowdb
- ✅ Чтение/запись при каждом запросе

### 2. Типы TypeScript (types.ts)

- ✅ Все enums из DBML: RoleType, PostStatus, PostType, PostLocationType, SurveyType, PostAuthorType
- ✅ Интерфейсы для всех сущностей
- ✅ Расширенные типы: UserWithProfile, PostDetailed, LoginRequest, LoginResponse
- ✅ Type-safe database schema

### 3. API Endpoints

#### Авторизация (routes/auth.ts)

- ✅ POST /api/auth/login - возвращает fake JWT токен и пользователя с профилем и ролями
- ✅ POST /api/auth/logout - выход из системы
- ✅ GET /api/auth/me - получение текущего пользователя

#### Пользователи (routes/users.ts)

- ✅ GET /api/users - список всех пользователей с профилями и ролями
- ✅ GET /api/users/:id - пользователь по ID
- ✅ POST /api/users - создание пользователя с профилем
- ✅ PATCH /api/users/:id - обновление пользователя и профиля
- ✅ DELETE /api/users/:id - удаление пользователя со всеми связями
- ✅ Все роуты защищены authMiddleware

#### Посты (routes/posts.ts)

- ✅ GET /api/posts - список постов с базовой информацией
- ✅ GET /api/posts/:id - **полная информация с JOIN** (текст, теги, фото, видео, опросы, авторы с профилями)
- ✅ POST /api/posts - создание поста со всеми связанными данными (требует авторизацию)
- ✅ PATCH /api/posts/:id - обновление поста (требует авторизацию)
- ✅ DELETE /api/posts/:id - удаление поста со всеми связями (требует авторизацию)

### 4. Middleware (middleware/auth.ts)

- ✅ Проверка наличия заголовка Authorization
- ✅ Валидация формата токена
- ✅ Возврат 401 при отсутствии/невалидном токене

### 5. Database Layer (db/index.ts)

- ✅ Инициализация lowdb
- ✅ CRUD функции: getAll, getById, getByField, getAllByField, create, update, remove
- ✅ Type-safe операции с использованием TypeScript generics
- ✅ Автоматическое чтение/запись в файл

### 6. Seed Script (seed.ts)

- ✅ 5 ролей: ADMIN, USER, SMM, COUNCIL, OWNER
- ✅ 3 пользователя с разными ролями:
  - admin / admin123 (Администратор)
  - smm_manager / smm123 (SMM менеджер)
  - user / user123 (Обычный пользователь)
- ✅ 5 постов с различным контентом:
  - Статья с опросом (SINGLE choice)
  - Пост с фото и видео
  - Черновик
  - Запланированная публикация
  - Пост с множественным опросом (MULTIPLE choice)
- ✅ Связи: теги, фото, видео, локации (VK, Telegram, Website), опросы, авторы

### 7. Интеграция с фронтендом

#### package.json скрипты

- ✅ `npm run dev:mock` - запуск только mock-сервера
- ✅ `npm run dev:all` - одновременный запуск фронта и мока через concurrently
- ✅ `npm run seed` - заполнение БД из корня проекта

#### Примеры интеграции (examples/)

- ✅ api-client.example.ts - настройка axios с interceptors
- ✅ react-query-hooks.example.ts - 15+ готовых хуков для React Query
- ✅ react-components.example.tsx - примеры компонентов (PostsList, PostDetail, CreatePostForm, LoginForm)

#### Документация

- ✅ MOCK_INTEGRATION.md - подробное руководство по интеграции
- ✅ Примеры использования типов
- ✅ Примеры API запросов
- ✅ React Query интеграция
- ✅ Переменные окружения

### 8. Конфигурация

- ✅ tsconfig.json для сервера
- ✅ .gitignore (node_modules, dist, db.json, \*.log)
- ✅ .env.example для фронтенда
- ✅ Обновлен корневой .gitignore (.env, .env.local)

## Особенности реализации

### JOIN логика

При запросе `GET /api/posts/:id` сервер автоматически:

1. Получает основные данные поста
2. Присоединяет текст (post_text)
3. Собирает все теги (post_tags)
4. Собирает все фото (post_photos)
5. Собирает все видео (post_videos)
6. Собирает локации публикации (post_locations)
7. Получает опрос с ответами (post_survey + survey_answers)
8. Получает авторов с их профилями (post_authors + users + profiles)

### Авторизация

- Простая проверка заголовка `Authorization: Bearer <token>`
- При логине возвращается fake JWT вида: `fake-jwt-{userId}-{timestamp}`
- Middleware проверяет только наличие и минимальную длину токена

### Персистентность

- Все изменения сохраняются в `data/db.json`
- Данные доступны после перезапуска сервера
- Можно сбросить данные командой `npm run seed`

## Тестирование

Все функции протестированы:

- ✅ Health check endpoint
- ✅ Login с валидными данными
- ✅ Получение списка постов
- ✅ Получение поста с JOIN
- ✅ Защита роутов (401 без токена)
- ✅ Доступ к защищенным роутам с токеном
- ✅ Создание поста через API
- ✅ Обновление поста через API
- ✅ Персистентность данных в db.json
- ✅ Одновременный запуск фронта и бэка

## Использование на фронтенде

Типы можно импортировать напрямую:

```typescript
import type { User, Post, PostDetailed, RoleType } from '../server-mock/src/types';
```

Файлы в `server-mock/` не включаются в production bundle фронтенда, т.к. не импортируются в основной код.

## Миграция на production

Когда реальный backend будет готов:

1. Замените `VITE_API_URL` в `.env`
2. Mock-сервер можно оставить для локальной разработки
3. Типы можно скопировать или сгенерировать из OpenAPI спецификации
