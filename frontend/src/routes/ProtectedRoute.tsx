import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import LoadingState from "@/components/common/LoadingState";
import ErrorState from "@/components/common/ErrorState";

/**
 * Wrap any route element that requires login. If auth state is still
 * loading (checking for a stored session on app startup), show a spinner
 * instead of flashing the login page.
 */
export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading, sessionError, retrySessionCheck } =
    useAuth();

  if (isLoading) return <LoadingState label="Checking your session..." />;
  if (sessionError)
    return (
      <ErrorState
        message={`Could not verify your session: ${sessionError}`}
        onRetry={retrySessionCheck}
      />
    );
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return <>{children}</>;
}

/**
 * Opposite of ProtectedRoute: used on /login, /register etc. so an already
 * logged-in user is sent straight to the dashboard instead of seeing the
 * login form again.
 */
export function PublicOnlyRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading, sessionError, retrySessionCheck } =
    useAuth();

  if (isLoading) return <LoadingState />;
  if (sessionError)
    return (
      <ErrorState
        message={`Could not verify your session: ${sessionError}`}
        onRetry={retrySessionCheck}
      />
    );
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  return <>{children}</>;
}
