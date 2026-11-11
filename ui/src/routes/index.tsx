import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";

import dashboardLayoutMetadata from "@components/dashboardLayout/metadata";
import authPageMetadata from "@pages/auth/authPage/metadata";
import adminMetadata from "@pages/app/admin/metadata";
import PageLoader from "@components/pageLoader";
import AuthRoute from "@components/authRoute";
import ErrorPage from "@pages/public/errorPage";

import type { ComponentType, LazyExoticComponent } from "react";

const ResetPassword = lazy(() => import("@pages/auth/resetPassword"));
const LandingPage = lazy(() => import("@pages/public/landingPage"));
const Presentation = lazy(() => import("@pages/public/presentation"));
const TermsOfUse = lazy(() => import("@pages/public/termsOfUse"));
const RefundPolicy = lazy(() => import("@pages/public/refundPolicy"));
const BrandIdentity = lazy(() => import("@pages/public/brandIdentity"));
const GuestEvent = lazy(() => import("@pages/public/guestEvent"));
const NotFound = lazy(() => import("@pages/public/notFound"));
const AuthPage = lazy(() => import("@pages/auth/authPage"));
const DashboardLayout = lazy(() => import("@components/dashboardLayout"));
const Billing = lazy(() => import("@pages/app/billing"));
const EventDetails = lazy(() => import("@pages/app/eventDetails"));
const EventScreen = lazy(() => import("@pages/app/eventScreen"));
const Home = lazy(() => import("@pages/app/home"));
const Logs = lazy(() => import("@pages/app/logs"));
const Profile = lazy(() => import("@pages/app/profile"));
const Customization = lazy(() => import("@pages/app/customization"));
const AdminDashboard = lazy(() => import("@pages/app/admin"));

const renderPage = (Page: LazyExoticComponent<ComponentType>) => (
  <Suspense fallback={<PageLoader />}>
    <Page />
  </Suspense>
);

const appRouter = createBrowserRouter([
  {
    errorElement: <ErrorPage />,
    children: [
      {
        element: <AuthRoute metadata={authPageMetadata} />,
        children: [
          { path: "/signin", element: renderPage(AuthPage) },
          { path: "/signup", element: renderPage(AuthPage) }
        ]
      },
      {
        element: <AuthRoute metadata={dashboardLayoutMetadata} />,
        children: [
          {
            path: "/app",
            element: renderPage(DashboardLayout),
            children: [
              { index: true, element: renderPage(Home) },
              { path: "events/:id", element: renderPage(EventDetails) },
              { path: "customization", element: renderPage(Customization) },
              { path: "billing", element: renderPage(Billing) },
              { path: "profile", element: renderPage(Profile) },
              { path: "logs", element: renderPage(Logs) },
              {
                element: <AuthRoute metadata={adminMetadata} />,
                children: [{ path: "admin", element: renderPage(AdminDashboard) }]
              }
            ]
          }
        ]
      },
      { path: "/app/events/:id/screen", element: renderPage(EventScreen) },
      { path: "/e/:token/screen", element: renderPage(EventScreen) },
      { path: "/e/:token", element: renderPage(GuestEvent) },
      { path: "/reset-password", element: renderPage(ResetPassword) },
      { path: "/id", element: renderPage(BrandIdentity) },
      { path: "/identidade", element: renderPage(BrandIdentity) },
      { path: "/brand", element: renderPage(BrandIdentity) },
      { path: "/termos-de-uso", element: renderPage(TermsOfUse) },
      { path: "/termos", element: renderPage(TermsOfUse) },
      { path: "/politica-de-cancelamento", element: renderPage(RefundPolicy) },
      { path: "/cancelamento-e-reembolso", element: renderPage(RefundPolicy) },
      { path: "/politica-de-reembolso", element: renderPage(RefundPolicy) },
      { path: "/", element: renderPage(LandingPage) },
      { path: "/apresentacao", element: renderPage(Presentation) },
      { path: "*", element: renderPage(NotFound) }
    ]
  }
]);

export default appRouter;
