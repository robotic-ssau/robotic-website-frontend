import type { Role } from './roles';

export interface User {
  id: string;
  email: string;
  displayName: string;
  roles: Role[];
  /** Только для Owner — иммунитет к удалению */
  isOwner?: boolean;
}

export interface UserState {
  user: User | null;
  isAuthenticated: boolean;
}
