import { Navigate, Outlet } from "react-router-dom";
import { useSession } from "../context/SessionContext";

const AdminProtectedRoute = () => {
  const { user } = useSession();

  if (user?.role !== "admin") {
    return <Navigate to="/dashboard" />;
  }

  return <Outlet />;
};

export default AdminProtectedRoute;
