import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function ProtectedRoute({ children }) {
  const { user } = useAuth();
  if (!user && !localStorage.getItem("refreshToken")) return <Navigate to="/login" replace />;
  return children;
}
