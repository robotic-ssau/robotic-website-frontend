import { Router } from 'express';
import type { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getAll, getById, getByField, getAllByField, create, update, remove } from '../db';
import type {
  UserDTO,
  ProfileDTO,
  GetUsersResponseDTO,
  GetUserResponseDTO,
  CreateUserRequestDTO,
  CreateUserResponseDTO,
  PatchUserRequestDTO,
  PatchUserResponseDTO,
  UserWithProfileDTO,
  ApiErrorDTO,
  RoleDTO,
} from '../types.js';
import { authMiddleware } from '../middleware/auth.js';
import { parsePageParams, paginate } from '../utils/pagination.js';

const router = Router();

// Все роуты пользователей требуют авторизации
router.use(authMiddleware);

// GET /api/users - получить список пользователей с пагинацией
router.get('/', async (req: Request, res: Response<GetUsersResponseDTO | ApiErrorDTO>) => {
  try {
    const { page, pageSize } = parsePageParams(
      req.query.page as string | undefined,
      req.query.pageSize as string | undefined,
    );

    const allUsers = await getAll('users');
    const { data: usersPage, meta } = paginate(allUsers, page, pageSize);

    const usersWithProfiles: UserWithProfileDTO[] = await Promise.all(
      usersPage.map(async (user) => {
        const profile = await getByField('profiles', 'user_id', user.id);
        const userRoles = await getAllByField('user_roles', 'user_id', user.id);
        const roles = await Promise.all(userRoles.map((ur) => getById('roles', ur.role_id)));

        return {
          ...user,
          profile,
          roles: roles.filter((r): r is RoleDTO => r != null),
        };
      }),
    );

    return res.json({ data: usersWithProfiles, meta });
  } catch (error) {
    console.error('Get users error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch users',
    });
  }
});

// GET /api/users/:id - получить пользователя по ID
router.get('/:id', async (req: Request, res: Response<GetUserResponseDTO | ApiErrorDTO>) => {
  try {
    const { id } = req.params;
    const user = await getById('users', id);

    if (!user) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'User not found',
      });
    }

    const profile = await getByField('profiles', 'user_id', user.id);
    const userRoles = await getAllByField('user_roles', 'user_id', user.id);
    const roles = await Promise.all(userRoles.map((ur) => getById('roles', ur.role_id)));

    const userWithProfile: UserWithProfileDTO = {
      ...user,
      profile,
      roles: roles.filter((r): r is RoleDTO => r != null),
    };

    return res.json(userWithProfile);
  } catch (error) {
    console.error('Get user error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch user',
    });
  }
});

// POST /api/users - создать нового пользователя
router.post(
  '/',
  async (
    req: Request<object, object, CreateUserRequestDTO>,
    res: Response<CreateUserResponseDTO | ApiErrorDTO>,
  ) => {
    try {
      const { username, password, active = true, profile: profileData } = req.body;

      if (!username || !password) {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'Username and password are required',
        });
      }

      // Проверяем уникальность username
      const existingUser = await getByField('users', 'username', username);
      if (existingUser) {
        return res.status(409).json({
          error: 'Conflict',
          message: 'Username already exists',
        });
      }

      const newUser: UserDTO = {
        id: uuidv4(),
        username,
        password,
        active,
      };

      await create('users', newUser);

      // Создаем профиль, если данные переданы
      let profile: ProfileDTO | undefined;
      if (profileData) {
        profile = {
          id: uuidv4(),
          user_id: newUser.id,
          first_name: profileData.first_name || '',
          second_name: profileData.second_name || '',
          middle_name: profileData.middle_name || '',
          phone: profileData.phone || '',
          email: profileData.email || '',
          group: profileData.group || '',
          vk_id: profileData.vk_id || '',
          telegram_id: profileData.telegram_id || '',
        };
        await create('profiles', profile);
      }

      const userWithProfile: UserWithProfileDTO = {
        ...newUser,
        profile,
        roles: [],
      };

      return res.status(201).json(userWithProfile);
    } catch (error) {
      console.error('Create user error:', error);
      return res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to create user',
      });
    }
  },
);

// PATCH /api/users/:id - обновить пользователя
router.patch(
  '/:id',
  async (
    req: Request<{ id: string }, object, PatchUserRequestDTO>,
    res: Response<PatchUserResponseDTO | ApiErrorDTO>,
  ) => {
    try {
      const { id } = req.params;
      const updates = req.body;

      const user = await getById('users', id);
      if (!user) {
        return res.status(404).json({
          error: 'Not Found',
          message: 'User not found',
        });
      }

      // Обновляем пользователя
      const { profile: profileUpdates, ...userUpdates } = updates;

      if (Object.keys(userUpdates).length > 0) {
        await update('users', id, userUpdates);
      }

      // Обновляем профиль, если данные переданы
      if (profileUpdates) {
        const profile = await getByField('profiles', 'user_id', id);
        if (profile) {
          await update('profiles', profile.id, profileUpdates);
        }
      }

      // Получаем обновленные данные
      const updatedUser = await getById('users', id);
      const profile = await getByField('profiles', 'user_id', id);
      const userRoles = await getAllByField('user_roles', 'user_id', id);
      const roles = await Promise.all(userRoles.map((ur) => getById('roles', ur.role_id)));

      const userWithProfile: UserWithProfileDTO = {
        ...updatedUser!,
        profile,
        roles: roles.filter((r): r is RoleDTO => r != null),
      };

      return res.json(userWithProfile);
    } catch (error) {
      console.error('Update user error:', error);
      return res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to update user',
      });
    }
  },
);

// DELETE /api/users/:id - удалить пользователя
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await getById('users', id);
    if (!user) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'User not found',
      });
    }

    // Удаляем профиль
    const profile = await getByField('profiles', 'user_id', id);
    if (profile) {
      await remove('profiles', profile.id);
    }

    // Удаляем связи с ролями
    const userRoles = await getAllByField('user_roles', 'user_id', id);
    await Promise.all(userRoles.map((ur) => remove('user_roles', ur.id)));

    // Удаляем пользователя
    await remove('users', id);

    return res.status(204).send();
  } catch (error) {
    console.error('Delete user error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to delete user',
    });
  }
});

export default router;
