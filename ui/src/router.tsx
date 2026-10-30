import { createBrowserRouter } from 'react-router-dom'
import { createElement } from 'react'

import ResetPassword from '@pages/auth/resetPassword'
import LadingPage from '@pages/public/ladingPage'
import ErrorPage from '@pages/public/errorPage'
import NotFound from '@pages/public/notFound'
import SignIn from '@pages/auth/signin'
import SignUp from '@pages/auth/signup'

const appRouter = createBrowserRouter([
  {
    errorElement: createElement(ErrorPage),
    children: [
      { path: '/signin', element: createElement(SignIn) },
      { path: '/signup', element: createElement(SignUp) },
      { path: '/reset-password', element: createElement(ResetPassword) },
      { path: '/', element: createElement(LadingPage) },
      { path: '*', element: createElement(NotFound) }
    ]
  }
])

export default appRouter
