import { createBrowserRouter } from 'react-router-dom'
import { createElement } from 'react'

import ResetPassword from '@pages/auth/resetPassword'
import LandingPage from '@pages/public/landingPage'
import TermsOfUse from '@pages/public/termsOfUse'
import RefundPolicy from '@pages/public/refundPolicy'
import ErrorPage from '@pages/public/errorPage'
import NotFound from '@pages/public/notFound'
import AuthPage from '@pages/auth/authPage'
import AuthRoute from '@components/authRoute'
import DashboardLayout from '@components/dashboardLayout'
import Billing from '@pages/app/billing'
import EventDetails from '@pages/app/eventDetails'
import Home from '@pages/app/home'
import Logs from '@pages/app/logs'
import Profile from '@pages/app/profile'

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
        children: [
          {
            path: '/app',
            element: createElement(DashboardLayout),
            children: [
              { index: true, element: createElement(Home) },
              { path: 'events/:id', element: createElement(EventDetails) },
              { path: 'billing', element: createElement(Billing) },
              { path: 'profile', element: createElement(Profile) },
              { path: 'logs', element: createElement(Logs) }
            ]
          }
        ]
      },
      { path: '/reset-password', element: createElement(ResetPassword) },
      { path: '/termos-de-uso', element: createElement(TermsOfUse) },
      { path: '/termos', element: createElement(TermsOfUse) },
      { path: '/politica-de-cancelamento', element: createElement(RefundPolicy) },
      { path: '/cancelamento-e-reembolso', element: createElement(RefundPolicy) },
      { path: '/politica-de-reembolso', element: createElement(RefundPolicy) },
      { path: '/', element: createElement(LandingPage) },
      { path: '*', element: createElement(NotFound) }
    ]
  }
])

export default appRouter
