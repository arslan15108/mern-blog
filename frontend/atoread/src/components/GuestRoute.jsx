import { Navigate, Outlet } from "react-router";
import { useAuth } from "../context/AuthContext";
import {Loader} from "./index"
const GuestRoute = () => {
  const { user, loading } = useAuth();
  
if (loading) return (
  <>
    {Array.from({ length: 3 }).map((_, index) => (
      <Loader key={index + 1} />
    ))}
  </>
);
  if (user) {
    return <Navigate to="/dashboard" replace />
  }
  return <Outlet />;
};

export default GuestRoute;