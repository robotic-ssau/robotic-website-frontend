import type { LoginResponseDTO, UserWithProfileDTO, RoleDTO } from '../api/types';
import { ROLES, type Role } from '../model/roles';
import type { User } from '../model/types';

const BACKEND_ROLE_TO_FRONTEND: Record<string, Role> = {
  ANONYMOUS: ROLES.GUEST,
  USER: ROLES.USER,
  ADMIN: ROLES.ADMIN,
  OWNER: ROLES.OWNER,
  COUNCIL: ROLES.COUNCIL,
  SMM: ROLES.USER,
};

function mapRolesDtoToDomain(roles?: RoleDTO[]): Role[] {
  if (!roles?.length) return [];
  return roles
    .map((r) => BACKEND_ROLE_TO_FRONTEND[r.name] ?? null)
    .filter((r): r is Role => r != null);
}

/**
 * Преобразует UserWithProfileDTO в доменную модель User.
 */
export function mapUserDtoToDomain(dto: UserWithProfileDTO): User {
  const { profile } = dto;
  const displayName = profile
    ? [profile.first_name, profile.second_name, profile.middle_name].filter(Boolean).join(' ') ||
      dto.username
    : dto.username;
  const email = profile?.email ?? dto.username;
  const roles = mapRolesDtoToDomain(dto.roles);
  const isOwner = roles.includes(ROLES.OWNER);

  return {
    id: dto.id,
    email,
    displayName,
    roles,
    ...(isOwner && { isOwner: true }),
  };
}

/**
 * Преобразует ответ бэкенда на логин в формат фронта (токен + доменная модель User).
 */
export function mapLoginResponseDtoToDomain(response: LoginResponseDTO): {
  token: string;
  user: User;
} {
  return {
    token: response.token,
    user: mapUserDtoToDomain(response.user),
  };
}
