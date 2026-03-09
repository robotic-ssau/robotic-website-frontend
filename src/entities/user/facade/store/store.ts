import { create } from 'zustand';
import type { User, UserState } from '../../model/types';
import { ROLES } from '../../model/roles';
import type { Role } from '../../model/roles';

interface UserStore extends UserState {
  setUser: (user: User | null) => void;
  logout: () => void;
  setInitComplete: () => void;
  /** Эффективные роли: у авторизованного — его роли, у гостя — только Guest (не перезатираем роли) */
  getEffectiveRoles: () => Role[];
  /** Проверяет, что у текущего пользователя есть хотя бы одна из требуемых ролей */
  checkAccess: (requiredRoles: string[]) => boolean;
}

const initialState: UserState = {
  user: null,
  isAuthenticated: false,
  isInit: false,
};

/** Роли неавторизованного пользователя — только просмотр ленты и инфо */
const GUEST_ROLES: Role[] = [ROLES.GUEST];

export const useUserStore = create<UserStore>((set, get) => ({
  ...initialState,

  setUser: (user) =>
    set({
      user,
      isAuthenticated: Boolean(user),
      isInit: true,
    }),

  logout: () => {
    localStorage.removeItem('access_token');
    set({ ...initialState, isInit: true });
  },

  setInitComplete: () => set({ isInit: true }),

  getEffectiveRoles: () => {
    const { user } = get();
    return user?.roles?.length ? user.roles : GUEST_ROLES;
  },

  checkAccess: (requiredRoles) => {
    const effectiveRoles = get().getEffectiveRoles();
    return requiredRoles.some((role) => effectiveRoles.includes(role as Role));
  },
}));
