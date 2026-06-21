import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { getOnboardingPath, isOnboardingRoute } from "../utils/onboarding";

function ProtectedRoute({ children }) {
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
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (user.role === "parent") {
    return <Navigate to="/parent" replace />;
  }

  const onboardingPath = getOnboardingPath(user);
  const onOnboardingPage = isOnboardingRoute(location.pathname);

  if (onboardingPath && !onOnboardingPage) {
    return <Navigate to={onboardingPath} replace />;
  }

  if (!onboardingPath && onOnboardingPage) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default ProtectedRoute;
