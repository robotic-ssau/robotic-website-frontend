import { createBrowserRouter, RouterProvider, type RouteObject, redirect } from 'react-router-dom';
import { AuthLayout, MainLayout } from '@/app/layouts';
import { ProtectedRoute } from '@/features/access';
import type { Role } from '@/entities/user';
import type { AppRouteConfig } from '@/shared/routing/types';
import { authLayoutRoutesMeta, mainLayoutRoutesMeta } from '@/pages/routes';
import { AuthInitWrapper } from './auth-init-wrapper';

import { postsRouteMeta } from '@/pages/posts-page';

const mainChildren: AppRouteConfig<Role>[] = [
  {
    index: true,
    loader: () => redirect(postsRouteMeta.path), // Дефолтный путь это страница с постами/новостями
    element: null,
  },
  ...mainLayoutRoutesMeta.map<AppRouteConfig<Role>>((meta) => ({
    path: meta.path.replace(/^\//, ''),
    element: meta.element,
    requiredRoles: meta.requiredRoles,
  })),
];

const routesConfig: AppRouteConfig<Role>[] = [
  {
    path: '/login',
    element: <AuthLayout />,
    children: [
      {
        index: true,
        element: authLayoutRoutesMeta[0].element,
      },
    ],
  },
  {
    path: '/',
    element: <MainLayout />,
    children: mainChildren,
  },
];

function wrapWithProtectedRoute(routes: AppRouteConfig<Role>[]): RouteObject[] {
  return routes.map((route) => {
    const { requiredRoles, element } = route;

    const wrappedElement =
      requiredRoles && element ? (
        <ProtectedRoute requiredRoles={requiredRoles}>{element}</ProtectedRoute>
      ) : (
        element
      );

    const routeObject: RouteObject = {
      element: wrappedElement,
      ...route,
    };

    if (route.children) {
      routeObject.children = wrapWithProtectedRoute(route.children);
    }

    return routeObject;
  });
}

const router = createBrowserRouter([
  {
    element: <AuthInitWrapper />,
    children: wrapWithProtectedRoute(routesConfig),
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
