import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

interface PublicRouteProps {
  children: React.ReactNode;
}

export const PublicRoute = ({ children }: PublicRouteProps) => {
  const { user } = useAuthStore();
  console.log("user", user);
  if (user) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};
