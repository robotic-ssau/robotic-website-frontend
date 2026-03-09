import type { AppHeaderProps } from './app-header.types';
import { AppHeaderDesktop } from './app-header.desktop.tsx';
import { AppHeaderMobile } from './app-header.mobile.tsx';
import { useIsMobile } from '@/shared/ui/use-is-mobile';

export function AppHeader({ variant, routesMeta, pathname, authRoutes }: AppHeaderProps) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <AppHeaderMobile
        variant={variant}
        routesMeta={routesMeta}
        pathname={pathname}
        authRoutes={authRoutes}
      />
    );
  }

  return (
    <AppHeaderDesktop
      variant={variant}
      routesMeta={routesMeta}
      pathname={pathname}
      authRoutes={authRoutes}
    />
  );
}

export type { AppHeaderProps } from './app-header.types';
export type { AppHeaderVariant } from './app-header.types';
