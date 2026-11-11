import { Navigate, Outlet, useLocation } from "react-router-dom";

import useSystemStore from "@stores/system";
import useAuthStore from "@stores/auth";

import type { AuthRouteProps } from "./types";

const privateFallback = "/signin";
const guestFallback = "/app";

const AuthRoute = ({ metadata }: AuthRouteProps) => {
  const user = useAuthStore((state) => state.auth.user);
  const hasPermissions = useSystemStore((state) => state.hasPermissions);
  const isAuthenticated = Boolean(user);
  const location = useLocation();
  const requiredPermissions = metadata.requiredPermissions ?? [];

  if (metadata.access === "private" && !isAuthenticated) {
    return <Navigate to={privateFallback} replace />;
  }

  if (requiredPermissions.length > 0 && !hasPermissions(user?.role, requiredPermissions)) {
    return <Navigate to={guestFallback} replace />;
  }

  if (metadata.access === "guest" && isAuthenticated) {
    const searchParams = new URLSearchParams(location.search);
    const planId = searchParams.get("planId") || searchParams.get("productId");
    const destination = planId ? `/app?checkout=${encodeURIComponent(planId)}` : guestFallback;
    return <Navigate to={destination} replace />;
  }

  return <Outlet />;
};

export default AuthRoute;
