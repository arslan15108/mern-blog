import { Navigate, Outlet } from "react-router";
import { useAuth } from "../context/AuthContext";
import { Loader } from "../components";

const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  if (loading) return Array.from({ length: 3 }).map((_, index) => <Loader key={index + 1} />);

  if (!user) return <Navigate to="/login" replace />; // ✅ return

  return <Outlet />;
};

export default ProtectedRoute;