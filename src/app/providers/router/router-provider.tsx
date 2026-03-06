import type { ReactNode } from 'react';
import { createBrowserRouter, RouterProvider, type RouteObject } from 'react-router-dom';
import { MainLayout } from '@/app/layouts/main-layout';
import App from '@/app/App';
import { ProtectedRoute } from '@/features/access';
import { ROLES, type Role } from '@/entities/user';
import { LoginPage } from '@/pages/login';
import { ProfilePage } from '@/pages/profile';
import { AdminPage } from '@/pages/admin';
import { LabPage } from '@/pages/lab';
import { ForbiddenPage } from '@/pages/forbidden';
import { NotFoundPage } from '@/pages/not-found';

type AppRouteConfig = {
  path?: string;
  index?: boolean;
  element?: ReactNode;
  children?: AppRouteConfig[];
  requiredRoles?: Role[];
};

const routesConfig: AppRouteConfig[] = [
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <App />,
      },
      {
        path: 'profile',
        element: <ProfilePage />,
        requiredRoles: [ROLES.USER],
      },
      {
        path: 'admin',
        element: <AdminPage />,
        requiredRoles: [ROLES.ADMIN, ROLES.OWNER],
      },
      {
        path: 'lab',
        element: <LabPage />,
        requiredRoles: [ROLES.COUNCIL, ROLES.ADMIN],
      },
      {
        path: '403',
        element: <ForbiddenPage />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
];

function wrapWithProtectedRoute(routes: AppRouteConfig[]): RouteObject[] {
  return routes.map((route) => {
    const { requiredRoles, element } = route;

    const wrappedElement =
      requiredRoles && element ? (
        <ProtectedRoute requiredRoles={requiredRoles}>{element}</ProtectedRoute>
      ) : (
        element
      );

    const routeObject: RouteObject = {
      path: route.path,
      index: route.index,
      element: wrappedElement,
    };

    if (route.children) {
      routeObject.children = wrapWithProtectedRoute(route.children);
    }

    return routeObject;
  });
}

const router = createBrowserRouter(wrapWithProtectedRoute(routesConfig));

export function AppRouter() {
  return <RouterProvider router={router} />;
}
