import { create } from 'zustand';
import type { User, UserState } from './types';
import { ROLES } from './roles';
import type { Role } from './roles';

interface UserStore extends UserState {
  setUser: (user: User | null) => void;
  logout: () => void;
  /** Эффективные роли: у авторизованного — его роли, у гостя — только Guest (не перезатираем роли) */
  getEffectiveRoles: () => Role[];
  /** Проверяет, что у текущего пользователя есть хотя бы одна из требуемых ролей */
  checkAccess: (requiredRoles: string[]) => boolean;
}

const initialState: UserState = {
  user: null,
  isAuthenticated: false,
};

/** Роли неавторизованного пользователя — только просмотр ленты и инфо */
const GUEST_ROLES: Role[] = [ROLES.GUEST];

export const useUserStore = create<UserStore>((set, get) => ({
  ...initialState,

  setUser: (user) =>
    set({
      user,
      isAuthenticated: Boolean(user),
    }),

  logout: () => set(initialState),

  getEffectiveRoles: () => {
    const { user } = get();
    return user?.roles?.length ? user.roles : GUEST_ROLES;
  },

  checkAccess: (requiredRoles) => {
    const effectiveRoles = get().getEffectiveRoles();
    return requiredRoles.some((role) => effectiveRoles.includes(role as Role));
  },
}));
