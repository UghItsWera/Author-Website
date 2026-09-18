import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

function ProtectedRoute() {
  const {
    isAuthenticated,
    isInitialising,
  } = useAuth();

  const location = useLocation();

  if (isInitialising) {
    return null;
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/admin/login"
        replace
        state={{ from: location }}
      />
    );
  }

  return <Outlet />;
}

export default ProtectedRoute;