import { createBrowserRouter } from 'react-router-dom'
import { createElement } from 'react'

import ResetPassword from '@pages/auth/resetPassword'
import LandingPage from '@pages/public/landingPage'
import ErrorPage from '@pages/public/errorPage'
import NotFound from '@pages/public/notFound'
import AuthPage from '@pages/auth/authPage'
import AuthRoute from '@components/authRoute'
import Home from '@pages/app/home'

const appRouter = createBrowserRouter([
  {
    errorElement: createElement(ErrorPage),
    children: [
      {
        element: createElement(AuthRoute, { access: 'guest' }),
        children: [
          { path: '/signin', element: createElement(AuthPage) },
          { path: '/signup', element: createElement(AuthPage) }
        ]
      },
      {
        element: createElement(AuthRoute, { access: 'private' }),
        children: [{ path: '/app', element: createElement(Home) }]
      },
      { path: '/reset-password', element: createElement(ResetPassword) },
      { path: '/', element: createElement(LandingPage) },
      { path: '*', element: createElement(NotFound) }
    ]
  }
])

export default appRouter
