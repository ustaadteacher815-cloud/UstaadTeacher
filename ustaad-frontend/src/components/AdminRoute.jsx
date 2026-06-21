import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function AdminRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="ustaad-page ustaad-page-centered">
        <div className="ustaad-card text-center">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }

  if (user.role !== "admin") {
    if (user.role === "parent") {
      return <Navigate to="/parent" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default AdminRoute;
