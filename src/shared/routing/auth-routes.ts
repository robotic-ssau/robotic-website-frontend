export interface AuthRoutesConfig {
  loginPath: string;
  profilePath: string;
}

export const DEFAULT_AUTH_ROUTES_CONFIG: AuthRoutesConfig = {
  loginPath: '/login',
  profilePath: '/profile',
};
