import { createBrowserRouter } from 'react-router-dom'
import { createElement } from 'react'

import SweepstakeDetailsPage from '@pages/sweepstakeDetails'
import ResetPassword from '@pages/resetPassword'
import Sweepstakes from '@pages/sweepstakes'
import AdminLogs from '@pages/adminLogs'
import ErrorPage from '@pages/errorPage'
import UserLogs from '@pages/userLogs'
import NotFound from '@pages/notFound'
import Presets from '@pages/presets'
import Users from '@pages/users'
import Login from '@pages/login'
import Home from '@pages/home'

import type { RouteObject } from 'react-router-dom'
import type { AppRoute } from '@appTypes/module'

const processProtectedRoutes = (routes: AppRoute[]): RouteObject[] =>
  routes.map(({ permissionCodes, children, global, auth, ...rest }) => {
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
      ...processProtectedRoutes([
        { path: '/my-logs', element: createElement(UserLogs), auth: true },
        { path: '/admin/logs', element: createElement(AdminLogs), auth: true },
        { path: '/sweepstakes', element: createElement(Sweepstakes), auth: true },
        { path: '/sweepstakes/:id', element: createElement(SweepstakeDetailsPage), auth: true },
        { path: '/presets', element: createElement(Presets), auth: true },
        { path: '/users', element: createElement(Users), auth: true }
      ]),
      { path: '*', element: createElement(NotFound) }
    ]
  }
])

export default appRouter
