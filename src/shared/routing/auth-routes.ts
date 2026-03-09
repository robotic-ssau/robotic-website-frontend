export interface AuthRoutesConfig {
  loginPath: string;
  profilePath: string;
}

export const defaultAuthRoutesConfig: AuthRoutesConfig = {
  loginPath: '/login',
  profilePath: '/profile',
};
