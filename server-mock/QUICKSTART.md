# 🚀 Быстрый старт Mock Backend

## Установка

```bash
# 1. Установить зависимости
npm install
cd server-mock && npm install && cd ..

# 2. Заполнить базу данных
npm run seed
```

## Запуск

```bash
# Запустить фронтенд и бэкенд одновременно
npm run dev:all
```

- Frontend: http://localhost:5173
- Backend: http://localhost:3001

## Тестовые данные для входа

| Роль          | Username    | Password |
| ------------- | ----------- | -------- |
| Администратор | admin       | admin123 |
| SMM менеджер  | smm_manager | smm123   |
| Пользователь  | user        | user123  |

## Основные API endpoints

```bash
# Логин
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Получить посты
curl http://localhost:3001/api/posts

# Получить пост с полной информацией (JOIN)
curl http://localhost:3001/api/posts/{id}

# Получить пользователей (требует токен)
curl http://localhost:3001/api/users \
  -H "Authorization: Bearer your-token-here"
```

## Использование на фронтенде

### 1. Импортируйте типы

```typescript
import type { UserDTO, PostDTO, PostDetailedDTO } from '../shared/types';
```

### 2. Настройте API клиент

```typescript
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:3001/api',
});

// Добавьте токен
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### 3. Используйте с React Query

```typescript
import { useQuery } from '@tanstack/react-query';

function usePosts() {
  return useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const { data } = await apiClient.get('/posts');
      return data;
    },
  });
}
```

## Документация

- [README.md](./README.md) - Полная документация mock-сервера
- [MOCK_INTEGRATION.md](../docs/MOCK_INTEGRATION.md) - Руководство по интеграции
- [IMPLEMENTATION.md](./IMPLEMENTATION.md) - Детали реализации
- [examples/](./examples/) - Примеры кода

## Полезные команды

```bash
npm run dev:all      # Запустить всё одновременно
npm run dev:mock     # Только backend
npm run seed         # Пересоздать тестовые данные
```

## Структура данных

База данных содержит:

- 5 ролей (ADMIN, USER, SMM, COUNCIL, OWNER)
- 3 пользователя с разными ролями
- 5 постов (статьи, посты, черновики, опросы)
- Связанные данные (теги, фото, видео, опросы, локации)

## Проверка работы

```bash
# Health check
curl http://localhost:3001/health

# Должен вернуть:
# {"status":"ok","timestamp":"..."}
```

## Вопросы?

Смотрите детальную документацию в [README.md](./README.md)
