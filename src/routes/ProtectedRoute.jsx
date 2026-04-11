import { Navigate, useLocation } from "react-router-dom";
import { useUserStore } from "../store/useUserStore";

export function ProtectedRoute({ children }) {
  const token = useUserStore((state) => state.token);
  const isAuthenticated = Boolean(token);
  const location = useLocation();

  if (!isAuthenticated) {
    const redirect = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/auth?redirect=${redirect}`} replace />;
  }

  return children;
}
