# Shared Types (DTO)

Общие типы данных для взаимодействия между фронтендом и бэкендом (Data Transfer Objects).

## Зачем это нужно?

- **Независимость**: Фронтенд не зависит напрямую от mock-сервера
- **Переиспользование**: Типы используются и фронтом, и моком
- **Семантическая ясность**: Суффикс `DTO` явно указывает, что это типы для API
- **Единый источник истины**: Один набор типов для всех

## Использование

### На фронтенде

```typescript
import type {
  UserDTO,
  PostDTO,
  PostDetailedDTO,
  RoleTypeDTO,
  PostStatusDTO,
} from '../shared/types';

// Использование в компонентах
const user: UserDTO = {
  id: '123',
  username: 'john',
  password: 'secret',
  active: true,
};

// Использование с API
async function getPost(id: string): Promise<PostDetailedDTO> {
  const response = await apiClient.get<PostDetailedDTO>(`/posts/${id}`);
  return response.data;
}
```

### В mock-сервере

```typescript
import type { UserDTO, LoginResponseDTO } from '../../shared/types/dto.js';

router.post('/login', async (req: Request, res: Response<LoginResponseDTO>) => {
  // ...
});
```

## Структура типов

### Enums

- `RoleTypeDTO` - роли пользователей
- `PostStatusDTO` - статусы постов
- `PostTypeDTO` - типы постов
- `PostLocationTypeDTO` - типы локаций публикации
- `SurveyTypeDTO` - типы опросов
- `PostAuthorTypeDTO` - типы авторства

### Базовые сущности

- `UserDTO`, `RoleDTO`, `UserRoleDTO`, `ProfileDTO`
- `PostDTO`, `PostTagDTO`, `PostPhotoDTO`, `PostVideoDTO`, `PostTextDTO`
- `PostLocationDTO`, `PostSurveyDTO`, `SurveyAnswerDTO`, `PostAuthorDTO`

### Расширенные типы

- `UserWithProfileDTO` - пользователь с профилем и ролями
- `PostDetailedDTO` - пост со всеми связанными данными (JOIN)

### Auth типы

- `LoginRequestDTO` - запрос на логин
- `LoginResponseDTO` - ответ с токеном и данными пользователя

## Соглашение об именовании

Все типы API имеют суффикс `DTO` для:

1. **Семантической ясности** - сразу понятно, что это типы для передачи данных
2. **Отличия от доменных моделей** - DTO могут отличаться от внутренних моделей
3. **Простоты поиска** - легко найти все API типы через `*DTO`

## Migration Path

Когда реальный backend будет готов:

1. Эти типы можно использовать как есть
2. Или сгенерировать новые из OpenAPI спецификации
3. Или адаптировать к реальным контрактам API

Директория `shared/` не зависит от mock-сервера и может использоваться с любым бэкендом.
