import { Router } from 'express';
import type { Request, Response } from 'express';
import { getByField, getAllByField, getById } from '../db/index.js';
import type {
  LoginRequestDTO,
  LoginResponseDTO,
  LogoutResponseDTO,
  GetCurrentUserResponseDTO,
  UserWithProfileDTO,
  ApiErrorDTO,
  RoleDTO,
} from '../types.js';

const router = Router();

// POST /api/auth/login
router.post(
  '/login',
  async (
    req: Request<object, object, LoginRequestDTO>,
    res: Response<LoginResponseDTO | ApiErrorDTO>,
  ) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'Username and password are required',
        });
      }

      // Находим пользователя
      const user = await getByField('users', 'username', username);

      if (!user || user.password !== password) {
        return res.status(401).json({
          error: 'Unauthorized',
          message: 'Invalid username or password',
        });
      }

      if (!user.active) {
        return res.status(403).json({
          error: 'Forbidden',
          message: 'User account is inactive',
        });
      }

      // Получаем профиль пользователя
      const profile = await getByField('profiles', 'user_id', user.id);

      // Получаем роли пользователя
      const userRoles = await getAllByField('user_roles', 'user_id', user.id);
      const roles = await Promise.all(userRoles.map((ur) => getById('roles', ur.role_id)));

      const userWithProfile: UserWithProfileDTO = {
        ...user,
        profile,
        roles: roles.filter((r): r is RoleDTO => r != null),
      };

      const response: LoginResponseDTO = {
        token: `fake-jwt-${user.id}-${Date.now()}`,
        user: userWithProfile,
      };

      return res.json(response);
    } catch (error) {
      console.error('Login error:', error);
      return res.status(500).json({
        error: 'Internal Server Error',
        message: 'An error occurred during login',
      });
    }
  },
);

// POST /api/auth/logout (опционально)
router.post('/logout', (req: Request, res: Response<LogoutResponseDTO>) => {
  return res.json({ message: 'Logged out successfully' });
});

// GET /api/auth/me (получить текущего пользователя)
router.get('/me', async (req: Request, res: Response<GetCurrentUserResponseDTO | ApiErrorDTO>) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Missing or invalid Authorization header',
    });
  }

  // Здесь можно извлечь user_id из токена, но для простоты возвращаем моковые данные
  const users = await getAllByField('users', 'active', true);

  if (users.length === 0) {
    return res.status(404).json({
      error: 'Not Found',
      message: 'No active users found',
    });
  }

  const user = users[0];
  const profile = await getByField('profiles', 'user_id', user.id);
  const userRoles = await getAllByField('user_roles', 'user_id', user.id);
  const roles = await Promise.all(userRoles.map((ur) => getById('roles', ur.role_id)));

  const userWithProfile: UserWithProfileDTO = {
    ...user,
    profile,
    roles: roles.filter((r): r is RoleDTO => r != null),
  };

  return res.json(userWithProfile);
});

export default router;
