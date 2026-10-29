import { createBrowserRouter } from 'react-router-dom'
import { createElement } from 'react'

import { ErrorPage, Home, Login, NotFound, ResetPassword } from '@pages'

import type { RouteObject } from 'react-router-dom'
import type { AppRoute } from '@appTypes/module'

const processProtectedRoutes = (routes: AppRoute[]): RouteObject[] =>
  routes.map((routeItem) => {
    const { children, auth, ...rest } = routeItem
    delete rest.permissionCodes
    delete rest.global
    const route: RouteObject = auth && rest.element ? { ...rest, element: <>{rest.element}</> } : { ...rest }
    if (children) route.children = processProtectedRoutes(children)
    return route
  })

const appRouter = createBrowserRouter([
  {
    errorElement: createElement(ErrorPage),
    children: [
      { path: '/login', element: createElement(Login) },
      { path: '/reset-password', element: createElement(ResetPassword) },
      { path: '/', element: createElement(Home) },
      ...processProtectedRoutes([]),
      { path: '*', element: createElement(NotFound) }
    ]
  }
])

export default appRouter
