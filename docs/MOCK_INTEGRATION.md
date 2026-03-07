# Интеграция Mock Backend с фронтендом

## Запуск одновременно с фронтендом

В корне проекта выполните:

```bash
npm run dev:all
```

Эта команда запустит одновременно:

- Frontend на `http://localhost:5173` (Vite)
- Backend на `http://localhost:3001` (Mock Server)

## Отдельные команды

```bash
# Только фронтенд
npm run dev

# Только бэкенд
npm run dev:mock

# Заполнить базу данных начальными данными
npm run seed
```

## Использование типов на фронтенде

Импортируйте типы из общей директории `shared/types`:

```typescript
// Импорт типов
import type {
  UserDTO,
  PostDTO,
  PostDetailedDTO,
  RoleTypeDTO,
  PostStatusDTO,
  PostTypeDTO,
} from '../shared/types';

// Пример использования
const user: UserDTO = {
  id: '123',
  username: 'john',
  password: 'secret',
  active: true,
};
```

## Настройка API клиента

### Пример с axios

```typescript
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Добавляем токен к каждому запросу
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
```

## Примеры запросов

### Авторизация

```typescript
import type { LoginRequestDTO, LoginResponseDTO } from '../shared/types';
import apiClient from './api-client';

async function login(username: string, password: string) {
  const response = await apiClient.post<LoginResponseDTO>('/auth/login', {
    username,
    password,
  });

  // Сохраняем токен
  localStorage.setItem('token', response.data.token);
  localStorage.setItem('user', JSON.stringify(response.data.user));

  return response.data;
}
```

### Получение постов

```typescript
import type { PostDTO, PostDetailedDTO, PostStatusDTO, PostTypeDTO } from '../shared/types';
import apiClient from './api-client';

// Получить список постов
async function getPosts() {
  const response = await apiClient.get<PostDTO[]>('/posts');
  return response.data;
}

// Получить полную информацию о посте
async function getPost(id: string) {
  const response = await apiClient.get<PostDetailedDTO>(`/posts/${id}`);
  return response.data;
}

// Создать пост (требует авторизацию)
async function createPost(postData: {
  status: PostStatusDTO;
  type: PostTypeDTO;
  text: string;
  tags?: string[];
  photos?: string[];
}) {
  const response = await apiClient.post<PostDetailedDTO>('/posts', postData);
  return response.data;
}
```

### Работа с пользователями

```typescript
import type { UserWithProfileDTO } from '../shared/types';
import apiClient from './api-client';

// Получить всех пользователей (требует авторизацию)
async function getUsers() {
  const response = await apiClient.get<UserWithProfileDTO[]>('/users');
  return response.data;
}

// Получить пользователя по ID
async function getUser(id: string) {
  const response = await apiClient.get<UserWithProfileDTO>(`/users/${id}`);
  return response.data;
}
```

## React Query интеграция

```typescript
import { useQuery, useMutation } from '@tanstack/react-query';
import type { PostDTO, PostDetailedDTO } from '../shared/types';

// Хук для получения постов
export function usePosts() {
  return useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const response = await apiClient.get<PostDTO[]>('/posts');
      return response.data;
    },
  });
}

// Хук для получения одного поста
export function usePost(id: string) {
  return useQuery({
    queryKey: ['posts', id],
    queryFn: async () => {
      const response = await apiClient.get<PostDetailedDTO>(`/posts/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}

// Хук для создания поста
export function useCreatePost() {
  return useMutation({
    mutationFn: async (postData: any) => {
      const response = await apiClient.post<PostDetailedDTO>('/posts', postData);
      return response.data;
    },
  });
}
```

## Переменные окружения

Создайте файл `.env` в корне проекта:

```env
VITE_API_URL=http://localhost:3001/api
```

Используйте в коде:

```typescript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const apiClient = axios.create({
  baseURL: API_URL,
});
```

## Тестовые данные

Используйте эти учетные данные для тестирования:

- **Администратор**: `admin` / `admin123`
- **SMM менеджер**: `smm_manager` / `smm123`
- **Пользователь**: `user` / `user123`

## Примечания

1. Mock-сервер **изолирован** от основного кода фронтенда и не включается в production bundle
2. Все изменения данных сохраняются в `server-mock/data/db.json`
3. При необходимости можно запустить `npm run seed` для сброса данных к начальному состоянию
4. Для продакшена замените `baseURL` на реальный API endpoint
